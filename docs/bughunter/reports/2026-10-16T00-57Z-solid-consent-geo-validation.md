# BugHunter: Solid cookie-consent geo decision and GTM startup

- **Audited:** 2026-10-16 00:57 UTC
- **Repository / base:** `qrati-labs/qrati-connect-solid-example`, `fd82c4f8fe37095b4eaad6a28952566a65147e08` (`main`)
- **Outcome:** Confirmed medium-severity fail-open defect in geo-response validation; report-only PR. No production fix was made because this repository has no test framework or test files, and its declared package manager/dependencies are unavailable in this run. Per the test-first requirement, the unsafe code path was documented rather than changed without a regression test.
- **Coverage / performance:** Not measured.

## Workflow and control/data flow

`src/components/CookieConsentBanner.tsx` starts on mount, calls `initGtm()` first, then awaits `checkConsentRequired()` and passes its result to `ensureCookieConsentInitialized()`. The footer invokes `showCookiePreferences()`, which lazily enters the same singleton initialization promise. `src/lib/cookieConsent.ts` reads a session cache or calls the geo endpoint, then selects CookieConsent opt-in/opt-out mode and updates Google Consent Mode signals. The worker (`src/worker.ts`) only normalizes static routes and injects/strips GTM placeholders in HTML; the inspected runtime GTM path is the client-side loader.

## Bounded related-code cone

Included: consent/GTM functions and component, `App.tsx` mount/footer callers, `index.html` load order/template markers, `worker.ts` HTML handling, package scripts/dependencies, test-file discovery, and current dependency availability. Excluded: gallery widget internals and the geo endpoint implementation/service (cross-repository contract not independently inspected here). CodeGraph was initialized for this checkout and used to trace the component, helpers, and callers; its generated `.codegraph/` directory is untracked and was left in the original checkout because safe removal was blocked. The audit/branch worktree is separate.

## Finding

### Medium — malformed successful geo payload is cached and interpreted as consent not required

At `src/lib/cookieConsent.ts:102-107`, any HTTP-success response is destructured as `{ required: boolean }` without runtime validation, its value is cached as a string, and then returned. An empty object or a payload with a non-boolean `required` can therefore yield `undefined` or another invalid value; `ensureCookieConsentInitialized()` uses truthiness at lines 126-135, so the invalid value selects opt-out mode and may call `updateGtagConsent({ analytics: true, ads: true })` (lines 128-131). This is a fail-open boundary: only explicit boolean `false` should mean consent is not required. The catch path correctly defaults network/JSON parse failures to required, but structurally valid malformed JSON objects bypass it. Recommend requiring `typeof required === 'boolean'` before caching/returning, and testing missing, non-boolean, and valid values.

The GTM setup emits a global granted default followed by denied regional defaults before appending the GTM script (`cookieConsent.ts:37-61`). Google documents that an unscoped default applies where no more-specific regional default applies, so this ordering itself is not reported as a defect. The behavior still merits browser-level region simulation to validate deployed configuration.

## Test quality and verification evidence

- No repository test files or test script were found; `package.json` only defines dev/build/preview/deploy.
- `pnpm` is not installed (`pnpm: command not found`) and `node_modules` is absent. Build, lint, typecheck, and automated regression execution could not be run.
- No tests were added: without a runnable TypeScript test harness/dependencies, introducing an unexecutable test setup would not provide verified coverage. The report identifies the exact regression cases needed before production correction.
- Unit evidence: none; integration/E2E evidence: none; coverage not measured.
- Static source review only. No performance measurement.

## Research and recommendations

Google's Consent Mode guidance says an unscoped default applies to visitors not covered by region-specific defaults, and more-specific regions take precedence.[1] For this workflow, validate the geo response at runtime and fail closed on any missing or non-boolean decision. Add focused unit tests for schema boundaries/cache writes, then integration coverage for component startup and GTM consent state, including geo request failure and region-specific behavior.

## Commands and results

- Fresh preflight evidence: chosen checkout `FETCH=ok`, clean, `main` at the same SHA as `origin/main`.
- `gh auth status`: authenticated.
- `gh pr list --repo qrati-labs/qrati-connect-solid-example --state open`: no existing PRs.
- `codegraph init`: indexed 10 files; 55 nodes and 86 edges.
- `pnpm --version`: failed; executable unavailable. `node_modules` absent.
- Automated tests/build/lint/typecheck: not run (blocked by unavailable package manager/dependencies and no test harness).
- Code changes: report and tracker only; no production code/tests.
- `git diff --check`: to be verified before PR.

## PR state

Report-only PR URL and head/check state will be recorded after publication; never merge or deploy.

## Sources

[1] https://developers.google.com/tag-platform/security/guides/consent — Google Consent Mode documentation