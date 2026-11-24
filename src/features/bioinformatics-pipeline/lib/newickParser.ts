export interface PhyloNode {
  id: number;
  name: string;
  branchLength: number;
  supportRaw: string;
  shAlrt: number | null;
  ufboot: number | null;
  children: PhyloNode[];
}

export interface FitchResult {
  steps: number;
  minSteps: number;
  maxSteps: number;
  retentionIndex: number;
  nPresent: number;
  nAbsent: number;
}

export interface LayoutNode {
  node: PhyloNode;
  x: number;
  y: number;
  isLeaf: boolean;
  depth: number;
  parentId: number | null;
}

export interface LayoutEdge {
  parentId: number;
  childId: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface TreeLayout {
  nodes: LayoutNode[];
  edges: LayoutEdge[];
  leafOrder: string[];
  width: number;
  height: number;
  maxDepth: number;
  plotLeft: number;
  plotRight: number;
}

function parseSupport(raw: string): { shAlrt: number | null; ufboot: number | null } {
  const s = raw.trim();
  if (!s) return { shAlrt: null, ufboot: null };

  // IQ-TREE dual support: "SH-aLRT/UFBoot" e.g. "96.3/96" or "100/100"
  if (s.includes("/")) {
    const [a, b] = s.split("/");
    const sh = Number.parseFloat(a);
    const uf = Number.parseFloat(b);
    return {
      shAlrt: Number.isFinite(sh) ? sh : null,
      ufboot: Number.isFinite(uf) ? uf : null,
    };
  }

  const single = Number.parseFloat(s);
  if (Number.isFinite(single)) {
    return { shAlrt: null, ufboot: single };
  }
  return { shAlrt: null, ufboot: null };
}

/**
 * Recursive-descent Newick / NHX parser.
 * Supports IQ-TREE `.treefile` and `.nhx` (`[&&NHX:...]`), quoted names,
 * dual SH-aLRT/UFBoot node supports, and multifurcating unrooted roots.
 */
export function parseNewick(input: string): PhyloNode | null {
  // Strip NHX / bracketed comments `[...]` outside quotes
  let cleaned = "";
  let inSingle = false;
  let inDouble = false;
  let bracketDepth = 0;
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (ch === "'" && !inDouble && bracketDepth === 0) {
      inSingle = !inSingle;
      cleaned += ch;
    } else if (ch === '"' && !inSingle && bracketDepth === 0) {
      inDouble = !inDouble;
      cleaned += ch;
    } else if (!inSingle && !inDouble && ch === "[") {
      bracketDepth++;
    } else if (!inSingle && !inDouble && ch === "]" && bracketDepth > 0) {
      bracketDepth--;
    } else if (bracketDepth === 0) {
      cleaned += ch;
    }
  }

  const str = cleaned.trim();
  if (!str) return null;

  let pos = 0;
  let nextId = 1;

  const skipWs = () => {
    while (pos < str.length && /\s/.test(str[pos])) pos++;
  };

  const parseLabel = (): string => {
    skipWs();
    if (pos >= str.length) return "";
    const ch = str[pos];
    if (ch === "'" || ch === '"') {
      const quote = ch;
      pos++;
      let out = "";
      while (pos < str.length) {
        if (str[pos] === quote) {
          if (str[pos + 1] === quote) {
            out += quote;
            pos += 2;
          } else {
            pos++;
            break;
          }
        } else {
          out += str[pos++];
        }
      }
      return out;
    }

    let out = "";
    while (pos < str.length && !/[,():;\s]/.test(str[pos])) {
      out += str[pos++];
    }
    return out;
  };

  const parseLength = (): number => {
    skipWs();
    if (str[pos] !== ":") return 0;
    pos++;
    skipWs();
    let numStr = "";
    while (pos < str.length && !/[,();;\s]/.test(str[pos])) {
      numStr += str[pos++];
    }
    const parsed = Number.parseFloat(numStr);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  };

