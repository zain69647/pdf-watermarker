# Add PDF Deduplicator to the Tools Menu

## What
Add a new link **PDF Deduplicator** → `https://script-to-site.vercel.app/` in the **Utilities** section of the top-left side drawer menu.

## Where
`src/components/SideDrawer.tsx` — append one entry to the `Utilities` items list (after "PDF Tool"), using an existing or fitting icon (e.g. `Files`/`CopyX` from lucide-react).

No other changes — design, behavior, and all other links stay untouched.
