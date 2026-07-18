## Why

Next.js warns that `<script>` tags inside React components are never executed when rendering on the client. The current `RootLayout` uses an inline `<script>` in `<head>` to detect the user's theme preference and apply the `dark` class before first paint — but this script is never actually executed during client-side rendering, making the theme detection unreliable and producing a console warning.

## What Changes

- Replace the inline `<script>` tag in `src/app/layout.tsx` with Next.js's recommended approach for theme detection: a `next-themes` `<ThemeProvider>` wrapper or a server-side `next/script` component with `strategy="beforeInteractive"`.
- Remove the `<head>` block from `RootLayout` and move font preconnect links into Next.js metadata or the `<body>` where they belong.
- Ensure the dark-mode class is applied consistently across server and client renders to avoid hydration mismatches.

## Capabilities

### New Capabilities

- `theme-detection`: Reliable server-safe theme detection that applies the `dark` class before first paint without using inline `<script>` tags in React components.

### Modified Capabilities

(none — no existing specs to modify)

## Impact

- `src/app/layout.tsx`: Replace `<script>` with `next/script` or `next-themes` approach; restructure `<head>` contents.
- Potentially `src/components/layout/Navbar.tsx` and `src/components/layout/Footer.tsx` if theme toggle logic depends on the current class-based approach.
- May add `next-themes` as a dependency if not already present.
