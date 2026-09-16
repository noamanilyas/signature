# Project notes

## Bug-repro e2e tests

When writing a Playwright test to reproduce/debug a bug, add it as a
permanent test under `e2e/tests/drag-drop/<feature>/` (matching the existing
per-feature layout, e.g. `table/`, `icon/`, `group3/`) — not in a throwaway
`tmp-repro` folder. Never delete these tests once the task is done, even
after the underlying bug is fixed; keep them in the suite as regression
coverage.
