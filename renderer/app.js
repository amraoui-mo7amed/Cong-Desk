// CongéDesk - Application Logic
// Features: Bilingual (FR/AR), Dark/Light Themes, Employee Cards Grid, Dedicated Preview Modal, GRH.22 Generator

let currentAppLang = 'fr'; // 'fr' or 'ar'
let currentDocLang = 'fr'; // 'fr' or 'ar'
let currentTheme = 'light'; // 'light' (default) or 'dark'
let currentZoom = 1.0;
let modalZoom = 0.85;
let isPreviewDataOnly = false; // Toggle between full document and transparent pre-printed overlay mode

let employees = [];
let activeEmployee = null;
let leaveHistory = [];

// ================= I18N DICTIONARY =================
const i18n = {
  fr: {
    appSubtitle: "Système de Gestion des Congés CNAS GRH.22",
    searchPlaceholder: "Rechercher employé, grade, service...",
    langBtnLabel: "العربية",
    addEmployee: "Ajouter Employé",
    randomData: "Données Aléatoires",
    kpiTotal: "Total Employés",
    kpiQuota: "Droit Annuel Légal",
    kpiQuotaVal: "30 Jours",
    kpiIssued: "Titres Émis",
    kpiReserve: "Total Reliquats N-1",
    directoryTitle: "Annuaire des Employés & Soldes de Congé",
    cardsViewLabel: "Affichage Cartes",
    vacationDaysLeft: "Jours de Congé Restants",
    autoCalcBadge: "Calcul Automatique",
    n1Reliquat: "Reliquat N-1",
    annualQuota: "Droit Annuel",
    requestedDays: "Demandé",
    totalAvail: "Total Disponible",
    secPeriod: "Période & Durée du Congé",
    lblLeaveDays: "Jours Accordés",
    lblDateDepart: "Date de Départ",
    lblDateRetour: "Date de Reprise Calculée",
    lblLeaveAddress: "Adresse Durant le Congé",
    secAgent: "Informations de l'Agent",
    lblName: "Nom & Prénom",
    lblGrade: "Grade / Fonction",
    lblService: "Service / Structure",
    lblAddress: "Adresse Personnelle",
    secBalances: "Détail des Droits & Reliquats",
    secIssuing: "Émission & Signatures",
    lblCity: "Fait à",
    lblDate: "Le (Date)",
    lblSignatory: "Qualité du Signataire",
    backBtn: "Retour à l'Annuaire",
    directPdf: "Remplir PDF Officiel",
    exportPdf: "Exporter PDF",
    saveRecord: "Enregistrer & Déduire",
    printDoc: "Imprimer Document",
    fullPreview: "Grand Aperçu",
    modifyParameters: "Ajuster Paramètres",
    previewModalTitle: "Aperçu Titre de Congé GRH.22",
    previewModalSub: "Aperçu officiel avant impression et archivage",
    cardPreviewBtn: "Aperçu GRH.22",
    cardLeaveBtn: "Nouveau Congé",
    activeOk: "Solde Disponible",
    activeWarn: "Solde Épuisé",
    daysUnit: "j",
    daysRemainingLabel: "Jours Restants",
    noEmployeesFound: "Aucun employé correspondant trouvé",
    addEmployeeModalTitle: "Ajouter un Nouvel Employé",
    nameFr: "Nom & Prénom (Français)",
    nameAr: "الاسم واللقب (بالعربية)",
    gradeFr: "Grade / Fonction (Français)",
    gradeAr: "الرتبة / الوظيفة (بالعربية)",
    serviceFr: "Service / Direction (Français)",
    serviceAr: "المصلحة / المديرية (بالعربية)",
    personalAddress: "Adresse Personnelle",
    prevReliquat: "Reliquat Antérieur N-1 (Jours)",
    annualQuotaDays: "Droit Annuel (Jours)",
    cancel: "Annuler",
    save: "Enregistrer",
    pageFrLabel: "Page 1 : Français (TITRE DE CONGÉ)",
    pageArLabel: "الصفحة 2 : العربية (بيان العطلة السنوية)",
    modeFullDoc: "Modèle Complet",
    modePrePrinted: "Papier Pré-imprimé",
    printPrePrinted: "Imprimer (Papier Officiel)",
    printFullDoc: "Imprimer Tout",
    pdfDataOnly: "PDF Données Seules",
    pdfFullDoc: "PDF Complet",
    confirmDelete: "Êtes-vous sûr de vouloir supprimer l'employé",
    sufficientBalanceText: (days) => `Solde suffisant. L'employé conservera ${days} jours en réserve après ce congé.`,
    depletedBalanceText: "Solde entièrement utilisé. L'employé utilise la totalité de ses droits (0 jour restant).",
    overLimitText: (deficit, req, avail) => `Attention dépassement ! Le congé demandé (${req}j) dépasse les droits disponibles (${avail}j) de ${deficit} jour(s).`
  },
  ar: {
    appSubtitle: "نظام تسيير العطل السنوية كـ.ن.ت.ج - استمارة GRH.22",
    searchPlaceholder: "بحث عن موظف، رتبة، مصلحة...",
    langBtnLabel: "Français",
    addEmployee: "إضافة موظف",
    randomData: "بيانات عشوائية",
    kpiTotal: "إجمالي الموظفين",
    kpiQuota: "الحق السنوي القانوني",
    kpiQuotaVal: "30 يوماً",
    kpiIssued: "سندات العطل الصادرة",
    kpiReserve: "إجمالي البواقي السابقة",
    directoryTitle: "دليل الموظفين وأرصدة العطل",
    cardsViewLabel: "عرض البطاقات",
    vacationDaysLeft: "أيام العطلة المتبقية",
    autoCalcBadge: "حساب تلقائي",
    n1Reliquat: "الباقي N-1",
    annualQuota: "الحق السنوي",
    requestedDays: "المطلوب",
    totalAvail: "المجموع المتاح",
    secPeriod: "فترة ومدة العطلة",
    lblLeaveDays: "الأيام الممنوحة",
    lblDateDepart: "تاريخ الانطلاق",
    lblDateRetour: "تاريخ الاستئناف المحسوب",
    lblLeaveAddress: "العنوان أثناء العطلة",
    secAgent: "معلومات الموظف",
    lblName: "الاسم واللقب",
    lblGrade: "الرتبة / الوظيفة",
    lblService: "المصلحة / الهيكل",
    lblAddress: "العنوان الشخصي",
    secBalances: "تفاصيل الحقوق والبواقي",
    secIssuing: "الإصدار والتوقيعات",
    lblCity: "حرر بـ",
    lblDate: "بتاريخ",
    lblSignatory: "صفة الموقع",
    backBtn: "رجوع إلى الدليل",
    directPdf: "ملء الاستمارة الرسمية",
    exportPdf: "تصدير PDF",
    saveRecord: "حفظ وخصم الرصيد",
    printDoc: "طباعة الوثيقة",
    fullPreview: "معاينة مكبرة",
    modifyParameters: "تعديل المعطيات",
    previewModalTitle: "معاينة بيان العطلة السنوية GRH.22",
    previewModalSub: "المعاينة الرسمية قبل الطباعة والأرشفة",
    cardPreviewBtn: "معاينة الوثيقة",
    cardLeaveBtn: "منح عطلة",
    activeOk: "رصيد متاح",
    activeWarn: "رصيد مستنفد",
    daysUnit: "يوم",
    daysRemainingLabel: "يوماً متبقياً",
    noEmployeesFound: "لم يتم العثور على أي موظف مطابق",
    addEmployeeModalTitle: "إضافة موظف جديد",
    nameFr: "Nom & Prénom (Français)",
    nameAr: "الاسم واللقب (بالعربية)",
    gradeFr: "Grade / Fonction (Français)",
    gradeAr: "الرتبة / الوظيفة (بالعربية)",
    serviceFr: "Service / Direction (Français)",
    serviceAr: "المصلحة / المديرية (بالعربية)",
    personalAddress: "العنوان الشخصي",
    prevReliquat: "الباقي من السنة السابقة (أيام)",
    annualQuotaDays: "الحق السنوي (أيام)",
    cancel: "إلغاء",
    save: "حفظ الموظف",
    pageFrLabel: "Page 1 : Français (TITRE DE CONGÉ)",
    pageArLabel: "الصفحة 2 : العربية (بيان العطلة السنوية)",
    modeFullDoc: "النموذج الكامل",
    modePrePrinted: "ورق رسمي جاهز",
    printPrePrinted: "طباعة (ورق رسمي جاهز)",
    printFullDoc: "طباعة الوثيقة كاملة",
    pdfDataOnly: "PDF بيانات فقط",
    pdfFullDoc: "PDF كامل",
    confirmDelete: "هل أنت متأكد من حذف الموظف",
    sufficientBalanceText: (days) => `الرصيد كافٍ. سيحتفظ الموظف بـ ${days} يوماً في الاحتياط بعد هذه العطلة.`,
    depletedBalanceText: "تم استهلاك الرصيد بالكامل (0 يوم متبقي).",
    overLimitText: (deficit, req, avail) => `تنبيه تجاوز الرصيد! العطلة المطلوبة (${req} يوم) تتجاوز الرصيد المتاح (${avail} يوم) بـ ${deficit} يوم.`
  }
};

