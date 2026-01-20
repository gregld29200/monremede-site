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
