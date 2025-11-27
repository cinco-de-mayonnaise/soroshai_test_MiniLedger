# MiniLedger Web
An attempt at completing the Technical Assignment for Junior Python Developer position at Sorosh AI

MiniLedger Web is a lightweight, browser-based ledger processor designed to load a JSON file containing accounts and financial transactions, validate them using clear deterministic rules, and display the final ledger state along with warnings for invalid transactions.

This project provides:

- A clean React + Tailwind CSS frontend
- Full client-side JSON parsing
- Deterministic and rule-compliant transaction processing
- A JavaScript based webapp targetting both desktop and mobile systems.
- Responsive, simple UI that looks great on a plethora of screens.

## Features
✔ Upload & parse a JSON ledger file

Users upload a .json file that contains:

Initial account balances

A list of financial transactions

✔ Deterministic transaction engine

Handles:

DEPOSIT

WITHDRAW

TRANSFER

With full validation:

Unknown accounts

Duplicate transaction IDs

Negative/zero amounts

Insufficient funds

Same-account transfer

Out-of-order timestamps (sorted automatically)

✔ Ledger viewer

Displays:

Initial balance

Final balance

Account status (normal/negative)

✔ Warning panel

Shows invalid transactions with human-readable reasons.

✔ Responsive UI

Works on mobile, tablets, and desktops.

## Tech Stack

- React 18+
- Tailwind CSS
- Vite (recommended) or Create-React-App
- JavaScript / ES Modules

## Installation & Setup

Below are instructions for Windows, Linux, and macOS.

🖥️ 1. Prerequisites

You need:

Node.js version 18 or newer

npm or yarn

Check your versions:

node -v
npm -v


If you need Node.js:

👉 https://nodejs.org/

📥 2. Clone the Repository

Open a terminal (PowerShell / CMD / Git Bash / Linux terminal):

git clone https://github.com/yourusername/miniledger-web.git
cd miniledger-web


(Replace the URL with your actual GitHub repo)

📚 3. Install Dependencies
npm install


(or)

yarn install

▶️ 4. Run the Development Server
npm run dev


Vite will print an address like:

http://localhost:5173/


Open it in your browser.

🏗️ 5. Build for Production
npm run build


This generates static files in:

dist/


To preview the production build:

npm run preview

🧪 6. Running Unit Tests

(If you added test coverage with Jest/Vitest)

npm run test

🧰 Running on Windows

Everything works the same as Linux/macOS.

Recommended terminals:

PowerShell

Git Bash

Windows Terminal

Node installation is straightforward via the official installer.

🐧 Running on Linux (Ubuntu / Debian / Fedora / Arch)

Install Node from your package manager or via NodeSource:

Example (Ubuntu):

sudo apt update
sudo apt install nodejs npm


Or recommended (latest Node):

curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs


Then clone + run as usual.

🍎 Running on macOS

Homebrew users:

brew install node


Then clone + run as usual.

## Input JSON Format

```
{
  "accounts": [
    { "id": "A001", "balance": 1000 },
    { "id": "A002", "balance": 500 }
  ],
  "transactions": [
    { "id": "T100", "timestamp": "2025-01-01T10:00", "type": "DEPOSIT", "account": "A001", "amount": 200 },
    { "id": "T101", "timestamp": "2025-01-01T10:01", "type": "WITHDRAW", "account": "A002", "amount": 600 }
  ]
}
```

## Architecture Overview

MiniLedger is split into three major layers:

1. UI Layer (React + Tailwind)

Handles user inputs and displays results.

2. Parsing Layer

Reads JSON from file input and sanitizes the structure.

3. Transaction Engine

Sorts by timestamp, validates rules, computes final ledger, produces warnings.

Logic is intentionally decoupled from UI to make the engine portable.
