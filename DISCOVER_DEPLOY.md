# KOL IDS™ Discover — Production Deployment

## What this module does

1. Customer enters `@handle` + platform.
2. KOL IDS searches the internal creator catalog first.
3. If the record is stale/missing, the server calls a configured official API or approved data provider.
4. No browser-side provider secret is used and no public-page scraping is performed.
5. The response stores normalized public metrics, source provenance, retrieval time and a bounded content sample.
6. Benchmarks are calculated from aggregated catalog snapshots by platform + follower band.
7. Campaign/audience context produces a deterministic creator-fit and campaign-role analysis. This is decision support, not a factual claim about the creator or their audience.
8. The customer can import the verified discovery result into the existing creator registry.

## Server secrets

Configure these only in Supabase Edge Function secrets. Never put them in `config.js`, `app.js`, HTML, Git, or a browser bundle.

- `YOUTUBE_DATA_API_KEY` — YouTube Data API v3 public-data access.
- `TIKTOK_RESEARCH_ACCESS_TOKEN` — only for an approved use case that legally permits your product to use TikTok Research API data. TikTok states that Research Tools are for qualifying research/non-profit use cases; for a commercial KOL database, use a commercial/contracted TikTok data path or an approved provider instead.
- `KOLIDS_PROVIDER_URL` — fixed server-side endpoint for an approved data provider.
- `KOLIDS_PROVIDER_API_KEY` — provider credential.

The Discover function also accepts the current Supabase secret-key environment used by the project. Do not expose a Supabase secret/service-role key to the browser.

## Provider contract for `KOLIDS_PROVIDER_URL`

The provider endpoint must accept:

```json
{"platform":"instagram","handle":"creatorhandle"}
```

and return normalized data similar to:

```json
{
  "provider":"Example Approved Provider",
  "sourceUrl":"https://provider.example/docs",
  "termsUrl":"https://provider.example/terms",
  "name":"Creator Name",
  "bio":"Public bio",
  "profileUrl":"https://social.example/@creatorhandle",
  "avatarUrl":"https://...",
  "verified":true,
  "metrics":{
    "followers":100000,
    "following":500,
    "totalLikes":1000000,
    "contentCount":250
  },
  "content":[
    {"id":"public-id","publishedAt":"2026-09-01T00:00:00Z","url":"https://...","type":"VIDEO","views":100000,"likes":5000,"comments":100,"shares":50}
  ]
}
```

The application stores normalized fields only. Do not return private messages, email addresses, phone numbers, login credentials, private audience lists, or sensitive personal attributes.

## SQL order

Run:

1. `SQL_TO_RUN/00_RUN_THIS_IN_SUPABASE_SQL_EDITOR.sql` — existing base setup if this project has not already been initialized.
2. `SQL_TO_RUN/01_RUN_INTELLIGENCE_ENGINE_MIGRATION.sql` — existing intelligence layer.
3. `SQL_TO_RUN/02_ALIGN_FRONTEND_DATABASE.sql` — current frontend/database alignment patch.
4. `SQL_TO_RUN/03_DISCOVER_INTELLIGENCE.sql` — this Discover module.

If the earlier files have already been applied successfully, only the new migration is required.

## Deploy the Edge Function

Deploy `supabase/functions/discover-creator` as the `discover-creator` function.

Keep JWT verification enabled. The function performs an additional organization-membership and active-subscription check before reading or mutating catalog data.

## Security controls built into this version

- Internal catalog tables are revoked from `anon` and `authenticated`; customers reach them through the authenticated Edge Function.
- Provider credentials remain server-side.
- Organization membership is checked before discovery.
- Active entitlement is checked before discovery.
- Per-organization discovery requests are rate-limited to 30/hour in the function.
- Handles are normalized and constrained before provider requests.
- Provider URL is server configuration, not user input, reducing SSRF exposure.
- Provider requests have a timeout.
- Source provider, source type, source URL, terms URL and retrieval time are recorded.
- Metrics are time-stamped so stale data is visible.
- Benchmarks require a minimum cohort size before percentile output is shown.
- Benchmark data is aggregated; individual creators are not returned as the benchmark itself.
- Discovery analysis is auditable in `creator_discover_analyses`.
- The existing creator registry remains organization-scoped by RLS.

## Compliance operating rule

Treat public creator information as potentially personal data. Public availability does not automatically remove data-protection obligations. Maintain a documented purpose, lawful processing basis, privacy notice where required, retention schedule, source/terms register, data-subject request process, and provider-contract review. Do not infer or store sensitive traits from public content merely because an algorithm could infer them.

This is an engineering control set, not legal advice. Have Thai PDPA counsel review the final production data map, provider contracts and customer-facing notice before launch.

## V30.1 compliance / provider policy gate

Set these server-side secrets only. Never put provider credentials in `app.js` or HTML.

- `KOLIDS_ALLOWED_ORIGIN=https://tpopconnects.com`
- `YOUTUBE_DATA_API_KEY=<server secret>`
- `YOUTUBE_DERIVED_METRICS_APPROVED=false` by default; set `true` only after the intended analytics/derived-metrics use case is accepted under the applicable YouTube policy/audit path.
- `KOLIDS_PROVIDER_URL=<approved provider endpoint>`
- `KOLIDS_PROVIDER_API_KEY=<server secret>`
- `KOLIDS_PROVIDER_DERIVED_METRICS_ALLOWED=false` by default; set `true` only where the provider agreement explicitly permits the required derived analytics and storage.
- `TIKTOK_RESEARCH_COMMERCIAL_APPROVED=false` by default. Do not enable the TikTok Research API path for a commercial KOL IDS deployment unless the applicable access/use case has been approved.
- `TIKTOK_RESEARCH_ACCESS_TOKEN=<server secret>` only when approved.

Discover records the source, terms URL, policy profile, freshness, data-quality flags and whether derived metrics were permitted by the source policy.

The system does not scrape platform pages and does not accept user-supplied provider URLs, which avoids turning Discover into an arbitrary outbound fetch/SSRF surface.
