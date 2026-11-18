// CongéDesk - Application Logic (CNAS GRH.22 Official Edition)
// Features: Bilingual (FR/AR), Dark/Light Themes, Collapsible Sidebar, Minimal Director Cards, Tabler Icons, Dedicated Settings & About, Leave Calculator & GRH.22 Generator

let currentAppLang = 'fr'; // 'fr' or 'ar'
let currentDocLang = 'fr'; // 'fr' or 'ar'
let currentTheme = 'light'; // 'light' (default) or 'dark'
let currentZoom = 1.0;
let isPreviewDataOnly = false; // Toggle between full document and transparent pre-printed overlay mode
let currentView = 'home'; // 'home', 'directors', 'history', 'settings'
let currentSettingsTab = 'general'; // 'general', 'data', 'about'

let employees = []; // Holds directors
let activeEmployee = null;
let leaveHistory = [];
let directorToDeleteId = null;

// ================= I18N BILINGUAL SYSTEM =================
const i18n = {
  fr: {
    nav_home: "Accueil",
    nav_directors: "Directeurs",
    nav_history: "Historique",
    nav_settings: "Paramètres",

    home_badge: "Caisse Nationale des Assurances Sociales",
    home_title: "Portail CongéDesk — Gestion des Congés CNAS GRH.22",
    home_desc: "Plateforme institutionnelle d'administration des congés annuels et d'édition conforme du Titre Officiel <strong>GRH.22</strong> pour les directeurs d'agences des 58 Wilayas et structures spécialisées de la CNAS.",
    home_btn_directors: "Consulter l'Annuaire des Directeurs",
    home_btn_new: "Nouveau Titre de Congé",
    kpi_directors: "Agences & Établissements",
    kpi_wilayas: "Wilayas Couvertes",
    kpi_wilayas_val: "58 Wilayas",
    kpi_issued: "Titres GRH.22 Émis",
    kpi_legal_days: "Droit Annuel Réglementaire",
    kpi_legal_days_val: "30 Jours",
    launch_1_title: "Annuaire Officiel CNAS",
    launch_1_desc: "Rechercher parmi les 64 directeurs de wilayas, consulter leurs soldes et modifier les informations.",
    launch_2_title: "Édition Rapide GRH.22",
    launch_2_desc: "Calculer les droits, dates de départ et reprise avec impression recto (FR) / verso (AR) conforme.",
    launch_3_title: "Registre & Historique",
    launch_3_desc: "Consulter les congés accordés, suivre les déductions de solde et exporter les registres en CSV.",
    home_recent_title: "Derniers Titres de Congé Émis",
    home_view_all: "Voir tout l'historique",

    search_placeholder: "Rechercher par nom, wilaya, agence...",
    dropdown_all_wilayas: "Toutes les Wilayas & Établissements",
    dropdown_search_placeholder: "Filtrer une wilaya...",
    dir_section_title: "Annuaire des Directeurs d'Agences de Wilayas & Établissements CNAS",

    // History Page
    history_title: "Historique des Titres de Congé Émis",
    history_sub: "Registres des titres GRH.22 délivrés aux directeurs avec soldes déduits",
    btn_export_csv: "Exporter CSV",
    btn_clear_reg: "Vider le Registre",
    th_date: "Date d'Émission",
    th_agent: "Directeur / Agent",
    th_agency: "Agence / Wilaya",
    th_period: "Période de Congé",
    th_days: "Jours",
    th_balance: "Nouveau Solde",
    th_actions: "Actions",
    history_empty: "Aucun titre de congé enregistré dans l'historique pour le moment.",

    // Settings Page
    settings_title: "Paramètres & Configuration de l'Application",
    settings_sub: "Personnalisation des paramètres d'émission, base de données et informations CNAS",
    stab_general: "Général & Établissement",
    stab_data: "Base de Données CNAS",
    stab_about: "À Propos",
    set_sec_emitter: "Informations de la Structure Émettrice",
    set_lbl_org: "Nom de l'Organisme / Établissement",
    set_lbl_struct: "Direction ou Structure Centrale",
    set_lbl_city: "Ville par Défaut (Fait à ...)",
    set_lbl_sig_title: "Qualité du Signataire",
    set_lbl_sig_name: "Nom du Signataire",
    set_lbl_def_days: "Droit Annuel Légal par Défaut (Jours)",
    set_btn_save: "Enregistrer les Paramètres",
    set_sec_data: "Gestion des Données des Directeurs & Registres",
    set_data_desc: "Les directeurs sont synchronisés directement depuis le fichier officiel <code style=\"color: var(--primary); font-weight: 700;\">data.xlsx</code> de la CNAS.",
    set_reset_title: "Réinitialiser les Directeurs (data.xlsx)",
    set_reset_desc: "Recharge la liste officielle complète des 64 Directeurs d'Agences de Wilayas et Établissements CNAS.",
    set_btn_reset: "Réinitialiser (64 Directeurs)",
    set_clear_title: "Vider le Registre des Congés",
    set_clear_desc: "Supprime l'historique des titres émis sans effacer la liste des directeurs.",
    set_btn_clear: "Vider l'Historique",
    about_version: "Version 2.0.0 (Édition Officielle CNAS)",
    about_desc: "Solution intégrée de gestion des congés annuels et d'édition conforme des Titres de Congé officiels <strong>GRH.22</strong> pour la Caisse Nationale des Assurances Sociales des Travailleurs Salariés (CNAS - République Algérienne Démocratique et Populaire).",
    about_org_name: "Caisse Nationale des Assurances Sociales des Travailleurs Salariés",
    about_org_ar: "الصندوق الوطني للتأمينات الاجتماعية للعمال الأجراء",
    about_dg: "Direction Générale — Gestion des Ressources Humaines",

    // Director Details Modal
    modal_det_service_fr: "Structure / Agence (FR)",
    modal_det_service_ar: "الوكالة / المصلحة (AR)",
    modal_det_grade_fr: "Grade / Fonction (FR)",
    modal_det_grade_ar: "الرتبة / الوظيفة (AR)",
    modal_det_address: "Adresse Siège / Professionnelle",
    modal_det_n1: "Reliquat N-1",
    modal_det_annual: "Droit Annuel",
    modal_det_total: "Total Disponible",
    modal_det_history_title: "Congés Référencés",
    modal_det_btn_close: "Fermer",
    modal_det_btn_new_leave: "Nouveau Congé",

    // Delete Confirmation Modal
    modal_del_title: "Confirmer la suppression",
    modal_del_msg: "Êtes-vous sûr de vouloir supprimer ce directeur ?",
    modal_del_warn: "Cette action est irréversible et supprimera également les fiches associées.",
    modal_del_cancel: "Annuler",
    modal_del_confirm: "Supprimer Définitivement",

    // New/Edit Director Modal
    modal_emp_title_add: "Ajouter un Nouveau Directeur",
    modal_emp_title_edit: "Modifier les Données du Directeur",
    modal_emp_lbl_code: "Code Wilaya",
    modal_emp_lbl_agency: "Agence / Wilaya",
    modal_emp_lbl_name_fr: "Nom & Prénom (Français)",
    modal_emp_lbl_name_ar: "الاسم واللقب (بالعربية)",
    modal_emp_lbl_grade_fr: "Grade / Fonction (Français)",
    modal_emp_lbl_grade_ar: "الرتبة / الوظيفة (بالعربية)",
    modal_emp_lbl_service_fr: "Service / Structure (Français)",
    modal_emp_lbl_service_ar: "المصلحة / المديرية (بالعربية)",
    modal_emp_lbl_address: "Adresse du Siège / Professionnelle",
    modal_emp_lbl_n1: "Reliquat Antérieur N-1 (Jours)",
    modal_emp_lbl_annual: "Droit Annuel Légal (Jours)",
    modal_emp_btn_cancel: "Annuler",
    modal_emp_btn_save: "Enregistrer",

    // Leave Drawer
    drawer_title: "Titre de Congé GRH.22",
    drawer_subtitle: "Calcul & Remplissage automatique",
    drawer_mode_full: "Modèle",
    drawer_mode_overlay: "Papier Officiel",
    drawer_calc_title: "Jours de Congé Restants",
    drawer_calc_badge: "Calcul Automatique",
    drawer_stat_n1: "Reliquat N-1",
    drawer_stat_annual: "Droit Annuel",
    drawer_stat_requested: "Demandé",
    drawer_sec_period: "Période & Durée du Congé",
    drawer_lbl_granted: "Jours Accordés",
    drawer_lbl_dep_date: "Date de Départ",
    drawer_lbl_ret_date: "Date de Reprise Calculée",
    drawer_lbl_leave_addr: "Adresse Durant le Congé",
    drawer_sec_agent: "Informations du Directeur",
    drawer_lbl_name: "Nom & Prénom",
    drawer_lbl_grade: "Grade / Fonction",
    drawer_lbl_service: "Structure / Agence",
    drawer_lbl_address: "Adresse Siège / Personnelle",
    drawer_sec_rights: "Détail des Droits & Reliquats",
    drawer_lbl_tot_avail: "Total Disponible",
    drawer_sec_sign: "Émission & Signatures",
    drawer_lbl_city: "Fait à",
    drawer_lbl_date: "Le (Date)",
    drawer_lbl_signatory: "Qualité du Signataire",
    drawer_btn_back: "Retour à l'Annuaire",
    drawer_btn_print_official: "Imprimer (Papier Officiel)",
    drawer_btn_print_all: "Imprimer Tout",
    drawer_btn_pdf_data: "PDF Données Seules",
    drawer_btn_pdf_full: "PDF Complet",
    drawer_btn_save: "Enregistrer"
  },
  ar: {
    nav_home: "الرئيسية",
    nav_directors: "المدراء",
    nav_history: "سجل العطل",
    nav_settings: "الإعدادات",

    home_badge: "الصندوق الوطني للتأمينات الاجتماعية للعمال الأجراء",
    home_title: "بوابة إجازاتي — تسيير العطل وإصدار سند العطلة كناس GRH.22",
    home_desc: "المنصة الإدارية الرسمية لتسيير العطل السنوية وإصدار سند العطلة الرسمي <strong>GRH.22</strong> لمدراء وكالات الولايات الـ 58 والمؤسسات المتخصصة التابعة للصندوق الوطني للتأمينات الاجتماعية.",
    home_btn_directors: "دليل مدراء الوكالات والمؤسسات",
    home_btn_new: "إصدار سند عطلة جديد",
    kpi_directors: "الوكالات والمؤسسات",
    kpi_wilayas: "الولايات المغطاة",
    kpi_wilayas_val: "58 ولاية",
    kpi_issued: "سندات GRH.22 الصادرة",
    kpi_legal_days: "الحق السنوي القانوني",
    kpi_legal_days_val: "30 يوماً",
    launch_1_title: "الدليل الرسمي كناس",
    launch_1_desc: "البحث في قائمة مدراء وكالات الولايات، متابعة الأرصدة وتعديل البيانات الرسمية.",
    launch_2_title: "الإصدار السريع GRH.22",
    launch_2_desc: "حساب الحقوق وتواريخ المغادرة والاستئناف وطباعة وجه (فرنسي) / ظهر (عربي) مطابق قانونياً.",
    launch_3_title: "سجل الإجازات والأرشيف",
    launch_3_desc: "مراجعة العطل الممنوحة ومتابعة اقتطاعات الأرصدة وتصدير السجلات إلى CSV.",
    home_recent_title: "آخر سندات العطل الصادرة",
    home_view_all: "عرض كامل السجل",

    search_placeholder: "بحث بالاسم، الولاية، أو الوكالة...",
    dropdown_all_wilayas: "جميع الولايات والمؤسسات",
    dropdown_search_placeholder: "تصفية حسب الولاية...",
    dir_section_title: "دليل مدراء وكالات الولايات والمؤسسات المتخصصة كناس",

    // History Page
    history_title: "سجل سندات العطل الصادرة",
    history_sub: "سجل سندات GRH.22 المسلمة للمدراء مع خصم الأيام من الرصيد",
    btn_export_csv: "تصدير إلى CSV",
    btn_clear_reg: "إفراغ السجل",
    th_date: "تاريخ الإصدار",
    th_agent: "المدير / العون",
    th_agency: "الوكالة / الولاية",
    th_period: "فترة العطلة",
    th_days: "الأيام",
    th_balance: "الرصيد المتبقي",
    th_actions: "الإجراءات",
    history_empty: "لا توجد سندات عطل مسجلة في التاريخ حتى الآن.",

    // Settings Page
    settings_title: "إعدادات وتخصيص التطبيق",
    settings_sub: "تخصيص معلومات الهيئة المصدرة، قاعدة البيانات وبيانات كناس الرسمية",
    stab_general: "عام والهيئة المصدرة",
    stab_data: "قاعدة بيانات كناس",
    stab_about: "حول التطبيق",
    set_sec_emitter: "معلومات الهيكل / الإدارة المصدرة",
    set_lbl_org: "اسم الهيئة / المؤسسة",
    set_lbl_struct: "المديرية أو الهيكل المركزي",
    set_lbl_city: "المدينة الافتراضية (حرر بـ)",
    set_lbl_sig_title: "صفة الممضي",
    set_lbl_sig_name: "اسم ولقب الممضي",
    set_lbl_def_days: "الحق السنوي القانوني الافتراضي (أيام)",
    set_btn_save: "حفظ الإعدادات",
    set_sec_data: "إدارة بيانات المدراء وسجلات العطل",
    set_data_desc: "تتم مزامنة بيانات المدراء مباشرة من ملف كناس الرسمي <code style=\"color: var(--primary); font-weight: 700;\">data.xlsx</code>.",
    set_reset_title: "إعادة تعيين المدراء (data.xlsx)",
    set_reset_desc: "إعادة تحميل القائمة الرسمية الكاملة لـ 64 مديراً لوكالات الولايات والمؤسسات التابعة لكناس.",
    set_btn_reset: "إعادة تعيين (64 مديراً)",
    set_clear_title: "إفراغ سجل العطل",
    set_clear_desc: "حذف تاريخ السندات الصادرة دون المساس بقائمة المدراء أو أرصدتهم الأصلية.",
    set_btn_clear: "إفراغ التاريخ",
    about_version: "الإصدار 2.0.0 (النسخة الرسمية المعتمدة لكناس)",
    about_desc: "منظومة إدارية متكاملة لتسيير الإجازات السنوية وإصدار سند العطلة الرسمي <strong>GRH.22</strong> للصندوق الوطني للتأمينات الاجتماعية للعمال الأجراء (الجمهورية الجزائرية الديمقراطية الشعبية).",
    about_org_name: "الصندوق الوطني للتأمينات الاجتماعية للعمال الأجراء",
    about_org_ar: "الصندوق الوطني للتأمينات الاجتماعية للعمال الأجراء",
    about_dg: "المديرية العامة — تسيير الموارد البشرية",

    // Director Details Modal
    modal_det_service_fr: "الهيكل / الوكالة (بالفرنسية)",
    modal_det_service_ar: "الوكالة / المصلحة (بالعربية)",
    modal_det_grade_fr: "الرتبة / الوظيفة (بالفرنسية)",
    modal_det_grade_ar: "الرتبة / الوظيفة (بالعربية)",
    modal_det_address: "عنوان المقر / المهني",
    modal_det_n1: "الرصيد المتبقي N-1",
    modal_det_annual: "الحق السنوي",
    modal_det_total: "المجموع المتاح",
    modal_det_history_title: "العطل المسجلة للمدير",
    modal_det_btn_close: "إغلاق",
    modal_det_btn_new_leave: "عطلة جديدة",

    // Delete Confirmation Modal
    modal_del_title: "تأكيد الحذف",
    modal_del_msg: "هل أنت متأكد من رغبتك في حذف هذا المدير ؟",
    modal_del_warn: "هذا الإجراء نهائي ولا يمكن التراجع عنه وسيحذف كافة السجلات المرتبطة.",
    modal_del_cancel: "إلغاء",
    modal_del_confirm: "حذف نهائي",

    // New/Edit Director Modal
    modal_emp_title_add: "إضافة مدير جديد",
    modal_emp_title_edit: "تعديل بيانات المدير",
    modal_emp_lbl_code: "رمز الولاية",
    modal_emp_lbl_agency: "الوكالة / الولاية",
    modal_emp_lbl_name_fr: "الاسم واللقب (بالفرنسية)",
    modal_emp_lbl_name_ar: "الاسم واللقب (بالعربية)",
    modal_emp_lbl_grade_fr: "الرتبة / الوظيفة (بالفرنسية)",
    modal_emp_lbl_grade_ar: "الرتبة / الوظيفة (بالعربية)",
    modal_emp_lbl_service_fr: "المصلحة / الهيكل (بالفرنسية)",
    modal_emp_lbl_service_ar: "المصلحة / المديرية (بالعربية)",
    modal_emp_lbl_address: "عنوان المقر / العنوان المهني",
    modal_emp_lbl_n1: "الرصيد المتبقي السابق N-1 (أيام)",
    modal_emp_lbl_annual: "الحق السنوي القانوني (أيام)",
    modal_emp_btn_cancel: "إلغاء",
    modal_emp_btn_save: "حفظ البيانات",

    // Leave Drawer
    drawer_title: "سند العطلة GRH.22",
    drawer_subtitle: "حساب وملء تلقائي معتمد",
    drawer_mode_full: "النموذج الكامل",
    drawer_mode_overlay: "الورق المطبوع مسبقاً",
    drawer_calc_title: "أيام العطلة المتبقية",
    drawer_calc_badge: "حساب تلقائي",
    drawer_stat_n1: "متبقي N-1",
    drawer_stat_annual: "الحق السنوي",
    drawer_stat_requested: "المطلوب",
    drawer_sec_period: "فترة ومدة العطلة",
    drawer_lbl_granted: "الأيام الممنوحة",
    drawer_lbl_dep_date: "تاريخ الذهاب",
    drawer_lbl_ret_date: "تاريخ الاستئناف المحسوب",
    drawer_lbl_leave_addr: "العنوان خلال العطلة",
    drawer_sec_agent: "معلومات المدير",
    drawer_lbl_name: "الاسم واللقب",
    drawer_lbl_grade: "الرتبة / الوظيفة",
    drawer_lbl_service: "الهيكل / الوكالة",
    drawer_lbl_address: "عنوان المقر / الشخصي",
    drawer_sec_rights: "تفاصيل الحقوق والأرصدة",
    drawer_lbl_tot_avail: "المجموع المتاح",
    drawer_sec_sign: "الإصدار والتوقيع",
    drawer_lbl_city: "حرر بـ",
    drawer_lbl_date: "في (التاريخ)",
    drawer_lbl_signatory: "صفة الممضي",
    drawer_btn_back: "العودة إلى الدليل",
    drawer_btn_print_official: "طباعة (الورق الرسمي)",
    drawer_btn_print_all: "طباعة الكل",
    drawer_btn_pdf_data: "PDF بيانات فقط",
    drawer_btn_pdf_full: "PDF كامل",
    drawer_btn_save: "حفظ وخصم الرصيد"
  }
};

