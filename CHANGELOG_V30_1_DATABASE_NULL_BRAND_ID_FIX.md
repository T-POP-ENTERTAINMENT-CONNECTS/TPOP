# V30.1 — Legacy `campaigns.brand_id` compatibility fix

- Makes legacy `campaigns.brand_id` nullable when the column exists.
- The current frontend stores brand intelligence in `campaigns.payload`.
- Prevents `null value in column "brand_id" of relation "campaigns" violates not-null constraint`.
- Restores campaign button labels after a failed save request.

Run `SQL_TO_RUN/02_ALIGN_FRONTEND_DATABASE.sql` again in Supabase SQL Editor, then reload the frontend with a hard refresh.
