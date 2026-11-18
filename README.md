# CongéDesk

Desktop application for managing employee annual leave balances and generating official Algerian CNAS GRH.22 leave forms (*Titre de Congé Annuel / بيان العطلة السنوية*).

## Overview

CongéDesk automates vacation tracking and document preparation for CNAS human resources departments:
- **Leave Calculator:** Automatically calculates total entitlements and remaining balances using previous year carryover (N-1) plus the standard 30-day annual quota.
- **Bilingual Form Generation:** Generates the official GRH.22 form in French and Arabic (RTL) with segmented date boxes.
- **Pre-printed Stationery Support:** Hides all backgrounds, borders, and labels so only the data values are printed directly onto existing physical paper in the printer tray.
- **Full Document Print:** Prints the entire document (headers, borders, tables, signatures) onto blank paper.
- **Local Storage:** Stores employee profiles and leave history in a local SQLite database (`data/congedesk.sqlite`).

## Prerequisites

- Node.js 20+
- Windows 10 / 11 (64-bit)

## Installation & Development

```bash
# Install dependencies
npm install

# Start the application
npm start
```

## Packaging

Build the Windows release binaries:

```bash
# Build 64-bit installer and portable executable
npm run build:x64
```

Build artifacts are generated in `dist/`:
- `CongéDesk Setup 1.0.0.exe` — Windows NSIS installer
- `CongéDesk 1.0.0.exe` — Standalone portable executable

## Tech Stack

- **Framework:** Electron
- **Database:** SQLite (native `node:sqlite`)
- **Typography & Icons:** Tajawal (Arabic), FontAwesome Free
- **PDF & Print Engine:** Chromium Print-to-PDF / `pdf-lib`

## User Manual

An illustrated bilingual User Guide (French & Arabic) is included at `docs/CongéDesk_Manuel_Utilisation.pdf` and attached to the GitHub Releases page.

## Proprietary Notice

Private and proprietary software. For internal organizational use only. All rights reserved.
