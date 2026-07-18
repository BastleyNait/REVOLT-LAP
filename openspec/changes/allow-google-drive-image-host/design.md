## Context

The project uses Next.js `<Image>` component with a `remotePatterns` whitelist in `next.config.mjs`. Currently only `lh3.googleusercontent.com`, `images.unsplash.com`, and Supabase hosts are allowed. When a component tries to render an image from `drive.google.com`, Next.js throws a runtime error because the hostname is not whitelisted.

## Goals / Non-Goals

**Goals:**
- Allow `<Image>` components to load images from `drive.google.com` without runtime errors.

**Non-Goals:**
- Adding generic wildcard patterns for all Google domains.
- Modifying how other image hosts are configured.

## Decisions

- **Add explicit `drive.google.com` entry**: Rather than using a wildcard like `*.google.com`, we add the specific hostname. This follows the existing pattern in `next.config.mjs` where individual hosts are listed explicitly, keeping the whitelist tight and security-conscious.

## Risks / Trade-offs

- **Security scope**: Whitelisting `drive.google.com` allows any Google Drive file URL to be rendered. This is acceptable since `<Image>` still validates the URL scheme (HTTPS only) and Google Drive is a trusted CDN-like host.
- **No migration or rollback needed**: This is a single-line addition to the config. If reverted, simply remove the entry.
