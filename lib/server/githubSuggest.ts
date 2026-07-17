/**
 * Shared logic: create GitHub branch + commit (no PR).
 * Used by Vercel serverless handler and Vite local middleware.
 */

export type SuggestEditInput = {
  filePath: string;
  title: string;
  markdown: string;
  note?: string;
  authorName?: string;
};

export type SuggestEditResult =
  | {
      ok: true;
      branch: string;
      branchUrl: string;
      compareUrl: string;
      /** Open PR URL — not merged; you review/merge manually */
      prUrl: string;
      prNumber: number;
      message: string;
    }
  | { ok: false; status: number; error: string; detail?: string };

export type GithubSuggestConfig = {
  token: string;
  owner: string;
  repo: string;
  defaultBranch: string;
};

export function getGithubConfigFromEnv(
  env: NodeJS.ProcessEnv | Record<string, string>
): GithubSuggestConfig | { error: string } {
  const token = env.GITHUB_TOKEN || env.GH_TOKEN;
  if (!token) {
    return {
      error:
        "Chybí GITHUB_TOKEN. Přidejte ho do .env.local a restartujte dev server (nebo nastavte ve Vercel).",
    };
  }
  return {
    token,
    owner: env.GITHUB_OWNER || "kolardavidcz",
    repo: env.GITHUB_REPO || "vscht-uceni-web",
    defaultBranch: env.GITHUB_DEFAULT_BRANCH || "main",
  };
}

function isAllowedPath(filePath: string): boolean {
  const normalized = filePath.replace(/\\/g, "/");
  if (normalized.includes("..")) return false;
  return (
    normalized.startsWith("src/features/bioinformatics/content/") &&
    normalized.endsWith(".md")
  );
}

function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

async function gh<T>(
  config: GithubSuggestConfig,
  path: string,
  init?: RequestInit
): Promise<{ ok: boolean; status: number; data: T; raw: string }> {
  const res = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${config.token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "vscht-uceni-suggest-edit",
      ...(init?.headers || {}),
    },
  });
  const raw = await res.text();
  let data = {} as T;
  try {
    data = raw ? (JSON.parse(raw) as T) : ({} as T);
  } catch {
    /* non-json */
  }
  return { ok: res.ok, status: res.status, data, raw };
}

function encodeRepoPath(filePath: string): string {
  return filePath.split("/").map(encodeURIComponent).join("/");
}

