# KOL IDS V30 — Audience-First + Performance-Only Gen Code

## Step 03 / KOL Persona
- Removed Gen Code from the creator/KOL intake UI.
- Creator records no longer generate or save creator-level Gen Codes from the KOL Persona page.
- Removed the Gen Code badge from Decision/KOL Persona cards.
- Existing legacy creator `payload.genCode` values are not deleted automatically, but are no longer used or displayed by the creator intake/decision flow.

## Step 02 / Audience
- Step 02 can now be opened and filled before Step 01 Campaign is completed.
- Audience fields are treated as direct brand target-audience inputs.
- Unsaved audience input is retained in the current workspace while navigating away and back.
- When the user saves an audience before a campaign exists, KOL IDS creates a minimal `Untitled Campaign` draft shell and links the audience to it through `campaign_id`.
- Completing Step 01 later updates the same campaign shell rather than creating a disconnected campaign.
- Existing Audience → Creator Intelligence → Decision relationships remain intact.

## Step 05 / Performance
- Gen Code remains available only in Performance.
- Campaign-level Gen Code configuration continues to generate codes for approved creators and attaches code, code ID and attribution window to performance observations.
- No database migration is required.
