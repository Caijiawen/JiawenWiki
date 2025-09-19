# Repository Guidelines

## Project Structure & Module Organization
This site runs on Docusaurus. Author long-form docs in `docs/` using kebab-case filenames, and publish time-stamped stories under `blog/YYYY-MM-DD-title/index.md`. Shared UI and theme code lives in `src/`, while static assets ship from `static/` and are referenced with `/img/...`. Keep scripts and one-off utilities under `scripts/`, translations inside `i18n/`, and let the build output remain confined to `build/`. Update configuration only through the TypeScript files (`docusaurus.config.ts`, `sidebars.ts`, `tsconfig.json`).

## Build, Test, and Development Commands
Use `npm ci` after cloning to sync dependencies. Launch the local dev server with `npm start` for hot reload. Produce the production bundle with `npm run build` and preview it using `npm run serve`. Reset caches when something behaves oddly via `npm run clear`. Run `npm run typecheck` before committing configuration or TS changes. When editing locale data, regenerate strings with `npm run write-translations` and `npm run write-heading-ids`.

## Coding Style & Naming Conventions
Write Markdown/MDX with ATX headings, 80–100 character soft wraps, and a frontmatter block containing `title`, `slug`, and `sidebar_position`. Indent with two spaces and avoid tabs. Follow camelCase for variables and functions, PascalCase for React components, and prefer descriptive names. Keep imports relative within `src/`, and reference assets by their `/img/...` path so they resolve correctly once deployed.

## Testing Guidelines
There is no automated test suite. Validate your work by running `npm run build` to ensure a clean production bundle, and `npm run typecheck` to catch configuration and TS errors. Before opening a pull request, verify key pages manually in `npm start` or after `npm run serve`, checking links, images, and callouts.

## Commit & Pull Request Guidelines
Craft concise, imperative commit subjects; optional emoji prefixes such as `✨ Add homepage hero` follow the existing history. Keep commits scoped to one concern. Pull requests should include a summary of intent, linked issues, screenshots or GIFs for visible changes, and the verification steps you ran. Note any i18n effects when touching `i18n/` or translated strings.

## Security & Configuration Tips
Never commit secrets or API keys—manage them through the deployment platform. Large media files belong under `static/` and should be optimized before committing. Use `vercel.json` only for deployment routing changes; avoid editing generated artifacts in `build/`.
