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

// Seed realistic Algerian CNAS random employee & leave data
function seedSampleData(clearFirst = false) {
  if (clearFirst) {
    db.exec('DELETE FROM leave_records; DELETE FROM employees;');
  }

  const sampleEmployees = [
    {
      id: 'emp_01',
      name_fr: 'BENALI Ahmed',
      name_ar: 'بن علي أحمد',
      grade_fr: "Attaché Principal d'Administration",
      grade_ar: 'ملحق رئيسي للإدارة',
      service_fr: 'Sous-Direction des Ressources Humaines',
      service_ar: 'المديرية الفرعية للموارد البشرية',
      address_fr: '12 Rue Didouche Mourad, Alger-Centre',
      address_ar: '12 شارع ديدوش مراد، الجزائر الوسطى',
      prev_balance: 14,
      annual_entitlement: 30
    },
    {
      id: 'emp_02',
      name_fr: 'MEZIANE Samira',
      name_ar: 'مزيان سميرة',
      grade_fr: 'Ingénieur Principal en Informatique',
      grade_ar: 'مهندس رئيسي في الإعلام الآلي',
      service_fr: 'Direction des Systèmes d\'Information',
      service_ar: 'مديرية أنظمة الإعلام الآلي',
      address_fr: '25 Boulevard Colonel Amirouche, Bab El Oued, Alger',
      address_ar: '25 شارع العقيد عميروش، باب الواد، الجزائر',
      prev_balance: 8,
      annual_entitlement: 30
    },
    {
      id: 'emp_03',
      name_fr: 'KACI Mohamed',
      name_ar: 'قاسي محمد',
      grade_fr: 'Chef de Service Recouvrement',
      grade_ar: 'رئيس مصلحة التحصيل',
      service_fr: 'Direction du Recouvrement et du Contentieux',
      service_ar: 'مديرية التحصيل والمنازعات',
      address_fr: '08 Cité 5 Juillet, Bab Ezzouar, Alger',
      address_ar: '08 حي 5 جويلية، باب الزوار، الجزائر',
      prev_balance: 22,
      annual_entitlement: 30
    },
    {
      id: 'emp_04',
      name_fr: 'BOUZID Amina',
      name_ar: 'بوزيد أمينة',
      grade_fr: 'Médecin Contrôleur Principal',
      grade_ar: 'طبيب مراقب رئيسي',
      service_fr: 'Département du Contrôle Médical',
      service_ar: 'قسم المراقبة الطبية',
      address_fr: '14 Rue Hassiba Ben Bouali, Sidi M\'Hamed, Alger',
      address_ar: '14 شارع حسيبة بن بوعلي، سيدي امحمد، الجزائر',
      prev_balance: 5,
      annual_entitlement: 30
    },
    {
      id: 'emp_05',
      name_fr: 'HADJ-ALI Karim',
      name_ar: 'حاج علي كريم',
      grade_fr: 'Comptable Agréé Principal',
      grade_ar: 'محاسب معتمد رئيسي',
      service_fr: 'Sous-Direction des Finances et de la Comptabilité',
      service_ar: 'المديرية الفرعية للمالية والمحاسبة',
      address_fr: '03 Rue Larbi Ben M\'hidi, Oran',
      address_ar: '03 شارع العربي بن مهيدي، وهران',
      prev_balance: 19,
      annual_entitlement: 30
    },
    {
      id: 'emp_06',
      name_fr: 'MANSOURI Fatima',
      name_ar: 'منصوري فاطمة',
      grade_fr: 'Administrateur Conseiller',
      grade_ar: 'متصرف مستشار',
      service_fr: 'Secrétariat Général',
      service_ar: 'الأمانة العامة',
      address_fr: '17 Avenue de l\'Indépendance, Rouiba, Alger',
      address_ar: '17 شارع الاستقلال، الرويبة، الجزائر',
      prev_balance: 0,
      annual_entitlement: 30
    },
    {
      id: 'emp_07',
      name_fr: 'DAHMANI Youcef',
      name_ar: 'دحماني يوسف',
      grade_fr: 'Technicien Supérieur Réseaux & Télécoms',
      grade_ar: 'تقني سامي في الشبكات والمواصلات السلكية واللاسلكية',
      service_fr: 'Centre d\'Exploitation Informatique',
      service_ar: 'مركز الاستغلال المعلوماتي',
      address_fr: '52 Rue Tripoli, Hussein Dey, Alger',
      address_ar: '52 شارع طرابلس، حسين داي، الجزائر',
      prev_balance: 11,
      annual_entitlement: 30
    },
    {
      id: 'emp_08',
      name_fr: 'CHERRADI Souad',
      name_ar: 'شرادي سعاد',
      grade_fr: 'Chargée des Relations Publiques & Accueil',
      grade_ar: 'مكلفة بالعلاقات العامة والاستقبال',
      service_fr: 'Cellule Communication & Écoute Sociale',
      service_ar: 'خلية الإعلام والتواصل الاجتماعي',
      address_fr: '09 Boulevard Zighout Youcef, Alger',
      address_ar: '09 شارع زيغود يوسف، الجزائر',
      prev_balance: 15,
      annual_entitlement: 30
    }
  ];

  sampleEmployees.forEach(emp => saveEmployee(emp));

  // Seed sample leave history
  const sampleLeaves = [
    {
      employeeId: 'emp_01',
      agent_name: 'BENALI Ahmed',
      grade: "Attaché Principal d'Administration",
      service: 'Sous-Direction des Ressources Humaines',
      leave_days: 16,
      dep_date: '01/07/2026',
      ret_date: '17/07/2026',
      leave_address: '05 Boulevard des Martyrs, Tipaza',
      location: 'Alger',
      date: '25/06/2026',
      director: 'Le Directeur d\'Agence',
      prev_balance: 30,
      cur_entitlement: 30,
      tot_entitlement: 60,
      leave_granted: 16,
      new_balance: 14,
      timestamp: '2026-06-25T10:30:00Z'
    },
    {
      employeeId: 'emp_02',
      agent_name: 'MEZIANE Samira',
      grade: 'Ingénieur Principal en Informatique',
      service: 'Direction des Systèmes d\'Information',
      leave_days: 22,
      dep_date: '10/08/2026',
      ret_date: '01/09/2026',
      leave_address: 'Cité Plage, Ain El Turck, Oran',
      location: 'Alger',
      date: '02/08/2026',
      director: 'Le Directeur d\'Agence',
      prev_balance: 0,
      cur_entitlement: 30,
      tot_entitlement: 30,
      leave_granted: 22,
      new_balance: 8,
      timestamp: '2026-08-02T14:15:00Z'
    },
    {
      employeeId: 'emp_03',
      agent_name: 'KACI Mohamed',
      grade: 'Chef de Service Recouvrement',
      service: 'Direction du Recouvrement et du Contentieux',
      leave_days: 8,
      dep_date: '15/09/2026',
      ret_date: '23/09/2026',
      leave_address: 'Résidence Sahel, Zéralda, Alger',
      location: 'Alger',
      date: '10/09/2026',
      director: 'Le Directeur d\'Agence',
      prev_balance: 0,
      cur_entitlement: 30,
      tot_entitlement: 30,
      leave_granted: 8,
      new_balance: 22,
      timestamp: '2026-09-10T09:00:00Z'
    }
  ];

  sampleLeaves.forEach(rec => saveLeaveRecord(rec));

  return { success: true, employeesCount: sampleEmployees.length, leavesCount: sampleLeaves.length };
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
  saveLeaveRecord,
  seedSampleData
};