function applyLanguage(lang) {
  currentAppLang = (lang === 'ar') ? 'ar' : 'fr';
  currentDocLang = currentAppLang;
  localStorage.setItem('congedesk_lang', currentAppLang);

  const isAr = (currentAppLang === 'ar');
  document.documentElement.setAttribute('lang', currentAppLang);
  document.documentElement.setAttribute('dir', isAr ? 'rtl' : 'ltr');
  document.title = isAr ? 'CongéDesk — تسيير العطل وسندات كناس GRH.22' : 'CongéDesk — Gestion des Congés CNAS GRH.22';

  const fabLang = document.getElementById('fab-lang-btn');
  if (fabLang) {
    fabLang.title = isAr ? "Passer au Français" : "التبديل إلى العربية";
  }

  // Update data-i18n text
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (i18n[currentAppLang] && i18n[currentAppLang][key] !== undefined) {
      el.textContent = i18n[currentAppLang][key];
    }
  });

  // Update data-i18n-html
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (i18n[currentAppLang] && i18n[currentAppLang][key] !== undefined) {
      el.innerHTML = i18n[currentAppLang][key];
    }
  });

  // Update placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (i18n[currentAppLang] && i18n[currentAppLang][key] !== undefined) {
      el.placeholder = i18n[currentAppLang][key];
    }
  });

  // Update Wilaya trigger label if default
  const wilayaLabel = document.getElementById('wilaya-selected-label');
  if (wilayaLabel && (!selectedWilayaCode || selectedWilayaCode === '')) {
    wilayaLabel.textContent = i18n[currentAppLang].dropdown_all_wilayas;
  }

  if (cachedWilayaList && cachedWilayaList.length > 0) {
    renderWilayaDropdownItems(cachedWilayaList);
  }

  filterAndRenderDirectors();
  if (currentView === 'home') updateHomeDashboard();
  if (currentView === 'history') renderHistoryTable();
  updateSidebarToggleIcon();
}

