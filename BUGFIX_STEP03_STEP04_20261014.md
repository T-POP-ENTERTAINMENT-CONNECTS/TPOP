# KOL IDS — Step 03 / Step 04 Bug Fix (2026-10-14)

## Scope
- Fix Step 03 auto-calculation guard: existing creator-decision rows with a null/missing score or empty evidence no longer count as completed fit results.
- Preserve the intended workflow: valid saved fit rows are reused; auto-calculation is only triggered when one or more creators lack a complete saved result.
- Fix Step 04 approval validation to read the current campaign's latest decision rows, including in-session fallback rows, and require a real numeric score plus non-empty evidence before approval.
- Use a clearer validation message when a creator's fit result is missing/incomplete.

## Validation
- `node --check app.js` passes.
- No database schema/migration changes are included.
- This is a source patch; deploy the updated `app.js` with the existing project and test against the connected Supabase project.

## Important
This patch does not invent missing scores or treat absent historical performance as bad performance. It forces incomplete/stale fit records to be recalculated rather than silently presenting them as completed.
