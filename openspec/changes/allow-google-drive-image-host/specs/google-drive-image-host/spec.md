## ADDED Requirements

### Requirement: Google Drive hostname is whitelisted
Next.js `next.config.mjs` SHALL include `drive.google.com` in the `images.remotePatterns` array with protocol `https`.

#### Scenario: Image component renders a Google Drive URL
- **WHEN** a `<Image>` component receives a `src` pointing to `https://drive.google.com/...`
- **THEN** Next.js resolves the image without throwing a hostname-mismatch error

#### Scenario: Only HTTPS protocol is allowed
- **WHEN** a Google Drive image URL uses `https://`
- **THEN** the request is permitted by the remote pattern configuration