// ================= INITIALIZATION =================
window.addEventListener('DOMContentLoaded', async () => {
  // 1. Theme initialization
  const savedTheme = localStorage.getItem('congedesk_theme');
  currentTheme = (savedTheme === 'dark') ? 'dark' : 'light';
  applyTheme(currentTheme);

  // 2. Language initialization
  const savedLang = localStorage.getItem('congedesk_lang');
  if (savedLang === 'ar' || savedLang === 'fr') {
    currentAppLang = savedLang;
  } else {
    currentAppLang = 'fr';
  }
  applyLanguage(currentAppLang);

  // 3. Sidebar collapsed state
  const isSidebarCollapsed = localStorage.getItem('congedesk_sidebar_collapsed') === 'true';
  if (isSidebarCollapsed) {
    document.getElementById('app-sidebar')?.classList.add('collapsed');
  }
  updateSidebarToggleIcon();

  // 4. Set default dates
  const today = new Date();
  const issueDateEl = document.getElementById('f-issue-date');
  if (issueDateEl) issueDateEl.value = today.toISOString().split('T')[0];

  const nextMonday = new Date();
  nextMonday.setDate(today.getDate() + ((1 + 7 - today.getDay()) % 7 || 7));
  const depDateEl = document.getElementById('f-date-depart');
  if (depDateEl) depDateEl.value = nextMonday.toISOString().split('T')[0];

  onDateDepartInput();

  // 5. Load directors and leave history from SQLite
  await loadEmployees();
  await loadHistory();
  loadAppSettings();
  updateHomeDashboard();

  // 6. Drawer real-time inputs
  const inputs = document.querySelectorAll('.input-ctrl');
  inputs.forEach(inp => {
    inp.addEventListener('input', () => {
      recalcAndRender();
    });
  });
});

// ================= VIEW SWITCHER (PAGES) =================
function switchAppView(view) {
  currentView = view;

  // Update navigation items
  document.querySelectorAll('.sidebar-nav .nav-item, .sidebar-footer .nav-item').forEach(item => {
    item.classList.remove('active');
  });

  const activeNav = document.getElementById(`nav-${view}`);
  if (activeNav) activeNav.classList.add('active');

  // Toggle pages
  const pages = ['home', 'directors', 'history', 'settings'];
  pages.forEach(p => {
    const pageEl = document.getElementById(`page-${p}`);
    if (pageEl) {
      if (p === view) {
        pageEl.style.display = 'flex';
        pageEl.classList.add('active');
      } else {
        pageEl.style.display = 'none';
        pageEl.classList.remove('active');
      }
    }
  });

  if (view === 'home') {
    updateHomeDashboard();
  } else if (view === 'history') {
    renderHistoryTable();
  }
}

// ================= HOME DASHBOARD =================
function updateHomeDashboard() {
  const countDirectors = employees.length || 64;
  const countIssued = leaveHistory.length || 0;

  const kpiDir = document.getElementById('home-kpi-directors');
  if (kpiDir) kpiDir.textContent = countDirectors;

  const kpiIss = document.getElementById('home-kpi-issued');
  if (kpiIss) kpiIss.textContent = countIssued;

  const recentList = document.getElementById('home-recent-leaves-list');
  if (!recentList) return;

  const isAr = (currentAppLang === 'ar');
  if (leaveHistory.length === 0) {
    recentList.innerHTML = `
      <div style="padding: 24px; text-align: center; color: var(--text-dim); font-size: 13px;">
        <i class="ti ti-file-off" style="font-size: 28px; margin-bottom: 6px; display: block; color: var(--text-dim);"></i>
        ${isAr ? 'لا توجد سندات عطل صادرة مؤخراً.' : 'Aucun titre de congé émis récemment.'}
      </div>
    `;
    return;
  }

  const recents = leaveHistory.slice(0, 4);
  recentList.innerHTML = recents.map(r => `
    <div class="home-recent-item">
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="width: 36px; height: 36px; border-radius: 8px; background: rgba(37,99,235,0.12); color: var(--primary); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 13px;">
          ${r.leave_days || 0}${isAr ? 'ي' : 'j'}
        </div>
        <div>
          <strong style="font-size: 13.5px; color: var(--text-main); display: block;">${escapeHtml(r.agent_name || (isAr ? 'مدير' : 'Directeur'))}</strong>
          <span style="font-size: 11.5px; color: var(--text-dim);">${escapeHtml(r.service || '')} &bull; ${isAr ? 'من' : 'Du'} ${escapeHtml(r.dep_date || '—')} ${isAr ? 'إلى' : 'au'} ${escapeHtml(r.ret_date || '—')}</span>
        </div>
      </div>
      <button class="btn btn-sm btn-secondary" onclick="viewHistoryDoc('${r.id}')">
        <i class="ti ti-file-text"></i> ${isAr ? 'السند' : 'Titre'}
      </button>
    </div>
  `).join('');
}

function openQuickNewVacation() {
  if (employees.length > 0) {
    openLeaveDrawerFor(employees[0].id);
  } else {
    switchAppView('directors');
  }
}

// ================= LANGUAGE TOGGLE =================
function toggleAppLanguage() {
  const nextLang = (currentAppLang === 'fr') ? 'ar' : 'fr';
  applyLanguage(nextLang);
}

// ================= SIDEBAR COLLAPSE TOGGLE =================
function updateSidebarToggleIcon() {
  const sidebar = document.getElementById('app-sidebar');
  const icon = document.getElementById('sidebar-toggle-icon');
  if (!sidebar || !icon) return;
  const isCollapsed = sidebar.classList.contains('collapsed');
  const isAr = (currentAppLang === 'ar');
  if (isAr) {
    icon.className = isCollapsed 
      ? 'ti ti-layout-sidebar-right-expand' 
      : 'ti ti-layout-sidebar-right-collapse';
  } else {
    icon.className = isCollapsed 
      ? 'ti ti-layout-sidebar-left-expand' 
      : 'ti ti-layout-sidebar-left-collapse';
  }
}

