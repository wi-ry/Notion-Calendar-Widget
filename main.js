const { app, BrowserWindow, BrowserView, ipcMain, screen } = require('electron');
const path = require('path');
const fs = require('fs');

let win;
let calendarView;
let optionsWin;
let resizeState = null;
const TITLEBAR_HEIGHT = 40;
const DEFAULT_WINDOW_BOUNDS = {
  width: 800,
  height: 600,
};
const DEFAULT_OPTIONS = {
  rememberWindowBounds: true,
  openAtLogin: false,
};

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

function normalizeSettings(raw) {
  const settings = raw && typeof raw === 'object' ? raw : {};
  const options = {
    ...DEFAULT_OPTIONS,
    ...(settings.options && typeof settings.options === 'object' ? settings.options : {}),
  };

  let windowBounds = null;

  if (settings.windowBounds && typeof settings.windowBounds === 'object') {
    windowBounds = settings.windowBounds;
  } else if (typeof settings.width === 'number' || typeof settings.height === 'number') {
    // Backward compatibility with the previous flat bounds format.
    windowBounds = {
      width: settings.width,
      height: settings.height,
      x: settings.x,
      y: settings.y,
    };
  }

  return {
    options,
    windowBounds,
  };
}

function loadNormalizedSettings() {
  return normalizeSettings(loadSettings());
}

function saveNormalizedSettings(settings) {
  saveSettings(normalizeSettings(settings));
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
  const saved = loadNormalizedSettings();
  const shouldRestoreBounds = saved.options.rememberWindowBounds && saved.windowBounds;
  const winWidth = shouldRestoreBounds?.width || DEFAULT_WINDOW_BOUNDS.width;
  const winHeight = shouldRestoreBounds?.height || DEFAULT_WINDOW_BOUNDS.height;
  const winX = shouldRestoreBounds?.x ?? (screenWidth - winWidth - 20);
  const winY = shouldRestoreBounds?.y ?? 100;

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
    roundedCorners: false,
    transparent: false,
    hasShadow: true,
    backgroundColor: '#1a1a1a',
    minWidth: 300,
    minHeight: 200,
    icon: path.join(__dirname, 'assets', 'notion-calendar.ico'),
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
    const settings = loadNormalizedSettings();

    if (settings.options.rememberWindowBounds) {
      settings.windowBounds = win.getBounds();
    } else {
      settings.windowBounds = null;
    }

    saveNormalizedSettings(settings);
  });

  win.on('closed', () => {
    calendarView = null;
  });
}

function createOptionsWindow() {
  if (optionsWin && !optionsWin.isDestroyed()) {
    optionsWin.focus();
    return;
  }

  optionsWin = new BrowserWindow({
    width: 420,
    height: 360,
    resizable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    parent: win,
    modal: false,
    autoHideMenuBar: true,
    title: 'Widget Options',
    webPreferences: {
      preload: path.join(__dirname, 'options-preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  optionsWin.removeMenu?.();
  optionsWin.loadFile('options.html');

  optionsWin.on('closed', () => {
    optionsWin = null;
  });
}

app.setAppUserModelId('ca.willryan.notioncalendarwidget');
app.whenReady().then(createWindow);

app.on('window-all-closed', () => app.quit());

ipcMain.on('close-window', () => win?.close());
ipcMain.on('refresh-calendar', () => calendarView?.webContents.reload());
ipcMain.on('open-options-window', () => createOptionsWindow());

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

ipcMain.handle('get-options', () => {
  const settings = loadNormalizedSettings();
  // Always reflect the actual OS login-item state.
  settings.options.openAtLogin = app.getLoginItemSettings().openAtLogin;
  return settings.options;
});

ipcMain.handle('save-options', (_event, partialOptions) => {
  const settings = loadNormalizedSettings();

  settings.options = {
    ...settings.options,
    ...(partialOptions && typeof partialOptions === 'object' ? partialOptions : {}),
  };

  if (!settings.options.rememberWindowBounds) {
    settings.windowBounds = null;
  }

  if (partialOptions && typeof partialOptions.openAtLogin === 'boolean') {
    if (app.isPackaged) {
      // 1. Detect if this is a portable app, otherwise fall back to standard exe path
      const actualExePath = process.env.PORTABLE_EXECUTABLE_FILE || app.getPath('exe');

      // 2. Set the login item pointing to the correct executable
      app.setLoginItemSettings({ 
        openAtLogin: partialOptions.openAtLogin,
        path: actualExePath
      });
      
      console.log(`Auto-launch registered pointing to: ${actualExePath}`);
    } else {
      console.log('Development mode detected: Skipping registry auto-launch update.');
    }
  }

  saveNormalizedSettings(settings);
  return settings.options;
});

ipcMain.handle('reset-options', () => {
  const settings = loadNormalizedSettings();
  settings.options = { ...DEFAULT_OPTIONS };
  app.setLoginItemSettings({ openAtLogin: false });
  saveNormalizedSettings(settings);
  return settings.options;
});

ipcMain.on('close-options-window', () => {
  optionsWin?.close();
});
