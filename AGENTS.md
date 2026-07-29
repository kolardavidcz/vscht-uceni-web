# Agent Rules — vscht_uceni_web

## Environment
- **Runtime**: WSL2 Ubuntu (ext4 filesystem). All commands run inside Linux.
- **Package Manager**: `pnpm` only. Never use `npm` or `yarn`.

## Commands
- **Dev server**: `pnpm dev`
- **Type checking**: `pnpm typecheck`
- **Production build**: `pnpm build`

## CRITICAL: Never invoke node_modules/.bin directly
NEVER run `./node_modules/.bin/tsc` or `./node_modules/.bin/vite` directly.
ALWAYS use `pnpm typecheck`, `pnpm build`, or `pnpm dev`.
Direct binary invocation causes Windows "Select an app" popups on the host OS.
