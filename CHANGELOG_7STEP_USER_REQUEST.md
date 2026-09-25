# KOL IDS — 7-Step Workflow Update

## Step 01 — Campaign Objectives & Brand Personality
- Objectives reduced to exactly 9 choices: Brand Awareness, Reach, Engagement, Consideration, Conversion, Traffic, Lead Generation, Sales, Other.
- Other objective accepts custom text and is stored in the campaign payload.
- Brand Personality reduced to exactly 9 choices: Premium, Authentic, Innovative, Bold, Sophisticated, Playful, Trustworthy, Energetic, Other.
- Other personality accepts custom text and is stored in the campaign payload.

## Step 02 — Audience Persona
- Added a required deep Audience Persona field.
- Retained structured age/life stage, market, income/spending, interests, behavior journey, pain points, lifestyle/content habits, purchase context, exclusions and evidence notes.
- Intelligence Engine now includes Audience Persona, interests, income and purchase context in audience-fit evidence.

## Step 03 — KOL Persona
- Profile link renamed to Primary Channel link and stored as both `primaryChannelLink` and legacy-compatible `profileUrl`.
- Creator photo changed from URL input to direct image upload.
- Browser compresses uploaded images to WebP before storing them in the creator payload.
- Added Decision shortlist so selected creators can move explicitly into Step 04.

## Step 04 — Decision
- Step 04 displays the creators shortlisted in Step 03.
- Analysis request sends `creator_ids` to the Intelligence Engine.
- Backend now honors `creator_ids`, so only the intended shortlist is analyzed.
- Decision cards expose audience, content, brand, performance evidence, commercial efficiency, confidence and risk.

## Step 05 — Digital & Event Performance
- Digital inputs expanded to impressions, views, engagement components, saves, clicks, sessions, leads, conversions, revenue and content volume.
- Live digital calculations include engagement rate, view rate, CTR, lead rate, conversion rate, CPM, CPC, CPA and ROAS.
- Event inputs expanded to capacity, attendance, qualified leads, QR scans, demos, samples, engagement actions, conversions, revenue and spend.
- Live event calculations include attendance rate, lead rate, scan rate, demo rate, sample rate, conversion rate, cost/attendee, cost/lead, revenue/attendee and ROAS.
- Intelligence Engine now calculates offline outcome scores from event metadata instead of treating event observations as empty digital data.

## Step 06 — Business Impact & Learning
- Connects approved creator decisions with observed digital/event outcomes.
- Calculates revenue, spend, ROAS, ROI, conversion and efficiency signals.
- Added What Worked, Friction, Next Hypothesis and calculated Next Actions.

## Step 07 — Reports
- Expanded full report to include campaign objectives, brand personality, audience persona, creator decision evidence, digital/event outcomes, business impact and learning.
- Full PDF report remains downloadable.
- Added report-data JSON export.

## Validation
- `app.js` passes Node syntax check.
- Duplicate helper definitions removed after the workflow replacement.
- Existing Supabase schema is retained; new workflow fields are stored in existing JSON payload/metadata structures.
