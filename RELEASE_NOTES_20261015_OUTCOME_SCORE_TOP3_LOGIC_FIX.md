KOL IDS — CALCULATION LOGIC PATCH (2026-10-15)

Scope: internal calculation logic only. No layout, styles, copy, navigation, authentication, or unrelated features changed.

Root cause:
The report derived impact score and Top 3 from performance_observations.actual_score, but that score is computed/stored on prediction-ledger rows, not on performance observations. Therefore entered performance records could contribute to business totals while remaining Pending and being excluded from the leaderboard.

Fix:
- Derive an observed outcome score directly from each completed performance observation using the existing goal- and channel-specific score model (DIGITAL, ECOMMERCE, OFFLINE).
- Preserve any explicit actual_score if present; otherwise derive from recorded metrics.
- Use those derived scores in report status, average impact score, exports that consume report snapshot, and Top 3 leaderboard through the existing shared report snapshot.
- Incomplete records with no usable metrics remain unscored; missing metrics are excluded from the weighted score rather than treated as zero.

Validation:
- JavaScript syntax checked with `node --check`.
- This is a code-level fix; runtime behavior still needs confirmation against the deployed Supabase data and hosting deployment.
