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
    btn_save: "Enregistrer",
    btn_cancel: "Fermer",
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
    drawer_tab_p1: "Page 1 (FR)",
    drawer_tab_p2: "Page 2 (AR)",
    drawer_btn_calibrate: "Calibrage",
    stab_print: "Impression & Calibrage",
    calib_modal_title: "Calibrage & Alignement Papier Officiel",
    calib_modal_sub: "Ajustement millimétrique pour formulaires pré-imprimés CNAS GRH.22",
    calib_lbl_feed: "Mode d'Alimentation du Papier dans l'Imprimante",
    calib_opt_140x220: "Papier Officiel CNAS (140 × 220 mm) — Recommandé",
    calib_opt_a4_center: "Bac A4 — Centré avec guides papier (HP / Canon / Epson)",
    calib_opt_a4_left: "Bac A4 — Aligné sur le bord gauche",
    calib_feed_hint: "Si votre imprimante utilise les guides réglables au centre du bac, choisissez 'Bac A4 — Centré'.",
    calib_lbl_x: "Décalage Horizontal X (mm)",
    calib_lbl_y: "Décalage Vertical Y (mm)",
    calib_x_hint: "(- Gauche / + Droite)",
    calib_y_hint: "(- Haut / + Bas)",
    calib_test_tip: "Astuce : Imprimez une feuille de test sur papier blanc ordinaire et superposez-la sur votre imprimé officiel contre la lumière pour vérifier l'alignement.",
    calib_btn_test: "Imprimer Feuille Test",
    calib_btn_reset: "Réinitialiser (0, 0)",
    calib_lbl_modes_help: "Détails & Recommandations des Modes",
    calib_studio_heading: "Ajustement Millimétrique des Détails & Prévisualisation en Direct",
    calib_studio_sub: "Sélectionnez un champ ou cliquez directement dessus dans l'aperçu pour modifier son décalage X et Y",
    calib_active_field_title: "Détail Sélectionné",
    calib_sel_field_lbl: "Choisir le champ à décaler :",
    calib_btn_reset_field: "Zéro (0, 0)",
    calib_lbl_axis_x: "Axe X (mm) :",
    calib_lbl_axis_y: "Axe Y (mm) :",
    calib_fields_summary: "Tous les Détails Imprimés",
    calib_btn_reset_all: "Tout Réinitialiser",
    calib_prev_watermark: "Fond Officiel",
    calib_search_placeholder: "Filtrer les détails et chiffres...",
    calib_preview_hint: "Cliquez sur n'importe quel texte dans l'aperçu pour le sélectionner et le décaler en direct.",
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
    btn_save: "حفظ",
    btn_cancel: "إغلاق",
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
    drawer_tab_p1: "الصفحة 1 : فرنسية",
    drawer_tab_p2: "الصفحة 2 : عربية",
    drawer_btn_calibrate: "معايرة",
    stab_print: "الطباعة والمعايرة",
    calib_modal_title: "معايرة ومحاذاة الورق المطبوع مسبقاً",
    calib_modal_sub: "ضبط دقيق بالمليمتر لمطبوعات كناس الرسمية GRH.22",
    calib_lbl_feed: "طريقة إدخال الورق في درج الطابعة",
    calib_opt_140x220: "الورق الرسمي كناس (140 × 220 مم) — موصى به",
    calib_opt_a4_center: "درج A4 — في الوسط بواسطة موجهات الورق (HP / Canon / Epson)",
    calib_opt_a4_left: "درج A4 — محاذاة للجهة اليسرى",
    calib_feed_hint: "إذا كانت طابعتك تحتوي على موجهات ورق منزلقة في وسط الدرج، اختر خيار 'درج A4 — في الوسط'.",
    calib_lbl_x: "إزاحة أفقية X (مم)",
    calib_lbl_y: "إزاحة عمودية Y (مم)",
    calib_x_hint: "(- يسار / + يمين)",
    calib_y_hint: "(- أعلى / + أسفل)",
    calib_test_tip: "تلميح: اطبع صفحة تجريبية على ورق أبيض عادي ثم ضعها فوق المطبوع الرسمي أمام الضوء للتحقق من تطابق الأسطر بدقة.",
    calib_btn_test: "طباعة ورقة اختبار",
    calib_btn_reset: "إعادة ضبط (0, 0)",
    calib_lbl_modes_help: "تفاصيل وتوجيهات أوضاع التغذية",
    calib_studio_heading: "الضبط الدقيق لتفاصيل الطباعة بالمليمتر مع المعاينة الحية",
    calib_studio_sub: "حدد الحقل أو انقر عليه مباشرة في المعاينة لتعديل إزاحته الأفقية والعمودية",
    calib_active_field_title: "الحقل المحدد حالياً",
    calib_sel_field_lbl: "اختر الحقل المراد إزاحته:",
    calib_btn_reset_field: "تصفير (0, 0)",
    calib_lbl_axis_x: "المحور X (مم):",
    calib_lbl_axis_y: "المحور Y (مم):",
    calib_fields_summary: "جميع تفاصيل السند المطبوعة",
    calib_btn_reset_all: "إعادة ضبط الكل",
    calib_prev_watermark: "الخلفية الرسمية",
    calib_search_placeholder: "البحث عن حقل أو رقم...",
    calib_preview_hint: "انقر على أي نص داخل المعاينة الحية لتحديده وضبط موضعه بالمليمتر مباشرة.",
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

  // Update Wilaya trigger label
  updateWilayaTriggerLabel();

  if (cachedWilayaList && cachedWilayaList.length > 0) {
    renderWilayaDropdownItems(cachedWilayaList);
  }

  renderCalibDropdownAndCards();
  if (typeof updateCalibStudioUI === 'function') {
    updateCalibStudioUI();
  }

  filterAndRenderDirectors();
  if (currentView === 'home') updateHomeDashboard();
  if (currentView === 'history') renderHistoryTable();
  updateSidebarToggleIcon();
  setDrawerLanguage(currentDocLang);
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

  if (tab === 'print') {
    const s = getPrintSettings();
    const xSet = document.getElementById('set-calib-offset-x');
    const ySet = document.getElementById('set-calib-offset-y');
    if (xSet) xSet.value = s.offset_x;
    if (ySet) ySet.value = s.offset_y;
    renderCalibDropdownAndCards();
  if (typeof updateCalibStudioUI === 'function') {
    updateCalibStudioUI();
  }
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

function updateWilayaTriggerLabel() {
  const labelEl = document.getElementById('wilaya-selected-label');
  if (!labelEl) return;
  const isAr = (currentAppLang === 'ar');
  if (!selectedWilayaCode || selectedWilayaCode === '') {
    labelEl.textContent = isAr ? 'جميع الولايات والمؤسسات' : 'Toutes les Wilayas & Établissements';
    return;
  }
  const item = cachedWilayaList.find(w => w.code === selectedWilayaCode);
  if (item) {
    labelEl.textContent = isAr ? item.full_ar : item.full_fr;
  }
}

function populateWilayaFilter() {
  const select = document.getElementById('wilaya-filter-select');
  if (select) {
    select.innerHTML = '<option value="">Toutes les Wilayas & Établissements</option>';
  }

  // Group wilayas/agencies
  const wilayaList = [];
  employees.forEach(e => {
    const code = e.code_wilaya || '';
    const agencyFr = e.agency || e.service_fr || '';
    let agencyAr = '';
    if (e.service_ar) {
      agencyAr = e.service_ar.replace(/^وكالة كناس لولاية\s+/, '').replace(/^وكالة كناس\s+/, '').trim();
    } else {
      agencyAr = agencyFr;
    }

    const key = code || agencyFr;
    if (!wilayaList.some(w => w.code === key)) {
      wilayaList.push({
        code: key,
        badge: (code && code.length <= 4) ? code : 'DG',
        label_fr: agencyFr,
        label_ar: agencyAr,
        full_fr: code ? `${code} - ${agencyFr}` : agencyFr,
        full_ar: code ? `${code} - ${agencyAr}` : agencyAr
      });
    }
  });

  wilayaList.sort((a, b) => {
    const na = parseInt(a.code, 10);
    const nb = parseInt(b.code, 10);
    if (!isNaN(na) && !isNaN(nb)) return na - nb;
    if (!isNaN(na)) return -1;
    if (!isNaN(nb)) return 1;
    return a.label_fr.localeCompare(b.label_fr);
  });

  cachedWilayaList = wilayaList;

  if (select) {
    wilayaList.forEach(w => {
      const opt = document.createElement('option');
      opt.value = w.code;
      opt.textContent = w.full_fr;
      select.appendChild(opt);
    });
  }

  renderWilayaDropdownItems(cachedWilayaList);
  updateWilayaTriggerLabel();
}

function renderWilayaDropdownItems(items) {
  const container = document.getElementById('wilaya-dropdown-items');
  if (!container) return;

  const isAr = (currentAppLang === 'ar');
  const allLabel = isAr ? 'جميع الولايات والمؤسسات' : 'Toutes les Wilayas & Établissements';

  let html = `
    <div class="dropdown-item ${!selectedWilayaCode ? 'active' : ''}" onclick="selectWilayaDropdownItem('')">
      <div class="dropdown-item-badge"><i class="ti ti-world"></i></div>
      <span class="dropdown-item-name">${escapeHtml(allLabel)}</span>
      ${!selectedWilayaCode ? '<i class="ti ti-check dropdown-item-check"></i>' : ''}
    </div>
  `;

  items.forEach(w => {
    const isActive = (selectedWilayaCode === w.code);
    const displayName = isAr ? w.label_ar : w.label_fr;
    html += `
      <div class="dropdown-item ${isActive ? 'active' : ''}" onclick="selectWilayaDropdownItem('${escapeHtml(w.code)}')">
        <div class="dropdown-item-badge">${escapeHtml(w.badge)}</div>
        <span class="dropdown-item-name">${escapeHtml(displayName)}</span>
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
    w.code.toLowerCase().includes(query) || 
    (w.label_fr && w.label_fr.toLowerCase().includes(query)) ||
    (w.label_ar && w.label_ar.toLowerCase().includes(query)) ||
    (w.full_fr && w.full_fr.toLowerCase().includes(query)) ||
    (w.full_ar && w.full_ar.toLowerCase().includes(query))
  );
  renderWilayaDropdownItems(filtered);
}

function selectWilayaDropdownItem(code) {
  selectedWilayaCode = code;
  updateWilayaTriggerLabel();

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

  const initialLang = (currentAppLang === 'ar') ? 'ar' : 'fr';
  setDrawerLanguage(initialLang);

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
  const isAppAr = (currentAppLang === 'ar');

  if (lang === 'ar') {
    btnFr?.classList.remove('active');
    btnAr?.classList.add('active');
    const pill = document.getElementById('preview-page-pill');
    if (pill) pill.textContent = isAppAr ? "الصفحة 2 : العربية" : "Page 2 : Arabe";
  } else {
    btnFr?.classList.add('active');
    btnAr?.classList.remove('active');
    const pill = document.getElementById('preview-page-pill');
    if (pill) pill.textContent = isAppAr ? "الصفحة 1 : الفرنسية" : "Page 1 : Français";
  }

  if (activeEmployee) {
    const isAr = (lang === 'ar');
    document.getElementById('f-agent-name').value = isAr ? (activeEmployee.name_ar || activeEmployee.name_fr) : (activeEmployee.name_fr || activeEmployee.name_ar);
    document.getElementById('f-grade').value = isAr ? (activeEmployee.grade_ar || activeEmployee.grade_fr) : (activeEmployee.grade_fr || activeEmployee.grade_ar);
    document.getElementById('f-service').value = isAr ? (activeEmployee.service_ar || activeEmployee.service_fr) : (activeEmployee.service_fr || activeEmployee.service_ar);
    document.getElementById('f-address').value = isAr ? (activeEmployee.address_ar || activeEmployee.address_fr) : (activeEmployee.address_fr || activeEmployee.address_ar);

    const empName = isAr ? (activeEmployee.name_ar || activeEmployee.name_fr) : (activeEmployee.name_fr || activeEmployee.name_ar);
    const empRole = isAr ? (activeEmployee.grade_ar || activeEmployee.grade_fr) : (activeEmployee.grade_fr || activeEmployee.grade_ar);
    const empAgency = isAr ? (activeEmployee.service_ar || activeEmployee.agency) : (activeEmployee.service_fr || activeEmployee.agency);

    const titleEl = document.getElementById('drawer-agent-title');
    const subEl = document.getElementById('drawer-agent-subtitle');
    if (titleEl) titleEl.textContent = `${empName} - GRH.22`;
    if (subEl) subEl.textContent = `${empRole} — ${empAgency || ''}`;
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

function getFieldTransform(fieldOffsets, fieldKey) {
  if (!fieldOffsets || !fieldOffsets[fieldKey]) return '';
  const x = parseFloat(fieldOffsets[fieldKey].x) || 0;
  const y = parseFloat(fieldOffsets[fieldKey].y) || 0;
  if (x === 0 && y === 0) return '';
  return `transform: translate(${x}mm, ${y}mm);`;
}

function buildSheetHTML(data, isAr, overlayMode) {
  const langClass = isAr ? 'lang-ar' : 'lang-fr';
  const modeClass = overlayMode ? 'mode-preprinted' : 'mode-full';
  const printSettings = getPrintSettings();
  const offsetX = parseFloat(printSettings.offset_x) || 0;
  const offsetY = parseFloat(printSettings.offset_y) || 0;
  const transformStyle = overlayMode ? `transform: translate(${offsetX}mm, ${offsetY}mm);` : '';

  const fo = printSettings.field_offsets || {};
  const tName = getFieldTransform(fo, 'agent_name');
  const tGrade = getFieldTransform(fo, 'grade');
  const tService = getFieldTransform(fo, 'service');
  const tAddress = getFieldTransform(fo, 'address');
  const tAddress2 = getFieldTransform(fo, 'address_2');
  const tLeaveDays = getFieldTransform(fo, 'leave_days');

  const tDep = getFieldTransform(fo, 'dates_dep');
  const tDepDay = getFieldTransform(fo, 'dep_day');
  const tDepMonth = getFieldTransform(fo, 'dep_month');
  const tDepYear = getFieldTransform(fo, 'dep_year');

  const tRet = getFieldTransform(fo, 'dates_ret');
  const tRetDay = getFieldTransform(fo, 'ret_day');
  const tRetMonth = getFieldTransform(fo, 'ret_month');
  const tRetYear = getFieldTransform(fo, 'ret_year');

  const tLeaveAddr = getFieldTransform(fo, 'leave_address');
  const tLocation = getFieldTransform(fo, 'location');
  const tDocDate = getFieldTransform(fo, 'doc_date');
  const tSignatory = getFieldTransform(fo, 'signatory');

  const tRights = getFieldTransform(fo, 'rights_table');
  const tRightsPrev = getFieldTransform(fo, 'rights_prev');
  const tRightsCur = getFieldTransform(fo, 'rights_cur');
  const tRightsTot = getFieldTransform(fo, 'rights_tot');
  const tRightsGranted = getFieldTransform(fo, 'rights_granted');
  const tRightsNew = getFieldTransform(fo, 'rights_new');

  return `
    <div class="document-page ${langClass} ${modeClass}">
      <div class="data-layer" style="${transformStyle}">
        <!-- Nom et prénom de l'agent -->
        <div class="field-item field-agent-name" data-calib-field="agent_name" style="${tName}">${escapeHtml(data.agent_name || '')}</div>

        <!-- Grade ou fonction -->
        <div class="field-item field-grade" data-calib-field="grade" style="${tGrade}">${escapeHtml(data.grade || '')}</div>

        <!-- Service -->
        <div class="field-item field-service" data-calib-field="service" style="${tService}">${escapeHtml(data.service || '')}</div>

        <!-- Adresse -->
        <div class="field-item field-address-1" data-calib-field="address" style="${tAddress}">${escapeHtml(data.address_line_1 || '')}</div>
        ${data.address_line_2 ? `<div class="field-item field-address-2" data-calib-field="address_2" style="${tAddress2}">${escapeHtml(data.address_line_2)}</div>` : ''}

        <!-- Bénéficie d'un congé de X jours -->
        <div class="field-item field-leave-days" data-calib-field="leave_days" style="${tLeaveDays}">${data.leave_days || ''}</div>

        <!-- Date de départ (6 individual cells in JJ / MM / AA subgroups) -->
        <div class="date-group group-dep" data-calib-field="dates_dep" style="${tDep}">
          <div class="date-subgroup sub-day" data-calib-field="dep_day" style="${tDepDay}">
            <span class="cell cell-d1">${data.dep?.d1 || ''}</span>
            <span class="cell cell-d2">${data.dep?.d2 || ''}</span>
          </div>
          <div class="date-subgroup sub-month" data-calib-field="dep_month" style="${tDepMonth}">
            <span class="cell cell-m1">${data.dep?.m1 || ''}</span>
            <span class="cell cell-m2">${data.dep?.m2 || ''}</span>
          </div>
          <div class="date-subgroup sub-year" data-calib-field="dep_year" style="${tDepYear}">
            <span class="cell cell-y1">${data.dep?.y1 || ''}</span>
            <span class="cell cell-y2">${data.dep?.y2 || ''}</span>
          </div>
        </div>

        <!-- Date de retour (6 individual cells in JJ / MM / AA subgroups) -->
        <div class="date-group group-ret" data-calib-field="dates_ret" style="${tRet}">
          <div class="date-subgroup sub-day" data-calib-field="ret_day" style="${tRetDay}">
            <span class="cell cell-d1">${data.ret?.d1 || ''}</span>
            <span class="cell cell-d2">${data.ret?.d2 || ''}</span>
          </div>
          <div class="date-subgroup sub-month" data-calib-field="ret_month" style="${tRetMonth}">
            <span class="cell cell-m1">${data.ret?.m1 || ''}</span>
            <span class="cell cell-m2">${data.ret?.m2 || ''}</span>
          </div>
          <div class="date-subgroup sub-year" data-calib-field="ret_year" style="${tRetYear}">
            <span class="cell cell-y1">${data.ret?.y1 || ''}</span>
            <span class="cell cell-y2">${data.ret?.y2 || ''}</span>
          </div>
        </div>

        <!-- Adresse durant le congé -->
        <div class="field-item field-leave-address" data-calib-field="leave_address" style="${tLeaveAddr}">${escapeHtml(data.leave_address || '')}</div>

        <!-- Fait à ... Le ... -->
        <div class="field-item field-location" data-calib-field="location" style="${tLocation}">${escapeHtml(data.location || '')}</div>
        <div class="field-item field-date" data-calib-field="doc_date" style="${tDocDate}">${escapeHtml(data.date || '')}</div>

        <!-- Le Directeur -->
        <div class="field-item field-signatory" data-calib-field="signatory" style="${tSignatory}">${escapeHtml(data.director || '')}</div>

        <!-- Detail des droits values -->
        <div class="rights-values" data-calib-field="rights_table" style="${tRights}">
          <div class="field-item right-val-prev" data-calib-field="rights_prev" style="${tRightsPrev}">${data.prev_balance ?? ''}</div>
          <div class="field-item right-val-cur" data-calib-field="rights_cur" style="${tRightsCur}">${data.cur_entitlement ?? ''}</div>
          <div class="field-item right-val-tot" data-calib-field="rights_tot" style="${tRightsTot}">${data.tot_entitlement ?? ''}</div>
          <div class="field-item right-val-granted" data-calib-field="rights_granted" style="${tRightsGranted}">${data.leave_granted ?? ''}</div>
          <div class="field-item right-val-new" data-calib-field="rights_new" style="${tRightsNew}">${data.new_balance ?? ''}</div>
        </div>
      </div>
    </div>
  `;
}

// Generate print / PDF HTML with transparent coordinates
function generatePrintHTML(dataOnly = false, isTestPage = false) {
  if (isTestPage) {
    return generateTestPageHTML();
  }

  const isAr = (currentDocLang === 'ar');
  const data = getFormData();
  const printSettings = getPrintSettings();
  const feed = printSettings.paper_feed || 'official_140x220';
  const offsetX = parseFloat(printSettings.offset_x) || 0;
  const offsetY = parseFloat(printSettings.offset_y) || 0;

  if (dataOnly) {
    // Official Pre-printed form dimensions and coordinates
    const isCustom = (feed === 'official_140x220');
    const pageSizeRule = isCustom ? '140mm 220mm' : 'A4';
    const pageWidth = isCustom ? '140mm' : '210mm';
    const pageHeight = isCustom ? '220mm' : '297mm';
    const containerLeft = (feed === 'a4_center') ? '35mm' : '0mm';

    const langClass = isAr ? 'lang-ar' : 'lang-fr';
    const content = buildSheetHTML(data, isAr, true);

    return `<!DOCTYPE html>
<html lang="${isAr ? 'ar' : 'fr'}" dir="${isAr ? 'rtl' : 'ltr'}">
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap" rel="stylesheet">
  <style>
    @page { size: ${pageSizeRule}; margin: 0; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: transparent !important;
      margin: 0; padding: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .document-page {
      width: ${pageWidth};
      height: ${pageHeight};
      position: relative;
      background: transparent !important;
      background-image: none !important;
      box-sizing: border-box;
      margin: 0;
      overflow: hidden;
    }
    .document-page::after {
      display: none !important;
    }
    .data-layer {
      position: absolute;
      top: 0;
      left: ${containerLeft};
      width: 140mm;
      height: 220mm;
      transform: translate(${offsetX}mm, ${offsetY}mm);
      transform-origin: top left;
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
    }

    /* Calibrated French Coordinates (in mm on 140x220mm physical form) */
    .lang-fr { font-family: 'Times New Roman', Times, serif; }
    .lang-fr .field-agent-name { top: 58.5mm; left: 47.0mm; font-size: 13.5px; font-weight: 700; }
    .lang-fr .field-grade { top: 66.0mm; left: 38.0mm; font-size: 12.5px; font-weight: 700; }
    .lang-fr .field-service { top: 73.5mm; left: 24.0mm; font-size: 12.5px; font-weight: 700; }
    .lang-fr .field-address-1 { top: 81.0mm; left: 24.0mm; font-size: 12.0px; font-weight: 700; }
    .lang-fr .field-address-2 { top: 86.5mm; left: 13.0mm; font-size: 12.0px; font-weight: 700; }
    .lang-fr .field-leave-days { top: 88.5mm; left: 48.0mm; width: 12.0mm; text-align: center; font-size: 14.0px; font-weight: 800; }
    .lang-fr .group-dep { top: 96.5mm; width: 140mm; left: 0; }
    .lang-fr .group-ret { top: 104.5mm; width: 140mm; left: 0; }
    .lang-fr .cell-d1 { left: 34.0mm; width: 4.5mm; text-align: center; font-size: 13.0px; }
    .lang-fr .cell-d2 { left: 38.5mm; width: 4.5mm; text-align: center; font-size: 13.0px; }
    .lang-fr .cell-m1 { left: 44.0mm; width: 4.5mm; text-align: center; font-size: 13.0px; }
    .lang-fr .cell-m2 { left: 48.5mm; width: 4.5mm; text-align: center; font-size: 13.0px; }
    .lang-fr .cell-y1 { left: 54.5mm; width: 4.5mm; text-align: center; font-size: 13.0px; }
    .lang-fr .cell-y2 { left: 59.0mm; width: 4.5mm; text-align: center; font-size: 13.0px; }
    .lang-fr .field-leave-address { top: 112.5mm; left: 45.0mm; font-size: 12.0px; font-weight: 700; }
    .lang-fr .field-location { top: 134.5mm; left: 20.0mm; font-size: 12.5px; font-weight: 700; }
    .lang-fr .field-date { top: 134.5mm; left: 60.0mm; font-size: 12.5px; font-weight: 700; }
    .lang-fr .field-signatory { top: 144.0mm; left: 75.0mm; font-size: 12.5px; font-style: italic; }
    .lang-fr .rights-values .field-item { left: 48.0mm; width: 18.0mm; text-align: center; font-size: 13.5px; font-weight: 800; }
    .lang-fr .right-val-prev { top: 167.0mm; }
    .lang-fr .right-val-cur  { top: 173.5mm; }
    .lang-fr .right-val-tot  { top: 180.0mm; }
    .lang-fr .right-val-granted { top: 186.5mm; }
    .lang-fr .right-val-new { top: 194.5mm; font-size: 14.5px; font-weight: 900; }

    /* Calibrated Arabic Coordinates (in mm on 140x220mm physical form) */
    .lang-ar { font-family: 'Tajawal', sans-serif; direction: rtl; }
    .lang-ar .field-agent-name { top: 58.5mm; right: 38.0mm; font-size: 14.0px; font-weight: 700; }
    .lang-ar .field-grade { top: 66.0mm; right: 40.0mm; font-size: 13.0px; font-weight: 700; }
    .lang-ar .field-service { top: 73.5mm; right: 32.0mm; font-size: 13.0px; font-weight: 700; }
    .lang-ar .field-address-1 { top: 81.0mm; right: 32.0mm; font-size: 12.5px; font-weight: 700; }
    .lang-ar .field-address-2 { top: 86.5mm; right: 18.0mm; font-size: 12.5px; font-weight: 700; }
    .lang-ar .field-leave-days { top: 88.5mm; right: 36.0mm; width: 12.0mm; text-align: center; font-size: 14.5px; font-weight: 800; }
    .lang-ar .group-dep { top: 96.5mm; width: 140mm; right: 0; left: auto; }
    .lang-ar .group-ret { top: 104.5mm; width: 140mm; right: 0; left: auto; }
    .lang-ar .cell-d1 { left: 77.0mm; width: 4.5mm; text-align: center; font-size: 13.0px; }
    .lang-ar .cell-d2 { left: 81.5mm; width: 4.5mm; text-align: center; font-size: 13.0px; }
    .lang-ar .cell-m1 { left: 87.0mm; width: 4.5mm; text-align: center; font-size: 13.0px; }
    .lang-ar .cell-m2 { left: 91.5mm; width: 4.5mm; text-align: center; font-size: 13.0px; }
    .lang-ar .cell-y1 { left: 97.5mm; width: 4.5mm; text-align: center; font-size: 13.0px; }
    .lang-ar .cell-y2 { left: 102.0mm; width: 4.5mm; text-align: center; font-size: 13.0px; }
    .lang-ar .field-leave-address { top: 112.5mm; right: 42.0mm; font-size: 12.5px; font-weight: 700; }
    .lang-ar .field-location { top: 134.5mm; right: 25.0mm; font-size: 13.0px; font-weight: 700; }
    .lang-ar .field-date { top: 134.5mm; right: 68.0mm; font-size: 13.0px; font-weight: 700; }
    .lang-ar .field-signatory { top: 144.0mm; right: 68.0mm; font-size: 13.0px; }
    .lang-ar .rights-values .field-item { left: 68.0mm; width: 18.0mm; text-align: center; font-size: 14.0px; font-weight: 800; }
    .lang-ar .right-val-prev { top: 167.0mm; }
    .lang-ar .right-val-cur  { top: 173.5mm; }
    .lang-ar .right-val-tot  { top: 180.0mm; }
    .lang-ar .right-val-granted { top: 186.5mm; }
    .lang-ar .right-val-new { top: 194.5mm; font-size: 15.0px; font-weight: 900; }
  </style>
</head>
<body>
  ${content}
</body>
</html>`;
  }

  // Full Template Mode (Blank A4 sheet with template background)
  const content = buildSheetHTML(data, isAr, false);
  const bgDataUri = (typeof TEMPLATE_IMAGES !== 'undefined')
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
      background: #ffffff;
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
      ${bgDataUri ? `background-image: url('${bgDataUri}');` : 'background: #ffffff;'}
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
    .document-page .field-item:not(.field-leave-days) {
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
    .document-page .field-signatory {
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

// Calibration Test Page Generator
function generateTestPageHTML() {
  const printSettings = getPrintSettings();
  const offsetX = parseFloat(printSettings.offset_x) || 0;
  const offsetY = parseFloat(printSettings.offset_y) || 0;
  const feed = printSettings.paper_feed || 'official_140x220';
  const isCustom = (feed === 'official_140x220');
  const pageSizeRule = isCustom ? '140mm 220mm' : 'A4';
  const pageWidth = isCustom ? '140mm' : '210mm';
  const pageHeight = isCustom ? '220mm' : '297mm';
  const containerLeft = (feed === 'a4_center') ? '35mm' : '0mm';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>CongéDesk - Test d'Alignement</title>
  <style>
    @page { size: ${pageSizeRule}; margin: 0; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #ffffff;
      margin: 0; padding: 0;
      font-family: Arial, sans-serif;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page-sheet {
      width: ${pageWidth};
      height: ${pageHeight};
      position: relative;
      margin: 0;
      overflow: hidden;
    }
    .card-box {
      position: absolute;
      top: 0;
      left: ${containerLeft};
      width: 140mm;
      height: 220mm;
      border: 1.5px dashed #2563eb;
      transform: translate(${offsetX}mm, ${offsetY}mm);
      transform-origin: top left;
    }
    .corner {
      position: absolute;
      width: 10mm;
      height: 10mm;
      border: 1.5px solid #000;
    }
    .c-tl { top: 0; left: 0; border-right: none; border-bottom: none; }
    .c-tr { top: 0; right: 0; border-left: none; border-bottom: none; }
    .c-bl { bottom: 0; left: 0; border-right: none; border-top: none; }
    .c-br { bottom: 0; right: 0; border-left: none; border-top: none; }
    .test-line {
      position: absolute;
      left: 6mm;
      right: 6mm;
      border-bottom: 1px dotted #dc2626;
      font-size: 8.5px;
      color: #dc2626;
      line-height: 1;
      padding-bottom: 1px;
    }
    .test-box {
      position: absolute;
      border: 1px solid #16a34a;
      font-size: 8px;
      color: #16a34a;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .meta-tag {
      position: absolute;
      top: 25mm;
      left: 10mm;
      right: 10mm;
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      padding: 6px 10px;
      font-size: 9px;
      color: #334155;
      line-height: 1.4;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="page-sheet">
    <div class="card-box">
      <div class="corner c-tl"></div>
      <div class="corner c-tr"></div>
      <div class="corner c-bl"></div>
      <div class="corner c-br"></div>

      <div class="meta-tag">
        <strong>CongéDesk — Page de Test d'Alignement Papier Officiel GRH.22</strong><br>
        Mode : <strong>${feed}</strong> | Décalage X : <strong>${offsetX} mm</strong> | Décalage Y : <strong>${offsetY} mm</strong><br>
        Placez cette feuille sur votre imprimé CNAS contre la lumière pour vérifier l'alignement.
      </div>

      <!-- Line 1: Nom et prénom -->
      <div class="test-line" style="top: 62.5mm;">[Ligne 1: Nom et prénom de l'agent (58.5 mm)]</div>

      <!-- Line 2: Grade -->
      <div class="test-line" style="top: 70.0mm;">[Ligne 2: Grade ou fonction (66.0 mm)]</div>

      <!-- Line 3: Service -->
      <div class="test-line" style="top: 77.5mm;">[Ligne 3: Service (73.5 mm)]</div>

      <!-- Line 4: Adresse -->
      <div class="test-line" style="top: 85.0mm;">[Ligne 4: Adresse (81.0 mm)]</div>

      <!-- Line 5: Jours box -->
      <div class="test-box" style="top: 88.5mm; left: 48mm; width: 12mm; height: 6mm;">Jours</div>

      <!-- Line 6: Date début -->
      <div class="test-box" style="top: 96.5mm; left: 34mm; width: 30mm; height: 6mm;">Du : [JJ/MM/AA]</div>

      <!-- Line 7: Date fin -->
      <div class="test-box" style="top: 104.5mm; left: 34mm; width: 30mm; height: 6mm;">Au : [JJ/MM/AA]</div>

      <!-- Line 8: Adresse conge -->
      <div class="test-line" style="top: 116.5mm;">[Ligne 8: Adresse durant le congé (112.5 mm)]</div>

      <!-- Line 9: Fait à ... Le ... -->
      <div class="test-line" style="top: 138.5mm;">[Ligne 9: Fait à / Le (134.5 mm)]</div>

      <!-- Signataire -->
      <div class="test-box" style="top: 144mm; left: 75mm; width: 45mm; height: 12mm;">Signature Directeur</div>

      <!-- Table detail des droits -->
      <div class="test-box" style="top: 167mm; left: 45mm; width: 24mm; height: 32mm;">Tableau Droits (167-199mm)</div>
    </div>
  </div>
</body>
</html>`;
}

// Print Calibration Storage & Helpers
const DEFAULT_PRINT_SETTINGS = {
  paper_feed: 'official_140x220',
  offset_x: 0,
  offset_y: 0,
  field_offsets: {}
};

const CALIB_FEED_MODES = [
  {
    id: 'official_140x220',
    icon: 'ti-file-invoice',
    title_fr: 'Papier Officiel CNAS',
    title_ar: 'الورق الرسمي كناس',
    subtitle_fr: '(140 × 220 mm)',
    subtitle_ar: '(140 × 220 مم)',
    badge_fr: 'Recommandé',
    badge_ar: 'موصى به',
    badge_class: 'badge-recommended',
    desc_fr: 'Alimentation directe dans le bac réglé au format 140×220 mm. Alignement natif exact.',
    desc_ar: 'إدخال مباشر للورقة بمقاس 140×220 مم في الدرج المخصص. محاذاة أصلية دقيقة.',
    offset_pill_fr: 'Écart 0 mm',
    offset_pill_ar: 'إزاحة 0 مم'
  },
  {
    id: 'a4_center',
    icon: 'ti-layout-align-middle',
    title_fr: 'Bac A4 — Centré avec guides',
    title_ar: 'درج A4 — توسيط بموجهات الورق',
    subtitle_fr: '',
    subtitle_ar: '',
    badge_fr: 'HP / Canon / Epson',
    badge_ar: 'HP / Canon / Epson',
    badge_class: 'badge-standard',
    desc_fr: 'Feuille placée au centre du bac A4 avec guides réglables. Centrage automatique (+35 mm).',
    desc_ar: 'وضع الورقة في وسط درج A4 وضبط الموجهات. توسيط تلقائي بهامش +35 مم.',
    offset_pill_fr: 'Auto +35 mm',
    offset_pill_ar: 'تلقائي +35 مم'
  },
  {
    id: 'a4_left',
    icon: 'ti-layout-align-left',
    title_fr: 'Bac A4 — Calé bord gauche',
    title_ar: 'درج A4 — محاذاة للحافة اليسرى',
    subtitle_fr: '',
    subtitle_ar: '',
    badge_fr: 'Bord référence',
    badge_ar: 'حافة مرجعية',
    badge_class: 'badge-side',
    desc_fr: 'Feuille insérée collée contre le guide gauche du bac A4. Décalage d\'origine nul.',
    desc_ar: 'وضع الورقة ملتصقة بالحافة اليسرى لدرج A4. إزاحة ابتدائية 0 مم.',
    offset_pill_fr: 'Bord 0 mm',
    offset_pill_ar: 'مبدئي 0 مم'
  }
];

function getPrintSettings() {
  try {
    const raw = localStorage.getItem('congedesk_print_settings');
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_PRINT_SETTINGS,
        ...parsed,
        field_offsets: parsed.field_offsets || {}
      };
    }
  } catch (e) {}
  return { ...DEFAULT_PRINT_SETTINGS, field_offsets: {} };
}

function savePrintSettings(settings) {
  localStorage.setItem('congedesk_print_settings', JSON.stringify(settings));
}

function renderCalibDropdownAndCards() {
  const isAr = (currentAppLang === 'ar');
  const s = getPrintSettings();
  const currentMode = s.paper_feed || 'official_140x220';
  const activeObj = CALIB_FEED_MODES.find(m => m.id === currentMode) || CALIB_FEED_MODES[0];

  ['set', 'modal'].forEach(prefix => {
    // 1. Trigger label & badge
    const labelEl = document.getElementById(`${prefix}-calib-trigger-label`);
    const badgeEl = document.getElementById(`${prefix}-calib-trigger-badge`);
    const fullTitle = (isAr ? activeObj.title_ar : activeObj.title_fr) + (activeObj.subtitle_fr ? ` ${isAr ? activeObj.subtitle_ar : activeObj.subtitle_fr}` : '');
    if (labelEl) labelEl.textContent = fullTitle;
    if (badgeEl) {
      badgeEl.textContent = isAr ? activeObj.badge_ar : activeObj.badge_fr;
      badgeEl.className = `calib-badge ${activeObj.badge_class}`;
    }

    // 2. Dropdown Menu Items
    const menuEl = document.getElementById(`${prefix}-calib-menu`);
    if (menuEl) {
      menuEl.innerHTML = CALIB_FEED_MODES.map(mode => {
        const isActive = (mode.id === currentMode);
        const title = isAr ? mode.title_ar : mode.title_fr;
        const subtitle = isAr ? mode.subtitle_ar : mode.subtitle_fr;
        const badge = isAr ? mode.badge_ar : mode.badge_fr;
        const desc = isAr ? mode.desc_ar : mode.desc_fr;
        const offsetPill = isAr ? mode.offset_pill_ar : mode.offset_pill_fr;
        return `
          <div class="calib-menu-item ${isActive ? 'active' : ''}" onclick="selectCalibFeedMode('${mode.id}', '${prefix}')">
            <div class="calib-item-icon-box"><i class="ti ${mode.icon}"></i></div>
            <div class="calib-item-content">
              <div class="calib-item-header">
                <span class="calib-item-title">${escapeHtml(title)} ${subtitle ? `<span style="font-size: 11px; opacity: 0.7;">${escapeHtml(subtitle)}</span>` : ''}</span>
                <span class="calib-badge ${mode.badge_class}">${escapeHtml(badge)}</span>
              </div>
              <div class="calib-item-desc">${escapeHtml(desc)}</div>
              <div class="calib-item-margin"><i class="ti ti-ruler-2"></i> ${escapeHtml(offsetPill)}</div>
            </div>
            ${isActive ? '<i class="ti ti-check" style="color: var(--primary); font-size: 18px; margin-top: 4px;"></i>' : ''}
          </div>
        `;
      }).join('');
    }

    // 3. Explanatory Cards (Redesigned Compact Stack)
    const cardsEl = document.getElementById(`${prefix}-calib-cards-grid`);
    if (cardsEl) {
      cardsEl.innerHTML = CALIB_FEED_MODES.map(mode => {
        const isActive = (mode.id === currentMode);
        const title = isAr ? mode.title_ar : mode.title_fr;
        const subtitle = isAr ? mode.subtitle_ar : mode.subtitle_fr;
        const badge = isAr ? mode.badge_ar : mode.badge_fr;
        const desc = isAr ? mode.desc_ar : mode.desc_fr;
        const offsetPill = isAr ? mode.offset_pill_ar : mode.offset_pill_fr;
        return `
          <div class="calib-card ${isActive ? 'active' : ''}" onclick="selectCalibFeedMode('${mode.id}', '${prefix}')">
            <div class="calib-card-radio">
              ${isActive ? '<i class="ti ti-check"></i>' : ''}
            </div>
            <div class="calib-card-icon">
              <i class="ti ${mode.icon}"></i>
            </div>
            <div class="calib-card-content">
              <div class="calib-card-header-row">
                <div class="calib-card-title-group">
                  <span class="calib-card-title">${escapeHtml(title)}</span>
                  ${subtitle ? `<span class="calib-card-subtitle">${escapeHtml(subtitle)}</span>` : ''}
                </div>
                <div class="calib-card-badges-group">
                  <span class="calib-badge ${mode.badge_class}">${escapeHtml(badge)}</span>
                  <span class="calib-offset-pill"><i class="ti ti-ruler-2"></i> ${escapeHtml(offsetPill)}</span>
                </div>
              </div>
              <p class="calib-card-desc">${escapeHtml(desc)}</p>
            </div>
          </div>
        `;
      }).join('');
    }
  });
}

function toggleCalibDropdown(event, prefix) {
  if (event) event.stopPropagation();
  const menu = document.getElementById(`${prefix}-calib-menu`);
  const trigger = document.getElementById(`${prefix}-calib-trigger`);
  if (!menu) return;

  const isVisible = (menu.style.display === 'block');
  closeAllCalibDropdowns();

  if (!isVisible) {
    menu.style.display = 'block';
    if (trigger) trigger.classList.add('active');
  }
}

function closeAllCalibDropdowns() {
  ['set', 'modal'].forEach(prefix => {
    const menu = document.getElementById(`${prefix}-calib-menu`);
    const trigger = document.getElementById(`${prefix}-calib-trigger`);
    if (menu) menu.style.display = 'none';
    if (trigger) trigger.classList.remove('active');
  });
}

function selectCalibFeedMode(modeId, source) {
  const s = getPrintSettings();
  s.paper_feed = modeId;
  savePrintSettings(s);
  closeAllCalibDropdowns();
  renderCalibDropdownAndCards();
  if (typeof updateCalibStudioUI === 'function') {
    updateCalibStudioUI();
  }
  renderDocumentPreview();
}

// Global click handler to close calib dropdowns when clicking outside
document.addEventListener('click', (e) => {
  const setDropdown = document.getElementById('set-calib-dropdown');
  const modalDropdown = document.getElementById('modal-calib-dropdown');
  const calibCustomDropdown = document.getElementById('calib-custom-dropdown');

  if (setDropdown && !setDropdown.contains(e.target)) {
    const setMenu = document.getElementById('set-calib-menu');
    const setTrigger = document.getElementById('set-calib-trigger');
    if (setMenu) setMenu.style.display = 'none';
    if (setTrigger) setTrigger.classList.remove('active');
  }
  if (modalDropdown && !modalDropdown.contains(e.target)) {
    const modalMenu = document.getElementById('modal-calib-menu');
    const modalTrigger = document.getElementById('modal-calib-trigger');
    if (modalMenu) modalMenu.style.display = 'none';
    if (modalTrigger) modalTrigger.classList.remove('active');
  }
  if (calibCustomDropdown && !calibCustomDropdown.contains(e.target)) {
    closeCalibFieldDropdown();
  }
});

function openPrintCalibrationModal() {
  const modal = document.getElementById('modal-print-calibration');
  if (!modal) return;
  const s = getPrintSettings();
  const inputX = document.getElementById('calib-offset-x');
  const inputY = document.getElementById('calib-offset-y');
  if (inputX) inputX.value = s.offset_x;
  if (inputY) inputY.value = s.offset_y;
  renderCalibDropdownAndCards();
  if (typeof updateCalibStudioUI === 'function') {
    updateCalibStudioUI();
  }
  modal.style.display = 'flex';
}

function closePrintCalibrationModal() {
  const modal = document.getElementById('modal-print-calibration');
  if (modal) modal.style.display = 'none';
  closeAllCalibDropdowns();
}

function onCalibrationChange() {
  const inputX = document.getElementById('calib-offset-x');
  const inputY = document.getElementById('calib-offset-y');
  const s = getPrintSettings();
  s.offset_x = inputX ? parseFloat(inputX.value) || 0 : 0;
  s.offset_y = inputY ? parseFloat(inputY.value) || 0 : 0;
  savePrintSettings(s);
  renderDocumentPreview();
}

function nudgeCalibration(field, delta, isSettingsTab = false) {
  const s = getPrintSettings();
  s[field] = Math.round(((parseFloat(s[field]) || 0) + delta) * 10) / 10;
  savePrintSettings(s);
  
  const modalInput = document.getElementById(field === 'offset_x' ? 'calib-offset-x' : 'calib-offset-y');
  const setInput = document.getElementById(field === 'offset_x' ? 'set-calib-offset-x' : 'set-calib-offset-y');
  if (modalInput) modalInput.value = s[field];
  if (setInput) setInput.value = s[field];

  renderDocumentPreview();
}

function saveCalibrationModalSettings() {
  onCalibrationChange();
  closePrintCalibrationModal();
}

function syncSettingsCalibration(type) {
  const inputX = document.getElementById('set-calib-offset-x');
  const inputY = document.getElementById('set-calib-offset-y');
  const s = getPrintSettings();
  s.offset_x = inputX ? parseFloat(inputX.value) || 0 : 0;
  s.offset_y = inputY ? parseFloat(inputY.value) || 0 : 0;
  savePrintSettings(s);
  renderDocumentPreview();
}

function saveSettingsTabCalibration() {
  const isAr = (currentAppLang === 'ar');
  alert(isAr ? 'تم حفظ إعدادات الطباعة والمعايرة بنجاح!' : 'Paramètres d\'impression et de calibrage enregistrés avec succès !');
}

function resetCalibrationOffsets(isSettingsTab = false) {
  const s = { ...DEFAULT_PRINT_SETTINGS, field_offsets: {} };
  savePrintSettings(s);
  const xModal = document.getElementById('calib-offset-x');
  const yModal = document.getElementById('calib-offset-y');
  const xSet = document.getElementById('set-calib-offset-x');
  const ySet = document.getElementById('set-calib-offset-y');
  if (xModal) xModal.value = s.offset_x;
  if (yModal) yModal.value = s.offset_y;
  if (xSet) xSet.value = s.offset_x;
  if (ySet) ySet.value = s.offset_y;
  renderCalibDropdownAndCards();
  if (typeof updateCalibStudioUI === 'function') {
    updateCalibStudioUI();
  }
  renderDocumentPreview();
}

function printCalibrationTestPage() {
  printDocument(true, true);
}

// ================= CALIBRATION STUDIO CONTROLLER =================
const CALIB_FIELDS_DEF = [
  // 1. Général
  { key: 'global', category: 'general', cat_fr: 'Général', cat_ar: 'عام', icon: 'ti-world', label_fr: '🌐 Tout le document (Décalage global)', label_ar: '🌐 كامل السند (إزاحة عامة)' },
  
  // 2. Identité de l'agent
  { key: 'agent_name', category: 'agent', cat_fr: 'Agent', cat_ar: 'الموظف', icon: 'ti-user', label_fr: "Nom et prénom de l'agent", label_ar: 'الاسم واللقب' },
  { key: 'grade', category: 'agent', cat_fr: 'Agent', cat_ar: 'الموظف', icon: 'ti-briefcase', label_fr: 'Grade ou fonction', label_ar: 'الرتبة أو الوظيفة' },
  { key: 'service', category: 'agent', cat_fr: 'Agent', cat_ar: 'الموظف', icon: 'ti-building', label_fr: 'Structure ou service', label_ar: 'المصلحة أو الوكالة' },
  { key: 'address', category: 'agent', cat_fr: 'Agent', cat_ar: 'الموظف', icon: 'ti-home', label_fr: 'Adresse personnelle (Ligne 1)', label_ar: 'العنوان الشخصي (السطر 1)' },
  { key: 'address_2', category: 'agent', cat_fr: 'Agent', cat_ar: 'الموظف', icon: 'ti-home-2', label_fr: 'Adresse personnelle (Ligne 2)', label_ar: 'العنوان الشخصي (السطر 2)' },

  // 3. Durée & Adresse du Congé
  { key: 'leave_days', category: 'leave', cat_fr: 'Congé', cat_ar: 'العطلة', icon: 'ti-calendar-event', label_fr: 'Nombre de jours accordés (Chiffre)', label_ar: 'عدد الأيام الممنوحة (رقم)' },
  { key: 'leave_address', category: 'leave', cat_fr: 'Congé', cat_ar: 'العطلة', icon: 'ti-map-pin', label_fr: 'Adresse durant le congé', label_ar: 'العنوان أثناء العطلة' },

  // 4. Date de départ
  { key: 'dates_dep', category: 'dep_date', cat_fr: 'Date de Départ', cat_ar: 'تاريخ الخروج', icon: 'ti-calendar-share', label_fr: 'Date de départ (Groupe complet 6 cases)', label_ar: 'تاريخ الخروج (المجموعة كاملة)' },
  { key: 'dep_day', category: 'dep_date', cat_fr: 'Date de Départ', cat_ar: 'تاريخ الخروج', icon: 'ti-calendar', label_fr: 'Départ — Jour (Cases JJ)', label_ar: 'تاريخ الخروج — اليوم (JJ)' },
  { key: 'dep_month', category: 'dep_date', cat_fr: 'Date de Départ', cat_ar: 'تاريخ الخروج', icon: 'ti-calendar', label_fr: 'Départ — Mois (Cases MM)', label_ar: 'تاريخ الخروج — الشهر (MM)' },
  { key: 'dep_year', category: 'dep_date', cat_fr: 'Date de Départ', cat_ar: 'تاريخ الخروج', icon: 'ti-calendar', label_fr: 'Départ — Année (Cases AA)', label_ar: 'تاريخ الخروج — السنة (AA)' },

  // 5. Date de reprise
  { key: 'dates_ret', category: 'ret_date', cat_fr: 'Date de Reprise', cat_ar: 'تاريخ العودة', icon: 'ti-calendar-check', label_fr: 'Date de reprise (Groupe complet 6 cases)', label_ar: 'تاريخ العودة (المجموعة كاملة)' },
  { key: 'ret_day', category: 'ret_date', cat_fr: 'Date de Reprise', cat_ar: 'تاريخ العودة', icon: 'ti-calendar', label_fr: 'Reprise — Jour (Cases JJ)', label_ar: 'تاريخ العودة — اليوم (JJ)' },
  { key: 'ret_month', category: 'ret_date', cat_fr: 'Date de Reprise', cat_ar: 'تاريخ العودة', icon: 'ti-calendar', label_fr: 'Reprise — Mois (Cases MM)', label_ar: 'تاريخ العودة — الشهر (MM)' },
  { key: 'ret_year', category: 'ret_date', cat_fr: 'Date de Reprise', cat_ar: 'تاريخ العودة', icon: 'ti-calendar', label_fr: 'Reprise — Année (Cases AA)', label_ar: 'تاريخ العودة — السنة (AA)' },

  // 6. Lieu & Date d'établissement + Signature
  { key: 'location', category: 'sign', cat_fr: 'Signature & Lieu', cat_ar: 'المكان والتوقيع', icon: 'ti-building-community', label_fr: "Lieu d'établissement (Fait à...)", label_ar: 'مكان التحرير (حرر بـ...)' },
  { key: 'doc_date', category: 'sign', cat_fr: 'Signature & Lieu', cat_ar: 'المكان والتوقيع', icon: 'ti-calendar-time', label_fr: "Date d'établissement (Le...)", label_ar: 'تاريخ التحرير (في...)' },
  { key: 'signatory', category: 'sign', cat_fr: 'Signature & Lieu', cat_ar: 'المكان والتوقيع', icon: 'ti-signature', label_fr: 'Signature du Directeur', label_ar: 'إمضاء وختم المدير' },

  // 7. Chiffres & Tableau des droits
  { key: 'rights_table', category: 'rights', cat_fr: 'Tableau des Droits', cat_ar: 'جدول الأرصدة', icon: 'ti-table', label_fr: 'Tableau des droits (5 lignes complètes)', label_ar: 'جدول تفصيل الحقوق (الأرصدة ككل)' },
  { key: 'rights_prev', category: 'rights', cat_fr: 'Tableau des Droits', cat_ar: 'جدول الأرصدة', icon: 'ti-number', label_fr: '1. Reliquat antérieur (N-1)', label_ar: '1. رصيد سابق (N-1)' },
  { key: 'rights_cur', category: 'rights', cat_fr: 'Tableau des Droits', cat_ar: 'جدول الأرصدة', icon: 'ti-number', label_fr: '2. Droit annuel (N)', label_ar: '2. استحقاق السنة الحالية (N)' },
  { key: 'rights_tot', category: 'rights', cat_fr: 'Tableau des Droits', cat_ar: 'جدول الأرصدة', icon: 'ti-number', label_fr: '3. Total des droits acquis', label_ar: '3. مجموع الحقوق' },
  { key: 'rights_granted', category: 'rights', cat_fr: 'Tableau des Droits', cat_ar: 'جدول الأرصدة', icon: 'ti-number', label_fr: '4. Nombre de jours accordés', label_ar: '4. العطلة الممنوحة' },
  { key: 'rights_new', category: 'rights', cat_fr: 'Tableau des Droits', cat_ar: 'جدول الأرصدة', icon: 'ti-number', label_fr: '5. Nouveau solde restant', label_ar: '5. الرصيد المتبقي الجديد' }
];

const SAMPLE_CALIB_DATA_FR = {
  agent_name: 'BENALI Ahmed',
  grade: 'Chef de Département Informatique',
  service: 'Direction Générale - DSI',
  address_line_1: '12, Rue des Frères Bouadou, Bir Mourad Raïs',
  address_line_2: 'Bâtiment B, Alger',
  leave_days: 15,
  dep_date: '2026-07-01',
  ret_date: '2026-07-16',
  dep: { d1: '0', d2: '1', m1: '0', m2: '7', y1: '2', y2: '6' },
  ret: { d1: '1', d2: '6', m1: '0', m2: '7', y1: '2', y2: '6' },
  leave_address: '05, Bd Front de Mer, Oran',
  location: 'Alger',
  date: '25/06/2026',
  director: 'Le Directeur Général',
  prev_balance: 10,
  cur_entitlement: 30,
  tot_entitlement: 40,
  leave_granted: 15,
  new_balance: 25
};

const SAMPLE_CALIB_DATA_AR = {
  agent_name: 'بن علي أحمد',
  grade: 'رئيس قسم الإعلام الآلي',
  service: 'المديرية العامة - مديرية الأنظمة',
  address_line_1: '12، نهج الإخوة بوعدو، بئر مراد رايس',
  address_line_2: 'عمارة ب، الجزائر العاصمة',
  leave_days: 15,
  dep_date: '2026-07-01',
  ret_date: '2026-07-16',
  dep: { d1: '0', d2: '1', m1: '0', m2: '7', y1: '2', y2: '6' },
  ret: { d1: '1', d2: '6', m1: '0', m2: '7', y1: '2', y2: '6' },
  leave_address: '05، واجهة البحر، وهران',
  location: 'الجزائر',
  date: '25/06/2026',
  director: 'المدير العام',
  prev_balance: 10,
  cur_entitlement: 30,
  tot_entitlement: 40,
  leave_granted: 15,
  new_balance: 25
};

let calibActiveFieldKey = 'global';
let calibPreviewLang = 'fr';
let calibPreviewShowBg = true;

function toggleCalibFieldDropdown(event) {
  if (event) event.stopPropagation();
  const menu = document.getElementById('calib-field-overflow-menu');
  const trigger = document.getElementById('calib-field-trigger');
  if (!menu) return;

  const isVisible = (menu.style.display === 'block');
  closeAllCalibDropdowns();

  if (!isVisible) {
    menu.style.display = 'block';
    if (trigger) trigger.classList.add('active');
    const searchInput = document.getElementById('calib-field-search-input');
    if (searchInput) {
      searchInput.value = '';
      filterCalibFieldMenuItems('');
      setTimeout(() => searchInput.focus(), 60);
    }
  } else {
    menu.style.display = 'none';
    if (trigger) trigger.classList.remove('active');
  }
}

function closeCalibFieldDropdown() {
  const menu = document.getElementById('calib-field-overflow-menu');
  const trigger = document.getElementById('calib-field-trigger');
  if (menu) menu.style.display = 'none';
  if (trigger) trigger.classList.remove('active');
}

function filterCalibFieldMenuItems(query) {
  const container = document.getElementById('calib-field-menu-container');
  if (!container) return;
  const q = (query || '').toLowerCase().trim();
  const isAr = (currentAppLang === 'ar');
  const s = getPrintSettings();
  const fo = s.field_offsets || {};

  const categories = [
    { id: 'general', title: isAr ? '🌐 عام' : '🌐 Général' },
    { id: 'agent', title: isAr ? '👤 هوية الموظف' : "👤 Identité de l'agent" },
    { id: 'leave', title: isAr ? '🏖️ تفاصيل العطلة' : '🏖️ Détails du Congé' },
    { id: 'dep_date', title: isAr ? '📅 تاريخ الخروج' : '📅 Date de Départ' },
    { id: 'ret_date', title: isAr ? '📅 تاريخ العودة' : '📅 Date de Reprise' },
    { id: 'sign', title: isAr ? '✍️ التوقيع والمكان' : '✍️ Lieu & Signature' },
    { id: 'rights', title: isAr ? '📊 جدول الأرصدة والحقوق' : '📊 Tableau des Droits' }
  ];

  let html = '';
  categories.forEach(cat => {
    const fieldsInCat = CALIB_FIELDS_DEF.filter(f => f.category === cat.id && (
      !q ||
      f.label_fr.toLowerCase().includes(q) ||
      f.label_ar.toLowerCase().includes(q) ||
      f.cat_fr.toLowerCase().includes(q) ||
      f.cat_ar.toLowerCase().includes(q)
    ));

    if (fieldsInCat.length > 0) {
      html += `<div class="calib-category-header">${cat.title}</div>`;
      fieldsInCat.forEach(f => {
        const isActive = (f.key === calibActiveFieldKey);
        const label = isAr ? f.label_ar : f.label_fr;
        let offX = 0;
        let offY = 0;
        if (f.key === 'global') {
          offX = parseFloat(s.offset_x) || 0;
          offY = parseFloat(s.offset_y) || 0;
        } else if (fo[f.key]) {
          offX = parseFloat(fo[f.key].x) || 0;
          offY = parseFloat(fo[f.key].y) || 0;
        }
        const hasOffset = (offX !== 0 || offY !== 0);
        const offsetTxt = hasOffset ? `X:${offX > 0 ? '+' : ''}${offX} | Y:${offY > 0 ? '+' : ''}${offY}` : '0, 0';

        html += `
          <div class="calib-menu-item-row ${isActive ? 'active' : ''}" onclick="selectCalibField('${f.key}'); closeCalibFieldDropdown();">
            <div class="calib-menu-item-info">
              <i class="ti ${f.icon} calib-menu-item-icon"></i>
              <span class="calib-menu-item-text">${escapeHtml(label)}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <span class="calib-trigger-offset-pill ${hasOffset ? 'badge-modified' : ''}">${offsetTxt}</span>
              ${isActive ? '<i class="ti ti-check" style="color: var(--primary); font-size: 15px;"></i>' : ''}
            </div>
          </div>
        `;
      });
    }
  });

  if (!html) {
    html = `<div style="padding: 16px; text-align: center; color: var(--text-dim); font-size: 12px;">${isAr ? 'لا توجد نتائج مطابقة' : 'Aucun résultat correspondant'}</div>`;
  }

  container.innerHTML = html;
}

function selectCalibField(fieldKey) {
  calibActiveFieldKey = fieldKey || 'global';
  const def = CALIB_FIELDS_DEF.find(f => f.key === calibActiveFieldKey) || CALIB_FIELDS_DEF[0];
  const isAr = (currentAppLang === 'ar');
  const label = isAr ? def.label_ar : def.label_fr;
  const cat = isAr ? def.cat_ar : def.cat_fr;

  // 1. Update custom dropdown trigger
  const trigIcon = document.getElementById('calib-trigger-icon');
  const trigLabel = document.getElementById('calib-trigger-label');
  const trigCat = document.getElementById('calib-trigger-category');
  const trigPill = document.getElementById('calib-trigger-offset-pill');
  if (trigIcon) trigIcon.className = `ti ${def.icon}`;
  if (trigLabel) trigLabel.textContent = label;
  if (trigCat) trigCat.textContent = cat;

  // 2. Update active badge
  const iconEl = document.getElementById('calib-active-icon');
  const nameEl = document.getElementById('calib-active-name');
  if (iconEl) iconEl.className = `ti ${def.icon}`;
  if (nameEl) nameEl.textContent = label;

  // 3. Read current offset values
  const s = getPrintSettings();
  let valX = 0;
  let valY = 0;
  if (calibActiveFieldKey === 'global') {
    valX = parseFloat(s.offset_x) || 0;
    valY = parseFloat(s.offset_y) || 0;
  } else if (s.field_offsets && s.field_offsets[calibActiveFieldKey]) {
    valX = parseFloat(s.field_offsets[calibActiveFieldKey].x) || 0;
    valY = parseFloat(s.field_offsets[calibActiveFieldKey].y) || 0;
  }

  if (trigPill) {
    const hasOffset = (valX !== 0 || valY !== 0);
    trigPill.textContent = hasOffset ? `X:${valX > 0 ? '+' : ''}${valX} | Y:${valY > 0 ? '+' : ''}${valY}` : '0, 0';
    trigPill.classList.toggle('badge-modified', hasOffset);
  }

  const inputX = document.getElementById('calib-active-input-x');
  const inputY = document.getElementById('calib-active-input-y');
  if (inputX) inputX.value = valX;
  if (inputY) inputY.value = valY;

  // 4. Update quick list active highlight
  document.querySelectorAll('#calib-fields-quick-list .calib-field-row').forEach(row => {
    if (row.getAttribute('data-field-key') === calibActiveFieldKey) {
      row.classList.add('active');
      row.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    } else {
      row.classList.remove('active');
    }
  });

  // 5. Update canvas selection outline
  document.querySelectorAll('#calib-preview-canvas [data-calib-field]').forEach(el => {
    if (el.getAttribute('data-calib-field') === calibActiveFieldKey) {
      el.classList.add('selected-field');
    } else {
      el.classList.remove('selected-field');
    }
  });
}

function nudgeActiveField(axis, delta) {
  const s = getPrintSettings();
  if (!s.field_offsets) s.field_offsets = {};

  if (calibActiveFieldKey === 'global') {
    const prop = (axis === 'x') ? 'offset_x' : 'offset_y';
    s[prop] = Math.round(((parseFloat(s[prop]) || 0) + delta) * 10) / 10;
  } else {
    if (!s.field_offsets[calibActiveFieldKey]) {
      s.field_offsets[calibActiveFieldKey] = { x: 0, y: 0 };
    }
    const curVal = parseFloat(s.field_offsets[calibActiveFieldKey][axis]) || 0;
    s.field_offsets[calibActiveFieldKey][axis] = Math.round((curVal + delta) * 10) / 10;
  }

  savePrintSettings(s);
  updateCalibStudioUI(false);
  renderDocumentSheet();
}

function onActiveFieldInputChange(axis, val) {
  const num = parseFloat(val) || 0;
  const s = getPrintSettings();
  if (!s.field_offsets) s.field_offsets = {};

  if (calibActiveFieldKey === 'global') {
    const prop = (axis === 'x') ? 'offset_x' : 'offset_y';
    s[prop] = Math.round(num * 10) / 10;
  } else {
    if (!s.field_offsets[calibActiveFieldKey]) {
      s.field_offsets[calibActiveFieldKey] = { x: 0, y: 0 };
    }
    s.field_offsets[calibActiveFieldKey][axis] = Math.round(num * 10) / 10;
  }

  savePrintSettings(s);
  updateCalibStudioUI(false);
  renderDocumentSheet();
}

function resetActiveFieldOffset() {
  const s = getPrintSettings();
  if (!s.field_offsets) s.field_offsets = {};

  if (calibActiveFieldKey === 'global') {
    s.offset_x = 0;
    s.offset_y = 0;
  } else {
    delete s.field_offsets[calibActiveFieldKey];
  }

  savePrintSettings(s);
  updateCalibStudioUI(false);
  renderDocumentSheet();
}

function resetAllFieldOffsets() {
  const isAr = (currentAppLang === 'ar');
  const confirmMsg = isAr 
    ? 'هل أنت متأكد من إعادة ضبط جميع إزاحات الحقول والأرقام وإعادتها إلى الصفر؟'
    : 'Êtes-vous sûr de vouloir réinitialiser tous les décalages à zéro ?';
  if (!confirm(confirmMsg)) return;

  const s = getPrintSettings();
  s.offset_x = 0;
  s.offset_y = 0;
  s.field_offsets = {};
  savePrintSettings(s);
  updateCalibStudioUI();
  renderDocumentSheet();
}

function setCalibPreviewLang(lang) {
  calibPreviewLang = lang;
  const btnFr = document.getElementById('btn-calib-prev-lang-fr');
  const btnAr = document.getElementById('btn-calib-prev-lang-ar');
  if (btnFr) btnFr.classList.toggle('active', lang === 'fr');
  if (btnAr) btnAr.classList.toggle('active', lang === 'ar');
  renderCalibStudioPreview();
}

function toggleCalibPreviewBg() {
  calibPreviewShowBg = !calibPreviewShowBg;
  const btnBg = document.getElementById('btn-calib-prev-bg');
  if (btnBg) btnBg.classList.toggle('active', calibPreviewShowBg);
  renderCalibStudioPreview();
}

function renderCalibStudioPreview() {
  const canvas = document.getElementById('calib-preview-canvas');
  if (!canvas) return;

  const isAr = (calibPreviewLang === 'ar');
  const data = isAr ? SAMPLE_CALIB_DATA_AR : SAMPLE_CALIB_DATA_FR;

  const html = buildSheetHTML(data, isAr, true);
  canvas.innerHTML = html;

  const pageEl = canvas.querySelector('.document-page');
  if (pageEl) {
    pageEl.style.transform = 'scale(0.68)';
    pageEl.style.transformOrigin = 'top center';
    pageEl.style.margin = '0 auto';

    if (calibPreviewShowBg) {
      const bgUri = isAr 
        ? (window.TEMPLATE_AR_B64 || (typeof TEMPLATE_AR_B64 !== 'undefined' ? TEMPLATE_AR_B64 : ''))
        : (window.TEMPLATE_FR_B64 || (typeof TEMPLATE_FR_B64 !== 'undefined' ? TEMPLATE_FR_B64 : ''));
      if (bgUri) {
        pageEl.style.backgroundImage = `url("${bgUri}")`;
        pageEl.style.backgroundSize = '140mm 220mm';
        pageEl.style.backgroundColor = '#ffffff';
      }
    } else {
      pageEl.style.backgroundImage = 'none';
      pageEl.style.backgroundColor = '#ffffff';
    }
  }

  // Bind click-to-select on all fields inside preview
  canvas.querySelectorAll('[data-calib-field]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetField = e.currentTarget.getAttribute('data-calib-field');
      if (targetField) {
        selectCalibField(targetField);
      }
    });

    if (el.getAttribute('data-calib-field') === calibActiveFieldKey) {
      el.classList.add('selected-field');
    }
  });
}

