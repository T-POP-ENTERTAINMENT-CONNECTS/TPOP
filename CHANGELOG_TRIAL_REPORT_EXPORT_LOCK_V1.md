# KOL IDS™ — Trial Report Export Lock

## Change
7-Day Trial users can continue to use the workspace and view analysis results, but JSON/CSV report export is locked until a paid plan is active.

## Enforcement
- Server-side gate added to canonical Product export helpers.
- Server-side gate added to SaaS export-current and export-history endpoints.
- Self-service export endpoints return `REPORT_EXPORT_SUBSCRIPTION_REQUIRED` with `upgradeRequired=true`.
- Trial data is preserved; no analysis/workspace data is deleted or hidden.
- Workspace UI shows an upgrade modal when a Trial user clicks **Export report data**.

## Paid behavior
Paid plans continue to export normally.