  const parseSubtree = (): PhyloNode => {
    skipWs();
    const children: PhyloNode[] = [];
    if (str[pos] === "(") {
      pos++; // consume '('
      while (pos < str.length) {
        children.push(parseSubtree());
        skipWs();
        if (str[pos] === ",") {
          pos++;
          continue;
        }
        if (str[pos] === ")") {
          pos++;
          break;
        }
        break;
      }
    }

    const label = parseLabel();
    const branchLength = parseLength();
    const isInternal = children.length > 0;
    const support = isInternal ? parseSupport(label) : { shAlrt: null, ufboot: null };

    return {
      id: nextId++,
      name: isInternal ? "" : label,
      branchLength,
      supportRaw: isInternal ? label : "",
      shAlrt: support.shAlrt,
      ufboot: support.ufboot,
      children,
    };
  };

  const root = parseSubtree();
  return root.children.length > 0 || root.name ? root : null;
}

/** Return all leaf nodes in deterministic depth-first traversal order. */
export function getLeaves(root: PhyloNode): PhyloNode[] {
  const leaves: PhyloNode[] = [];
  const walk = (n: PhyloNode) => {
    if (n.children.length === 0) {
      leaves.push(n);
      return;
    }
    for (const c of n.children) walk(c);
  };
  walk(root);
  return leaves;
}

/**
 * Compute binary Fitch-Hartigan parsimony steps & Retention Index (RI) for a binary trait
 * (e.g. motif presence/absence) across a phylogenetic tree.
 * Mirrors GH48 `11_itol/meme/meme_visualization.py`:
 *   RI = (max_steps - actual_steps) / (max_steps - min_steps)
 *   where min_steps = 1 (when both states present), max_steps = min(nPresent, nAbsent).
 *   RI = 1.0 → strictly monophyletic / clade-specific; RI = 0.0 → maximally homoplasious.
 */
export function computeFitchRetentionIndex(
  root: PhyloNode,
  presentLeaves: Set<string>
): FitchResult {
  const leaves = getLeaves(root);
  let nPresent = 0;
  let nAbsent = 0;
  for (const leaf of leaves) {
    if (presentLeaves.has(leaf.name)) nPresent++;
    else nAbsent++;
  }

  const minSteps = nPresent > 0 && nAbsent > 0 ? 1 : 0;
  const maxSteps = Math.min(nPresent, nAbsent);

  if (maxSteps <= minSteps) {
    return {
      steps: minSteps,
      minSteps,
      maxSteps,
      retentionIndex: 0,
      nPresent,
      nAbsent,
    };
  }

  let steps = 0;

  // Fitch-Hartigan generalized for binary & multifurcating nodes (bitmask: 1=absent, 2=present, 3=both)
  const postorder = (node: PhyloNode): number => {
    if (node.children.length === 0) {
      return presentLeaves.has(node.name) ? 2 : 1;
    }

    const childStates = node.children.map(postorder);
    if (childStates.length === 2) {
      const inter = childStates[0] & childStates[1];
      if (inter !== 0) return inter;
      steps += 1;
      return childStates[0] | childStates[1];
    }

    // Generalized Fitch-Hartigan for degree >= 3 (e.g. unrooted trifurcating IQ-TREE root)
    let count0 = 0;
    let count1 = 0;
    for (const st of childStates) {
      if (st & 1) count0++;
      if (st & 2) count1++;
    }
    const maxVote = Math.max(count0, count1);
    // Every child whose state set does not contain the winning state contributes 1 change
    steps += childStates.length - maxVote;
    let out = 0;
    if (count0 === maxVote) out |= 1;
    if (count1 === maxVote) out |= 2;
    return out;
  };

  postorder(root);

  const ri = Math.max(0, Math.min(1, (maxSteps - steps) / (maxSteps - minSteps)));
  return {
    steps,
    minSteps,
    maxSteps,
    retentionIndex: Math.round(ri * 10000) / 10000,
    nPresent,
    nAbsent,
  };
}

