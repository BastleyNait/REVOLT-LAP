## Context

The `RootLayout` (`src/app/layout.tsx`) uses an inline `<script>` tag inside `<head>` to detect the user's theme preference from `localStorage` or `prefers-color-system: dark` and apply the `dark` class on `<html>` before first paint — preventing a flash of unstyled content (FOUC). This produces a Next.js warning:

> Encountered a script tag while rendering React component. Scripts inside React components are never executed when rendering on the client.

The `ThemeToggle` component (`src/components/layout/ThemeToggle.tsx`) reads and toggles this same `dark` class on `document.documentElement`, reading from `localStorage` key `"theme"`. Next.js version is `16.2.9`. No `next-themes` package is currently installed.

## Goals / Non-Goals

**Goals:**
- Eliminate the React `<script>` warning by replacing the inline script with a Next.js-compatible approach
- Preserve the pre-paint theme detection behavior (no FOUC)
- Keep the existing `dark` class + `localStorage` contract so `ThemeToggle` continues working unchanged
- Maintain hydration consistency between server and client renders

**Non-Goals:**
- Refactoring the theme toggle UI or introducing a theme provider abstraction
- Adding a light/dark mode setting to the admin panel
- Migrating to `next-themes` as a library (unnecessary overhead for this simple use case)

## Decisions

### Decision 1: Use `next/script` with `strategy="beforeInteractive"` over `next-themes`

**Why:** The current theme system is simple — a single `dark` class on `<html>` persisted in `localStorage`. `next-themes` would require wrapping the app in `<ThemeProvider>`, changing how `ThemeToggle` works, and adding a dependency for minimal benefit. `next/script` with `strategy="beforeInteractive"` runs the IIFE before React hydration, preserving the exact same behavior as the current inline script but without the warning.

**Alternatives considered:**
- `next-themes`: Overkill for a single-class theme system. Would require refactoring `ThemeToggle` and adding a provider wrapper.
- `<template>` tag: The warning suggests this, but `<template>` content is inert and wouldn't execute JavaScript — it's meant for cloning, not execution.
- Moving the script to `public/_document.js` (`Document` extension): Valid approach, but `next/script` is the modern, collocated alternative that doesn't require a separate file.

### Decision 2: Keep `suppressHydrationWarning` on `<html>` and `<body>`

**Why:** The server doesn't know the user's theme preference, so the server-rendered HTML will always differ from the client's initial state regarding the `dark` class. This attribute is necessary and correct — it tells React to silently ignore this expected mismatch.

### Decision 3: Move `<link>` preconnect tags out of `<head>` into Next.js metadata

**Why:** Next.js recommends placing `<link>` tags in the `metadata` export rather than in JSX `<head>`. The font preconnects and Material Symbols stylesheet can be expressed via `metadata.other` or kept as-is if they cause issues (they don't trigger the same warning as `<script>`).

**Revised approach:** Keep the `<link>` tags in `<head>` since they don't produce warnings and Next.js handles them correctly. Only the `<script>` needs replacement.

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| `next/script` with `beforeInteractive` may delay hydration slightly | The IIFE is tiny (~200 bytes) and synchronous — negligible impact |
| Server still renders without `dark` class, causing hydration mismatch | Already handled by `suppressHydrationWarning`; no change needed |
| `next/script` placement inside `<head>` vs `<body>` | `next/script` with `beforeInteractive` automatically places the script in `<head>` before interactive content — no manual placement needed |

## Migration Plan

1. Replace the inline `<script>` in `src/app/layout.tsx` with `next/script`
2. Remove the manual `<head>` block (keep `<link>` tags, they're fine)
3. Verify `ThemeToggle` still works correctly
4. Test: no console warning, theme persists across reloads, no FOUC

**Rollback:** Revert the single file change (`src/app/layout.tsx`). No data migration needed.
