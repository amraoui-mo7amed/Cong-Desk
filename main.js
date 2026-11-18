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
        printBackground: true,
        pageSize: 'A4',
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
      printBackground: true,
      pageSize: 'A4',
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

// Fill PDF Direct with pdf-lib onto official template (TDC_fr.pdf / TDC_ar.pdf)
ipcMain.handle('fill-pdf-direct', async (event, formData) => {
  try {
    const isAr = (formData.lang === 'ar' || formData.isAr);
    const templateName = isAr ? 'TDC_ar.pdf' : 'TDC_fr.pdf';
    const pdfPath = path.join(__dirname, 'resources', templateName);
    if (!fs.existsSync(pdfPath)) {
      throw new Error(`Le fichier resources/${templateName} est introuvable.`);
    }

    const existingPdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const page = pdfDoc.getPages()[0];
    const { width, height } = page.getSize();

    // Map percentage to points: y goes bottom-to-top in PDF points
    const ptX = (pct) => width * pct;
    const ptY = (pct) => height * (1.0 - pct);

    if (!isAr) {
      page.drawText(formData.agent_name || '', { x: ptX(0.400), y: ptY(0.312), size: 10.5, font });
      page.drawText(formData.grade || '', { x: ptX(0.340), y: ptY(0.344), size: 9.5, font });
      page.drawText(formData.service || '', { x: ptX(0.255), y: ptY(0.375), size: 9.5, font });
      page.drawText(formData.address_line_1 || '', { x: ptX(0.260), y: ptY(0.406), size: 9, font });
      if (formData.address_line_2) {
        page.drawText(formData.address_line_2, { x: ptX(0.135), y: ptY(0.437), size: 9, font });
      }
      page.drawText(String(formData.leave_days || ''), { x: ptX(0.410), y: ptY(0.468), size: 10.5, font });

      if (formData.dep) {
        page.drawText(formData.dep.d1 || '', { x: ptX(0.302), y: ptY(0.500), size: 9.5, font });
        page.drawText(formData.dep.d2 || '', { x: ptX(0.336), y: ptY(0.500), size: 9.5, font });
        page.drawText(formData.dep.m1 || '', { x: ptX(0.370), y: ptY(0.500), size: 9.5, font });
        page.drawText(formData.dep.m2 || '', { x: ptX(0.404), y: ptY(0.500), size: 9.5, font });
        page.drawText(formData.dep.y1 || '', { x: ptX(0.439), y: ptY(0.500), size: 9.5, font });
        page.drawText(formData.dep.y2 || '', { x: ptX(0.473), y: ptY(0.500), size: 9.5, font });
      }

      if (formData.ret) {
        page.drawText(formData.ret.d1 || '', { x: ptX(0.302), y: ptY(0.531), size: 9.5, font });
        page.drawText(formData.ret.d2 || '', { x: ptX(0.336), y: ptY(0.531), size: 9.5, font });
        page.drawText(formData.ret.m1 || '', { x: ptX(0.370), y: ptY(0.531), size: 9.5, font });
        page.drawText(formData.ret.m2 || '', { x: ptX(0.404), y: ptY(0.531), size: 9.5, font });
        page.drawText(formData.ret.y1 || '', { x: ptX(0.439), y: ptY(0.531), size: 9.5, font });
        page.drawText(formData.ret.y2 || '', { x: ptX(0.473), y: ptY(0.531), size: 9.5, font });
      }

      page.drawText(formData.leave_address || '', { x: ptX(0.360), y: ptY(0.562), size: 9, font });
      page.drawText(formData.location || '', { x: ptX(0.525), y: ptY(0.642), size: 9.5, font });
      page.drawText(formData.date || '', { x: ptX(0.720), y: ptY(0.642), size: 9.5, font });
      page.drawText(formData.director || '', { x: ptX(0.660), y: ptY(0.678), size: 9.5, font: fontRegular });

      page.drawText(String(formData.prev_balance ?? '0'), { x: ptX(0.440), y: ptY(0.774), size: 10, font });
      page.drawText(String(formData.cur_entitlement ?? '30'), { x: ptX(0.440), y: ptY(0.805), size: 10, font });
      page.drawText(String(formData.tot_entitlement ?? '0'), { x: ptX(0.440), y: ptY(0.836), size: 10, font });
      page.drawText(String(formData.leave_granted ?? '0'), { x: ptX(0.440), y: ptY(0.867), size: 10, font });
      page.drawText(String(formData.new_balance ?? '0'), { x: ptX(0.440), y: ptY(0.922), size: 11, font });
    }

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
