# Fix "Get App" button to match where the APK was uploaded

## Why it still fails
The APK went straight into the `public` folder, as `public/Watermarker_v1.0.1.apk`. The button still points to a `downloads` folder inside `public`, and that folder doesn't exist, so the link finds nothing.

## Fix
- Point the "Get App" button at `/Watermarker_v1.0.1.apk`, which is where the file actually is. You don't need to move or upload anything else.
- Once the change reaches GitHub, Vercel updates your site by itself. Then tap "Get App" on your Vercel site to check the download.

## Technical details
- In `src/pages/Index.tsx`, change `APK_URL` from `/downloads/Watermarker_v1.0.1.apk` to `/Watermarker_v1.0.1.apk`. Keep the `download` attribute and all styles.
