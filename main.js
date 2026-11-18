const fs = require('fs');
const path = require('path');
const { app, BrowserWindow, ipcMain, dialog, shell, Menu } = require('electron');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1380,
    height: 900,
    minWidth: 1050,
    minHeight: 700,
    title: 'CongéDesk - Titre de Congé CNAS GRH.22',
    icon: path.join(__dirname, 'assets', process.platform === 'win32' ? 'icon.ico' : 'icon.png'),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Completely remove menu bar
  mainWindow.setMenuBarVisibility(false);
  mainWindow.removeMenu();

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// SQLite Database Module (data/congedesk.sqlite)
const db = require('./db.js');

// IPC Handlers - Backed by SQLite
ipcMain.handle('get-employees', async () => {
  try {
    return db.getEmployees();
  } catch (err) {
    console.error('Error reading employees from SQLite:', err);
    return [];
  }
});

ipcMain.handle('save-employee', async (event, employee) => {
  try {
    const saved = db.saveEmployee(employee);
    return { success: true, employee: saved };
  } catch (err) {
    console.error('Error saving employee to SQLite:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('delete-employee', async (event, id) => {
  try {
    return db.deleteEmployee(id);
  } catch (err) {
    console.error('Error deleting employee from SQLite:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('get-leave-history', async () => {
  try {
    return db.getLeaveHistory();
  } catch (err) {
    console.error('Error reading history from SQLite:', err);
    return [];
  }
});

ipcMain.handle('save-leave-record', async (event, record) => {
  try {
    return db.saveLeaveRecord(record);
  } catch (err) {
    console.error('Error saving leave record to SQLite:', err);
    return { success: false, error: err.message };
  }
});

// Print Document (Direct system printer)
ipcMain.handle('print-document', async (event, { htmlContent, dataOnly = false }) => {
  try {
    const printWindow = new BrowserWindow({
      show: false,
      transparent: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true
      }
    });

    await printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`);

    return new Promise((resolve) => {
      printWindow.webContents.print({
        silent: false,
        printBackground: !dataOnly,
        pageSize: 'A5',
        margins: { marginType: 'none' }
      }, (success, failureReason) => {
        printWindow.close();
        if (success) {
          resolve({ success: true });
        } else {
          resolve({ success: false, error: failureReason });
        }
      });
    });
  } catch (err) {
    console.error('Print error:', err);
    return { success: false, error: err.message };
  }
});

// Save to PDF using printToPDF
ipcMain.handle('save-pdf', async (event, { htmlContent, defaultName, dataOnly = false }) => {
  try {
    const printWindow = new BrowserWindow({
      show: false,
      transparent: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true
      }
    });

    await printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`);

    const pdfBuffer = await printWindow.webContents.printToPDF({
      printBackground: !dataOnly,
      pageSize: 'A5',
      margins: { marginType: 'none' }
    });

    printWindow.close();

    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
      title: dataOnly ? 'Enregistrer le PDF Transparent (Données Seules)' : 'Enregistrer le Titre de Congé en PDF',
      defaultPath: defaultName || (dataOnly ? 'Titre_Conge_Donnees_Seules.pdf' : 'Titre_Conge_GRH22.pdf'),
      filters: [{ name: 'Fichiers PDF', extensions: ['pdf'] }]
    });

    if (canceled || !filePath) {
      return { success: false, canceled: true };
    }

    fs.writeFileSync(filePath, pdfBuffer);
    return { success: true, filePath };
  } catch (err) {
    console.error('Save PDF error:', err);
    return { success: false, error: err.message };
  }
});

