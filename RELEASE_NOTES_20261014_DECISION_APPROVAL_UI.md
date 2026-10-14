## Decision approval eligibility UI fix — 2026-10-14

- Step 04 now disables creator selection unless the latest visible decision is `RECOMMENDED` or `CONSIDER`, matching the approval rule used by saving and performance tracking.
- Ineligible cards explain that a fresh decision is required and prompt the user to review evidence gaps and recalculate fit.
- The approved count includes only currently eligible selected creators, and the workspace entry points use a new application cache key.
- No database change is required.
