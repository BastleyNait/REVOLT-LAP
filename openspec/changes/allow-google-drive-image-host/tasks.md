## 1. Configure Next.js Image Remote Patterns

- [x] 1.1 Add `{ protocol: "https", hostname: "drive.google.com" }` to the `remotePatterns` array in `next.config.mjs`

## 2. Verification

- [x] 2.1 Confirm the Next.js dev server starts without image configuration errors
- [x] 2.2 Verify an `<Image>` component with a `https://drive.google.com/...` src renders without a hostname-mismatch error
