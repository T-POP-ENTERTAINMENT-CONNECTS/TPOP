# KOL IDS™ V23 — Campaign Reference UI

This build updates the authenticated customer workspace to match the supplied Campaign reference screen.

## Campaign step
- 7-step sidebar with exact step labels and descriptions.
- Campaign header moved into the workspace top bar: “Define the commercial decision.”
- Campaign page no longer renders a duplicate hero/header block.
- Campaign Basics: Campaign Name, Goal, Market / Country / Region, Category, Sub-category, Campaign Type.
- Objectives: exact reference option set, including Repositioning and Other with inline specification.
- Selected objective chips with remove controls.
- Budget & Timeline: Budget, Currency, Start Date, End Date.
- Brand Profile: Brand Name, Brand Positioning, Brand Promise, Brand Personality.
- Brand Intelligence: Brand Values, Brand Avoid / Things We Must Avoid, Key Brand Messages.
- Custom “Other” inputs are persisted in campaign payload.
- Required-field validation accounts for custom Other selections.
- Existing Supabase campaign save/update flow is preserved.

## Post-login flow
Authenticated users with granted access render the workspace directly. There is no intentional intermediate “workspace loading” page in this UI build.
