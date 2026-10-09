# Add Scan2Text to the Tools Menu

## What
Add a new link **Scan2Text** → `https://textgrabber.vercel.app/` in the **Utilities** section of the side menu, right after "PDF Deduplicator". It opens in a new tab like the other links.

## Where
`src/components/SideDrawer.tsx`: add one entry after the PDF Deduplicator item, using the `ScanText` icon from lucide-react.

Nothing else changes.
