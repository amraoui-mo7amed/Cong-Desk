// CongéDesk - Application Logic
// Features: Bilingual (FR/AR), Dark/Light Themes, Employee Cards Grid, Dedicated Preview Modal, GRH.22 Generator

let currentAppLang = 'fr'; // 'fr' or 'ar'
let currentDocLang = 'fr'; // 'fr' or 'ar'
let currentTheme = 'light'; // 'light' (default) or 'dark'
let currentZoom = 1.0;
let modalZoom = 1.0;
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
    // Default mock data
    employees = [
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
        <span style="font-size: 15px; font-weight: 600;">${dict.noEmployeesFound}</span>
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
      <!-- Card Top: Identity & Status (Pure Language Isolated) -->
      <div class="emp-card-header">
        <div class="emp-identity">
          <div class="emp-avatar">${initials}</div>
          <div class="emp-name-block">
            <span class="emp-name-fr">${empName}</span>
          </div>
        </div>

        <span class="status-badge ${hasBalance ? 'active-ok' : 'active-warn'}">
          <i class="fa-solid ${hasBalance ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i>
          ${hasBalance ? dict.activeOk : dict.activeWarn}
        </span>
      </div>

      <!-- Card Meta Details -->
      <div class="emp-card-details">
        <div class="detail-line">
          <i class="fa-solid fa-briefcase"></i>
          <span>${empGrade}</span>
        </div>
        <div class="detail-line">
          <i class="fa-solid fa-building"></i>
          <span>${empService}</span>
        </div>
        ${empAddress ? `
        <div class="detail-line">
          <i class="fa-solid fa-location-dot"></i>
          <span>${empAddress}</span>
        </div>` : ''}
      </div>

      <!-- Vacation Balance Meter Card -->
      <div class="emp-balance-card">
        <div class="balance-top-row">
          <div class="balance-hero-num ${prevBal > 5 ? '' : (prevBal > 0 ? 'warn' : 'danger')}">
            <i class="fa-solid fa-umbrella-beach"></i>
            <span>${prevBal} ${dict.daysRemainingLabel}</span>
          </div>

          <div class="balance-stats-mini">
            <span>${dict.n1Reliquat}: <span class="balance-stat-pill">${prevBal}${dict.daysUnit}</span></span>
            <span>${dict.annualQuota}: <span class="balance-stat-pill">${annual}${dict.daysUnit}</span></span>
          </div>
        </div>

        <div class="balance-progress-track">
          <div class="balance-progress-fill" style="width: ${Math.max(pct, 12)}%; background: ${isBalanceHealthy ? 'var(--success)' : (hasBalance ? 'var(--warning)' : 'var(--danger)')};"></div>
        </div>
      </div>

      <!-- Card Footer Actions: Preview, Leave, Delete -->
      <div class="emp-card-actions">
        <!-- Direct Preview Button -->
        <button class="btn btn-sm btn-card-preview" onclick="openPreviewModalFor('${emp.id}')" title="${dict.cardPreviewBtn}">
          <i class="fa-solid fa-eye"></i> ${dict.cardPreviewBtn}
        </button>

        <!-- Create Leave Button -->
        <button class="btn btn-sm btn-card-leave" onclick="openLeaveDrawerFor('${emp.id}')" title="${dict.cardLeaveBtn}">
          <i class="fa-solid fa-file-signature"></i> ${dict.cardLeaveBtn}
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

// ================= DEDICATED PREVIEW FUNCTION (PREVIEW MODAL) =================
function openPreviewModalFor(empId) {
  activeEmployee = employees.find(e => e.id === empId);
  if (!activeEmployee) return;

  // Set document language to match active UI language
  currentDocLang = currentAppLang;

  // Sync drawer fields for this employee
  populateDrawerFields(activeEmployee, currentDocLang);

  // Update modal titles strictly in active language
  const isAr = (currentDocLang === 'ar');
  const empName = isAr ? (activeEmployee.name_ar || activeEmployee.name_fr) : (activeEmployee.name_fr || activeEmployee.name_ar);
  const empRole = isAr ? (activeEmployee.grade_ar || activeEmployee.grade_fr) : (activeEmployee.grade_fr || activeEmployee.grade_ar);

  document.getElementById('preview-modal-emp-name').textContent = `${empName} - ${isAr ? 'بيان العطلة السنوية GRH.22' : 'Titre de Congé GRH.22'}`;
  document.getElementById('preview-modal-emp-sub').textContent = empRole;

  // Sync tabs in modal
  document.getElementById('modal-tab-fr').classList.toggle('active', currentDocLang === 'fr');
  document.getElementById('modal-tab-ar').classList.toggle('active', currentDocLang === 'ar');

  // Render sheet into modal paper container
  renderModalDocumentSheet();

  // Show modal
  document.getElementById('preview-modal').style.display = 'flex';
}

function closePreviewModal() {
  document.getElementById('preview-modal').style.display = 'none';
}

function setPreviewModalLanguage(lang) {
  currentDocLang = lang;
  document.getElementById('modal-tab-fr').classList.toggle('active', lang === 'fr');
  document.getElementById('modal-tab-ar').classList.toggle('active', lang === 'ar');
  
  // Also sync drawer tabs
  document.getElementById('btn-tab-fr').classList.toggle('active', lang === 'fr');
  document.getElementById('btn-tab-ar').classList.toggle('active', lang === 'ar');

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

  renderModalDocumentSheet();
  recalcAndRender();
}

function renderModalDocumentSheet() {
  const isAr = (currentDocLang === 'ar');
  const data = getFormData();
  const bannerPath = isAr ? '../resources/header_banner_ar.png' : '../resources/header_banner.png';

  const html = buildDocumentSheetHTML(data, isAr, bannerPath, isPreviewDataOnly);
  const container = document.getElementById('preview-modal-paper-container');
  container.innerHTML = html;
  const sheet = container.querySelector('.document-page');
  if (sheet) {
    sheet.style.transform = `scale(${modalZoom})`;
  }
}

function adjustModalZoom(delta) {
  modalZoom = Math.min(Math.max(modalZoom + delta, 0.5), 1.6);
  document.getElementById('modal-zoom-txt').textContent = `${Math.round(modalZoom * 100)}%`;
  const sheet = document.querySelector('#preview-modal-paper-container .document-page');
  if (sheet) {
    sheet.style.transform = `scale(${modalZoom})`;
  }
}

function resetModalZoom() {
  modalZoom = 1.0;
  document.getElementById('modal-zoom-txt').textContent = '100%';
  const sheet = document.querySelector('#preview-modal-paper-container .document-page');
  if (sheet) {
    sheet.style.transform = `scale(1)`;
  }
}

function openLeaveDrawerFromPreview() {
  closePreviewModal();
  if (activeEmployee) {
    openLeaveDrawerFor(activeEmployee.id);
  }
}

function openDedicatedPreviewFromDrawer() {
  if (activeEmployee) {
    openPreviewModalFor(activeEmployee.id);
  }
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

  renderModalDocumentSheet();
  renderDocumentSheet();
}

// Build Official Sheet HTML
function buildDocumentSheetHTML(data, isAr, bannerPath, overlayMode = false) {
  return `
    <div class="document-page ${isAr ? 'lang-ar' : 'lang-fr'} ${overlayMode ? 'preview-data-only' : ''}" dir="${isAr ? 'rtl' : 'ltr'}">
      
      <!-- Header Banner -->
      <div class="header-banner">
        <img src="${bannerPath}" alt="CNAS Banner">
      </div>

      <!-- Sub Header -->
      <div class="sub-header">
        ${isAr ? `
          <div class="doc-title">بيان <span class="underline">العطلة السنوية</span></div>
          <div class="visa-box"><span>تأشيرة الهيئة</span></div>
        ` : `
          <div class="visa-box"><span>Visa de la Structure</span></div>
          <div class="doc-title">TITRE <span class="underline">DE CONGE</span> ANNUEL</div>
        `}
      </div>

      <!-- Main Form Border -->
      <div class="form-wrapper">
        <div class="form-border">
          
          <div class="fields-group">
            
            <div class="field-row">
              <span class="field-label">${isAr ? 'إسم ولقب العون :' : 'Nom et prénom de l’agent :'}</span>
              <div class="field-dotted"><span class="field-data">${data.agent_name}</span></div>
            </div>

            <div class="field-row">
              <span class="field-label">${isAr ? 'الرتبة أو الوظيفة :' : 'Grade ou fonction :'}</span>
              <div class="field-dotted"><span class="field-data">${data.grade}</span></div>
            </div>

            <div class="field-row">
              <span class="field-label">${isAr ? 'مصلحة :' : 'Service :'}</span>
              <div class="field-dotted"><span class="field-data">${data.service}</span></div>
            </div>

            <div class="field-row">
              <span class="field-label">${isAr ? 'العنــــوان :' : 'Adresse :'}</span>
              <div class="field-dotted"><span class="field-data">${data.address_line_1}</span></div>
            </div>

            <div class="field-row">
              <div class="field-dotted"><span class="field-data"></span></div>
            </div>

            <div class="field-row" style="margin-top: 3px;">
              <span class="field-label">${isAr ? 'يستفيد من عطلة تدوم :' : 'Bénéficie d’un congé de :'}</span>
              <div class="days-bracket">${data.leave_days}</div>
              <span class="field-label">${isAr ? 'يوما.' : 'jours.'}</span>
            </div>

            <div class="field-row" style="margin-top: 2px;">
              <span class="field-label">${isAr ? 'تاريخ الذهاب :' : 'Date de départ :'}</span>
              <div class="date-box-container">
                <div class="date-segment">
                  <div class="date-cell">${data.dep.d1}</div>
                  <div class="date-cell">${data.dep.d2}</div>
                </div>
                <div class="date-segment">
                  <div class="date-cell">${data.dep.m1}</div>
                  <div class="date-cell">${data.dep.m2}</div>
                </div>
                <div class="date-segment">
                  <div class="date-cell">${data.dep.y1}</div>
                  <div class="date-cell">${data.dep.y2}</div>
                </div>
              </div>
            </div>

            <div class="field-row" style="margin-top: 2px;">
              <span class="field-label">${isAr ? 'تاريخ العودة :' : 'Date de retour :'}</span>
              <div class="date-box-container">
                <div class="date-segment">
                  <div class="date-cell">${data.ret.d1}</div>
                  <div class="date-cell">${data.ret.d2}</div>
                </div>
                <div class="date-segment">
                  <div class="date-cell">${data.ret.m1}</div>
                  <div class="date-cell">${data.ret.m2}</div>
                </div>
                <div class="date-segment">
                  <div class="date-cell">${data.ret.y1}</div>
                  <div class="date-cell">${data.ret.y2}</div>
                </div>
              </div>
            </div>

            <div class="field-row" style="margin-top: 2px;">
              <span class="field-label">${isAr ? 'العنوان خلال العطلة :' : 'Adresse durant le congé :'}</span>
              <div class="field-dotted"><span class="field-data">${data.leave_address}</span></div>
            </div>

            <div class="field-row">
              <div class="field-dotted"><span class="field-data"></span></div>
            </div>

          </div>

          <!-- Date & Signature section -->
          <div class="mid-signature-block">
            <div class="date-location-line">
              <div class="item">
                <span class="field-label">${isAr ? 'حرر بـ' : 'Fait à'}</span> <span class="dotted-box-short">${data.location}</span>
              </div>
              <div class="item">
                <span class="field-label">${isAr ? 'في' : 'Le'}</span> <span class="dotted-box-short">${data.date}</span>
              </div>
            </div>
            <div class="director-role">
              ${data.director}
            </div>
          </div>

          <!-- Detail des droits Table -->
          <div class="table-container">
            <table class="rights-table">
              <thead>
                <tr>
                  <th colspan="2">${isAr ? 'كشف المستحقات' : 'DETAIL DES DROITS'}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="col-label">${isAr ? 'الباقي من السنة الماضية :' : 'Reliquat année précédente :'}</td>
                  <td class="col-val">${data.prev_balance}</td>
                </tr>
                <tr>
                  <td class="col-label">${isAr ? 'حقوق السنة الجارية :' : 'Droit année en cours :'}</td>
                  <td class="col-val">${data.cur_entitlement}</td>
                </tr>
                <tr>
                  <td class="col-label">${isAr ? 'مجموع الحقوق :' : 'Total droit :'}</td>
                  <td class="col-val">${data.tot_entitlement}</td>
                </tr>
                <tr>
                  <td class="col-label">${isAr ? 'العطل المسموحة :' : 'Congé accordé :'}</td>
                  <td class="col-val">${data.leave_granted}</td>
                </tr>
                <tr class="row-reliquat">
                  <td class="col-label reliquat-title">${isAr ? 'الباقي : ...' : 'Reliquat : .....'}</td>
                  <td class="col-val">${data.new_balance}</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>

        <!-- Vertical side reference -->
        <div class="side-reference">IMP.CNAS 03-2020 - GRH.22</div>
      </div>

    </div>
  `;
}

function renderDocumentSheet() {
  const isAr = (currentDocLang === 'ar');
  const data = getFormData();
  const bannerPath = isAr ? '../resources/header_banner_ar.png' : '../resources/header_banner.png';
  const html = buildDocumentSheetHTML(data, isAr, bannerPath, isPreviewDataOnly);

  const container = document.getElementById('drawer-paper-container');
  container.innerHTML = html;
  const sheet = container.querySelector('.document-page');
  if (sheet) {
    sheet.style.transform = `scale(${currentZoom})`;
  }
}

// Generate Standalone HTML for Printing / PDF
function generatePrintHTML(dataOnly = false) {
  const isAr = (currentDocLang === 'ar');
  const data = getFormData();
  const bannerPath = isAr ? '../resources/header_banner_ar.png' : '../resources/header_banner.png';
  const content = buildDocumentSheetHTML(data, isAr, bannerPath, false);

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&family=Amiri:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
  <style>
    @page { size: 140mm 220mm; margin: 4mm 6mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: ${dataOnly ? 'transparent' : '#ffffff'}; padding: 0; margin: 0; }
    .document-page { width: 140mm; min-height: 220mm; background: ${dataOnly ? 'transparent' : '#ffffff'}; padding: 5mm 6mm 4mm 6mm; position: relative; display: flex; flex-direction: column; color: #111; margin: 0 auto; box-sizing: border-box; }
    .header-banner { width: 100%; margin-bottom: 8px; }
    .header-banner img { width: 100%; height: auto; display: block; }
    .sub-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 10px; padding: 0 2px; }
    .visa-box { width: 125px; height: 64px; border: 1.2px solid #231f20; border-radius: 8px; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 4px; }
    .doc-title { font-weight: bold; color: #111; padding-bottom: 4px; }
    .doc-title .underline { text-decoration: underline; text-underline-offset: 3px; text-decoration-thickness: 1.2px; }
    .form-wrapper { position: relative; flex: 1; display: flex; flex-direction: column; }
    .form-border { border: 1.2px solid #231f20; padding: 10px 12px 8px 12px; flex: 1; display: flex; flex-direction: column; position: relative; }
    .side-reference { position: absolute; bottom: 2px; font-family: Arial, Helvetica, sans-serif; font-size: 6.8px; letter-spacing: 0.5px; color: #222; white-space: nowrap; }
    .fields-group { display: flex; flex-direction: column; gap: 6px; }
    .field-row { display: flex; align-items: baseline; }
    .field-label { white-space: nowrap; font-weight: 500; }
    .field-dotted { flex: 1; border-bottom: 1px dotted #444; min-height: 16px; position: relative; display: flex; align-items: flex-end; padding: 0 4px 1px 4px; }
    .field-data { font-weight: bold; color: #000; }
    .days-bracket { display: inline-flex; align-items: center; justify-content: center; min-width: 44px; height: 19px; border-left: 1.2px solid #000; border-bottom: 1.2px solid #000; border-right: 1.2px solid #000; margin: 0 5px; font-weight: bold; color: #000; padding: 0 4px; line-height: 1; }
    .date-box-container { display: inline-flex; border-bottom: 1.2px solid #000; border-right: 1.2px solid #000; border-left: 1.2px solid #000; height: 19px; align-items: center; background: #fff; direction: ltr !important; }
    .date-segment { display: inline-flex; height: 100%; align-items: center; border-right: 1.2px solid #000; position: relative; }
    .date-segment:last-child { border-right: none; }
    .date-cell { width: 14px; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 11.5px; font-weight: bold; color: #000; line-height: 1; }
    .date-cell:first-child::after { content: ''; position: absolute; left: 14px; bottom: 0; width: 1px; height: 48%; background-color: #666; }
    .mid-signature-block { margin-top: 18px; margin-bottom: 12px; display: flex; flex-direction: column; width: 100%; }
    .date-location-line { display: flex; font-weight: bold; gap: 15px; margin-bottom: 8px; }
    .date-location-line .item { display: inline-flex; align-items: baseline; }
    .dotted-box-short { display: inline-block; min-width: 65px; border-bottom: 1px dotted #333; margin: 0 4px; text-align: center; color: #000; }
    .table-container { margin-top: auto; display: flex; }
    .rights-table { width: 185px; border-collapse: collapse; border: 1.2px solid #231f20; background: #fff; }
    .rights-table th { background: #231f20; color: #fff; font-weight: bold; padding: 3px 4px; text-align: center; border: 1.2px solid #231f20; }
    .rights-table td { border: 1px solid #231f20; padding: 2px 4px; vertical-align: middle; }
    .rights-table td.col-label { font-weight: bold; width: 70%; }
    .rights-table td.col-val { width: 30%; text-align: center; font-weight: bold; color: #000; }

    /* French */
    .lang-fr { font-family: 'Times New Roman', Times, serif; direction: ltr; }
    .lang-fr .visa-box span { font-family: 'Tajawal', Arial, sans-serif; font-style: italic; font-size: 8.5px; color: #333; }
    .lang-fr .doc-title { font-size: 15px; letter-spacing: 0.5px; }
    .lang-fr .field-row { font-size: 11.8px; line-height: 17px; }
    .lang-fr .field-label { padding-right: 5px; }
    .lang-fr .field-data { font-size: 11.5px; }
    .lang-fr .days-bracket { font-size: 11.5px; }
    .lang-fr .date-box-container { margin-left: 6px; }
    .lang-fr .side-reference { right: -22px; transform: rotate(-90deg); transform-origin: bottom right; }
    .lang-fr .mid-signature-block { align-items: flex-end; padding-left: 15px; }
    .lang-fr .date-location-line { font-size: 10.5px; }
    .lang-fr .director-role { font-size: 11px; font-style: italic; margin-right: 25px; }
    .lang-fr .table-container { justify-content: flex-start; }
    .lang-fr .rights-table th { font-size: 10px; letter-spacing: 0.6px; }
    .lang-fr .rights-table td { font-size: 9px; }
    .lang-fr .rights-table tr.row-reliquat td { font-size: 10.5px; padding: 3px 4px; }
    .lang-fr .rights-table td.reliquat-title { font-style: italic; font-weight: bold; }

    /* Arabic */
    .lang-ar { font-family: 'Tajawal', sans-serif; direction: rtl; }
    .lang-ar .visa-box span { font-family: 'Tajawal', sans-serif; font-size: 11px; font-weight: bold; color: #222; }
    .lang-ar .doc-title { font-size: 20px; letter-spacing: 0; }
    .lang-ar .field-row { font-size: 14px; line-height: 20px; }
    .lang-ar .field-label { padding-left: 5px; font-weight: 700; }
    .lang-ar .field-data { font-size: 13.5px; }
    .lang-ar .days-bracket { font-size: 12px; }
    .lang-ar .date-box-container { margin-right: 6px; }
    .lang-ar .side-reference { left: -22px; transform: rotate(90deg); transform-origin: bottom left; }
    .lang-ar .mid-signature-block { align-items: flex-end; padding-left: 30px; }
    .lang-ar .date-location-line { font-size: 13px; }
    .lang-ar .director-role { font-size: 14px; font-style: normal; font-weight: bold; margin-left: 40px; }
    .lang-ar .table-container { justify-content: flex-start; }
    .lang-ar .rights-table th { font-size: 11px; letter-spacing: 0; }
    .lang-ar .rights-table td { font-size: 11.5px; }
    .lang-ar .rights-table tr.row-reliquat td { font-size: 12px; padding: 3px 4px; }
    .lang-ar .rights-table td.reliquat-title { font-style: normal; font-weight: bold; text-align: right; }

    ${dataOnly ? `
    /* DATA-ONLY PRINT OVERLAY: FOR PRE-PRINTED PHYSICAL SHEETS */
    body { background: transparent !important; }
    .document-page { background: transparent !important; box-shadow: none !important; }
    .header-banner, .sub-header, .side-reference, .field-label, .rights-table th, .rights-table td.col-label { visibility: hidden !important; opacity: 0 !important; }
    .form-border, .field-dotted, .days-bracket, .date-box-container, .date-segment, .dotted-box-short, .rights-table, .rights-table td { border-color: transparent !important; background: transparent !important; }
    .date-cell:first-child::after { display: none !important; }
    .field-data, .days-bracket, .date-cell, .dotted-box-short, .director-role, .rights-table td.col-val { color: #000000 !important; visibility: visible !important; opacity: 1 !important; }
    ` : ''}
  </style>
</head>
<body>
  <div class="document-page ${isAr ? 'lang-ar' : 'lang-fr'} ${dataOnly ? 'print-data-only' : ''}">
    ${content.replace(/<div class="document-page[^>]*>/, '').replace(/<\/div>\s*$/, '')}
  </div>
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
