// CongéDesk - SQLite Database Module using native node:sqlite
const path = require('path');
const fs = require('fs');
const { DatabaseSync } = require('node:sqlite');

// Determine data directory (userData for packaged app, local folder for dev)
let DATA_DIR;
try {
  const { app } = require('electron');
  if (app && app.isPackaged) {
    DATA_DIR = path.join(app.getPath('userData'), 'data');
  } else {
    DATA_DIR = path.join(__dirname, 'data');
  }
} catch (e) {
  DATA_DIR = path.join(__dirname, 'data');
}

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'congedesk.sqlite');

// If packaged and db doesn't exist yet, check if there's an initial db in app resources to copy
const DEV_DB = path.join(__dirname, 'data', 'congedesk.sqlite');
if (!fs.existsSync(DB_PATH) && fs.existsSync(DEV_DB)) {
  try {
    fs.copyFileSync(DEV_DB, DB_PATH);
  } catch (err) {
    console.warn('Could not copy initial db file:', err.message);
  }
}

const db = new DatabaseSync(DB_PATH);

// Initialize Tables
function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS employees (
      id TEXT PRIMARY KEY,
      name_fr TEXT NOT NULL,
      name_ar TEXT NOT NULL,
      grade_fr TEXT,
      grade_ar TEXT,
      service_fr TEXT,
      service_ar TEXT,
      address_fr TEXT,
      address_ar TEXT,
      prev_balance REAL DEFAULT 0,
      annual_entitlement REAL DEFAULT 30,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS leave_records (
      id TEXT PRIMARY KEY,
      employee_id TEXT,
      agent_name TEXT,
      grade TEXT,
      service TEXT,
      leave_days REAL,
      dep_date TEXT,
      ret_date TEXT,
      leave_address TEXT,
      location TEXT,
      date TEXT,
      director TEXT,
      prev_balance REAL,
      cur_entitlement REAL,
      tot_entitlement REAL,
      leave_granted REAL,
      new_balance REAL,
      timestamp TEXT DEFAULT (datetime('now'))
    );
  `);

  // Check if employees table is empty, seed initial data
  const countStmt = db.prepare('SELECT COUNT(*) as count FROM employees');
  const result = countStmt.get();
  
  if (result.count === 0) {
    const defaultEmployees = [
      {
        id: "emp-001",
        name_fr: "BENALI Ahmed",
        name_ar: "بن علي أحمد",
        grade_fr: "Ingénieur Principal en Informatique",
        grade_ar: "مهندس رئيسي في الإعلام الآلي",
        service_fr: "Direction des Systèmes d'Information",
        service_ar: "مديرية أنظمة الإعلام الآلي",
        address_fr: "Cité 500 Logements, Bt B3, N° 12, Alger",
        address_ar: "حي 500 مسكن، عمارة ب3، رقم 12، الجزائر",
        prev_balance: 14,
        annual_entitlement: 30
      },
      {
        id: "emp-002",
        name_fr: "MEZIANE Samira",
        name_ar: "مزيان سميرة",
        grade_fr: "Attachée Principale d'Administration",
        grade_ar: "ملحقة رئيسية للإدارة",
        service_fr: "Sous-Direction des Ressources Humaines",
        service_ar: "المديرية الفرعية للموارد البشرية",
        address_fr: "08 Rue Didouche Mourad, Alger-Centre",
        address_ar: "08 نهج ديدوش مراد، الجزائر الوسطى",
        prev_balance: 8,
        annual_entitlement: 30
      },
      {
        id: "emp-003",
        name_fr: "KACI Mohamed",
        name_ar: "قاسي محمد",
        grade_fr: "Chef de Département Contrôle Médical",
        grade_ar: "رئيس قسم المراقبة الطبية",
        service_fr: "Direction du Contrôle et des Prestations",
        service_ar: "مديرية المراقبة والأداءات",
        address_fr: "Lotissement El-Binaa, N° 45, Dely Ibrahim",
        address_ar: "تجزئة البناء، رقم 45، دالي براهيم",
        prev_balance: 22,
        annual_entitlement: 30
      }
    ];

    const insertStmt = db.prepare(`
      INSERT INTO employees (
        id, name_fr, name_ar, grade_fr, grade_ar, 
        service_fr, service_ar, address_fr, address_ar, 
        prev_balance, annual_entitlement
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const emp of defaultEmployees) {
      insertStmt.run(
        emp.id,
        emp.name_fr,
        emp.name_ar,
        emp.grade_fr,
        emp.grade_ar,
        emp.service_fr,
        emp.service_ar,
        emp.address_fr,
        emp.address_ar,
        emp.prev_balance,
        emp.annual_entitlement
      );
    }
  }
}

