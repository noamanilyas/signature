# Signature E2E Tests

This folder is **fully separate** from the signature app source. It does not modify any files under `public/` or `routes/`.

## What is covered

Drag-and-drop layout scenarios for the signature editor canvas (`#drop`):

| Group | Tests | Description |
|-------|-------|-------------|
| Textarea root directions | T1-N, T1-S, T1-W, T1-E | 4-direction drops from root |
| Textarea 3-element | T2-H3, T2-H3-E, T2-V4, T2-RG-L, T2-RG-R, T2-V-R | Multi-step horizontal/vertical/red-green layouts |
| Textarea deep nesting | T3-1 … T3-4, T3-1-N, T3-2-W | Up to 4-level nesting (red `.data2`, green `.data3`) |
| Image / Icon / Field | 1 each | Root + west (red) + north-inside-red (green) smoke |
| Mixed types | MIX-H, MIX-V, MIX-RG | Cross-element horizontal, vertical, and red-green layouts |
| Table cell nesting | smoke + 4 cells + E/S directions + replace | Nested red/green flow inside each 2×2 cell |
| Append tables | TBL-N/S/W/E, TBL-H3, TBL-IN-CELL, textarea sibling | Table-to-table and table-in-cell drops |
| Move / reposition | 3 tests | Swap root items, collapse red, reorder in red row |
| Delete | 5 tests | delDrop, canvas delete, red collapse, table cell reset |
| Fields modal | cancel, single-line, multi-line | Composite field assembly after `btnFields` drop |

**Container rules:**

- **Red** (`.group2` / `.data2`) — east/west drops create horizontal grouping
- **Green** (`.group3` / `.data3`) — north/south drops inside a red box create vertical grouping
- **Root north/south** — flat vertical siblings (no container)

Each test asserts DOM structure, preview table rows/cells, normalized HTML snapshot, and visual baselines (canvas + preview).

## Setup

```bash
cd e2e
npm install
npx playwright install chromium
```

## Run tests

From `e2e/`:

```bash
npm test
```

Run subsets:

```bash
npx playwright test textarea/
npx playwright test mixed/
npx playwright test table/
npx playwright test move/
npx playwright test delete/
npx playwright test fields/
npx playwright test image/
npx playwright test icon/
```

Useful variants:

```bash
npm run test:headed
npm run test:ui
npm run test:debug
```

The config starts the app from the repo root on port `4783` (or `SIGNATURE_TEST_PORT`).

## View results (screenshots, videos & attachments)

Terminal output only shows pass/fail. Artifacts are saved in two places:

### 1. Per-test folder — `e2e/test-results/`

After `npm test`, each test gets its own folder with files on disk (even when tests pass):

| File | Shows |
|------|-------|
| `test-finished-*.png` | Full-page screenshot (Playwright built-in) |
| `video.webm` | Screen recording of the test run |
| `trace.zip` | Playwright trace (open with `npx playwright show-trace trace.zip`) |
| `*-canvas-layout.png` | `#drop` canvas with red/green container borders |
| `*-signature-preview.png` | Generated signature in the right preview panel |
| `*-signature-output.html` | Normalized HTML output |

### 2. HTML report — `e2e/playwright-report/`

For a browsable UI with all attachments in one place:

```bash
npm run report
```

This opens `playwright-report/index.html`. Click any test to see the same canvas/preview/HTML attachments.

## Update baselines

When the current output is correct and you intentionally changed behavior:

```bash
npx playwright test --update-snapshots
```

Snapshots are stored under `e2e/tests/**/*.spec.ts-snapshots/` (PNG + HTML). Commit these baselines so PRs can diff expected layouts.