// ================= INITIALIZATION =================
window.addEventListener('DOMContentLoaded', async () => {
  // Default to light theme unless explicitly saved
  const savedTheme = localStorage.getItem('congedesk_theme');
  currentTheme = (savedTheme === 'dark') ? 'dark' : 'light';
  applyTheme(currentTheme);

  // Load saved language if any
  const savedLang = localStorage.getItem('congedesk_lang');
  if (savedLang === 'ar' || savedLang === 'fr') {
    currentAppLang = savedLang;
  }
  applyAppLanguage(currentAppLang);

  // Set default issue date (today)
  const today = new Date();
  document.getElementById('f-issue-date').value = today.toISOString().split('T')[0];

  // Set default departure date (next Monday)
  const nextMonday = new Date();
  nextMonday.setDate(today.getDate() + ((1 + 7 - today.getDay()) % 7 || 7));
  document.getElementById('f-date-depart').value = nextMonday.toISOString().split('T')[0];

  // Calculate default return date with 30 days
  onDateDepartInput();

  // Load employees and leave history
  await loadEmployees();
  await loadHistory();

  // Real-time input listeners inside drawer
  const inputs = document.querySelectorAll('.input-ctrl');
  inputs.forEach(inp => {
    inp.addEventListener('input', () => {
      recalcAndRender();
    });
  });
});

// ================= THEME TOGGLE =================
function toggleAppTheme() {
  currentTheme = (currentTheme === 'dark') ? 'light' : 'dark';
  localStorage.setItem('congedesk_theme', currentTheme);
  applyTheme(currentTheme);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const icon = document.getElementById('theme-btn-icon');
  if (icon) {
    if (theme === 'light') {
      icon.className = 'fa-solid fa-moon';
      icon.title = (currentAppLang === 'ar') ? "الوضع المظلم" : "Mode Sombre";
    } else {
      icon.className = 'fa-solid fa-sun';
      icon.title = (currentAppLang === 'ar') ? "الوضع المضيء" : "Mode Clair";
    }
  }
}

// ================= LANGUAGE TOGGLE =================
function toggleAppLanguage() {
  currentAppLang = (currentAppLang === 'fr') ? 'ar' : 'fr';
  currentDocLang = currentAppLang;
  localStorage.setItem('congedesk_lang', currentAppLang);
  applyAppLanguage(currentAppLang);
  renderEmployeeCards(employees);
  if (activeEmployee) {
    setDrawerLanguage(currentAppLang);
    setPreviewModalLanguage(currentAppLang);
  }
}

function applyAppLanguage(lang) {
  const dict = i18n[lang];
  const isAr = (lang === 'ar');

  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('dir', isAr ? 'rtl' : 'ltr');

  // Update button label if element exists
  const langBtnLabel = document.getElementById('lang-btn-label');
  if (langBtnLabel) {
    langBtnLabel.textContent = dict.langBtnLabel;
  }
  const langToggleBtn = document.getElementById('lang-toggle-btn');
  if (langToggleBtn) {
    langToggleBtn.title = isAr ? "Passer au Français" : "التبديل إلى العربية";
  }

  // Update static elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  // Update search input placeholder
  const searchInput = document.getElementById('search-employee-input');
  if (searchInput) {
    searchInput.placeholder = dict.searchPlaceholder;
  }

  // Update tab labels strictly in the active language
  const modalTabFr = document.getElementById('modal-tab-fr');
  const modalTabAr = document.getElementById('modal-tab-ar');
  const btnTabFr = document.getElementById('btn-tab-fr');
  const btnTabAr = document.getElementById('btn-tab-ar');

  if (isAr) {
    if (modalTabFr) modalTabFr.innerHTML = '<i class="fa-solid fa-file-lines"></i> الصفحة 1 : الفرنسية';
    if (modalTabAr) modalTabAr.innerHTML = '<i class="fa-solid fa-file-lines"></i> الصفحة 2 : العربية';
    if (btnTabFr) btnTabFr.innerHTML = '<i class="fa-solid fa-file-lines"></i> الصفحة 1 : الفرنسية';
    if (btnTabAr) btnTabAr.innerHTML = '<i class="fa-solid fa-file-lines"></i> الصفحة 2 : العربية';
  } else {
    if (modalTabFr) modalTabFr.innerHTML = '<i class="fa-solid fa-file-lines"></i> Page 1 : Français';
    if (modalTabAr) modalTabAr.innerHTML = '<i class="fa-solid fa-file-lines"></i> Page 2 : Arabe';
    if (btnTabFr) btnTabFr.innerHTML = '<i class="fa-solid fa-file-lines"></i> Page 1 : Français';
    if (btnTabAr) btnTabAr.innerHTML = '<i class="fa-solid fa-file-lines"></i> Page 2 : Arabe';
  }

  // Update theme button title
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) {
    themeBtn.title = isAr ? "تغيير المظهر (داكن / فاتح)" : "Basculer Thème (Sombre / Clair)";
  }

  // Re-render Top KPI Cards
  updateKPICards();
}