// Queries
function getEmployees() {
  const stmt = db.prepare('SELECT * FROM employees ORDER BY name_fr ASC');
  const rows = stmt.all();
  // Return plain objects
  return rows.map(r => ({ ...r }));
}

function getEmployee(id) {
  const stmt = db.prepare('SELECT * FROM employees WHERE id = ?');
  const row = stmt.get(id);
  return row ? { ...row } : null;
}

function saveEmployee(emp) {
  const existing = getEmployee(emp.id);
  if (existing) {
    const stmt = db.prepare(`
      UPDATE employees SET
        name_fr = ?,
        name_ar = ?,
        grade_fr = ?,
        grade_ar = ?,
        service_fr = ?,
        service_ar = ?,
        address_fr = ?,
        address_ar = ?,
        prev_balance = ?,
        annual_entitlement = ?
      WHERE id = ?
    `);
    stmt.run(
      emp.name_fr,
      emp.name_ar,
      emp.grade_fr,
      emp.grade_ar,
      emp.service_fr,
      emp.service_ar,
      emp.address_fr,
      emp.address_ar,
      emp.prev_balance,
      emp.annual_entitlement,
      emp.id
    );
  } else {
    const stmt = db.prepare(`
      INSERT INTO employees (
        id, name_fr, name_ar, grade_fr, grade_ar,
        service_fr, service_ar, address_fr, address_ar,
        prev_balance, annual_entitlement
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      emp.id,
      emp.name_fr,
      emp.name_ar,
      emp.grade_fr,
      emp.grade_ar,
      emp.service_fr,
      emp.service_ar,
      emp.address_fr,
      emp.address_ar,
      emp.prev_balance,
      emp.annual_entitlement
    );
  }
  return getEmployee(emp.id);
}

function deleteEmployee(id) {
  const stmt = db.prepare('DELETE FROM employees WHERE id = ?');
  stmt.run(id);
  return { success: true };
}

function getLeaveHistory() {
  const stmt = db.prepare('SELECT * FROM leave_records ORDER BY timestamp DESC');
  const rows = stmt.all();
  return rows.map(r => ({ ...r }));
}

function saveLeaveRecord(record) {
  const id = record.id || ('rec-' + Date.now());
  const timestamp = record.timestamp || new Date().toISOString();

  const stmt = db.prepare(`
    INSERT INTO leave_records (
      id, employee_id, agent_name, grade, service,
      leave_days, dep_date, ret_date, leave_address,
      location, date, director, prev_balance,
      cur_entitlement, tot_entitlement, leave_granted,
      new_balance, timestamp
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    id,
    record.employeeId || null,
    record.agent_name || '',
    record.grade || '',
    record.service || '',
    record.leave_days || 0,
    record.dep_date || '',
    record.ret_date || '',
    record.leave_address || '',
    record.location || '',
    record.date || '',
    record.director || '',
    record.prev_balance || 0,
    record.cur_entitlement || 0,
    record.tot_entitlement || 0,
    record.leave_granted || 0,
    record.new_balance || 0,
    timestamp
  );

  // Update employee remaining balance in SQLite
  if (record.employeeId) {
    const updateEmp = db.prepare('UPDATE employees SET prev_balance = ? WHERE id = ?');
    updateEmp.run(record.new_balance, record.employeeId);
  }

  return { success: true, id };
}

// Auto-initialize on module load
initDatabase();

module.exports = {
  db,
  DB_PATH,
  getEmployees,
  getEmployee,
  saveEmployee,
  deleteEmployee,
  getLeaveHistory,
  saveLeaveRecord
};
