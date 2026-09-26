# 2026-09-26 — Discover Hardening

### Added
- Handle-based Discover UI in Step 03.
- Internal creator catalog with platform + normalized handle identity.
- Time-series creator metric snapshots.
- Bounded public content metric records.
- Source/provenance records with provider, source URL, terms URL and retrieval time.
- Aggregated follower-band benchmarks (P25/P50/P75) with minimum cohort size.
- Auditable discovery request log and campaign-specific discovery analysis.
- Import-from-catalog into the existing organization creator registry.
- YouTube Data API v3 connector for public channel/video metrics.
- TikTok Research API connector behind explicit server-side credentials and eligibility requirements.
- Generic approved-data-provider connector for Instagram/Facebook/X/other commercial provider contracts.
- Server-side rate limiting, provider timeout, handle normalization and organization/entitlement checks.

### Security / compliance design
- Provider credentials are never accepted from or exposed to the browser.
- No public-page scraping route is implemented.
- Catalog tables are not exposed to the browser Data API.
- Customer workspace data remains organization-scoped.
- Sensitive attributes, private contact data and private audience lists are not part of the normalized schema.
- Discovery analysis records source and methodology for auditability.

### Important provider note
TikTok Research API access is restricted by TikTok's eligibility/terms. Commercial KOL IDS usage must use a permitted commercial/contracted API or approved data provider rather than assuming Research API access is allowed.


## V31.1.1 — Discover request diagnostics
- Hardened Edge Function request validation and stage-specific failure logging.
- Added stable error codes/request IDs for validation, access, rate limit and not-found responses.
- Added audit-write error checks and clearer import/discovery error surfaces.
- Expanded CORS allow-headers for Supabase client headers.
- Improved frontend parsing of JSON/text Edge Function error bodies and surfaced HTTP status.