function toggleSidebar() {
  const sidebar = document.getElementById('app-sidebar');
  if (!sidebar) return;

  sidebar.classList.toggle('collapsed');
  const isCollapsed = sidebar.classList.contains('collapsed');
  localStorage.setItem('congedesk_sidebar_collapsed', isCollapsed);

  updateSidebarToggleIcon();
}

// ================= SETTINGS TABS =================
function switchSettingsTab(tab) {
  currentSettingsTab = tab;

  document.querySelectorAll('.settings-tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.settings-tab-panel').forEach(panel => {
    panel.style.display = 'none';
    panel.classList.remove('active');
  });

  const activeBtn = document.getElementById(`stab-btn-${tab}`);
  if (activeBtn) activeBtn.classList.add('active');

  const activePanel = document.getElementById(`stab-panel-${tab}`);
  if (activePanel) {
    activePanel.style.display = 'block';
    activePanel.classList.add('active');
  }
}

function loadAppSettings() {
  const cfgStr = localStorage.getItem('congedesk_config');
  if (!cfgStr) return;
  try {
    const cfg = JSON.parse(cfgStr);
    if (cfg.company_name) document.getElementById('set-company-name').value = cfg.company_name;
    if (cfg.service) document.getElementById('set-service-name').value = cfg.service;
    if (cfg.city) {
      document.getElementById('set-default-city').value = cfg.city;
      document.getElementById('f-location').value = cfg.city;
    }
    if (cfg.signatory_title) {
      document.getElementById('set-signatory-title').value = cfg.signatory_title;
      document.getElementById('f-signatory').value = cfg.signatory_title;
    }
    if (cfg.signatory_name) document.getElementById('set-signatory-name').value = cfg.signatory_name;
    if (cfg.default_days) document.getElementById('set-default-days').value = cfg.default_days;
  } catch (e) {
    console.error('Error loading settings:', e);
  }
}

function saveAppSettings() {
  const cfg = {
    company_name: document.getElementById('set-company-name').value.trim(),
    service: document.getElementById('set-service-name').value.trim(),
    city: document.getElementById('set-default-city').value.trim(),
    signatory_title: document.getElementById('set-signatory-title').value.trim(),
    signatory_name: document.getElementById('set-signatory-name').value.trim(),
    default_days: Number(document.getElementById('set-default-days').value) || 30
  };

  localStorage.setItem('congedesk_config', JSON.stringify(cfg));
  document.getElementById('f-location').value = cfg.city || 'Alger';
  document.getElementById('f-signatory').value = cfg.signatory_title || 'Le Directeur Général,';

  alert('Paramètres généraux enregistrés avec succès !');
}

// ================= THEME TOGGLE =================
function toggleAppTheme() {
  currentTheme = (currentTheme === 'dark') ? 'light' : 'dark';
  localStorage.setItem('congedesk_theme', currentTheme);
  applyTheme(currentTheme);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const fabIcon = document.getElementById('fab-theme-icon');
  if (fabIcon) {
    fabIcon.className = (theme === 'dark') ? 'ti ti-sun' : 'ti ti-moon';
  }
  const sidebarIcon = document.getElementById('sidebar-theme-icon');
  if (sidebarIcon) {
    sidebarIcon.className = (theme === 'dark') ? 'ti ti-sun' : 'ti ti-moon';
  }
}

// ================= DIRECTORS DATA & WILAYA FILTER =================
async function loadEmployees() {
  if (window.electronAPI && window.electronAPI.getEmployees) {
    employees = await window.electronAPI.getEmployees();
  } else {
    employees = [];
  }

  populateWilayaFilter();
  updateKPICards();
  updateHomeDashboard();
  renderEmployeeCards(employees);
}

async function loadHistory() {
  if (window.electronAPI && window.electronAPI.getLeaveHistory) {
    leaveHistory = await window.electronAPI.getLeaveHistory();
    const issuedEl = document.getElementById('kpi-issued-titles');
    if (issuedEl) issuedEl.textContent = leaveHistory.length;
    updateHomeDashboard();
  }
}

function updateKPICards() {
  const totalCount = employees.length;
  const countEl = document.getElementById('kpi-total-employees');
  if (countEl) countEl.textContent = totalCount;

  const badgeText = document.getElementById('directors-count-text');
  if (badgeText) badgeText.textContent = `${totalCount} Directeurs`;

  const totalReserve = employees.reduce((acc, e) => acc + (parseFloat(e.prev_balance) || 0), 0);
  const reserveEl = document.getElementById('kpi-total-reserve');
  if (reserveEl) reserveEl.textContent = `${totalReserve} j`;
}

let selectedWilayaCode = '';
let cachedWilayaList = [];

function toggleWilayaDropdown(event) {
  if (event) event.stopPropagation();
  const dropdown = document.getElementById('wilaya-dropdown');
  const menu = document.getElementById('wilaya-dropdown-menu');
  if (!dropdown || !menu) return;

  const isOpen = dropdown.classList.contains('open');
  if (isOpen) {
    closeWilayaDropdown();
  } else {
    dropdown.classList.add('open');
    menu.style.display = 'block';
    const searchInput = document.getElementById('wilaya-dropdown-search');
    if (searchInput) {
      searchInput.value = '';
      setTimeout(() => searchInput.focus(), 60);
      filterWilayaDropdownList('');
    }
  }
}

function closeWilayaDropdown() {
  const dropdown = document.getElementById('wilaya-dropdown');
  const menu = document.getElementById('wilaya-dropdown-menu');
  if (dropdown) dropdown.classList.remove('open');
  if (menu) menu.style.display = 'none';
}

// Global click to close dropdown when clicking outside
document.addEventListener('click', (e) => {
  const dropdown = document.getElementById('wilaya-dropdown');
  if (dropdown && !dropdown.contains(e.target)) {
    closeWilayaDropdown();
  }
});

function populateWilayaFilter() {
  const select = document.getElementById('wilaya-filter-select');
  if (select) {
    select.innerHTML = '<option value="">Toutes les Wilayas & Établissements</option>';
  }

  // Group wilayas/agencies
  const wilayaList = [];
  employees.forEach(e => {
    if (e.code_wilaya && e.agency) {
      if (!wilayaList.some(w => w.code === e.code_wilaya)) {
        wilayaList.push({ code: e.code_wilaya, label: `${e.code_wilaya} - ${e.agency}` });
      }
    } else if (e.agency) {
      if (!wilayaList.some(w => w.label === e.agency)) {
        wilayaList.push({ code: e.agency, label: e.agency });
      }
    }
  });

  wilayaList.sort((a, b) => {
    const na = parseInt(a.code, 10);
    const nb = parseInt(b.code, 10);
    if (!isNaN(na) && !isNaN(nb)) return na - nb;
    return a.label.localeCompare(b.label);
  });

  cachedWilayaList = wilayaList;

  if (select) {
    wilayaList.forEach(w => {
      const opt = document.createElement('option');
      opt.value = w.code;
      opt.textContent = w.label;
      select.appendChild(opt);
    });
  }

  renderWilayaDropdownItems(cachedWilayaList);
}

function renderWilayaDropdownItems(items) {
  const container = document.getElementById('wilaya-dropdown-items');
  if (!container) return;

  const isAr = (currentAppLang === 'ar');
  const allLabel = isAr ? 'جميع الولايات والمؤسسات' : 'Toutes les Wilayas & Établissements';

  let html = `
    <div class="dropdown-item ${!selectedWilayaCode ? 'active' : ''}" onclick="selectWilayaDropdownItem('', '${escapeJsStr(allLabel)}')">
      <div class="dropdown-item-badge"><i class="ti ti-world"></i></div>
      <span class="dropdown-item-name">${escapeHtml(allLabel)}</span>
      ${!selectedWilayaCode ? '<i class="ti ti-check dropdown-item-check"></i>' : ''}
    </div>
  `;

  items.forEach(w => {
    const isActive = (selectedWilayaCode === w.code);
    const badgeText = w.code.length <= 4 ? w.code : 'DG';
    html += `
      <div class="dropdown-item ${isActive ? 'active' : ''}" onclick="selectWilayaDropdownItem('${escapeHtml(w.code)}', '${escapeJsStr(w.label)}')">
        <div class="dropdown-item-badge">${escapeHtml(badgeText)}</div>
        <span class="dropdown-item-name">${escapeHtml(w.label)}</span>
        ${isActive ? '<i class="ti ti-check dropdown-item-check"></i>' : ''}
      </div>
    `;
  });

  container.innerHTML = html;
}

function onWilayaDropdownSearch(event) {
  const query = (event.target.value || '').toLowerCase().trim();
  filterWilayaDropdownList(query);
}

