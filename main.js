const { app, BrowserWindow, BrowserView, ipcMain, screen } = require('electron');
const path = require('path');
const fs = require('fs');

let win;
let calendarView;
let resizeState = null;
const TITLEBAR_HEIGHT = 40;

function getSettingsPath() {
  return path.join(app.getPath('userData'), 'settings.json');
}

function loadSettings() {
  try {
    return JSON.parse(fs.readFileSync(getSettingsPath(), 'utf8'));
  } catch {
    return {};
  }
}

function saveSettings(data) {
  try {
    fs.writeFileSync(getSettingsPath(), JSON.stringify(data, null, 2));
  } catch {}
}

function updateCalendarBounds() {
  if (!win || win.isDestroyed() || !calendarView) return;
  const [contentWidth, contentHeight] = win.getContentSize();
  const viewHeight = Math.max(0, contentHeight - TITLEBAR_HEIGHT);

  calendarView.setBounds({
    x: 0,
    y: TITLEBAR_HEIGHT,
    width: contentWidth,
    height: viewHeight,
  });

  calendarView.setAutoResize({
    width: true,
    height: true,
  });
}

function createWindow() {
  const { width: screenWidth } = screen.getPrimaryDisplay().workAreaSize;
  const saved = loadSettings();
  const winWidth = saved.width || 800;
  const winHeight = saved.height || 600;
  const winX = saved.x ?? (screenWidth - winWidth - 20);
  const winY = saved.y ?? 100;

  win = new BrowserWindow({
    width: winWidth,
    height: winHeight,
    x: winX,
    y: winY,
    frame: false,
    thickFrame: false,
    resizable: true,
    alwaysOnTop: false,
    skipTaskbar: true,
    roundedCorners: true,
    transparent: false,
    hasShadow: true,
    backgroundColor: '#1a1a1a',
    minWidth: 300,
    minHeight: 200,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webviewTag: true,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile('index.html');

  calendarView = new BrowserView({
    webPreferences: {
      partition: 'persist:notion',
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.setBrowserView(calendarView);
  updateCalendarBounds();

  calendarView.webContents.loadURL('https://calendar.notion.so/').catch(() => {});
  calendarView.webContents.on('dom-ready', () => {
    calendarView?.webContents
      .insertCSS('html, body { background: #1a1a1a !important; }')
      .catch(() => {});
  });

  win.on('resize', () => {
    updateCalendarBounds();
  });

  win.on('close', () => {
    saveSettings(win.getBounds());
  });

  win.on('closed', () => {
    calendarView = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => app.quit());

ipcMain.on('close-window', () => win?.close());
ipcMain.on('refresh-calendar', () => calendarView?.webContents.reload());

ipcMain.on('begin-resize', (_event, edge, startX, startY) => {
  if (!win || win.isDestroyed()) return;

  resizeState = {
    edge,
    startX,
    startY,
    startBounds: win.getBounds(),
  };
});

ipcMain.on('update-resize', (_event, currentX, currentY) => {
  if (!win || win.isDestroyed() || !resizeState) return;

  const { edge, startX, startY, startBounds } = resizeState;
  const dx = currentX - startX;
  const dy = currentY - startY;

  let left = startBounds.x;
  let top = startBounds.y;
  let right = startBounds.x + startBounds.width;
  let bottom = startBounds.y + startBounds.height;

  if (edge.includes('left')) left += dx;
  if (edge.includes('right')) right += dx;
  if (edge.includes('top')) top += dy;
  if (edge.includes('bottom')) bottom += dy;

  const [minWidth, minHeight] = win.getMinimumSize();

  if (right - left < minWidth) {
    if (edge.includes('left')) {
      left = right - minWidth;
    } else {
      right = left + minWidth;
    }
  }

  if (bottom - top < minHeight) {
    if (edge.includes('top')) {
      top = bottom - minHeight;
    } else {
      bottom = top + minHeight;
    }
  }

  win.setBounds({
    x: Math.round(left),
    y: Math.round(top),
    width: Math.round(right - left),
    height: Math.round(bottom - top),
  });

  updateCalendarBounds();
});

ipcMain.on('end-resize', () => {
  resizeState = null;
});
