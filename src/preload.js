const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    appFocus: () => ipcRenderer.invoke('app-Focus'),
})
