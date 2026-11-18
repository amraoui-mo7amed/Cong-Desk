# CongéDesk v1.0.0 - Official Release

Desktop application for leave management and automated filling of the official CNAS GRH.22 form (*Titre de Congé Annuel / بيان العطلة السنوية*).

---

## 📦 Downloads

| Asset | Architecture | Description |
| :--- | :--- | :--- |
| **`CongéDesk-Setup-1.0.0-x64.exe`** | Windows 64-bit (x64) | Standard installer for 64-bit Windows with desktop and start menu shortcuts |
| **`CongéDesk-Setup-1.0.0-ia32.exe`** | Windows 32-bit (ia32) | Native 32-bit installer for older Windows systems |
| **`CongéDesk_Manuel_Utilisation.pdf`** | Cross-platform | Illustrated user guide with step-by-step instructions in **French & Arabic** |

---

## 🛠️ Highlights & Fixes

- **Fix `pdf-lib` module resolution**: Resolved runtime `Cannot find module 'pdf-lib'` by bundling dependency inside production ASAR.
- **Full 32-bit & 64-bit Windows support**: Dedicated NSIS installers for both x64 and ia32 architectures.
- **Embedded SQLite Database**: Fast, atomic local persistence stored in `data/congedesk.sqlite`.
- **Pre-printed Official Form Support**: Transparent PDF generation mode designed specifically for printing data directly onto pre-existing forms in the printer tray.
- **Strict Linguistic Isolation**: Fully independent French and Arabic interfaces (Tajawal typography and complete RTL support).
- **Synchronous Form Preview & Calculation**: Dynamic leave balance and resumption date computation.
