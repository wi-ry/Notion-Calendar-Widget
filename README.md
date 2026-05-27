# Notion Calendar Widget

A desktop widget for Windows that embeds https://calendar.notion.so/ in an Electron frameless window.

## Features

- Frameless floating widget with custom title bar
- Refresh and close buttons
- Always on top and hidden from taskbar
- Persistent Notion session via webview partition
- Persistent window size and position
- Custom edge and corner resizing

## Requirements

- Windows 10/11
- Node.js 18+

## Install

```powershell
npm install
```

## Run

```powershell
npm start
```

## Build

```powershell
npm run build:win
```

Build output is written to `release/`.

## CI/CD

- CI workflow: `.github/workflows/ci.yml`
	- Runs on push and pull request
	- Installs dependencies with `npm ci`
	- Runs syntax validation (`npm run check`)
	- Builds Windows artifact (`npm run build:win`)
- Commit policy workflow: `.github/workflows/conventional-commits.yml`
	- Runs on pull requests
	- Validates PR title follows Conventional Commits
	- Lints commit messages in the PR range with commitlint
- Release workflow: `.github/workflows/release.yml`
	- Runs on pushes to `main`
	- Uses `semantic-release` to generate version tags and GitHub releases
- Release build workflow: `.github/workflows/release-build.yml`
	- Runs when a GitHub release is published
	- Builds the Windows executable and uploads it as release assets

## Semantic Versioning

Releases are generated from commit messages using Conventional Commits.

- `feat:` -> minor release
- `fix:` -> patch release
- `feat!:` or `BREAKING CHANGE:` -> major release
- Other commit types do not trigger a release

Examples:

- `feat: add tray icon`
- `fix: handle webview resize race`
- `feat!: change settings file format`

## Project Files

- `main.js` - Electron main process and window lifecycle
- `preload.js` - Safe IPC bridge for renderer
- `index.html` - Widget UI, title bar, and resize handles
- `renderer.js` - Button behavior and manual resize interactions
- `package.json` - Scripts and dependencies

## Settings

Window bounds are stored in:

`%APPDATA%\notion-calendar-widget\settings.json`

## Notes

- First launch may take longer while Electron finishes setup.
- Internet access is required for Notion Calendar.