// ================= EMPLOYEE DATA =================
async function loadEmployees() {
  if (window.electronAPI && window.electronAPI.getEmployees) {
    employees = await window.electronAPI.getEmployees();
  } else {
    employees = [];
  }

  updateKPICards();
  renderEmployeeCards(employees);
}

async function loadHistory() {
  if (window.electronAPI && window.electronAPI.getLeaveHistory) {
    leaveHistory = await window.electronAPI.getLeaveHistory();
    document.getElementById('kpi-issued-titles').textContent = leaveHistory.length;
  }
}

function updateKPICards() {
  const dict = i18n[currentAppLang];
  document.getElementById('kpi-total-employees').textContent = employees.length;
  document.getElementById('employee-count-badge').textContent = `${employees.length} ${currentAppLang === 'ar' ? 'موظف' : 'Employés'}`;

  const totalReserve = employees.reduce((acc, e) => acc + (parseFloat(e.prev_balance) || 0), 0);
  document.getElementById('kpi-total-reserve').textContent = `${totalReserve} ${dict.daysUnit}`;
}

// ================= EMPLOYEE CARDS RENDERING (CARDS INSTEAD OF TABLES) =================
function renderEmployeeCards(list) {
  const container = document.getElementById('employee-cards-container');
  container.innerHTML = '';
  const dict = i18n[currentAppLang];
  const isAr = (currentAppLang === 'ar');

  if (list.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-dim); background: var(--bg-surface); border: 1px dashed var(--border-color); border-radius: var(--radius-xl);">
        <i class="fa-solid fa-user-slash" style="font-size: 32px; margin-bottom: 12px; display: block; color: var(--text-dim);"></i>
        <span style="font-size: 15px; font-weight: 600; display: block; margin-bottom: 16px;">${dict.noEmployeesFound}</span>
        <button class="btn btn-secondary" onclick="seedRandomDataUI()"><i class="fa-solid fa-dice"></i> <span>${dict.randomData}</span></button>
      </div>
    `;
    return;
  }

  list.forEach(emp => {
    const card = document.createElement('div');
    card.className = 'emp-card';

    const isAr = (currentAppLang === 'ar');
    const empName = isAr ? (emp.name_ar || emp.name_fr) : (emp.name_fr || emp.name_ar);
    const empGrade = isAr ? (emp.grade_ar || emp.grade_fr) : (emp.grade_fr || emp.grade_ar);
    const empService = isAr ? (emp.service_ar || emp.service_fr) : (emp.service_fr || emp.service_ar);
    const empAddress = isAr ? (emp.address_ar || emp.address_fr) : (emp.address_fr || emp.address_ar);

    const initials = isAr 
      ? (emp.name_ar ? emp.name_ar.trim()[0] : 'ع')
      : (emp.name_fr ? emp.name_fr.split(' ').map(n => n[0]).slice(0, 2).join('') : 'AG');

    const prevBal = parseFloat(emp.prev_balance) || 0;
    const annual = parseFloat(emp.annual_entitlement) || 30;
    const totalAvail = prevBal + annual;
    
    // Percentage remaining of total available
    const pct = totalAvail > 0 ? Math.min(Math.round((prevBal / totalAvail) * 100), 100) : 0;
    const isBalanceHealthy = prevBal > 5;
    const hasBalance = prevBal > 0;

    card.innerHTML = `
      <!-- Card Top: Identity (Pure Language Isolated) -->
      <div class="emp-card-header">
        <div class="emp-identity">
          <div class="emp-avatar-wrapper">
            <div class="emp-avatar">${initials}</div>
            <span class="emp-avatar-status ${hasBalance ? 'online' : 'busy'}"></span>
          </div>
          <div class="emp-name-block">
            <span class="emp-name-fr">${empName}</span>
            <span class="emp-dept-pill"><i class="fa-solid fa-building"></i> ${empService}</span>
          </div>
        </div>
      </div>

      <!-- Card Meta Badges Grid -->
      <div class="emp-meta-chips">
        <div class="emp-chip">
          <i class="fa-solid fa-briefcase"></i>
          <span class="chip-label">${empGrade}</span>
        </div>
        ${empAddress ? `
        <div class="emp-chip">
          <i class="fa-solid fa-location-dot"></i>
          <span class="chip-label" title="${empAddress}">${empAddress}</span>
        </div>` : ''}
      </div>

      <!-- Vacation Balance Liquid Meter Card -->
      <div class="emp-balance-card">
        <div class="balance-top-row">
          <div class="balance-hero-num ${prevBal > 5 ? '' : (prevBal > 0 ? 'warn' : 'danger')}">
            <div class="balance-icon-ring"><i class="fa-solid fa-umbrella-beach"></i></div>
            <div class="balance-val-group">
              <span class="balance-val">${prevBal}</span>
              <span class="balance-unit">${dict.daysRemainingLabel}</span>
            </div>
          </div>

          <div class="balance-stats-mini">
            <span class="balance-stat-pill" title="${dict.n1Reliquat}">N-1: <strong>${prevBal}${dict.daysUnit}</strong></span>
            <span class="balance-stat-pill" title="${dict.annualQuota}">Droit: <strong>${annual}${dict.daysUnit}</strong></span>
          </div>
        </div>

        <div class="balance-progress-track">
          <div class="balance-progress-fill" style="width: ${Math.max(pct, 10)}%; background: ${isBalanceHealthy ? 'linear-gradient(90deg, #10b981, #059669)' : (hasBalance ? 'linear-gradient(90deg, #f59e0b, #d97706)' : 'linear-gradient(90deg, #ef4444, #dc2626)')};"></div>
        </div>
      </div>

      <!-- Card Footer Actions: Create/Manage Leave & Delete -->
      <div class="emp-card-actions">
        <!-- Main Action: Open Leave Workspace (Form + Live Sheet Preview) -->
        <button class="btn btn-sm btn-card-leave" onclick="openLeaveDrawerFor('${emp.id}')" title="${dict.cardLeaveBtn}">
          <i class="fa-solid fa-file-signature"></i> <span>${dict.cardLeaveBtn}</span>
        </button>

        <!-- Delete Employee Button -->
        <button class="btn-icon danger" onclick="deleteEmployee('${emp.id}')" title="Supprimer">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    `;

    container.appendChild(card);
  });
}

// Search Filter Input (Pure language matching)
function onSearchInput() {
  const query = document.getElementById('search-employee-input').value.toLowerCase().trim();
  const isAr = (currentAppLang === 'ar');
  const filtered = employees.filter(e => {
    if (isAr) {
      return (e.name_ar && e.name_ar.toLowerCase().includes(query)) ||
             (e.grade_ar && e.grade_ar.toLowerCase().includes(query)) ||
             (e.service_ar && e.service_ar.toLowerCase().includes(query));
    } else {
      return (e.name_fr && e.name_fr.toLowerCase().includes(query)) ||
             (e.grade_fr && e.grade_fr.toLowerCase().includes(query)) ||
             (e.service_fr && e.service_fr.toLowerCase().includes(query));
    }
  });
  renderEmployeeCards(filtered);
}

// Delete Employee
async function deleteEmployee(empId) {
  const emp = employees.find(e => e.id === empId);
  if (!emp) return;

  const dict = i18n[currentAppLang];
  const empName = currentAppLang === 'ar' ? (emp.name_ar || emp.name_fr) : (emp.name_fr || emp.name_ar);

  if (confirm(`${dict.confirmDelete} "${empName}"?`)) {
    if (window.electronAPI && window.electronAPI.deleteEmployee) {
      await window.electronAPI.deleteEmployee(empId);
    }
    employees = employees.filter(e => e.id !== empId);
    updateKPICards();
    renderEmployeeCards(employees);
  }
}

// Generate random realistic data
async function seedRandomDataUI() {
  const isAr = (currentAppLang === 'ar');
  const confirmMsg = isAr 
    ? 'هل تريد توليد بيانات عشوائية للموظفين وسجلات العطل للتجربة؟'
    : 'Voulez-vous générer des données aléatoires d\'employés et d\'historique de congés pour les tests ?';
  
  if (!confirm(confirmMsg)) return;

  if (window.electronAPI && window.electronAPI.seedSampleData) {
    const res = await window.electronAPI.seedSampleData();
    if (res && res.success) {
      await loadEmployees();
      alert(isAr ? `تم توليد ${res.employeesCount} موظف و ${res.leavesCount} سجل عطلة بنجاح!` : `${res.employeesCount} employés et ${res.leavesCount} titres de congé ont été générés avec succès !`);
    } else {
      alert("Erreur: " + (res?.error || "Inconnue"));
    }
  }
}

// ================= DEDICATED PREVIEW FALLBACK =================
function openPreviewModalFor(empId) {
  // Directly open the unified workspace (Form + Live Sheet Preview)
  openLeaveDrawerFor(empId);
}

function closePreviewModal() {
  closeLeaveDrawer();
}

function setPreviewModalLanguage(lang) {
  setDrawerLanguage(lang);
}

// ================= SLIDE-OVER DRAWER & LEAVE CALCULATOR =================
function openLeaveDrawerFor(empId) {
  activeEmployee = employees.find(e => e.id === empId);
  if (!activeEmployee) return;

  currentDocLang = currentAppLang;

  // Set titles
  const isAr = (currentDocLang === 'ar');
  const empName = isAr ? (activeEmployee.name_ar || activeEmployee.name_fr) : (activeEmployee.name_fr || activeEmployee.name_ar);
  const empRole = isAr ? (activeEmployee.grade_ar || activeEmployee.grade_fr) : (activeEmployee.grade_fr || activeEmployee.grade_ar);

  document.getElementById('drawer-agent-title').textContent = `${empName} - GRH.22`;
  document.getElementById('drawer-agent-subtitle').textContent = empRole;

  // Populate drawer fields
  populateDrawerFields(activeEmployee, currentDocLang);

  // Sync drawer tabs
  document.getElementById('btn-tab-fr').classList.toggle('active', currentDocLang === 'fr');
  document.getElementById('btn-tab-ar').classList.toggle('active', currentDocLang === 'ar');

  // Open Drawer
  recalcAndRender();
  document.getElementById('leave-drawer').classList.add('open');
}

function populateDrawerFields(emp, lang) {
  const isAr = (lang === 'ar');
  if (isAr) {
    document.getElementById('f-agent-name').value = emp.name_ar || emp.name_fr;
    document.getElementById('f-grade').value = emp.grade_ar || emp.grade_fr;
    document.getElementById('f-service').value = emp.service_ar || emp.service_fr;
    document.getElementById('f-address').value = emp.address_ar || emp.address_fr;
    document.getElementById('f-signatory').value = "المدير،";
    document.getElementById('f-location').value = "الجزائر";
  } else {
    document.getElementById('f-agent-name').value = emp.name_fr;
    document.getElementById('f-grade').value = emp.grade_fr;
    document.getElementById('f-service').value = emp.service_fr;
    document.getElementById('f-address').value = emp.address_fr;
    document.getElementById('f-signatory').value = "Le Directeur,";
    document.getElementById('f-location').value = "Alger";
  }

  document.getElementById('f-prev-balance').value = emp.prev_balance ?? 0;
  document.getElementById('f-annual-entitlement').value = emp.annual_entitlement ?? 30;
}

function closeLeaveDrawer() {
  document.getElementById('leave-drawer').classList.remove('open');
}

function setDrawerLanguage(lang) {
  currentDocLang = lang;
  document.getElementById('btn-tab-fr').classList.toggle('active', lang === 'fr');
  document.getElementById('btn-tab-ar').classList.toggle('active', lang === 'ar');

  const pill = document.getElementById('preview-page-pill');
  if (pill) {
    pill.textContent = (lang === 'ar') ? i18n.ar.pageArLabel : i18n.fr.pageFrLabel;
  }

  if (activeEmployee) {
    const isAr = (lang === 'ar');
    const empName = isAr ? (activeEmployee.name_ar || activeEmployee.name_fr) : (activeEmployee.name_fr || activeEmployee.name_ar);
    const empRole = isAr ? (activeEmployee.grade_ar || activeEmployee.grade_fr) : (activeEmployee.grade_fr || activeEmployee.grade_ar);
    const titleEl = document.getElementById('drawer-agent-title');
    const subEl = document.getElementById('drawer-agent-subtitle');
    if (titleEl) titleEl.textContent = `${empName} - GRH.22`;
    if (subEl) subEl.textContent = empRole;
    populateDrawerFields(activeEmployee, lang);
  }

  recalcAndRender();
}

function applyPreset(days) {
  document.getElementById('f-leave-days').value = days;
  onDateDepartInput();
}

// Recalculate Vacation Balance and re-render document
function recalcAndRender() {
  const dict = i18n[currentAppLang];
  const prevBal = parseFloat(document.getElementById('f-prev-balance').value) || 0;
  const annual = parseFloat(document.getElementById('f-annual-entitlement').value) || 0;
  const requested = parseFloat(document.getElementById('f-leave-days').value) || 0;

  const totalAvail = prevBal + annual;
  document.getElementById('f-total-entitlement').value = totalAvail;

  const daysLeft = totalAvail - requested;

  // Update Drawer Hero Card Stats
  document.getElementById('stat-n1').textContent = `${prevBal} ${dict.daysUnit}`;
  document.getElementById('stat-annual').textContent = `${annual} ${dict.daysUnit}`;
  document.getElementById('stat-requested').textContent = `${requested} ${dict.daysUnit}`;

  document.getElementById('calc-days-left').textContent = `${daysLeft} ${dict.daysRemainingLabel}`;
  const isArCalc = (currentAppLang === 'ar');
  document.getElementById('calc-days-left-sub').textContent = `${daysLeft} / ${totalAvail} ${dict.daysUnit} (${prevBal} ${dict.daysUnit} N-1 + ${annual} ${dict.daysUnit} ${isArCalc ? 'سنوي' : 'annuel'})`;

  // Alert Box
  const alertBox = document.getElementById('calc-alert-banner');
  const alertIcon = document.getElementById('calc-alert-icon');
  const alertText = document.getElementById('calc-alert-text');
  const numElem = document.getElementById('calc-days-left');

  alertBox.className = 'calc-alert';
  if (daysLeft > 5) {
    alertBox.classList.add('ok');
    alertIcon.className = 'fa-solid fa-circle-check';
    alertText.textContent = dict.sufficientBalanceText(daysLeft);
    numElem.style.color = '#34d399';
  } else if (daysLeft >= 0) {
    alertBox.classList.add('warn');
    alertIcon.className = 'fa-solid fa-triangle-exclamation';
    alertText.textContent = daysLeft === 0 ? dict.depletedBalanceText : dict.sufficientBalanceText(daysLeft);
    numElem.style.color = '#fbbf24';
  } else {
    alertBox.classList.add('danger');
    alertIcon.className = 'fa-solid fa-circle-exclamation';
    const deficit = Math.abs(daysLeft);
    alertText.textContent = dict.overLimitText(deficit, requested, totalAvail);
    numElem.style.color = '#f87171';
  }

  renderDocumentSheet();
}

function onDateDepartInput() {
  const depStr = document.getElementById('f-date-depart').value;
  const days = parseInt(document.getElementById('f-leave-days').value) || 0;
  if (!depStr || days <= 0) return;

  const dep = new Date(depStr);
  const ret = new Date(dep);
  ret.setDate(ret.getDate() + (days - 1));

  document.getElementById('f-date-retour').value = ret.toISOString().split('T')[0];
  recalcAndRender();
}

function onLeaveDaysInput() {
  onDateDepartInput();
}

function onDateRetourInput() {
  const depStr = document.getElementById('f-date-depart').value;
  const retStr = document.getElementById('f-date-retour').value;
  if (!depStr || !retStr) return;

  const dep = new Date(depStr);
  const ret = new Date(retStr);

  const diffTime = ret.getTime() - dep.getTime();
  const diffDays = Math.round(diffTime / (1000 * 3600 * 24)) + 1;

  if (diffDays > 0) {
    document.getElementById('f-leave-days').value = diffDays;
    recalcAndRender();
  }
}

// Split date into DD MM YY
function getSplitDateParts(dateStr) {
  if (!dateStr) return { d1: '', d2: '', m1: '', m2: '', y1: '', y2: '' };
  const parts = dateStr.split('-');
  if (parts.length !== 3) return { d1: '', d2: '', m1: '', m2: '', y1: '', y2: '' };
  
  const y = parts[0].slice(-2);
  const m = parts[1].padStart(2, '0');
  const d = parts[2].padStart(2, '0');

  return {
    d1: d[0] || '',
    d2: d[1] || '',
    m1: m[0] || '',
    m2: m[1] || '',
    y1: y[0] || '',
    y2: y[1] || ''
  };
}

function formatDisplayDate(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function getFormData() {
  const prevBal = parseFloat(document.getElementById('f-prev-balance').value) || 0;
  const annual = parseFloat(document.getElementById('f-annual-entitlement').value) || 0;
  const requested = parseFloat(document.getElementById('f-leave-days').value) || 0;
  const totalAvail = prevBal + annual;
  const daysLeft = totalAvail - requested;

  const depStr = document.getElementById('f-date-depart').value;
  const retStr = document.getElementById('f-date-retour').value;
  const issueDateStr = document.getElementById('f-issue-date').value;

  return {
    employeeId: activeEmployee ? activeEmployee.id : null,
    agent_name: document.getElementById('f-agent-name').value || '',
    grade: document.getElementById('f-grade').value || '',
    service: document.getElementById('f-service').value || '',
    address_line_1: document.getElementById('f-address').value || '',
    address_line_2: '',
    leave_days: requested,
    dep_date: depStr,
    ret_date: retStr,
    dep: getSplitDateParts(depStr),
    ret: getSplitDateParts(retStr),
    leave_address: document.getElementById('f-leave-address').value || '',
    location: document.getElementById('f-location').value || '',
    date: formatDisplayDate(issueDateStr),
    director: document.getElementById('f-signatory').value || '',
    prev_balance: prevBal,
    cur_entitlement: annual,
    tot_entitlement: totalAvail,
    leave_granted: requested,
    new_balance: daysLeft
  };
}

// Mode toggle: Full document vs Pre-printed paper overlay
function setDocumentPrintMode(isOverlay) {
  isPreviewDataOnly = isOverlay;

  // Sync modal mode tabs
  const modalFull = document.getElementById('modal-mode-full');
  const modalOverlay = document.getElementById('modal-mode-overlay');
  if (modalFull) modalFull.classList.toggle('active', !isOverlay);
  if (modalOverlay) modalOverlay.classList.toggle('active', isOverlay);

  // Sync drawer mode tabs
  const drawerFull = document.getElementById('drawer-mode-full');
  const drawerOverlay = document.getElementById('drawer-mode-overlay');
  if (drawerFull) drawerFull.classList.toggle('active', !isOverlay);
  if (drawerOverlay) drawerOverlay.classList.toggle('active', isOverlay);

  // Update Preview Status Banner
  const statusBanner = document.getElementById('preview-status-banner');
  const statusText = document.getElementById('preview-status-text');
  const isAr = (currentDocLang === 'ar');

  if (statusBanner && statusText) {
    statusBanner.classList.toggle('mode-overlay-active', isOverlay);
    if (isOverlay) {
      statusText.innerHTML = isAr
        ? '<i class="fa-solid fa-layer-group"></i> <strong>وضع الورق الرسمي :</strong> يظهر النموذج كعلامة مائية خفيفة للتأكد من مواضع الكتابة. <strong>ستتم طباعة البيانات فقط</strong> على الورق المطبوع مسبقاً.'
        : '<i class="fa-solid fa-layer-group"></i> <strong>Mode Papier Pré-imprimé :</strong> Le formulaire est affiché en filigrane pour alignement. <strong>Seules les données seront imprimées</strong> sur votre feuille.';
    } else {
      statusText.innerHTML = isAr
        ? '<i class="fa-solid fa-circle-check"></i> <strong>وضع النموذج الكامل :</strong> ستتم طباعة الوثيقة كاملة مع الترويسة والحدود والبيانات.'
        : '<i class="fa-solid fa-circle-check"></i> <strong>Mode Document Complet :</strong> Le modèle officiel avec en-tête CNAS, bordures et données sera imprimé intégralement.';
    }
  }

  // Update Dynamic Action Button labels
  const btnPrintMain = document.getElementById('lbl-modal-print-main');
  const btnExportPdf = document.getElementById('lbl-modal-export-pdf');
  const btnAltPdf = document.getElementById('lbl-modal-alt-pdf');

  if (btnPrintMain) {
    if (isOverlay) {
      btnPrintMain.textContent = isAr ? 'طباعة على ورق رسمي' : 'Imprimer sur Papier Pré-imprimé';
    } else {
      btnPrintMain.textContent = isAr ? 'طباعة النموذج الكامل' : 'Imprimer Tout (Modèle Complet)';
    }
  }

  if (btnExportPdf) {
    if (isOverlay) {
      btnExportPdf.textContent = isAr ? 'تصدير PDF بيانات فقط' : 'Exporter PDF Données Seules';
    } else {
      btnExportPdf.textContent = isAr ? 'تصدير PDF كامل' : 'Exporter PDF Complet';
    }
  }

  if (btnAltPdf) {
    if (isOverlay) {
      btnAltPdf.textContent = isAr ? 'PDF كامل' : 'PDF Complet';
    } else {
      btnAltPdf.textContent = isAr ? 'PDF بيانات فقط' : 'PDF Données Seules';
    }
  }

  const formatBadgeEl = document.querySelector('.paper-format-badge');
  if (formatBadgeEl) {
    formatBadgeEl.innerHTML = isAr ? '<i class="fa-solid fa-receipt"></i> حجم A4 رسمي (210 × 297 مم)' : '<i class="fa-solid fa-receipt"></i> Format A4 Officiel (210 × 297 mm)';
  }

  renderModalDocumentSheet();
  renderDocumentSheet();
}

function executeCurrentPrint() {
  printDocument(isPreviewDataOnly);
}

// Build Official Sheet HTML using precision template overlay
function buildDocumentSheetHTML(data, isAr, overlayMode = false) {
  const modeClass = overlayMode ? 'mode-preprinted' : 'mode-full';
  const langClass = isAr ? 'lang-ar' : 'lang-fr';
  const dir = isAr ? 'rtl' : 'ltr';

  return `
    <div class="document-page ${langClass} ${modeClass}" dir="${dir}">
      <div class="data-layer">
        <!-- Nom et prénom de l'agent -->
        <div class="field-item field-agent-name">${data.agent_name || ''}</div>

        <!-- Grade ou fonction -->
        <div class="field-item field-grade">${data.grade || ''}</div>

        <!-- Service -->
        <div class="field-item field-service">${data.service || ''}</div>

        <!-- Adresse personnelle -->
        <div class="field-item field-address-1">${data.address_line_1 || ''}</div>
        ${data.address_line_2 ? `<div class="field-item field-address-2">${data.address_line_2}</div>` : ''}

        <!-- Bénéficie d'un congé de X jours -->
        <div class="field-item field-leave-days">${data.leave_days || ''}</div>

        <!-- Date de départ (6 individual cells) -->
        <div class="date-group group-dep">
          <span class="cell cell-d1">${data.dep?.d1 || ''}</span>
          <span class="cell cell-d2">${data.dep?.d2 || ''}</span>
          <span class="cell cell-m1">${data.dep?.m1 || ''}</span>
          <span class="cell cell-m2">${data.dep?.m2 || ''}</span>
          <span class="cell cell-y1">${data.dep?.y1 || ''}</span>
          <span class="cell cell-y2">${data.dep?.y2 || ''}</span>
        </div>

        <!-- Date de retour (6 individual cells) -->
        <div class="date-group group-ret">
          <span class="cell cell-d1">${data.ret?.d1 || ''}</span>
          <span class="cell cell-d2">${data.ret?.d2 || ''}</span>
          <span class="cell cell-m1">${data.ret?.m1 || ''}</span>
          <span class="cell cell-m2">${data.ret?.m2 || ''}</span>
          <span class="cell cell-y1">${data.ret?.y1 || ''}</span>
          <span class="cell cell-y2">${data.ret?.y2 || ''}</span>
        </div>

        <!-- Adresse durant le congé -->
        <div class="field-item field-leave-address">${data.leave_address || ''}</div>

        <!-- Fait à ... Le ... -->
        <div class="field-item field-location">${data.location || ''}</div>
        <div class="field-item field-date">${data.date || ''}</div>

        <!-- Le Directeur -->
        <div class="field-item field-signatory">${data.director || ''}</div>

        <!-- Detail des droits values -->
        <div class="rights-values">
          <div class="field-item right-val-prev">${data.prev_balance ?? ''}</div>
          <div class="field-item right-val-cur">${data.cur_entitlement ?? ''}</div>
          <div class="field-item right-val-tot">${data.tot_entitlement ?? ''}</div>
          <div class="field-item right-val-granted">${data.leave_granted ?? ''}</div>
          <div class="field-item right-val-new">${data.new_balance ?? ''}</div>
        </div>
      </div>
    </div>
  `;
}

function renderDocumentSheet() {
  const isAr = (currentDocLang === 'ar');
  const data = getFormData();
  const html = buildDocumentSheetHTML(data, isAr, isPreviewDataOnly);

  const container = document.getElementById('drawer-paper-container');
  if (container) {
    container.innerHTML = html;
    const sheet = container.querySelector('.document-page');
    if (sheet) {
      sheet.style.transform = `scale(${currentZoom})`;
    }
  }
}

// Generate Standalone HTML for Printing / PDF
function generatePrintHTML(dataOnly = false) {
  const isAr = (currentDocLang === 'ar');
  const data = getFormData();
  const bgDataUri = (!dataOnly && window.TEMPLATES_B64) ? window.TEMPLATES_B64[isAr ? 'ar' : 'fr'] : '';
  const content = buildDocumentSheetHTML(data, isAr, dataOnly);

  return `<!DOCTYPE html>
<html lang="${isAr ? 'ar' : 'fr'}" dir="${isAr ? 'rtl' : 'ltr'}">
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4;
      margin: 0;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      background: ${dataOnly ? 'transparent' : '#ffffff'};
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .document-page {
      width: 210mm;
      height: 297mm;
      position: relative;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      background-position: center;
      ${(!dataOnly && bgDataUri) ? `background-image: url('${bgDataUri}');` : 'background: transparent !important; background-image: none !important;'}
      box-sizing: border-box;
      margin: 0 auto;
      overflow: hidden;
    }
    .document-page::after {
      display: none !important;
    }
    .data-layer {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      pointer-events: none;
    }
    .field-item {
      position: absolute;
      color: #000000 !important;
      font-weight: 700;
      line-height: 1;
      white-space: nowrap;
    }
    .field-item {
      position: absolute;
      color: #000000 !important;
      font-weight: 700;
      line-height: 1.1;
      white-space: nowrap;
    }
    .field-item:empty {
      display: none !important;
    }
    .document-page:not(.mode-preprinted) .field-item {
      background: #ffffff;
      padding: 0 3px;
      border-radius: 2px;
    }
    .document-page:not(.mode-preprinted) .date-group .cell {
      background: #ffffff;
    }
    .date-group {
      position: absolute;
      display: flex;
      align-items: center;
      line-height: 1;
    }
    .date-group .cell {
      position: absolute;
      font-weight: 800;
      color: #000000 !important;
      line-height: 1;
      text-align: center;
      width: 16px;
    }
    .document-page:not(.mode-preprinted) .field-signatory {
      display: none !important;
    }

    /* French Coordinates */
    .lang-fr { font-family: 'Times New Roman', Times, serif; }
    .lang-fr .field-agent-name { top: 29.8%; left: 38.5%; font-size: 14px; font-weight: 700; }
    .lang-fr .field-grade { top: 33.1%; left: 32.5%; font-size: 13px; font-weight: 700; }
    .lang-fr .field-service { top: 36.4%; left: 24.5%; font-size: 13px; font-weight: 700; }
    .lang-fr .field-address-1 { top: 39.7%; left: 24.5%; font-size: 12.5px; font-weight: 700; }
    .lang-fr .field-address-2 { top: 43.0%; left: 13.0%; font-size: 12.5px; font-weight: 700; }
    .lang-fr .field-leave-days { top: 46.2%; left: 37.4%; width: 8.2%; text-align: center; font-size: 14.5px; font-weight: 800; }
    .lang-fr .group-dep { top: 50.45%; width: 100%; left: 0; }
    .lang-fr .group-ret { top: 53.85%; width: 100%; left: 0; }
    .lang-fr .cell-d1 { left: 28.8%; width: 3.4%; text-align: center; font-size: 13.5px; }
    .lang-fr .cell-d2 { left: 32.2%; width: 3.3%; text-align: center; font-size: 13.5px; }
    .lang-fr .cell-m1 { left: 35.5%; width: 3.4%; text-align: center; font-size: 13.5px; }
    .lang-fr .cell-m2 { left: 38.9%; width: 3.5%; text-align: center; font-size: 13.5px; }
    .lang-fr .cell-y1 { left: 42.4%; width: 3.4%; text-align: center; font-size: 13.5px; }
    .lang-fr .cell-y2 { left: 45.8%; width: 3.4%; text-align: center; font-size: 13.5px; }
    .lang-fr .field-leave-address { top: 57.0%; left: 35.5%; font-size: 12.5px; font-weight: 700; }
    .lang-fr .field-location { top: 65.8%; left: 45.6%; font-size: 13px; font-weight: 700; }
    .lang-fr .field-date { top: 65.8%; left: 65.5%; font-size: 13px; font-weight: 700; }
    .lang-fr .field-signatory { top: 70.0%; left: 63.5%; font-size: 13px; font-style: italic; }
    .lang-fr .rights-values .field-item { left: 39.2%; width: 13.0%; text-align: center; font-size: 14.5px; font-weight: 800; }
    .lang-fr .right-val-prev { top: 78.3%; }
    .lang-fr .right-val-cur  { top: 81.0%; }
    .lang-fr .right-val-tot  { top: 83.8%; }
    .lang-fr .right-val-granted { top: 86.5%; }
    .lang-fr .right-val-new { top: 90.7%; font-size: 15.5px; font-weight: 900; }

    /* Arabic Coordinates */
    .lang-ar { font-family: 'Tajawal', sans-serif; direction: rtl; }
    .lang-ar .field-agent-name { top: 29.6%; right: 30.5%; font-size: 15px; font-weight: 700; }
    .lang-ar .field-grade { top: 33.0%; right: 32.0%; font-size: 14px; font-weight: 700; }
    .lang-ar .field-service { top: 36.3%; right: 25.5%; font-size: 14px; font-weight: 700; }
    .lang-ar .field-address-1 { top: 39.6%; right: 25.5%; font-size: 13.5px; font-weight: 700; }
    .lang-ar .field-address-2 { top: 42.8%; right: 14.0%; font-size: 13.5px; font-weight: 700; }
    .lang-ar .field-leave-days { top: 46.2%; right: 37.0%; width: 9.0%; text-align: center; font-size: 15px; font-weight: 800; }
    .lang-ar .group-dep { top: 50.4%; width: 100%; right: 0; left: auto; }
    .lang-ar .group-ret { top: 53.8%; width: 100%; right: 0; left: auto; }
    .lang-ar .cell-d1 { left: 66.0%; width: 3.2%; text-align: center; font-size: 13.5px; }
    .lang-ar .cell-d2 { left: 69.2%; width: 3.4%; text-align: center; font-size: 13.5px; }
    .lang-ar .cell-m1 { left: 59.0%; width: 3.5%; text-align: center; font-size: 13.5px; }
    .lang-ar .cell-m2 { left: 62.5%; width: 3.5%; text-align: center; font-size: 13.5px; }
    .lang-ar .cell-y1 { left: 52.5%; width: 3.2%; text-align: center; font-size: 13.5px; }
    .lang-ar .cell-y2 { left: 55.7%; width: 3.3%; text-align: center; font-size: 13.5px; }
    .lang-ar .field-leave-address { top: 56.4%; right: 33.5%; font-size: 13.5px; font-weight: 700; }
    .lang-ar .field-location { top: 65.6%; right: 46.0%; font-size: 14px; font-weight: 700; }
    .lang-ar .field-date { top: 65.6%; right: 67.0%; font-size: 14px; font-weight: 700; }
    .lang-ar .field-signatory { top: 69.8%; right: 64.0%; font-size: 14px; }
    .lang-ar .rights-values .field-item { left: 48.9%; width: 14.8%; text-align: center; font-size: 15px; font-weight: 800; }
    .lang-ar .right-val-prev { top: 78.0%; }
    .lang-ar .right-val-cur  { top: 80.8%; }
    .lang-ar .right-val-tot  { top: 83.6%; }
    .lang-ar .right-val-granted { top: 86.4%; }
    .lang-ar .right-val-new { top: 90.8%; font-size: 16px; font-weight: 900; }
  </style>
</head>
<body>
  ${content}
</body>
</html>`;
}

// Print Document
async function printDocument(dataOnly = true) {
  if (!window.electronAPI) {
    window.print();
    return;
  }
  const htmlContent = generatePrintHTML(dataOnly);
  const res = await window.electronAPI.printDocument({ htmlContent, dataOnly });
  if (res && res.error) {
    alert("Print Error: " + res.error);
  }
}

// Export PDF (dataOnly = false for complete doc, true for transparent data-only)
async function saveAsPDF(dataOnly = false) {
  const data = getFormData();
  const safeName = data.agent_name ? data.agent_name.replace(/\s+/g, '_') : 'GRH22';
  const defaultName = dataOnly 
    ? `Titre_Conge_${safeName}_Donnees_Seules.pdf` 
    : `Titre_Conge_${safeName}.pdf`;

  if (!window.electronAPI) {
    alert("Available in Electron.");
    return;
  }

  const htmlContent = generatePrintHTML(dataOnly);
  const res = await window.electronAPI.savePDF({ htmlContent, defaultName, dataOnly });
  if (res && res.success) {
    alert(currentAppLang === 'ar' ? `تم حفظ ملف PDF بنجاح:\n${res.filePath}` : `Document PDF enregistré avec succès :\n${res.filePath}`);
  } else if (res && res.error) {
    alert("Error: " + res.error);
  }
}

// Fill PDF Direct with pdf-lib onto GRH22_cleaned.pdf
async function exportFilledPDFDirect() {
  if (!window.electronAPI || !window.electronAPI.fillPdfDirect) {
    alert("Available in Electron.");
    return;
  }

  const data = getFormData();
  const res = await window.electronAPI.fillPdfDirect(data);
  if (res && res.success) {
    alert("Cleaned official PDF filled successfully:\n" + res.filePath);
  } else if (res && res.error) {
    alert("Error: " + res.error);
  }
}

// Save Leave Record into history & update balance
async function saveCurrentLeaveRecord() {
  if (!window.electronAPI || !window.electronAPI.saveLeaveRecord) {
    alert("Saved (Browser mode).");
    return;
  }

  const data = getFormData();
  const res = await window.electronAPI.saveLeaveRecord(data);
  if (res && res.success) {
    alert(`Leave record saved successfully for ${data.agent_name}!\nNew vacation balance: ${data.new_balance} days.`);
    await loadEmployees();
    await loadHistory();
    closeLeaveDrawer();
  } else {
    alert("Error saving record.");
  }
}

// Zoom controls
function adjustZoom(delta) {
  currentZoom = Math.min(Math.max(currentZoom + delta, 0.5), 1.6);
  updateZoomDisplay();
}

function resetZoom() {
  currentZoom = 1.0;
  updateZoomDisplay();
}

function updateZoomDisplay() {
  document.getElementById('zoom-txt').textContent = `${Math.round(currentZoom * 100)}%`;
  const sheet = document.querySelector('#drawer-paper-container .document-page');
  if (sheet) {
    sheet.style.transform = `scale(${currentZoom})`;
  }
}

// Modal handling for adding employee
function openNewEmployeeModal() {
  document.getElementById('employee-modal').style.display = 'flex';
}

function closeNewEmployeeModal() {
  document.getElementById('employee-modal').style.display = 'none';
}

async function submitNewEmployee() {
  const nameFr = document.getElementById('m-name-fr').value.trim();
  const nameAr = document.getElementById('m-name-ar').value.trim();
  if (!nameFr && !nameAr) {
    alert(currentAppLang === 'ar' ? "يرجى إدخال الاسم على الأقل بالعربية أو الفرنسية." : "Veuillez renseigner au moins le nom en français ou en arabe.");
    return;
  }

  const newEmp = {
    id: 'emp-' + Date.now(),
    name_fr: nameFr || nameAr,
    name_ar: nameAr || nameFr,
    grade_fr: document.getElementById('m-grade-fr').value.trim() || 'Agent',
    grade_ar: document.getElementById('m-grade-ar').value.trim() || 'عون',
    service_fr: document.getElementById('m-service-fr').value.trim() || 'Administration',
    service_ar: document.getElementById('m-service-ar').value.trim() || 'المصلحة الإدارية',
    address_fr: document.getElementById('m-address-fr').value.trim() || '',
    address_ar: document.getElementById('m-address-fr').value.trim() || '',
    prev_balance: parseFloat(document.getElementById('m-prev-balance').value) || 0,
    annual_entitlement: parseFloat(document.getElementById('m-annual-entitlement').value) || 30
  };

  if (window.electronAPI && window.electronAPI.saveEmployee) {
    await window.electronAPI.saveEmployee(newEmp);
  } else {
    employees.push(newEmp);
  }

  closeNewEmployeeModal();
  await loadEmployees();
}