function filterWilayaDropdownList(query) {
  if (!query) {
    renderWilayaDropdownItems(cachedWilayaList);
    return;
  }
  const filtered = cachedWilayaList.filter(w => 
    w.code.toLowerCase().includes(query) || w.label.toLowerCase().includes(query)
  );
  renderWilayaDropdownItems(filtered);
}

function selectWilayaDropdownItem(code, label) {
  selectedWilayaCode = code;
  const labelEl = document.getElementById('wilaya-selected-label');
  if (labelEl) labelEl.textContent = label;

  const select = document.getElementById('wilaya-filter-select');
  if (select) select.value = code;

  closeWilayaDropdown();
  renderWilayaDropdownItems(cachedWilayaList);
  filterAndRenderDirectors();
}

function onWilayaFilterChange() {
  filterAndRenderDirectors();
}

function onSearchInput() {
  const clearBtn = document.getElementById('search-clear-btn');
  const query = document.getElementById('search-employee-input').value.trim();
  if (clearBtn) {
    clearBtn.style.display = query ? 'block' : 'none';
  }
  filterAndRenderDirectors();
}

function clearSearchInput() {
  const input = document.getElementById('search-employee-input');
  if (input) input.value = '';
  const clearBtn = document.getElementById('search-clear-btn');
  if (clearBtn) clearBtn.style.display = 'none';
  filterAndRenderDirectors();
}

function filterAndRenderDirectors() {
  const query = (document.getElementById('search-employee-input')?.value || '').toLowerCase().trim();
  const selectedWilaya = selectedWilayaCode || (document.getElementById('wilaya-filter-select')?.value || '');

  const filtered = employees.filter(e => {
    // Match wilaya code
    if (selectedWilaya) {
      const matchWilaya = (e.code_wilaya === selectedWilaya) || (e.agency === selectedWilaya);
      if (!matchWilaya) return false;
    }

    if (!query) return true;

    return (e.name_fr && e.name_fr.toLowerCase().includes(query)) ||
           (e.name_ar && e.name_ar.toLowerCase().includes(query)) ||
           (e.agency && e.agency.toLowerCase().includes(query)) ||
           (e.code_wilaya && e.code_wilaya.includes(query)) ||
           (e.service_fr && e.service_fr.toLowerCase().includes(query)) ||
           (e.grade_fr && e.grade_fr.toLowerCase().includes(query));
  });

  renderEmployeeCards(filtered);
}

// ================= MINIMAL DIRECTOR CARDS RENDERING =================
function renderEmployeeCards(list) {
  const container = document.getElementById('employee-cards-container');
  if (!container) return;
  container.innerHTML = '';

  const isAr = (currentAppLang === 'ar');
  const badgeText = document.getElementById('directors-count-text');
  if (badgeText) {
    badgeText.textContent = isAr ? `${list.length} مديراً` : `${list.length} Directeur${list.length > 1 ? 's' : ''}`;
  }

  if (list.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-dim); background: var(--glass-card); border: 1px dashed var(--glass-border-subtle); border-radius: var(--radius-xl);">
        <i class="ti ti-user-x" style="font-size: 38px; margin-bottom: 12px; display: block; color: var(--text-dim);"></i>
        <span style="font-size: 15px; font-weight: 700; display: block; margin-bottom: 8px;">${isAr ? 'لم يتم العثور على أي مدير' : 'Aucun directeur trouvé'}</span>
        <p style="font-size: 13px; color: var(--text-dim); margin-bottom: 16px;">${isAr ? 'يرجى التحقق من عبارات البحث أو إعادة ضبط تصفية الولاية.' : 'Vérifiez vos termes de recherche ou réinitialisez le filtre de wilaya.'}</p>
        <button class="btn btn-secondary" onclick="resetToCNASDirectors()"><i class="ti ti-refresh"></i> ${isAr ? 'إعادة تحميل قائمة كناس' : 'Recharger la liste CNAS'}</button>
      </div>
    `;
    return;
  }

  list.forEach(emp => {
    const card = document.createElement('div');
    card.className = 'director-card';

    const wilayaDisplay = emp.code_wilaya ? emp.code_wilaya : 'DG';
    const prevBal = parseFloat(emp.prev_balance) || 0;
    const annual = parseFloat(emp.annual_entitlement) || 30;
    const totalAvail = prevBal + annual;

    const displayName = isAr ? (emp.name_ar || emp.name_fr) : (emp.name_fr || emp.name_ar);
    const displayService = isAr ? (emp.service_ar || emp.service_fr || emp.agency) : (emp.service_fr || emp.agency || 'Direction');
    const displayGrade = isAr ? (emp.grade_ar || emp.grade_fr || 'مدير وكالة كناس الولائية') : (emp.grade_fr || "Directeur d'Agence de Wilaya");
    const statText = isAr ? 'يوماً متاحاً' : 'jours disponibles';
    const btnText = isAr ? 'عطلة جديدة' : 'Nouveau Congé';
    const titleDetails = isAr ? 'تفاصيل وبيانات المدير' : 'Détails du Directeur';
    const titleEdit = isAr ? 'تعديل' : 'Modifier';
    const titleDel = isAr ? 'حذف' : 'Supprimer';

    card.innerHTML = `
      <!-- Card Header: Wilaya, Name, Agency, Action Icons -->
      <div class="director-card-header">
        <div class="director-avatar-box">
          <span class="wilaya-num">${escapeHtml(wilayaDisplay)}</span>
        </div>
        <div class="director-info">
          <h3 class="director-name" title="${escapeHtml(displayName)}">${escapeHtml(displayName)}</h3>
          <span class="director-agency" title="${escapeHtml(displayService)}">
            ${escapeHtml(displayService)}
          </span>
        </div>
        <div class="director-card-actions">
          <button class="btn-card-icon" onclick="openDirectorDetailsModal('${emp.id}')" title="${titleDetails}">
            <i class="ti ti-eye"></i>
          </button>
          <button class="btn-card-icon" onclick="openEditDirectorModal('${emp.id}')" title="${titleEdit}">
            <i class="ti ti-edit"></i>
          </button>
          <button class="btn-card-icon btn-card-delete" onclick="promptDeleteDirector('${emp.id}', '${escapeJsStr(displayName)}', '${escapeJsStr(displayService)}')" title="${titleDel}">
            <i class="ti ti-trash"></i>
          </button>
        </div>
      </div>

      <!-- Card Body: Vacation Days & Grade -->
      <div class="director-card-body">
        <div class="director-stat-pill">
          <span class="stat-num">${totalAvail}</span>
          <span class="stat-text">${statText}</span>
        </div>
        <span class="director-grade-tag" title="${escapeHtml(displayGrade)}">
          ${escapeHtml(displayGrade)}
        </span>
      </div>

      <!-- Card Footer: Text Button with Certificate Icon for Adding Vacation -->
      <div class="director-card-footer">
        <button class="btn-vacation-text" onclick="openLeaveDrawerFor('${emp.id}')">
          <i class="ti ti-file-certificate"></i> ${btnText}
        </button>
      </div>
    `;

    container.appendChild(card);
  });
}

// ================= MODAL: DIRECTOR DETAILS =================
function openDirectorDetailsModal(dirId) {
  const dir = employees.find(e => e.id === dirId);
  if (!dir) return;

  activeEmployee = dir;

  document.getElementById('det-wilaya-badge').textContent = dir.code_wilaya || 'CNAS';
  document.getElementById('det-name-fr').textContent = dir.name_fr || '—';
  document.getElementById('det-name-ar').textContent = dir.name_ar || '—';

  document.getElementById('det-service-fr').textContent = dir.service_fr || dir.agency || '—';
  document.getElementById('det-service-ar').textContent = dir.service_ar || '—';

  document.getElementById('det-grade-fr').textContent = dir.grade_fr || 'Directeur';
  document.getElementById('det-grade-ar').textContent = dir.grade_ar || 'مدير';

  document.getElementById('det-address-fr').textContent = dir.address_fr || '—';

  const prev = parseFloat(dir.prev_balance) || 0;
  const annual = parseFloat(dir.annual_entitlement) || 30;
  document.getElementById('det-prev-balance').textContent = `${prev} j`;
  document.getElementById('det-annual-quota').textContent = `${annual} j`;
  document.getElementById('det-total-balance').textContent = `${prev + annual} j`;

  // Render recent leaves for this director
  const leavesList = document.getElementById('det-leaves-list');
  const dirLeaves = leaveHistory.filter(r => r.employee_id === dirId || r.agent_name === dir.name_fr);

  if (dirLeaves.length === 0) {
    leavesList.innerHTML = `<span style="font-size: 12px; color: var(--text-dim); display: block; padding: 8px;">Aucun congé enregistré pour ce directeur.</span>`;
  } else {
    leavesList.innerHTML = dirLeaves.map(l => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 8px; border-bottom: 1px solid var(--glass-border-subtle); font-size: 12px;">
        <span><strong>${l.leave_days} jours</strong> (${l.dep_date || '—'} au ${l.ret_date || '—'})</span>
        <span style="color: var(--text-dim); font-size: 11px;">Émis le ${l.date || l.timestamp?.split('T')[0] || ''}</span>
      </div>
    `).join('');
  }

  document.getElementById('director-details-modal').style.display = 'flex';
}

