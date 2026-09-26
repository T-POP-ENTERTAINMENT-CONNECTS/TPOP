# KOL IDS V30.1 — Pricing, Input Friction & Discover Compliance Hardening

## Commercial pricing
- 3 Months: THB 35,000 / 1 seat
- 6 Months: THB 65,000 / 2 seats
- 12 Months: THB 125,000 / 3 seats
- 7-Day Trial remains free / 1 seat

## Input friction
Campaign quick intake keeps only the fields needed to establish the decision frame: campaign name, goal/objective, market, budget/currency, brand name and brand/product context. Dates and key messages are optional. Existing advanced fields remain available and existing saved data is preserved.

Audience quick intake keeps the short audience brief as the main required evidence. Persona name defaults to Primary Audience and audience type defaults to Core Audience. Advanced evidence remains optional.

## Discover
- Exact @handle + platform lookup remains the primary UX.
- Search order remains internal catalog -> official API -> approved provider.
- Source provenance, freshness and data-quality flags are shown to the customer.
- Derived metrics and aggregated benchmarks are now source-policy gated.
- YouTube official API data does not automatically enter derived analytics; the derived-metrics gate must be explicitly approved for the applicable use case.
- TikTok Research API access is disabled by default for commercial deployments and requires an explicit approval flag.
- Provider credentials remain server-side.
- Provider endpoint is server-configured, not user-supplied.
- Catalog tables remain server-only.
- Discover rate limit remains 30 requests / organization / hour.

## Decision Intelligence
Discover remains an evidence acquisition layer. It does not replace the 7-step decision workflow, Performance, Business Impact, Learning, or Reports.
