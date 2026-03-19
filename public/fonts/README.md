# Optional local fonts

The app uses **Google Fonts** by default (see `app/layout.tsx`). No files are required here.

To use **NoorHira** (IndoPak) and **NafeesWeb** (Urdu) locally:

1. Add `NoorHiraArabic.woff2` and `NafeesWebNaskh.woff2` to this folder.
2. In `styles/arabic.css`, uncomment the `@font-face` block and set `.arabic-indopak` / `.urdu-text` `font-family` to prefer `NoorHira` / `NafeesWeb` again if you want.
