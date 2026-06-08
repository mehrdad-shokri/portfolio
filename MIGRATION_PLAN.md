# Migration Plan: TypeScript + Next.js 15 + Bun Upgrade

## Overview

Three tracks:
1. **Runtime & package manager** — replace Node.js/npm with Bun
2. **TypeScript migration** — convert all 120 JS files to `.ts`/`.tsx`
3. **Dependency upgrade** — Next.js 12 → 15, and all other packages to current versions

Styling toolchain (PostCSS, CSS Modules, stylelint) stays as-is; only versions change.
Pages Router is kept — no App Router migration (see rationale below).

---

## Why Pages Router, Not App Router

Next.js 13 introduced the App Router as an opt-in, and it has been the recommended default since Next.js 14. So it's a fair question why this plan sticks with Pages Router. Here is the reasoning, and where App Router would make sense later.

**This codebase is structurally coupled to Pages Router patterns.** Every page uses `getStaticProps` and/or `getStaticPaths`. The `_app.page.js` holds global context (theme, menu state) via React Context and a `useReducer`. `_document.page.js` customizes the HTML shell. These are Pages Router primitives — none of them exist in the App Router. Migrating them isn't a rename; it's a rewrite:

| Pages Router | App Router equivalent |
|---|---|
| `getStaticProps` | `async` page component + `fetch` with `cache: 'force-cache'` |
| `getStaticPaths` | `generateStaticParams()` export |
| `_app.page.js` | Root `layout.tsx` with `'use client'` providers |
| `_document.page.js` | Root `layout.tsx` metadata + `<html>`/`<body>` |
| `AppContext` via `useContext` | Context still works but providers must be in Client Components |

**We are already doing two major changes simultaneously** (TypeScript + Next.js upgrade). App Router is a third axis of complexity with its own mental model: Server Components vs Client Components, streaming, the `use` hook for async data, the new `metadata` API, etc. Mixing all three would make regressions very hard to bisect.

**Pages Router is not going away.** Vercel has committed to supporting it long-term. Next.js 15 ships with Pages Router fully intact. Choosing it now does not block an App Router migration later.

**When App Router migration makes sense:** after this plan is complete and the codebase is stable TypeScript. At that point it would be a clean, isolated migration rather than an entangled one. The blog's `getStaticProps`/`getStaticPaths` pattern is the natural starting point — it maps almost 1:1 to `generateStaticParams` in the App Router.

---

## Breaking Changes to Know Before Starting

| Change | Impact |
|--------|--------|
| `next export` CLI removed in Next.js 13 | Replace with `output: 'export'` in next.config.js |
| `next/image` API changed in Next.js 13 | `layout` prop removed; use `fill`, `width`, `height` instead |
| `next/link` no longer needs `<a>` child in Next.js 13 | Remove bare `<a>` children from `<Link>` |
| `next start` doesn't work with static export | Use a static file server for local preview |
| framer-motion 7 → 12: `AnimatePresence` and `LazyMotion` API changes | Review animation code |
| Storybook 6 → 8: complete config format change | Rewrite `.storybook/` config |
| `pageExtensions` must include `.tsx` variants | Update next.config.js |
| `module.exports` in next.config.js → use `import` or keep CJS | Decide on config format |
| Bun replaces Node.js as runtime and npm/yarn as package manager | `yarn.lock` / `package-lock.json` replaced by `bun.lockb`; all scripts use `bun run` |
| `engines` field in package.json changes from `node` to `bun` | Update before switching |

---

## Phase 0 — Bun Migration

> Goal: replace npm/yarn with Bun as both the package manager and the JavaScript runtime.
> Do this first so every subsequent install and script invocation in this plan uses Bun from the start.

### What Bun replaces and what it doesn't

Bun operates at two levels here:

**Package manager** (`bun install`, `bun add`, `bun remove`) — a drop-in replacement for npm/yarn. Installs from the same `package.json`, resolves the same registry, but is significantly faster. Creates `bun.lockb` instead of `yarn.lock` / `package-lock.json`.

**Runtime** (`bun run <script>`, `bun <file>`) — replaces `node` for running scripts. Bun implements the Node.js API surface (fs, path, crypto, child_process, etc.) so the existing utility scripts and `og-image.ts` will run under Bun without changes. It also has native TypeScript execution — no separate compilation step needed for running scripts directly.

**What stays on Node.js:** Next.js internally spawns its own Node.js processes for compilation and the dev server. `bun run dev` / `bun run build` invoke the Next.js CLI, which runs inside Node.js. Bun is the launcher and package manager; Node.js remains the Next.js engine. This is the standard and supported way to use Bun with Next.js.

### Tasks

