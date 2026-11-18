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
const db = new DatabaseSync(DB_PATH);

// Initialize Tables
function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS employees (
      id TEXT PRIMARY KEY,
      code_wilaya TEXT,
      agency TEXT,
      name_fr TEXT NOT NULL,
      name_ar TEXT NOT NULL,
      grade_fr TEXT,
      grade_ar TEXT,
      service_fr TEXT,
      service_ar TEXT,
      address_fr TEXT,
      address_ar TEXT,
      observations TEXT,
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

  // Ensure new columns exist if upgraded from older version
  const cols = db.prepare("PRAGMA table_info(employees)").all().map(c => c.name);
  if (!cols.includes('code_wilaya')) {
    db.exec("ALTER TABLE employees ADD COLUMN code_wilaya TEXT;");
  }
  if (!cols.includes('agency')) {
    db.exec("ALTER TABLE employees ADD COLUMN agency TEXT;");
  }
  if (!cols.includes('observations')) {
    db.exec("ALTER TABLE employees ADD COLUMN observations TEXT;");
  }

  // Auto-populate with CNAS directors from data.xlsx if empty or holding old dummy test data
  const countRow = db.prepare("SELECT COUNT(*) as c FROM employees").get();
  if (countRow.c < 50) {
    seedDirectorsData(true);
  }
}

// Queries
function getEmployees() {
  // Order by numerical Wilaya code, then name
  const stmt = db.prepare(`
    SELECT * FROM employees 
    ORDER BY 
      CASE WHEN code_wilaya IS NOT NULL AND code_wilaya != '' THEN CAST(code_wilaya AS INTEGER) ELSE 999 END ASC,
      name_fr ASC
  `);
  const rows = stmt.all();
  return rows.map(r => ({ ...r }));
}

function getEmployee(id) {
  const stmt = db.prepare('SELECT * FROM employees WHERE id = ?');
  const row = stmt.get(id);
  return row ? { ...row } : null;
}

function saveEmployee(emp) {
  const id = emp.id || ('dir_' + Date.now());
  const existing = getEmployee(id);
  
  if (existing) {
    const stmt = db.prepare(`
      UPDATE employees SET
        code_wilaya = ?,
        agency = ?,
        name_fr = ?,
        name_ar = ?,
        grade_fr = ?,
        grade_ar = ?,
        service_fr = ?,
        service_ar = ?,
        address_fr = ?,
        address_ar = ?,
        observations = ?,
        prev_balance = ?,
        annual_entitlement = ?
      WHERE id = ?
    `);
    stmt.run(
      emp.code_wilaya || '',
      emp.agency || '',
      emp.name_fr || '',
      emp.name_ar || '',
      emp.grade_fr || '',
      emp.grade_ar || '',
      emp.service_fr || '',
      emp.service_ar || '',
      emp.address_fr || '',
      emp.address_ar || '',
      emp.observations || '',
      Number(emp.prev_balance || 0),
      Number(emp.annual_entitlement || 30),
      id
    );
  } else {
    const stmt = db.prepare(`
      INSERT INTO employees (
        id, code_wilaya, agency, name_fr, name_ar, grade_fr, grade_ar,
        service_fr, service_ar, address_fr, address_ar, observations,
        prev_balance, annual_entitlement
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      emp.code_wilaya || '',
      emp.agency || '',
      emp.name_fr || '',
      emp.name_ar || '',
      emp.grade_fr || '',
      emp.grade_ar || '',
      emp.service_fr || '',
      emp.service_ar || '',
      emp.address_fr || '',
      emp.address_ar || '',
      emp.observations || '',
      Number(emp.prev_balance || 0),
      Number(emp.annual_entitlement || 30)
    );
  }
  return getEmployee(id);
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
    Number(record.leave_days || 0),
    record.dep_date || '',
    record.ret_date || '',
    record.leave_address || '',
    record.location || '',
    record.date || '',
    record.director || '',
    Number(record.prev_balance || 0),
    Number(record.cur_entitlement || 0),
    Number(record.tot_entitlement || 0),
    Number(record.leave_granted || 0),
    Number(record.new_balance || 0),
    timestamp
  );

  // Update employee remaining balance in SQLite
  if (record.employeeId) {
    const updateEmp = db.prepare('UPDATE employees SET prev_balance = ? WHERE id = ?');
    updateEmp.run(Number(record.new_balance || 0), record.employeeId);
  }

  return { success: true, id };
}

// Seed CNAS Directors directly from data.xlsx seed file
function seedDirectorsData(clearFirst = false) {
  if (clearFirst) {
    db.exec('DELETE FROM leave_records; DELETE FROM employees;');
  }

  const seedPath = path.join(__dirname, 'data', 'directors_seed.json');
  if (!fs.existsSync(seedPath)) {
    console.error('Seed file not found:', seedPath);
    return { success: false, error: 'Seed file missing' };
  }

  const directors = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
  const insertStmt = db.prepare(`
    INSERT OR REPLACE INTO employees (
      id, code_wilaya, agency, name_fr, name_ar, grade_fr, grade_ar,
      service_fr, service_ar, address_fr, address_ar, observations,
      prev_balance, annual_entitlement
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const d of directors) {
    insertStmt.run(
      d.id,
      d.code_wilaya || '',
      d.agency || '',
      d.name_fr || '',
      d.name_ar || '',
      d.grade_fr || '',
      d.grade_ar || '',
      d.service_fr || '',
      d.service_ar || '',
      d.address_fr || '',
      d.address_ar || '',
      d.observations || '',
      Number(d.prev_balance || 0),
      Number(d.annual_entitlement || 30)
    );
  }

  return { success: true, count: directors.length };
}

// Keep backward compatibility
function seedSampleData(clearFirst = false) {
  return seedDirectorsData(clearFirst);
}

// Auto-initialize on load
initDatabase();

module.exports = {
  db,
  initDatabase,
  getEmployees,
  getEmployee,
  saveEmployee,
  deleteEmployee,
  getDirectors: getEmployees,
  getDirector: getEmployee,
  saveDirector: saveEmployee,
  deleteDirector: deleteEmployee,
  getLeaveHistory,
  saveLeaveRecord,
  seedDirectorsData,
  seedSampleData
};