// Fill PDF Direct with pdf-lib onto GRH22_cleaned.pdf
ipcMain.handle('fill-pdf-direct', async (event, formData) => {
  try {
    const pdfPath = path.join(__dirname, 'resources', 'GRH22_cleaned.pdf');
    if (!fs.existsSync(pdfPath)) {
      throw new Error("Le fichier resources/GRH22_cleaned.pdf est introuvable.");
    }

    const existingPdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const font = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.TimesRoman);

    // Page 1: French version
    const page = pdfDoc.getPages()[0];
    const { height } = page.getSize();

    // In PDF coordinates (0,0 is bottom-left):
    // Nom et prénom:
    page.drawText(formData.agent_name || '', { x: 155, y: height - 193, size: 10, font });
    // Grade:
    page.drawText(formData.grade || '', { x: 120, y: height - 215, size: 9.5, font });
    // Service:
    page.drawText(formData.service || '', { x: 75, y: height - 237, size: 9.5, font });
    // Adresse:
    page.drawText(formData.address_line_1 || '', { x: 80, y: height - 259, size: 9, font });
    if (formData.address_line_2) {
      page.drawText(formData.address_line_2, { x: 35, y: height - 280, size: 9, font });
    }
    // Bénéficie d'un congé de X jours:
    page.drawText(String(formData.leave_days || ''), { x: 152, y: height - 303, size: 10, font });
    
    // Date de départ (segmented DD MM YY)
    if (formData.dep) {
      page.drawText(formData.dep.d1 || '', { x: 107, y: height - 324, size: 9, font });
      page.drawText(formData.dep.d2 || '', { x: 124, y: height - 324, size: 9, font });
      page.drawText(formData.dep.m1 || '', { x: 140, y: height - 324, size: 9, font });
      page.drawText(formData.dep.m2 || '', { x: 157, y: height - 324, size: 9, font });
      page.drawText(formData.dep.y1 || '', { x: 174, y: height - 324, size: 9, font });
      page.drawText(formData.dep.y2 || '', { x: 191, y: height - 324, size: 9, font });
    }

    // Date de retour
    if (formData.ret) {
      page.drawText(formData.ret.d1 || '', { x: 107, y: height - 346, size: 9, font });
      page.drawText(formData.ret.d2 || '', { x: 124, y: height - 346, size: 9, font });
      page.drawText(formData.ret.m1 || '', { x: 140, y: height - 346, size: 9, font });
      page.drawText(formData.ret.m2 || '', { x: 157, y: height - 346, size: 9, font });
      page.drawText(formData.ret.y1 || '', { x: 174, y: height - 346, size: 9, font });
      page.drawText(formData.ret.y2 || '', { x: 191, y: height - 346, size: 9, font });
    }

    // Adresse durant le congé:
    page.drawText(formData.leave_address || '', { x: 145, y: height - 369, size: 9, font });

    // Fait à ... Le ...
    page.drawText(formData.location || '', { x: 200, y: height - 425, size: 9.5, font });
    page.drawText(formData.date || '', { x: 295, y: height - 425, size: 9.5, font });

    // DETAIL DES DROITS
    page.drawText(String(formData.prev_balance || '0'), { x: 165, y: height - 505, size: 10, font });
    page.drawText(String(formData.cur_entitlement || '30'), { x: 165, y: height - 523, size: 10, font });
    page.drawText(String(formData.tot_entitlement || '0'), { x: 165, y: height - 540, size: 10, font });
    page.drawText(String(formData.leave_granted || '0'), { x: 165, y: height - 558, size: 10, font });
    page.drawText(String(formData.new_balance || '0'), { x: 165, y: height - 588, size: 11, font });

    const filledPdfBytes = await pdfDoc.save();

    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
      title: 'Enregistrer le PDF Rempli (pdf-lib)',
      defaultPath: `Titre_Conge_${formData.agent_name ? formData.agent_name.replace(/\s+/g, '_') : 'Agent'}.pdf`,
      filters: [{ name: 'Fichiers PDF', extensions: ['pdf'] }]
    });

    if (canceled || !filePath) return { success: false, canceled: true };

    fs.writeFileSync(filePath, filledPdfBytes);
    return { success: true, filePath };
  } catch (err) {
    console.error('Fill PDF Direct error:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('open-file-folder', async (event, targetPath) => {
  if (fs.existsSync(targetPath)) {
    shell.showItemInFolder(targetPath);
    return { success: true };
  }
  return { success: false };
});
