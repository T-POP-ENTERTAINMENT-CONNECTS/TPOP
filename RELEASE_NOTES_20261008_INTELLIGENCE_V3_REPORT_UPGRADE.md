# KOL IDS — Intelligence Engine V3 + Step 07 Report Upgrade

## Intelligence Engine
- Model version: `KOL_IDS_LEARNING_ENGINE_V3`
- Confidence is treated as evidence reliability, not as a positive fit component.
- Missing performance history is neutral (50) and explicitly gated as insufficient evidence.
- Performance influence is reliability-shrunk toward neutral when confidence is low.
- Added stronger evidence validation warnings for suspicious metric relationships without rejecting valid attribution models.
- Creator decisions store model-governance metadata, calibration state, interval method, drift state and evidence availability.
- Portfolio selection no longer rewards confidence as a direct positive score; confidence now controls reliability shrinkage.
- Insufficient-history creators are excluded from optimized portfolio selection.
- Existing OOS calibration, recency weighting, creator calibration, shrinkage and drift guard remain active.

## Step 07 — Reports
- Added Decision Quality & Model Governance section to the live report.
- Shows average confidence, high-trust decisions, calibration readiness, verified evidence, prediction count, MAE and interval coverage.
- Performance evidence without actual history is displayed as unavailable rather than 0.
- Outcome trend chart now uses separate Revenue and Spend axes to avoid scale distortion.
- PDF report includes a dedicated model-governance page.
- PDF charts retain KOL IDS CI palette: maroon + soft cyan + warm neutral.
- Charts keep large, readable typography and observed-data-only rules.
