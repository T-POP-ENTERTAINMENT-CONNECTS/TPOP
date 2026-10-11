# Creator Fit refresh resilience — 2026-10-11

- Creator edits now refresh fit through the same guarded `calculateCreatorFitSafe()` path used by the Creator page, rather than calling the Edge Function directly.
- If the remote `intelligence-engine` returns a non-2xx response, the UI can display a provisional local fit instead of treating the already-saved creator update as failed.
- The message explicitly warns that the remote engine is unavailable and that provisional local results should not be treated as a successfully persisted remote decision.
- This is a frontend resilience fix; it does not claim to repair the underlying server-side 500. Check Supabase Edge Function logs to identify and fix the original server error.
