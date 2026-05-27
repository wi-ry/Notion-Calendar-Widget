const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('optionsAPI', {
  getOptions: () => ipcRenderer.invoke('get-options'),
  saveOptions: (options) => ipcRenderer.invoke('save-options', options),
  resetOptions: () => ipcRenderer.invoke('reset-options'),
  closeWindow: () => ipcRenderer.send('close-options-window'),
});
