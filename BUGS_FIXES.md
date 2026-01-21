# Bug Fixes Log

## 2026-01-20: Questionnaire Submissions Not Saving to Sanity

### Problem
Quiz/questionnaire submissions on `/consultations/demande` were returning 500 errors with "Unauthorized - Session not found" (error code `SIO-401-ANF`). Submissions were not being saved to the Sanity database.

### Root Cause
1. **Sanity client initialization timing**: The Sanity write client was being created at module load time in `/src/sanity/lib/writeClient.ts`, before environment variables were available in Vercel's serverless environment (cold start issue).
2. **Invalid API token**: Multiple Sanity API tokens failed with "Session not found" errors.

### Solution
1. **Code fix**: Modified `/src/app/api/questionnaire/route.ts` to create the Sanity client at request time instead of module load time:
   ```typescript
   function getWriteClient() {
     const token = process.env.SANITY_API_WRITE_TOKEN
     if (!token) {
       throw new Error('SANITY_API_WRITE_TOKEN is not configured')
     }
     return createClient({
       projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '4otm8dqd',
       dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
       apiVersion: '2026-01-13',
       useCdn: false,
       token,
     })
   }
   ```

2. **Debug endpoint**: Created `/src/app/api/debug/sanity-status/route.ts` for production diagnostics.

3. **New API token**: Created new Sanity API robot token "Production Write" with Editor permissions (prefix `skvr`).

4. **Vercel update**: Updated `SANITY_API_WRITE_TOKEN` environment variable in Vercel and redeployed.

### Files Modified
- `/src/app/api/questionnaire/route.ts` - Client creation moved to request time
- `/src/app/api/debug/sanity-status/route.ts` - New debug endpoint (can be removed in future)

### Verification
- Debug endpoint shows `testResult: "success-with-data"`
- Quiz submissions now save successfully to Sanity database
- Tested with real submission: Grégory Le Dall (greg.ledall@hotmail.com)

---

## 2026-01-21: Email Not Sent After Quiz Submission

### Problem
Users were not receiving confirmation emails after completing the questionnaire on `/consultations/demande`. Submissions were being saved to Sanity, but no email was sent.

### Root Cause
The `RESEND_API_KEY` environment variable was missing from Vercel production environment. The code in `/src/lib/resend.ts` checks for this key and returns `null` if not set, causing email sending to be silently skipped.

From Vercel logs:
```
Warning: RESEND_API_KEY is not set. Email sending will be skipped.
```

### Solution
1. Added `RESEND_API_KEY` environment variable to Vercel project settings (All Environments)
2. Triggered a new deployment to apply the environment variable

### Files Involved
- `/src/lib/resend.ts` - Contains `getResendClient()` which checks for the API key
- `/src/app/api/questionnaire/route.ts` - Calls `getResendClient()` and sends email if client exists

### Verification
- Vercel environment variables now shows `RESEND_API_KEY` configured for All Environments
- New deployment completed successfully
- Test by submitting a new questionnaire and checking email delivery

---
