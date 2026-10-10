# Professional report and data governance upgrade — 2026-10-10

## Report changes
- Expanded Complete Report PDF evidence coverage to count source labels: VERIFIED, API, SELF-REPORTED, ESTIMATED, unspecified, and records without outcome scores.
- Added a calculation definitions and limitations section to make ROAS, ROI, revenue less spend, conversion rate, and event lead yield interpretable and auditable.
- Explicitly states that source labels are not, by themselves, proof of independent audit.
- Adds guardrails about compatible channel scope, measurement windows, currency, attribution, and validating reported metrics against platform/shop/CRM/event exports.
- Preserves unavailable values as unavailable and distinguishes derived calculations from independently audited results.

## Validation
- JavaScript syntax checked with Node.
- ZIP integrity checked.
- The PDF must be regenerated after deployment and reviewed with live campaign data; this bundle does not certify the underlying source records.