function closeDirectorDetailsModal() {
  document.getElementById('director-details-modal').style.display = 'none';
}

function startVacationFromDetails() {
  if (activeEmployee) {
    closeDirectorDetailsModal();
    openLeaveDrawerFor(activeEmployee.id);
  }
}

// ================= MODAL: DELETE CONFIRMATION =================
function promptDeleteDirector(id, name, agency) {
  directorToDeleteId = id;
  const isAr = (currentAppLang === 'ar');
  const msgEl = document.getElementById('delete-confirm-message');
  if (msgEl) {
    msgEl.innerHTML = isAr
      ? `هل أنت متأكد من رغبتك في حذف المدير <strong>${escapeHtml(name)}</strong> ${agency ? `(${escapeHtml(agency)})` : ''} نهائياً من قاعدة البيانات ؟`
      : `Êtes-vous sûr de vouloir supprimer définitivement le directeur <strong>${escapeHtml(name)}</strong> ${agency ? `(${escapeHtml(agency)})` : ''} de la base de données ?`;
  }
  document.getElementById('delete-confirm-modal').style.display = 'flex';
}

function closeDeleteConfirmModal() {
  directorToDeleteId = null;
  document.getElementById('delete-confirm-modal').style.display = 'none';
}

async function executeConfirmedDelete() {
  if (!directorToDeleteId) return;

  if (window.electronAPI && window.electronAPI.deleteEmployee) {
    await window.electronAPI.deleteEmployee(directorToDeleteId);
  }

  employees = employees.filter(e => e.id !== directorToDeleteId);
  closeDeleteConfirmModal();
  updateKPICards();
  filterAndRenderDirectors();
}

// ================= MODAL: ADD / EDIT DIRECTOR =================
function openNewEmployeeModal() {
  const isAr = (currentAppLang === 'ar');
  document.getElementById('modal-director-title').innerHTML = `
    <i class="ti ti-user-plus" style="color: var(--primary);"></i> <span>${isAr ? 'إضافة مدير جديد' : 'Ajouter un Nouveau Directeur'}</span>
  `;
  const saveText = document.getElementById('btn-save-new-director-text');
  if (saveText) saveText.textContent = isAr ? 'حفظ' : 'Enregistrer';
  const cancelBtn = document.getElementById('btn-cancel-new-director');
  if (cancelBtn) cancelBtn.textContent = isAr ? 'إلغاء' : 'Annuler';

  document.getElementById('m-director-id').value = '';
  document.getElementById('m-code-wilaya').value = '';
  document.getElementById('m-agency').value = '';
  document.getElementById('m-name-fr').value = '';
  document.getElementById('m-name-ar').value = '';
  document.getElementById('m-grade-fr').value = "Directeur d'Agence de Wilaya";
  document.getElementById('m-grade-ar').value = "مدير وكالة كناس الولائية";
  document.getElementById('m-service-fr').value = '';
  document.getElementById('m-service-ar').value = '';
  document.getElementById('m-address-fr').value = '';
  document.getElementById('m-prev-balance').value = '0';
  document.getElementById('m-annual-entitlement').value = '30';

  document.getElementById('employee-modal').style.display = 'flex';
}

function openEditDirectorModal(dirId) {
  const dir = employees.find(e => e.id === dirId);
  if (!dir) return;

  const isAr = (currentAppLang === 'ar');
  document.getElementById('modal-director-title').innerHTML = `
    <i class="ti ti-edit" style="color: var(--primary);"></i> <span>${isAr ? 'تعديل بيانات ومعلومات المدير' : 'Modifier les Informations du Directeur'}</span>
  `;
  const saveText = document.getElementById('btn-save-new-director-text');
  if (saveText) saveText.textContent = isAr ? 'حفظ التعديلات' : 'Enregistrer';
  const cancelBtn = document.getElementById('btn-cancel-new-director');
  if (cancelBtn) cancelBtn.textContent = isAr ? 'إلغاء' : 'Annuler';

  document.getElementById('m-director-id').value = dir.id;
  document.getElementById('m-code-wilaya').value = dir.code_wilaya || '';
  document.getElementById('m-agency').value = dir.agency || '';
  document.getElementById('m-name-fr').value = dir.name_fr || '';
  document.getElementById('m-name-ar').value = dir.name_ar || '';
  document.getElementById('m-grade-fr').value = dir.grade_fr || "Directeur d'Agence de Wilaya";
  document.getElementById('m-grade-ar').value = dir.grade_ar || "مدير وكالة كناس الولائية";
  document.getElementById('m-service-fr').value = dir.service_fr || '';
  document.getElementById('m-service-ar').value = dir.service_ar || '';
  document.getElementById('m-address-fr').value = dir.address_fr || '';
  document.getElementById('m-prev-balance').value = dir.prev_balance ?? 0;
  document.getElementById('m-annual-entitlement').value = dir.annual_entitlement ?? 30;

  document.getElementById('employee-modal').style.display = 'flex';
}

function closeNewEmployeeModal() {
  document.getElementById('employee-modal').style.display = 'none';
}

async function submitNewEmployee() {
  const id = document.getElementById('m-director-id').value.trim() || ('dir_' + Date.now());
  const nameFr = document.getElementById('m-name-fr').value.trim();
  const nameAr = document.getElementById('m-name-ar').value.trim();

  if (!nameFr && !nameAr) {
    alert("Veuillez renseigner au moins le nom du directeur en français ou en arabe.");
    return;
  }

  const codeWilaya = document.getElementById('m-code-wilaya').value.trim();
  const agency = document.getElementById('m-agency').value.trim();

  const directorData = {
    id,
    code_wilaya: codeWilaya,
    agency: agency,
    name_fr: nameFr || nameAr,
    name_ar: nameAr || nameFr,
    grade_fr: document.getElementById('m-grade-fr').value.trim() || "Directeur d'Agence",
    grade_ar: document.getElementById('m-grade-ar').value.trim() || "مدير وكالة",
    service_fr: document.getElementById('m-service-fr').value.trim() || (agency ? `Agence CNAS de ${agency}` : 'Direction'),
    service_ar: document.getElementById('m-service-ar').value.trim() || (agency ? `وكالة كناس ${agency}` : 'المديرية'),
    address_fr: document.getElementById('m-address-fr').value.trim() || '',
    address_ar: document.getElementById('m-address-fr').value.trim() || '',
    prev_balance: parseFloat(document.getElementById('m-prev-balance').value) || 0,
    annual_entitlement: parseFloat(document.getElementById('m-annual-entitlement').value) || 30
  };

  if (window.electronAPI && window.electronAPI.saveEmployee) {
    await window.electronAPI.saveEmployee(directorData);
  }

  closeNewEmployeeModal();
  await loadEmployees();
}

// ================= RESET DIRECTORS FROM DATA.XLSX =================
async function resetToCNASDirectors() {
  if (!confirm("Voulez-vous recharger la liste officielle des 64 Directeurs d'Agences et Établissements CNAS depuis data.xlsx ?")) {
    return;
  }

  if (window.electronAPI && window.electronAPI.seedDirectorsData) {
    const res = await window.electronAPI.seedDirectorsData();
    if (res && res.success) {
      await loadEmployees();
      alert("Liste officielle des 64 directeurs CNAS synchronisée avec succès !");
    } else {
      alert("Erreur lors de la synchronisation: " + (res?.error || "Inconnue"));
    }
  }
}

