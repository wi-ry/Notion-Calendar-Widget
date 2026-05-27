const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  closeWindow: () => ipcRenderer.send('close-window'),
  refreshCalendar: () => ipcRenderer.send('refresh-calendar'),
  beginResize: (edge, startX, startY) => ipcRenderer.send('begin-resize', edge, startX, startY),
  updateResize: (currentX, currentY) => ipcRenderer.send('update-resize', currentX, currentY),
  endResize: () => ipcRenderer.send('end-resize'),
});
