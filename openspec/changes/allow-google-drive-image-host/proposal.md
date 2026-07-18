## Why

Next.js throws an error when `<Image>` receives a Google Drive URL (`drive.google.com`) because the hostname is not whitelisted under `images.remotePatterns` in `next.config.mjs`. This blocks any page that tries to render external images hosted on Google Drive.

## What Changes

- Add `drive.google.com` to the `remotePatterns` array in `next.config.mjs` so that `<Image>` components can safely load Google Drive URLs.

## Capabilities

### New Capabilities

- `google-drive-image-host`: Allow Next.js `<Image>` to fetch images from `drive.google.com` by whitelisting the hostname in the image remote patterns configuration.

### Modified Capabilities

<!-- None — this is a new capability, no existing spec is being changed. -->

## Impact

- `next.config.mjs` — one line added to `remotePatterns`
- No runtime or build-time dependency changes
- No breaking changes
