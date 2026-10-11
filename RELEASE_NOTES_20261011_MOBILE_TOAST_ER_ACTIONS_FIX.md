# Mobile creator UI and ER guard — 2026-10-11

- Reduced Social / Edit / Remove buttons on mobile to 46px high (43px on very narrow screens), with smaller padding and gaps.
- Constrained mobile toast notifications to the viewport and reduced their type size so long warning messages do not cover most of the creator card.
- Guarded the Creator Fit card against invalid engagement-rate values above 100%; these are shown as `Check ER data` rather than a misleading percentage such as `10000%`.
- Creator create/update now rejects engagement-rate values outside 0–100% with a clear validation message.
- Note: the toast shown in the screenshot reports a genuine remote `intelligence-engine` Edge Function failure. This UI patch makes the local fallback and warning usable, but cannot verify or repair the deployed Supabase function without its runtime error/logs. Provisional local decisions remain explicitly provisional until the remote engine succeeds.
