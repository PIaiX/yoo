const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Пример функции:
  sendNotification: (message) => {
    console.log('Electron API: ' + message);
  }
});