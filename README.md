# CongéDesk

> Application de bureau moderne pour la gestion des congés annuels et le remplissage automatisé du formulaire officiel **CNAS GRH.22** (*Titre de Congé Annuel / بيان العطلة السنوية*).

---

## ✨ Fonctionnalités Principales

- **Base de données SQLite** : Stockage fiable et rapide via le module natif `node:sqlite`.
- **Interface Cartes & KPIs** : Vue d'ensemble avec indicateurs statistiques clés (Total employés, droit légal, titres émis, reliquats N-1) et grille de cartes d'employés avec jauges de reliquat.
- **Bilinguisme Total & Isolation Stricte** :
  - **Mode Français** : Affichage et formulaire 100% en français.
  - **Mode Arabe (RTL)** : Affichage et formulaire 100% en arabe avec typographie **Tajawal**.
- **Calculateur Automatique de Congés** :
  - Calcul dynamique du droit total : $\text{Total Droit} = \text{Reliquat N-1} + \text{Droit Annuel}$.
  - Calcul instantané du solde restant et des dates de départ / reprise.
  - Alertes automatiques en cas de dépassement ou d'épuisement du solde.
- **Aperçu Synchrone & Modal Dédié** :
  - Visualisation en temps réel du document officiel GRH.22.
  - Fonction zoom (50% à 160%) et inspection avant impression.
- **Impression Papier Officiel & PDF Données Seules** :
  - **Impression Document Complet** : Imprime l'intégralité du formulaire (cadres, logos, intitulés et données).
  - **Impression Papier Officiel Pré-imprimé** : Rend les arrière-plans et bordures transparents pour imprimer exclusivement les données textuelles aux coordonnées physiques exactes sur le papier pré-imprimé existant dans l'imprimante.
- **Thèmes Clair / Sombre** : Thème clair moderne par défaut avec bascule instantanée vers le mode sombre.
- **Design Épuré** :
  - Sans barre de menus superflue.
  - Icônes vectorielles **FontAwesome**.
  - Logo personnalisé et icônes d'application multi-résolution.

---

## 🚀 Installation & Lancement (Développement)

```powershell
# Installation des dépendances
npm install

# Lancement de l'application
npm start
```

---

## 📦 Compilation & Release

```powershell
# Compilation Windows 64-bit
npm run build:x64

# Compilation Windows 32-bit
npm run build:ia32
```

Les fichiers exécutables (.exe d'installation NSIS et version Portable autonome) sont générés dans le dossier `dist/`.

---

## 🔒 Confidentialité & Propriété

Ce logiciel est une solution **propriétaire privée**, réservée à un usage interne exclusif.
- **Dépôt Privé & Code Fermé** (Non Open-Source).
- Tous droits de propriété intellectuelle réservés © 2026.
- Toute reproduction, redistribution ou exploitation non autorisée est strictement prohibée.
