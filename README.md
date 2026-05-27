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