/**
 * Compute rectangular phylogram / cladogram coordinates for SVG rendering.
 */
export function layoutPhylogram(
  root: PhyloNode,
  options: {
    cladogram?: boolean;
    plotWidth?: number;
    rowHeight?: number;
    paddingLeft?: number;
    paddingRight?: number;
    paddingY?: number;
  } = {}
): TreeLayout {
  const cladogram = options.cladogram ?? false;
  const plotWidth = options.plotWidth ?? 420;
  const rowHeight = options.rowHeight ?? 24;
  const paddingLeft = options.paddingLeft ?? 16;
  const paddingRight = options.paddingRight ?? 230;
  const paddingY = options.paddingY ?? 22;

  const leaves = getLeaves(root);
  const leafCount = Math.max(1, leaves.length);
  const height = paddingY * 2 + (leafCount - 1) * rowHeight + 24;

  // Compute node depths
  const depthMap = new Map<number, number>();
  const heightMap = new Map<number, number>(); // max steps to leaf for cladogram

  const computeHeights = (node: PhyloNode): number => {
    if (node.children.length === 0) {
      heightMap.set(node.id, 0);
      return 0;
    }
    const h = 1 + Math.max(...node.children.map(computeHeights));
    heightMap.set(node.id, h);
    return h;
  };
  const rootHeight = Math.max(1, computeHeights(root));

  let maxDepth = 0;
  const assignDepth = (node: PhyloNode, parentDepth: number) => {
    let d: number;
    if (cladogram) {
      d = node.children.length === 0 ? rootHeight : rootHeight - (heightMap.get(node.id) ?? 0);
    } else {
      d = parentDepth + (node === root ? 0 : node.branchLength > 0 ? node.branchLength : 0.02);
    }
    depthMap.set(node.id, d);
    if (d > maxDepth) maxDepth = d;
    for (const c of node.children) assignDepth(c, d);
  };
  assignDepth(root, 0);

  if (maxDepth === 0) maxDepth = 1;

  // Assign Y coordinates (leaves evenly spaced, internal nodes centered between children)
  const yMap = new Map<number, number>();
  let leafIdx = 0;
  const assignY = (node: PhyloNode): number => {
    if (node.children.length === 0) {
      const y = paddingY + leafIdx * rowHeight;
      leafIdx++;
      yMap.set(node.id, y);
      return y;
    }
    const childYs = node.children.map(assignY);
    const y = (Math.min(...childYs) + Math.max(...childYs)) / 2;
    yMap.set(node.id, y);
    return y;
  };
  assignY(root);

  const nodes: LayoutNode[] = [];
  const edges: LayoutEdge[] = [];

  const collect = (node: PhyloNode, parentId: number | null) => {
    const depth = depthMap.get(node.id) ?? 0;
    const x = paddingLeft + (depth / maxDepth) * plotWidth;
    const y = yMap.get(node.id) ?? paddingY;
    nodes.push({
      node,
      x,
      y,
      isLeaf: node.children.length === 0,
      depth,
      parentId,
    });

    for (const child of node.children) {
      const cx = paddingLeft + ((depthMap.get(child.id) ?? 0) / maxDepth) * plotWidth;
      const cy = yMap.get(child.id) ?? paddingY;
      edges.push({
        parentId: node.id,
        childId: child.id,
        x1: x,
        y1: y,
        x2: cx,
        y2: cy,
      });
      collect(child, node.id);
    }
  };
  collect(root, null);

  return {
    nodes,
    edges,
    leafOrder: leaves.map((l) => l.name),
    width: paddingLeft + plotWidth + paddingRight,
    height,
    maxDepth,
    plotLeft: paddingLeft,
    plotRight: paddingLeft + plotWidth,
  };
}
