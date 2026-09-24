# Fix "Get App" download on Vercel

## Why it fails
The app file is stored on Lovable's own file storage, so its link only works on Lovable hosting. On Vercel the same link returns a web page instead of the app.

## Fix (your idea: put the APK in the project on GitHub)
1. You upload the APK on GitHub, in the project's `public/downloads/` folder, named exactly `Watermarker_v1.0.1.apk`. On GitHub: open `public`, then Add file > Upload files, and type `downloads/` before the name. A 13 MB file is fine on GitHub.
2. I change the "Get App" button to point to `/downloads/Watermarker_v1.0.1.apk`. Vercel then serves the file from your own site.
3. Vercel redeploys automatically after the GitHub change. Then tap "Get App" on your Vercel site to check it.

## Technical details
- In `src/pages/Index.tsx`, set the header link `href` to `/downloads/Watermarker_v1.0.1.apk` and remove the `watermarker-apk.asset.json` import. Keep the `download` attribute and all button styles and animations.
- Files in `public/` are copied as-is to the build output, so Vercel serves them at the site root.
- Leave the old stored file alone. It can be deleted later.
- For future versions, upload the new APK the same way and update the file name in the button.
