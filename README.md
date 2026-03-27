# 🔐 PassVault - Zero-Knowledge Password Manager

A lightweight, highly secure, and offline-first password manager that lives entirely in your web browser.

**PassVault** is built with a **Zero-Knowledge architecture** — meaning:

* ❌ No backend servers
* ❌ No databases
* ❌ No cloud syncing

👉 Your data **never leaves your device**, making it immune to server-side data breaches.

---

## ✨ Features

* 🔒 **100% Offline & Private**
  No Firebase, no databases, no external API calls. Everything stays on your machine.

* 🛡️ **Military-Grade Encryption**
  Your entire password vault is encrypted using **AES-256 encryption**.

* 👥 **Multi-User Support**
  Multiple users can safely use the same device. Each vault is isolated using **SHA-256 hashing** of the master password.

* ⚡ **Built-in Password Generator**
  Generate secure and memorable passwords instantly.

* 🎨 **Modern UI**
  Clean and responsive interface built with **React + Tailwind CSS**.

* 📋 **One-Click Copy**
  Easily copy passwords with visual feedback.

---

## 🛠️ Tech Stack

* **Frontend Framework:** React 18 (with Vite)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Security/Cryptography:** crypto-js (AES & SHA-256)
* **Icons:** lucide-react

---

## 🧠 How the Security Works

### 🔑 1. The Fingerprint (Storage Key)

* Your **Master Password** is hashed using **SHA-256**
* This creates a unique fingerprint
* Used as a key/folder name in **Local Storage**
* Ensures complete isolation between users

---

### 🔐 2. The Vault (Encryption)

* All saved passwords are bundled together
* Encrypted using **AES-256**
* Your **Master Password acts as the encryption key**

---

### 🧾 3. The Result

* Local Storage only contains:

  * A hashed key (folder name)
  * Encrypted data (unreadable text)

👉 Without the correct Master Password, **data cannot be decrypted**

---

## 🚀 Getting Started (Run Locally)

### ✅ Prerequisites

* Install **Node.js**

---

### 📥 Installation

1. Clone this repository:

```bash
git clone https://github.com/Saksham-Gupta077/SecureVault.git
```

2. Open the project in VS Code

3. Open terminal:

```bash
Ctrl + `
```

4. Install dependencies:

```bash
npm install
```

5. Start development server:

```bash
npm run dev
```

---

### 🌐 Run the App

Open your browser and go to:

```text
http://localhost:5173
```

---

## 📂 Project Structure

```bash
src/
│── App.tsx                # Main entry (Login + Dashboard routing)
│
├── components/
│   ├── Login.tsx         # Master password screen
│   └── Dashboard.tsx     # Password vault UI
│
├── lib/
│   ├── encryption.ts     # AES + SHA-256 logic
│   └── generator.ts      # Password generator logic
```

---

## 🔮 Future Improvements

* 🌐 Convert into **Chrome/Edge Extension**
* 🔐 Improve generator:

  * Fully random 16+ character passwords
* 📦 Add:

  * Export/Import encrypted vault
  * Backup system

---

## 👨‍💻 Author

**Saksham Gupta**
GitHub: https://github.com/Saksham-Gupta077

---

## ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub!
