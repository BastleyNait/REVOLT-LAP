## ADDED Requirements

### Requirement: Theme detection without inline script tags

The application SHALL detect the user's preferred theme (light or dark) and apply the `dark` class to `<html>` before first paint WITHOUT using raw `<script>` tags inside React components.

#### Scenario: Dark theme detected from localStorage
- **WHEN** the user has previously selected dark mode and `localStorage.getItem('theme')` returns `'dark'`
- **THEN** the `dark` class SHALL be applied to `<html>` before React hydration completes
- **AND** no console warning about script tags in React components SHALL appear

#### Scenario: Dark theme detected from system preference
- **WHEN** `localStorage` has no stored theme and the user's system prefers dark mode (`prefers-color-scheme: dark`)
- **THEN** the `dark` class SHALL be applied to `<html>` before React hydration completes

#### Scenario: Light theme by default
- **WHEN** `localStorage` has no stored theme and the system prefers light mode (or no preference)
- **THEN** the `dark` class SHALL NOT be applied to `<html>`

### Requirement: Theme script executes before interactive hydration

The theme detection script SHALL execute with `strategy="beforeInteractive"` so that the `dark` class is applied before React's interactive content hydrates, preventing a flash of unstyled content (FOUC).

#### Scenario: No FOUC on page load
- **WHEN** the page loads with a persisted dark theme preference
- **THEN** the page SHALL render with dark styling from the first visible paint
- **AND** no flash of light-themed content SHALL occur before the dark class is applied

### Requirement: Theme toggle compatibility preserved

The theme detection mechanism SHALL maintain compatibility with the existing `ThemeToggle` component, which reads the `dark` class from `document.documentElement` and persists changes to `localStorage` under the key `'theme'`.

#### Scenario: ThemeToggle reads initial state correctly
- **WHEN** the page loads with the `dark` class already applied by the detection script
- **THEN** `ThemeToggle` SHALL correctly identify the current theme as `dark` on mount

#### Scenario: ThemeToggle persists theme changes
- **WHEN** the user toggles from dark to light mode via `ThemeToggle`
- **THEN** the `dark` class SHALL be removed from `<html>`
- **AND** `localStorage` SHALL store `'light'` under the key `'theme'`
- **AND** on subsequent page loads, the light theme SHALL be applied automatically
