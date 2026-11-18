const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getEmployees: () => ipcRenderer.invoke('get-employees'),
  saveEmployee: (emp) => ipcRenderer.invoke('save-employee', emp),
  deleteEmployee: (id) => ipcRenderer.invoke('delete-employee', id),
  getDirectors: () => ipcRenderer.invoke('get-employees'),
  saveDirector: (dir) => ipcRenderer.invoke('save-employee', dir),
  deleteDirector: (id) => ipcRenderer.invoke('delete-employee', id),
  getLeaveHistory: () => ipcRenderer.invoke('get-leave-history'),
  saveLeaveRecord: (record) => ipcRenderer.invoke('save-leave-record', record),
  printDocument: (options) => ipcRenderer.invoke('print-document', options),
  savePDF: (data) => ipcRenderer.invoke('save-pdf', data),
  fillPdfDirect: (data) => ipcRenderer.invoke('fill-pdf-direct', data),
  openFileFolder: (path) => ipcRenderer.invoke('open-file-folder', path),
  seedSampleData: () => ipcRenderer.invoke('seed-sample-data'),
  seedDirectorsData: () => ipcRenderer.invoke('seed-sample-data'),
  clearAllData: () => ipcRenderer.invoke('clear-all-data')
});
