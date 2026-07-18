## 1. Replace inline script with next/script

- [x] 1.1 Import `Script` from `next/script` in `src/app/layout.tsx`
- [x] 1.2 Replace the raw `<script dangerouslySetInnerHTML>` inside `<head>` with `<Script strategy="beforeInteractive">` containing the same IIFE theme-detection logic
- [x] 1.3 Remove the now-empty `<head>` block from `RootLayout` (keep `<link>` tags by moving them into `<body>` or leaving them as direct children of `<html>`)

## 2. Verify and clean up

- [x] 2.1 Confirm `suppressHydrationWarning` remains on both `<html>` and `<body>` elements
- [x] 2.2 Verify `ThemeToggle` component still correctly reads the `dark` class on mount without any changes
- [x] 2.3 Manual test: toggle dark/light mode, reload page, confirm theme persists with no FOUC and no console warnings