export async function createSuggestBranch(
  config: GithubSuggestConfig,
  input: SuggestEditInput
): Promise<SuggestEditResult> {
  const filePath = String(input.filePath || "").replace(/\\/g, "/");
  const title = String(input.title || "wiki").trim();
  const markdown = String(input.markdown ?? "");
  const note = String(input.note || "").trim();
  const authorName = String(input.authorName || "").trim().slice(0, 80);

  if (!isAllowedPath(filePath)) {
    return {
      ok: false,
      status: 400,
      error: "Neplatná cesta souboru",
      detail: "Úpravy jsou povoleny jen v bioinformatics content/*.md",
    };
  }
  if (!markdown.trim()) {
    return { ok: false, status: 400, error: "Markdown nesmí být prázdný" };
  }
  if (markdown.length > 400_000) {
    return { ok: false, status: 400, error: "Soubor je příliš velký" };
  }

  const { owner, repo, defaultBranch } = config;

  const ref = await gh<{ object: { sha: string } }>(
    config,
    `/repos/${owner}/${repo}/git/ref/heads/${defaultBranch}`
  );
  if (!ref.ok) {
    return {
      ok: false,
      status: 502,
      error: "Nelze načíst výchozí větev",
      detail:
        ref.raw.slice(0, 400) ||
        `HTTP ${ref.status} — zkontrolujte token a přístup k ${owner}/${repo}`,
    };
  }
  const baseSha = ref.data.object.sha;

  const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const branch = `suggest/${slugify(title) || "wiki"}-${stamp}`;

  const createdRef = await gh(config, `/repos/${owner}/${repo}/git/refs`, {
    method: "POST",
    body: JSON.stringify({
      ref: `refs/heads/${branch}`,
      sha: baseSha,
    }),
  });
  if (!createdRef.ok) {
    return {
      ok: false,
      status: 502,
      error: "Nelze vytvořit větev",
      detail: createdRef.raw.slice(0, 400),
    };
  }

  const existing = await gh<{ sha: string }>(
    config,
    `/repos/${owner}/${repo}/contents/${encodeRepoPath(filePath)}?ref=${defaultBranch}`
  );
  const fileSha = existing.ok ? existing.data.sha : undefined;

  // Commit as the token owner (e.g. kolardavidcz), NOT as "noreply".
  // Vercel rejects previews when git author is unknown to the team.
  // Suggestor name stays only in the PR body / commit message text.
  const me = await gh<{
    id: number;
    login: string;
    name: string | null;
    email: string | null;
  }>(config, "/user");
  if (!me.ok || !me.data.login) {
    return {
      ok: false,
      status: 502,
      error: "Nelze načíst GitHub uživatele z tokenu",
      detail: me.raw.slice(0, 400),
    };
  }
  const gitName = me.data.name?.trim() || me.data.login;
  const gitEmail =
    me.data.email?.trim() ||
    `${me.data.id}+${me.data.login}@users.noreply.github.com`;

  const commitMessage = [
    `docs(wiki): návrh úpravy — ${title}`,
    "",
    authorName ? `Autor návrhu: ${authorName}` : null,
    note ? `Poznámka: ${note}` : null,
    "Zdroj: webový editor Navrhnout úpravu",
    // Backup for Vercel ignoreCommand (primary: branch name suggest/*)
    "[skip vercel]",
  ]
    .filter(Boolean)
    .join("\n");

  const contentB64 = Buffer.from(markdown, "utf8").toString("base64");
  const gitIdentity = { name: gitName, email: gitEmail };
  const put = await gh(
    config,
    `/repos/${owner}/${repo}/contents/${encodeRepoPath(filePath)}`,
    {
      method: "PUT",
      body: JSON.stringify({
        message: commitMessage,
        content: contentB64,
        branch,
        ...(fileSha ? { sha: fileSha } : {}),
        author: gitIdentity,
        committer: gitIdentity,
      }),
    }
  );
  if (!put.ok) {
    return {
      ok: false,
      status: 502,
      error: "Commit se nepodařil",
      detail: put.raw.slice(0, 500),
    };
  }

  const branchUrl = `https://github.com/${owner}/${repo}/tree/${encodeURIComponent(branch)}`;
  const compareUrl = `https://github.com/${owner}/${repo}/compare/${encodeURIComponent(defaultBranch)}...${encodeURIComponent(branch)}?expand=1`;

  // Open a pull request — never auto-merge; Vercel skip via branch suggest/* + commit/PR markers
  const prBody = [
    `## Návrh úpravy wiki`,
    ``,
    `**Stránka:** ${title}`,
    `**Soubor:** \`${filePath}\``,
    authorName ? `**Od:** ${authorName}` : null,
    ``,
    note ? `### Poznámka\n\n${note}` : null,
    ``,
    `> Odesláno z webového editoru **Navrhnout úpravu**.`,
    `> PR se **neslučuje automaticky** — zkontrolujte diff a merge ručně.`,
    ``,
    `<!-- vercel: skip preview builds for suggest/* branches -->`,
    `[skip vercel]`,
  ]
    .filter(Boolean)
    .join("\n");

  const pr = await gh<{ html_url: string; number: number }>(
    config,
    `/repos/${owner}/${repo}/pulls`,
    {
      method: "POST",
      body: JSON.stringify({
        title: `docs(wiki): ${title}`,
        head: branch,
        base: defaultBranch,
        body: prBody,
        // draft: true, // enable if you prefer drafts only
      }),
    }
  );

  if (!pr.ok) {
    // Branch still exists — surface compare link so you can open PR manually
    return {
      ok: false,
      status: 502,
      error:
        "Větev a commit vznikly, ale PR se nepodařilo vytvořit (zkontrolujte oprávnění Pull requests: Read and write)",
      detail: `${pr.raw.slice(0, 400)}\n\nRučně: ${compareUrl}`,
    };
  }

  return {
    ok: true,
    branch,
    branchUrl,
    compareUrl,
    prUrl: pr.data.html_url,
    prNumber: pr.data.number,
    message:
      "Větev, commit a pull request jsou na GitHubu. PR se neslučuje automaticky — merge ručně po kontrole.",
  };
}
