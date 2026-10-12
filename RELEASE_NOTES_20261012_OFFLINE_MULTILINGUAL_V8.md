# Release notes — offline multilingual creator intelligence V8 (2026-10-12)

- Added campaign/brief language alongside creator profile language, with 12 selectable languages.
- Added an in-code, auditable concept glossary for core creator-fit concepts across Thai, English, Chinese, Japanese, Korean, Spanish, French, German, Indonesian, Vietnamese, Portuguese, and Arabic. The glossary can normalize matched concepts such as review, educate, skincare, trust, interactive, and playful across languages without sending data to an external service.
- Cross-language fit compares normalized concept IDs when both sides contain recognized glossary concepts. Unknown words are not translated. Same-language text can still use lexical word matching.
- Decision results now include the language pair, comparison mode, recognized concept IDs, and usable score-weight coverage. Partial evidence produces a partial screening index; zero usable dimensions produce no score. Core evidence gates remain in place for recommendations.
- Creator fee currency is saved separately and commercial fit is available only when it matches campaign currency. No FX rate is invented.
- Bumped learning model to `KOL_IDS_LEARNING_ENGINE_V8_OFFLINE_MULTILINGUAL_GLOSSARY` so calibration does not mix scoring contracts.

## Privacy and limits

- Creator and campaign text is processed inside the existing Supabase Edge Function. No external LLM, translation API, or AI provider is called.
- The glossary is finite and rule-based. It does not understand arbitrary paraphrases, context, sarcasm, negation, or ambiguous phrases. For cross-language use, select the correct languages and use standard creator-intelligence tags where possible. If evidence is insufficient, the engine must not be treated as a probability or final decision.
- Workspace interface and narrative labels remain primarily English; this release localizes interpretation inputs and records language evidence, but does not provide ChatGPT-style free-form translated explanations across all languages.
- Verification: JavaScript and Edge Function syntax parsing passed. No live Supabase, Deno typecheck, or deployed production run was performed.
