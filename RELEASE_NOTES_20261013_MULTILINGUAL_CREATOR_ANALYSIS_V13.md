# Multilingual creator analysis — V13 — 2026-10-13

## What changed

- The browser derives creator signals from a curated multilingual phrase glossary for English, Thai, Chinese (Simplified/Traditional), Japanese, Korean, Spanish, French, German, Indonesian, Vietnamese, Portuguese and Arabic.
- The Edge Function uses the same typed concept IDs to compare supported translated phrases across creator bio, manual advanced signals, audience context, brand context and objective text.
- The full eight creator signal groups now contribute where evidence applies: audience relationship/social behavior/audience psychology to Audience; content function/content personality/content behavior to Campaign; personality/communication/content personality to Brand.
- Each fit dimension is calculated only when comparable evidence exists. Unsupported or missing dimensions remain unknown and are omitted from the partial index; they are not treated as a mismatch.
- Common country/market names are normalized across languages. Arabic and Persian digits are normalized when parsing age ranges. Supported translated campaign goals are mapped to the validated canonical objective names.
- Custom Advanced Creator Intelligence values are preserved. Glossary-recognized custom terms participate through their canonical concepts. Unrecognized values are surfaced in `languageEvidence.unmappedCreatorSignals` and can only participate through an exact same-language match in audience, brand or campaign context; the engine does not invent a translation.
- No external translation/LLM provider is called. Creator text remains processed in the existing Supabase Edge Function.
- Model version is now `KOL_IDS_LEARNING_ENGINE_V13_MULTILINGUAL_TYPED_EVIDENCE`, so old-model calibration is not mixed with V13 results.

## Supported language scope

This is deterministic multilingual support for a curated creator-fit taxonomy, common market names and campaign goal labels. It is not general-purpose machine translation or ChatGPT-like understanding of arbitrary idioms, slang, or long prose. The interface currently offers Thai and English display; profile and campaign language fields support the 12 analysis languages above. Unmapped phrases are explicitly reported.

## Deployment

Deploy the static frontend and the `intelligence-engine` Supabase Edge Function together. No database schema migration is required. After deployment, recalculate creator fit so new V13 evidence is written; calibration starts under the new model version and remains low until sufficient V13 outcomes exist.

## Validation

JavaScript and Edge Function TypeScript syntax checks passed. No live Supabase deployment or production analysis was performed.

