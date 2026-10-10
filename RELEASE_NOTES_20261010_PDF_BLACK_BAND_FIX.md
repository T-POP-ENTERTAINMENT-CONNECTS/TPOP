# PDF black band fix — 2026-10-10

- Updated PDF page header callbacks to explicitly paint each page white before drawing report content, including subsequent pages.
- Hardened browser print fallback styles so page/body/report backgrounds are forced to white and do not inherit dark backgrounds.
- No campaign metrics, scoring, or business-impact calculations were changed.

Validation note: the source bundle has been patched. Rebuild/redeploy the site and generate a fresh Complete Report PDF to validate the exported artifact. The original PDF was not included in this ZIP, so it could not be directly patched in place.
