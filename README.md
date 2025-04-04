
# 🌐 Website Checker

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![codecov](https://codecov.io/gh/2naive/website-checker/graph/badge.svg?token=A4RG8Z8IPA)](https://codecov.io/gh/2naive/website-checker)
![CI](https://github.com/2naive/website-checker/actions/workflows/test.yml/badge.svg)
![node-current](https://img.shields.io/badge/node-%3E%3D18.x-green)
![node-lts](https://img.shields.io/badge/node-lts%2Fhydrogen-brightgreen)
![npm](https://img.shields.io/npm/v/website-checker.svg)



> A modular, easily extendable website auditing tool built with Node.js. It provides detailed insights into SEO, performance, accessibility, content quality, and more.

---

## 🚀 Overview

**Website Checker** helps developers, SEO specialists, and website owners quickly evaluate websites. It provides modular checks covering SEO, HTML validation, performance metrics, spelling errors, structured data validation, and much more.

- ✅ **SEO Checks**: Robots.txt, sitemap.xml, meta tags, structured data, headings, broken links.
- 🚀 **Performance Checks**: Response times, Lighthouse performance scores.
- 📖 **Content Checks**: Spellchecking, headings validation.
- 📑 **Markup Checks**: HTML validation via W3C standards.
- 🔄 **Flexible and modular**: Easily add your own custom checks.

---

## 📦 Installation

### Prerequisites

- Node.js 18+ ([download here](https://nodejs.org))

### Clone repository:

```bash
git clone https://github.com/yourusername/website-checker.git
cd website-checker
npm install
```

---

## ⚙️ Usage

### Run audit from CLI

```bash
npm run audit https://example.com -- [options]
```

### Run as web service in your browser

```bash
npm run server
```

### Options:

- `-c, --config <path>`: Use a custom config file (default: `./config.json`)
- `-j, --json <path>`: Save results to a JSON file
- `-i, --include <items>`: Comma-separated list of checks or groups to include (runs only specified checks/groups)
- `-e, --exclude <items>`: Comma-separated list of checks or groups to exclude
- `-d, --depth <number>`: Depth of child pages to audit (default: 0, audits only the specified URL)

### Example

```bash
npm run audit https://example.com -- -e lighthousePerformance -d 2 -j results.json
```

---

## 🛠️ Available Checks

| Category      | Checks                              |
|---------------|-------------------------------------|
| **SEO**       | Robots.txt, Sitemap, Title length, Meta tags, Structured data, Broken links, Headings, Duplicate URLs |
| **Performance** | Response Time, Lighthouse Scores |
| **Content**   | Spellcheck                          |
| **Markup**    | HTML Validation (via W3C)           |

---

## 🧩 Adding Your Own Checks

Create a new check file in the appropriate folder inside `checks/`. Export your check as a default async function.

---

## 🧪 Testing & Coverage

Run tests:

```bash
npm test
```

Run coverage:

```bash
npm run coverage
```

Coverage report will be generated at `coverage/index.html`.

---

## 📝 Contributing

Pull requests are encouraged!

---

## 📃 License

[MIT](LICENSE) © 2naive

---

🎉 **Happy auditing!**