// ================= HISTORY HUB =================
function renderHistoryTable() {
  const tbody = document.getElementById('history-records-body');
  const emptyState = document.getElementById('history-empty-state');
  if (!tbody) return;

  if (leaveHistory.length === 0) {
    tbody.innerHTML = '';
    if (emptyState) emptyState.style.display = 'flex';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  const isAr = (currentAppLang === 'ar');
  tbody.innerHTML = leaveHistory.map(rec => `
    <tr>
      <td>${escapeHtml(rec.date || rec.timestamp?.split('T')[0] || '—')}</td>
      <td><strong>${escapeHtml(rec.agent_name || '—')}</strong></td>
      <td>${escapeHtml(rec.service || '—')}</td>
      <td>${isAr ? 'من' : 'Du'} <strong>${escapeHtml(rec.dep_date || '—')}</strong> ${isAr ? 'إلى' : 'au'} <strong>${escapeHtml(rec.ret_date || '—')}</strong></td>
      <td><span style="font-weight: 800; color: var(--primary);">${rec.leave_days || 0} ${isAr ? 'ي' : 'j'}</span></td>
      <td>${rec.new_balance ?? '—'} ${isAr ? 'ي' : 'j'}</td>
      <td>
        <button class="btn btn-sm btn-secondary" onclick="viewHistoryDoc('${rec.id}')" title="${isAr ? 'معاينة وإعادة طباعة' : 'Ré-éditer'}">
          <i class="ti ti-file-text"></i> ${isAr ? 'السند' : 'Titre'}
        </button>
      </td>
    </tr>
  `).join('');
}

function viewHistoryDoc(recId) {
  const rec = leaveHistory.find(r => r.id === recId);
  if (!rec) return;

  // Find director or create temporary active director
  const dir = employees.find(e => e.id === rec.employee_id) || {
    id: rec.employee_id || 'temp',
    name_fr: rec.agent_name,
    name_ar: rec.agent_name,
    grade_fr: rec.grade,
    grade_ar: rec.grade,
    service_fr: rec.service,
    service_ar: rec.service,
    address_fr: rec.leave_address,
    prev_balance: rec.prev_balance,
    annual_entitlement: rec.cur_entitlement
  };

  openLeaveDrawerFor(dir.id);

  // Overwrite form fields with saved record data
  if (rec.leave_days) document.getElementById('f-leave-days').value = rec.leave_days;
  if (rec.dep_date) document.getElementById('f-date-depart').value = rec.dep_date;
  if (rec.ret_date) document.getElementById('f-date-retour').value = rec.ret_date;
  if (rec.leave_address) document.getElementById('f-leave-address').value = rec.leave_address;
  if (rec.location) document.getElementById('f-location').value = rec.location;

  recalcAndRender();
}

async function confirmClearHistory() {
  if (!confirm("Attention : Voulez-vous vraiment effacer tout le registre des congés émis ?")) return;

  if (window.electronAPI && window.electronAPI.clearAllData) {
    await window.electronAPI.clearAllData();
    // Re-seed directors so they don't get lost
    if (window.electronAPI.seedDirectorsData) {
      await window.electronAPI.seedDirectorsData();
    }
    await loadEmployees();
    await loadHistory();
    renderHistoryTable();
    alert("Registre des congés vidé avec succès.");
  }
}

function exportHistoryCSV() {
  if (leaveHistory.length === 0) {
    alert("Aucun titre dans l'historique à exporter.");
    return;
  }

  let csv = "ID,Date Emission,Directeur,Structure,Grade,Jours Conge,Date Depart,Date Retour,Adresse Conge,Nouveau Solde\n";
  leaveHistory.forEach(r => {
    csv += `"${r.id}","${r.date || ''}","${r.agent_name || ''}","${r.service || ''}","${r.grade || ''}",${r.leave_days || 0},"${r.dep_date || ''}","${r.ret_date || ''}","${r.leave_address || ''}",${r.new_balance || 0}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `CNAS_Historique_Conges_Directeurs_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ================= SLIDE-OVER DRAWER & LEAVE CALCULATOR =================
function openLeaveDrawerFor(empId) {
  activeEmployee = employees.find(e => e.id === empId);
  if (!activeEmployee) return;

  currentDocLang = 'fr'; // default page 1 is French

  const empName = activeEmployee.name_fr || activeEmployee.name_ar;
  const empRole = activeEmployee.grade_fr || activeEmployee.grade_ar;

  document.getElementById('drawer-agent-title').textContent = `${empName} - GRH.22`;
  document.getElementById('drawer-agent-subtitle').textContent = `${empRole} — ${activeEmployee.service_fr || activeEmployee.agency || ''}`;

  populateFormWithEmployee(activeEmployee);
  recalcAndRender();

  document.getElementById('leave-drawer').classList.add('open');
}

function closeLeaveDrawer() {
  document.getElementById('leave-drawer').classList.remove('open');
}

function populateFormWithEmployee(emp) {
  const isAr = (currentDocLang === 'ar');
  document.getElementById('f-agent-name').value = isAr ? (emp.name_ar || emp.name_fr) : (emp.name_fr || emp.name_ar);
  document.getElementById('f-grade').value = isAr ? (emp.grade_ar || emp.grade_fr) : (emp.grade_fr || emp.grade_ar);
  document.getElementById('f-service').value = isAr ? (emp.service_ar || emp.service_fr) : (emp.service_fr || emp.service_ar);
  document.getElementById('f-address').value = isAr ? (emp.address_ar || emp.address_fr) : (emp.address_fr || emp.address_ar);

  document.getElementById('f-prev-balance').value = emp.prev_balance ?? 0;
  document.getElementById('f-annual-entitlement').value = emp.annual_entitlement ?? 30;

  if (!document.getElementById('f-leave-days').value) {
    document.getElementById('f-leave-days').value = '30';
  }
}

function setDrawerLanguage(lang) {
  currentDocLang = lang;

  const btnFr = document.getElementById('btn-tab-fr');
  const btnAr = document.getElementById('btn-tab-ar');

  if (lang === 'ar') {
    btnFr?.classList.remove('active');
    btnAr?.classList.add('active');
    document.getElementById('preview-page-pill').textContent = "ص 2 : العربية (بيان العطلة السنوية)";
  } else {
    btnFr?.classList.add('active');
    btnAr?.classList.remove('active');
    document.getElementById('preview-page-pill').textContent = "Page 1 : Français (TITRE DE CONGÉ)";
  }

  if (activeEmployee) {
    const isAr = (lang === 'ar');
    document.getElementById('f-agent-name').value = isAr ? (activeEmployee.name_ar || activeEmployee.name_fr) : (activeEmployee.name_fr || activeEmployee.name_ar);
    document.getElementById('f-grade').value = isAr ? (activeEmployee.grade_ar || activeEmployee.grade_fr) : (activeEmployee.grade_fr || activeEmployee.grade_ar);
    document.getElementById('f-service').value = isAr ? (activeEmployee.service_ar || activeEmployee.service_fr) : (activeEmployee.service_fr || activeEmployee.service_ar);
    document.getElementById('f-address').value = isAr ? (activeEmployee.address_ar || activeEmployee.address_fr) : (activeEmployee.address_fr || activeEmployee.address_ar);
  }

  recalcAndRender();
}

function setDocumentPrintMode(isOverlay) {
  isPreviewDataOnly = isOverlay;

  const btnFull = document.getElementById('drawer-mode-full');
  const btnOverlay = document.getElementById('drawer-mode-overlay');

  if (isOverlay) {
    btnFull?.classList.remove('active');
    btnOverlay?.classList.add('active');
  } else {
    btnFull?.classList.add('active');
    btnOverlay?.classList.remove('active');
  }

  renderDocumentSheet();
}

function onLeaveDaysInput() {
  const days = parseInt(document.getElementById('f-leave-days').value, 10) || 0;
  const depStr = document.getElementById('f-date-depart').value;

  if (depStr && days > 0) {
    const depDate = new Date(depStr);
    const retDate = new Date(depDate);
    retDate.setDate(retDate.getDate() + days);
    document.getElementById('f-date-retour').value = retDate.toISOString().split('T')[0];
  }

  recalcAndRender();
}

function onDateDepartInput() {
  const depStr = document.getElementById('f-date-depart').value;
  const days = parseInt(document.getElementById('f-leave-days').value, 10) || 30;

  if (depStr) {
    const depDate = new Date(depStr);
    const retDate = new Date(depDate);
    retDate.setDate(retDate.getDate() + days);
    document.getElementById('f-date-retour').value = retDate.toISOString().split('T')[0];
  }

  recalcAndRender();
}

function onDateRetourInput() {
  const depStr = document.getElementById('f-date-depart').value;
  const retStr = document.getElementById('f-date-retour').value;

  if (depStr && retStr) {
    const d1 = new Date(depStr);
    const d2 = new Date(retStr);
    const diffTime = d2.getTime() - d1.getTime();
    const diffDays = Math.round(diffTime / (1000 * 3600 * 24));
    if (diffDays > 0) {
      document.getElementById('f-leave-days').value = diffDays;
    }
  }

  recalcAndRender();
}

function applyPreset(days) {
  document.getElementById('f-leave-days').value = days;
  onLeaveDaysInput();
}

function recalcAndRender() {
  const prevBal = parseFloat(document.getElementById('f-prev-balance').value) || 0;
  const annual = parseFloat(document.getElementById('f-annual-entitlement').value) || 30;
  const requested = parseFloat(document.getElementById('f-leave-days').value) || 0;

  const totalAvail = prevBal + annual;
  document.getElementById('f-total-entitlement').value = totalAvail;

  const daysLeft = totalAvail - requested;
  const isAr = (currentAppLang === 'ar');

  // Update calculator hero card in drawer
  document.getElementById('calc-days-left').textContent = isAr ? `${daysLeft} يوماً` : `${daysLeft} jours`;
  document.getElementById('calc-days-left-sub').textContent = isAr 
    ? `متبقية من إجمالي ${totalAvail} يوماً من الحقوق المتاحة` 
    : `restants sur ${totalAvail} jours de droit total`;
  document.getElementById('stat-n1').textContent = isAr ? `${prevBal} ي` : `${prevBal} j`;
  document.getElementById('stat-annual').textContent = isAr ? `${annual} ي` : `${annual} j`;
  document.getElementById('stat-requested').textContent = isAr ? `${requested} ي` : `${requested} j`;

  const alertBanner = document.getElementById('calc-alert-banner');
  const alertIcon = document.getElementById('calc-alert-icon');
  const alertText = document.getElementById('calc-alert-text');

  if (daysLeft > 0) {
    alertBanner.className = 'calc-alert ok';
    alertIcon.className = 'ti ti-circle-check';
    alertText.textContent = isAr 
      ? `رصيد كافٍ. سيحتفظ المدير بـ ${daysLeft} يوماً كاحتياطي بعد هذه العطلة.`
      : `Solde suffisant. Le directeur conservera ${daysLeft} jours en réserve après ce congé.`;
  } else if (daysLeft === 0) {
    alertBanner.className = 'calc-alert ok';
    alertIcon.className = 'ti ti-circle-check';
    alertText.textContent = isAr
      ? `رصيد مستهلك بالكامل. استنفد المدير كامل حقوقه السنوية (0 يوم متبقٍ).`
      : `Solde entièrement utilisé. Le directeur utilise la totalité de ses droits (0 jour restant).`;
  } else {
    alertBanner.className = 'calc-alert danger';
    alertIcon.className = 'ti ti-alert-triangle';
    alertText.textContent = isAr
      ? `تنبيه تجاوز الرصيد ! العطلة المطلوبة (${requested} يوماً) تتجاوز الحقوق المتاحة (${totalAvail} يوماً) بـ ${Math.abs(daysLeft)} يوم.`
      : `Attention dépassement ! Le congé demandé (${requested}j) dépasse les droits disponibles (${totalAvail}j) de ${Math.abs(daysLeft)} jour(s).`;
  }

  renderDocumentSheet();
}

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
  const annual = parseFloat(document.getElementById('f-annual-entitlement').value) || 30;
  const requested = parseFloat(document.getElementById('f-leave-days').value) || 0;
  const totalAvail = prevBal + annual;
  const daysLeft = totalAvail - requested;

  const depStr = document.getElementById('f-date-depart').value;
  const retStr = document.getElementById('f-date-retour').value;
  const issueDateStr = document.getElementById('f-issue-date').value;

  const fullAddress = document.getElementById('f-address').value || '';
  let addressLine1 = fullAddress;
  let addressLine2 = '';
  if (fullAddress.length > 55) {
    const breakIdx = fullAddress.lastIndexOf(' ', 50);
    if (breakIdx > 20) {
      addressLine1 = fullAddress.slice(0, breakIdx);
      addressLine2 = fullAddress.slice(breakIdx + 1);
    }
  }

  return {
    employeeId: activeEmployee ? activeEmployee.id : null,
    agent_name: document.getElementById('f-agent-name').value || '',
    grade: document.getElementById('f-grade').value || '',
    service: document.getElementById('f-service').value || '',
    address_line_1: addressLine1,
    address_line_2: addressLine2,
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

// Render the live document sheet inside drawer
function renderDocumentSheet() {
  const container = document.getElementById('drawer-paper-container');
  if (!container) return;

  const isAr = (currentDocLang === 'ar');
  const data = getFormData();
  const html = buildSheetHTML(data, isAr, isPreviewDataOnly);
  container.innerHTML = html;

  const sheet = container.querySelector('.document-page');
  if (sheet) {
    sheet.style.transform = `scale(${currentZoom})`;
  }
}

function buildSheetHTML(data, isAr, overlayMode) {
  const langClass = isAr ? 'lang-ar' : 'lang-fr';
  const modeClass = overlayMode ? 'mode-preprinted' : 'mode-full';

  return `
    <div class="document-page ${langClass} ${modeClass}">
      <div class="data-layer">
        <!-- Nom et prénom de l'agent -->
        <div class="field-item field-agent-name">${escapeHtml(data.agent_name || '')}</div>

        <!-- Grade ou fonction -->
        <div class="field-item field-grade">${escapeHtml(data.grade || '')}</div>

        <!-- Service -->
        <div class="field-item field-service">${escapeHtml(data.service || '')}</div>

        <!-- Adresse -->
        <div class="field-item field-address-1">${escapeHtml(data.address_line_1 || '')}</div>
        ${data.address_line_2 ? `<div class="field-item field-address-2">${escapeHtml(data.address_line_2)}</div>` : ''}

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
        <div class="field-item field-leave-address">${escapeHtml(data.leave_address || '')}</div>

        <!-- Fait à ... Le ... -->
        <div class="field-item field-location">${escapeHtml(data.location || '')}</div>
        <div class="field-item field-date">${escapeHtml(data.date || '')}</div>

        <!-- Le Directeur -->
        <div class="field-item field-signatory">${escapeHtml(data.director || '')}</div>

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

// Generate print / PDF HTML with transparent coordinates
function generatePrintHTML(dataOnly = false) {
  const isAr = (currentDocLang === 'ar');
  const data = getFormData();
  const content = buildSheetHTML(data, isAr, dataOnly);

  const bgDataUri = (!dataOnly && typeof TEMPLATE_IMAGES !== 'undefined')
    ? (isAr ? TEMPLATE_IMAGES.ar : TEMPLATE_IMAGES.fr)
    : null;

  return `<!DOCTYPE html>
<html lang="${isAr ? 'ar' : 'fr'}" dir="${isAr ? 'rtl' : 'ltr'}">
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap" rel="stylesheet">
  <style>
    @page { size: A4; margin: 0; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: ${dataOnly ? 'transparent' : '#ffffff'};
      margin: 0; padding: 0;
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
    .data-layer {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      pointer-events: none;
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
    .document-page:not(.mode-preprinted) .field-item:not(.field-leave-days) {
      background: #ffffff;
      padding: 0 3px;
      border-radius: 2px;
    }
    .document-page .field-leave-days,
    .document-page .date-group .cell {
      background: transparent !important;
      padding: 0 !important;
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
    .lang-ar .field-leave-days { top: 46.2%; right: 28.0%; width: 7.5%; text-align: center; font-size: 15px; font-weight: 800; }
    .lang-ar .group-dep { top: 50.4%; width: 100%; right: 0; left: auto; }
    .lang-ar .group-ret { top: 53.8%; width: 100%; right: 0; left: auto; }
    .lang-ar .cell-d1 { left: 52.5%; width: 3.2%; text-align: center; font-size: 13.5px; }
    .lang-ar .cell-d2 { left: 55.7%; width: 3.3%; text-align: center; font-size: 13.5px; }
    .lang-ar .cell-m1 { left: 59.0%; width: 3.5%; text-align: center; font-size: 13.5px; }
    .lang-ar .cell-m2 { left: 62.5%; width: 3.5%; text-align: center; font-size: 13.5px; }
    .lang-ar .cell-y1 { left: 66.0%; width: 3.2%; text-align: center; font-size: 13.5px; }
    .lang-ar .cell-y2 { left: 69.2%; width: 3.4%; text-align: center; font-size: 13.5px; }
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
    alert("Erreur d'impression : " + res.error);
  }
}

// Export PDF
async function saveAsPDF(dataOnly = false) {
  const data = getFormData();
  const safeName = data.agent_name ? data.agent_name.replace(/\s+/g, '_') : 'GRH22';
  const defaultName = dataOnly 
    ? `Titre_Conge_${safeName}_Donnees_Seules.pdf` 
    : `Titre_Conge_${safeName}.pdf`;

  if (!window.electronAPI) {
    alert("Fonctionnalité disponible dans Electron.");
    return;
  }

  const htmlContent = generatePrintHTML(dataOnly);
  const res = await window.electronAPI.savePDF({ htmlContent, defaultName, dataOnly });
  if (res && res.success) {
    alert(`Document PDF enregistré avec succès :\n${res.filePath}`);
  } else if (res && res.error) {
    alert("Erreur: " + res.error);
  }
}

// Save Leave Record into history & update balance
async function saveCurrentLeaveRecord() {
  if (!window.electronAPI || !window.electronAPI.saveLeaveRecord) {
    alert("Enregistré (Mode navigateur).");
    return;
  }

  const data = getFormData();
  const res = await window.electronAPI.saveLeaveRecord(data);
  if (res && res.success) {
    alert(`Titre de congé enregistré avec succès pour ${data.agent_name} !\nNouveau solde de congé : ${data.new_balance} jours.`);
    await loadEmployees();
    await loadHistory();
    closeLeaveDrawer();
  } else {
    alert("Erreur lors de l'enregistrement du congé.");
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
  const txt = document.getElementById('zoom-txt');
  if (txt) txt.textContent = `${Math.round(currentZoom * 100)}%`;
  const sheet = document.querySelector('#drawer-paper-container .document-page');
  if (sheet) {
    sheet.style.transform = `scale(${currentZoom})`;
  }
}

// Security / formatting helper functions
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeJsStr(str) {
  if (str === null || str === undefined) return '';
  return String(str).replace(/'/g, "\\'").replace(/"/g, '&quot;');
}