function updateCalibStudioUI(rebuildMenu = true) {
  const isAr = (currentAppLang === 'ar');
  const s = getPrintSettings();
  const fo = s.field_offsets || {};

  // 1. Rebuild dropdown menu items
  if (rebuildMenu) {
    filterCalibFieldMenuItems('');
  }

  // 2. Quick list of all fields
  const quickListEl = document.getElementById('calib-fields-quick-list');
  if (quickListEl) {
    quickListEl.innerHTML = CALIB_FIELDS_DEF.map(f => {
      const isSel = (f.key === calibActiveFieldKey);
      const label = isAr ? f.label_ar : f.label_fr;
      let offX = 0;
      let offY = 0;
      if (f.key === 'global') {
        offX = parseFloat(s.offset_x) || 0;
        offY = parseFloat(s.offset_y) || 0;
      } else if (fo[f.key]) {
        offX = parseFloat(fo[f.key].x) || 0;
        offY = parseFloat(fo[f.key].y) || 0;
      }
      const hasOffset = (offX !== 0 || offY !== 0);
      const offsetTxt = hasOffset ? `X:${offX > 0 ? '+' : ''}${offX} | Y:${offY > 0 ? '+' : ''}${offY}` : '0, 0';

      return `
        <div class="calib-field-row ${isSel ? 'active' : ''} ${hasOffset ? 'has-offset' : ''}" data-field-key="${f.key}" onclick="selectCalibField('${f.key}')">
          <div class="calib-field-row-name">
            <i class="ti ${f.icon}"></i>
            <span>${escapeHtml(label)}</span>
          </div>
          <span class="calib-field-row-badge ${hasOffset ? 'badge-modified' : ''}">${offsetTxt}</span>
        </div>
      `;
    }).join('');
  }

  // 3. Update active item details
  selectCalibField(calibActiveFieldKey);

  // 4. Update preview canvas
  renderCalibStudioPreview();
}

// Print Document
async function printDocument(dataOnly = true, isTestPage = false) {
  if (!window.electronAPI) {
    window.print();
    return;
  }
  const printSettings = getPrintSettings();
  const feed = printSettings.paper_feed || 'official_140x220';
  const htmlContent = generatePrintHTML(dataOnly, isTestPage);
  // If printing on 140x220mm official paper directly, let Chromium honor CSS @page size 140mm 220mm
  const pageSize = (dataOnly && feed === 'official_140x220') ? undefined : 'A4';
  const res = await window.electronAPI.printDocument({ htmlContent, dataOnly, pageSize });
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

  const printSettings = getPrintSettings();
  const feed = printSettings.paper_feed || 'official_140x220';
  const htmlContent = generatePrintHTML(dataOnly);
  const pageSize = (dataOnly && feed === 'official_140x220') ? undefined : 'A4';
  const res = await window.electronAPI.savePDF({ htmlContent, defaultName, dataOnly, pageSize });
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