- [x] **0.1** Install Bun (1.3.14)
- [x] **0.2** Update `engines` in `package.json` to `"bun": ">=1.1.0"`
- [x] **0.3** Generated `bun.lock`, removed `package-lock.json`
- [x] **0.4** All scripts use `bun run` — `lint`, `build:storybook` updated; `deploy:functions` left as `npm run deploy` intentionally (separate sub-project)
- [x] **0.5** Removed `legacy-peer-deps=true` from `.npmrc` (npm-only flag, Bun ignores it)
- [x] **0.6** Build verified passing with `bun run build`
- [x] **0.7** `vercel.json` updated with `bunVersion`, `installCommand`, `buildCommand`, `outputDirectory`
- [x] **0.8** `puppeteer-core` launches Chrome correctly under Bun runtime

---

## Phase 1 — Foundation & Tooling

> Goal: get the project ready to accept TypeScript without breaking the existing build.

- [x] **1.1** Install TypeScript and type packages
  ```bash
  bun add --dev typescript @types/react @types/react-dom @types/node
  ```
- [x] **1.2** Create `tsconfig.json`
  - Set `baseUrl: "src"` to preserve existing path aliases
  - Enable `strict: true`
  - Include `jsx: "preserve"` (Next.js handles JSX transform)
  - Add `paths` to match jsconfig aliases (components/*, layouts/*, etc.)
  - Set `moduleResolution: "node"` (Next.js 12 uses webpack; upgrade to `bundler` in Phase 2)
  - Add `ignoreDeprecations: "6.0"` to silence TS 6 baseUrl deprecation warning
  - Remove `jsconfig.json` after tsconfig is confirmed working
- [x] **1.3** Add TypeScript ESLint support
  ```bash
  bun add --dev @typescript-eslint/parser @typescript-eslint/eslint-plugin
  ```
  Scoped to `.ts`/`.tsx` files via `overrides` — avoids breaking existing JS files before migration
- [x] **1.4** Update `prettier` to current version (2.x → 3.x) and verify `.prettierrc` still works
- [x] **1.5** Add `typecheck` script to `package.json`
  ```json
  "typecheck": "tsc --noEmit"
  ```
- [x] **1.6** Update `stylelint` and all stylelint plugins to current versions
- [x] **1.7** Verify the existing JS build still passes after tooling changes
  ```bash
  bun run build
  ```

---

## Phase 2 — Next.js 15 Upgrade

> Goal: upgrade Next.js and fix all breaking changes before touching TypeScript.

- [ ] **2.1** Upgrade Next.js and related packages
  ```bash
  bun add next@latest react@latest react-dom@latest @next/bundle-analyzer@latest eslint-config-next@latest
  ```
- [ ] **2.2** Replace `next export` in `package.json` build script
  - Remove `&& next export -o build/`
  - Add `output: 'export'` and `distDir: 'build'` to `next.config.js`
  - Update `deploy` script accordingly
- [ ] **2.3** Update `next.config.js`
  - Add `output: 'export'`
  - Add `distDir: 'build'`
  - Update `pageExtensions` to `['page.tsx', 'page.ts', 'page.js', 'api.tsx', 'api.ts', 'api.js']` (support both during migration)
- [ ] **2.4** Fix `next/image` usage
  - Audit all `<Image>` usages in the codebase (`src/components/Image/Image.js`, pages, layouts)
  - Remove `layout` prop; replace with `fill` or explicit `width`/`height`
  - Update `objectFit` and `objectPosition` to CSS instead of props
- [ ] **2.5** Fix `next/link` usage
  - Find all `<Link><a>...</a></Link>` patterns
  - Remove the inner `<a>` wrapper (Next.js 13+ renders it automatically)
  - Preserve any `className` or `onClick` that was on `<a>` by moving to `<Link>`
- [ ] **2.6** Run build and fix any remaining Next.js upgrade errors
  ```bash
  bun run build
  ```
- [ ] **2.7** Smoke-test the static export and confirm `build/` directory is correct

---

## Phase 3 — TypeScript Migration

> Goal: convert all source files to TypeScript. Work bottom-up (utils → hooks → components → layouts → pages).
> Strategy: rename `.js` → `.ts`/`.tsx`, fix type errors, commit in logical batches.

### 3.1 Shared Types File
- [ ] Create `src/types/index.ts` with shared interfaces:
  - `Theme` (`'dark' | 'light'`)
  - `AppState` and `AppAction` (from `layouts/App/reducer.js`)
  - `MediaBreakpoints` (from `utils/style.js`)
  - Any other cross-cutting types

### 3.2 Utilities (`src/utils/`)
- [ ] `clamp.js` → `clamp.ts`
- [ ] `date.js` → `date.ts`
- [ ] `delay.js` → `delay.ts`
- [ ] `throttle.js` → `throttle.ts`
- [ ] `timecode.js` → `timecode.ts`
- [ ] `style.js` → `style.ts` (type `media`, `cssProps`, `classes`)
- [ ] `image.js` → `image.ts` (type srcSet utilities)
- [ ] `three.js` → `three.ts` (type Three.js color utilities; install `@types/three`)
- [ ] `mdx.js` → `mdx.ts`

### 3.3 Custom Hooks (`src/hooks/`)
- [ ] `useAppContext.js` → `useAppContext.ts`
- [ ] `useFormInput.js` → `useFormInput.ts`
- [ ] `useFoucFix.js` → `useFoucFix.ts`
- [ ] `useFps.js` → `useFps.ts`
- [ ] `useHasMounted.js` → `useHasMounted.ts`
- [ ] `useInViewport.js` → `useInViewport.ts`
- [ ] `useInterval.js` → `useInterval.ts`
- [ ] `useLocalStorage.js` → `useLocalStorage.ts`
- [ ] `useParallax.js` → `useParallax.ts`
- [ ] `usePrevious.js` → `usePrevious.ts`
- [ ] `useScrollToHash.js` → `useScrollToHash.ts`
- [ ] `index.js` → `index.ts`

### 3.4 ThemeProvider (dependency of almost everything)
- [ ] `ThemeProvider/theme.js` → `theme.ts`
- [ ] `ThemeProvider/useTheme.js` → `useTheme.ts`
- [ ] `ThemeProvider/ThemeProvider.js` → `ThemeProvider.tsx`

### 3.5 Simple/Leaf Components (`src/components/`)
These have no or few sub-dependencies — convert first:
- [ ] `Divider` → `.tsx`
- [ ] `VisuallyHidden` → `.tsx`
- [ ] `Text` → `.tsx`
- [ ] `Heading` → `.tsx`
- [ ] `Monogram` → `.tsx`
- [ ] `Icon` → `.tsx` (type icon name union from SVG filenames)
- [ ] `Loader` → `.tsx`
- [ ] `Transition` → `.tsx`
- [ ] `Section` → `.tsx`
- [ ] `List` → `.tsx`
- [ ] `Table` → `.tsx`
- [ ] `Code` → `.tsx`
- [ ] `DecoderText` → `.tsx`

### 3.6 Complex Components
- [ ] `Button` → `.tsx` (has `forwardRef`, external link detection)
- [ ] `Link` → `.tsx`
- [ ] `Input` + `TextArea` → `.tsx`
- [ ] `SegmentedControl` → `.tsx`
- [ ] `Carousel` → `.tsx` (has GLSL shaders — add `src/types/glsl.d.ts` module declaration)
- [ ] `Model` → `.tsx` (Three.js; type `deviceModels.js` → `deviceModels.ts`)
- [ ] `Image` → `.tsx` (most complex; type srcSet, lazy loading, video handling)
- [ ] `Navbar` → `.tsx` (`NavToggle`, `ThemeToggle`, `navData`)
- [ ] `Meta` → `.tsx`
- [ ] `Footer` → `.tsx`

### 3.7 Layouts (`src/layouts/`)
- [ ] `App/reducer.js` → `reducer.ts`
- [ ] `App/ScrollRestore.js` → `ScrollRestore.tsx`
- [ ] `Home/DisplacementSphere.js` → `DisplacementSphere.tsx`
- [ ] `Home/Intro.js` → `Intro.tsx`
- [ ] `Home/Profile.js` → `Profile.tsx`
- [ ] `Home/ProjectSummary.js` → `ProjectSummary.tsx`
- [ ] `Home/Home.js` → `Home.tsx`
- [ ] `Post/PostMarkdown.js` → `PostMarkdown.tsx`
- [ ] `Post/Post.js` → `Post.tsx`
- [ ] `Project/Project.js` → `Project.tsx`

### 3.8 Pages (`src/pages/`)
- [ ] `_app.page.js` → `_app.page.tsx`
- [ ] `_document.page.js` → `_document.page.tsx`
- [ ] `index.page.js` → `index.page.tsx`
- [ ] `404/index.page.js` → `404/index.page.tsx`
- [ ] `blog/Articles.js` → `blog/Articles.tsx`
- [ ] `blog/og-image.js` → `blog/og-image.ts`
- [ ] `blog/index.page.js` → `blog/index.page.tsx`
- [ ] `blog/[slug].page.js` → `blog/[slug].page.tsx`
- [ ] `contact/Contact.js` → `contact/Contact.tsx`
- [ ] `contact/index.page.js` → `contact/index.page.tsx`
- [ ] `projects/snappfood/Earth.js` → `Earth.tsx`
- [ ] `projects/snappfood/SnappFood.js` → `SnappFood.tsx`
- [ ] `projects/snappfood/index.page.js` → `index.page.tsx`
- [ ] `uses/Uses.js` → `Uses.tsx`
- [ ] `uses/index.page.js` → `uses/index.page.tsx`

### 3.9 Module Declarations (`src/types/`)
These are needed for non-typed imports:
- [ ] `glsl.d.ts` — declare `*.glsl` as `string`
- [ ] `mdx.d.ts` — declare `*.mdx` module if needed
- [ ] `css.d.ts` — CSS Modules typing (or use `typescript-plugin-css-modules`)
- [ ] Check if `@types/three` covers everything or if custom Three.js overrides are needed

### 3.10 Storybook
- [ ] Update all `*.stories.js` files to `*.stories.tsx`
- [ ] Add `argTypes` with proper TS types

### 3.11 Final typecheck pass
- [ ] Run `bun run typecheck` with zero errors
- [ ] Remove `jsconfig.json`
- [ ] Remove `.js` extensions from `pageExtensions` once all files are migrated

---

## Phase 4 — Remaining Dependency Upgrades

> These are kept separate from Next.js because they each carry their own API changes.

- [ ] **4.1** Upgrade `framer-motion` (7.x → 12.x)
  - `LazyMotion` and `domAnimation` API is unchanged
  - `AnimatePresence` `exitBeforeEnter` prop renamed to `mode="wait"`
  - Review any `useAnimation` or `useMotionValue` usage for deprecations
- [ ] **4.2** Upgrade `three` (0.144 → 0.184) and `three-stdlib`
  - Check for removed or renamed exports
  - Verify `DisplacementSphere.js` and `Earth.js` still work
- [ ] **4.3** Upgrade `mdx-bundler` (9.x → 10.x)
  - Review changelog for `bundleMDX` API changes
- [ ] **4.4** Upgrade `esbuild` to current (0.15 → latest)
- [ ] **4.5** Upgrade Storybook (6.5 → 8.x)
  - This is a significant rewrite of `.storybook/main.js` and `.storybook/preview.js`
  - Use `bunx storybook@latest upgrade` to get the automated migration (Bun equivalent of `npx`)
  - Replace `storybook-addon-next` with `@storybook/nextjs` (official framework package)
  - Update `@storybook/builder-webpack5` → Storybook 8 uses Vite by default (or keep webpack5)
- [ ] **4.6** Upgrade all rehype plugins (`rehype-img-size`, `rehype-preset-minify`, `rehype-slug`, `@mapbox/rehype-prism`) to current versions
- [ ] **4.7** Upgrade PostCSS and PostCSS plugins (`postcss-preset-env`, `postcss-flexbugs-fixes`) to current versions
- [ ] **4.8** Upgrade `@svgr/webpack` (6.x → 8.x) — verify SVG imports still work
- [ ] **4.9** Upgrade all ESLint plugins to versions compatible with ESLint 9
  - ESLint 8 → 9 uses a flat config format by default; decide whether to adopt it or stay on legacy `.eslintrc`
- [ ] **4.10** Final full build and storybook build verification

---

## Phase 5 — Validation & Cleanup

- [ ] **5.1** `bun run typecheck` — zero TypeScript errors
- [ ] **5.2** `bun run build` — clean production build with static export
- [ ] **5.3** `bun run lint` — zero ESLint and stylelint errors
- [ ] **5.4** `bun run build:storybook` — Storybook builds successfully
- [ ] **5.5** Serve the `build/` directory locally and manually verify all pages
  - Home, Blog index, blog posts (MDX rendering, OG images)
  - Contact page
  - Projects page (3D Earth renders)
  - Uses page
  - 404 page
  - Dark/light theme toggle
- [ ] **5.6** Check bundle sizes haven't regressed significantly
- [ ] **5.7** Remove any remaining `.js`/`.jsx` source files that have been converted
- [ ] **5.8** Update `README.md` with new stack information

---

## File Count Summary

| Area | Files to Migrate |
|------|-----------------|
| utils/ | 9 |
| hooks/ | 12 |
| components/ | ~55 (JS + index files) |
| layouts/ | ~20 |
| pages/ | ~16 |
| stories/ | ~26 |
| types to create | ~4 |
| **Total** | **~142 files** |

---

## Suggested Commit Cadence

Each phase or sub-section in Phase 3 should be a separate commit so regressions are easy to bisect.
Never commit with a failing `bun run build` or failing `bun run typecheck`.
