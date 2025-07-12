# 🌐 Web Scraper

This project is a lightweight Node.js-based web scraper that extracts basic company information from a list of URLs. It supports company name extraction via `<title>`, as well as emails and phone numbers from page content.

---

## 🚀 Features

- ✅ Accepts **user-defined search queries** or **seed URLs**
- ✅ Validates and checks **URL formatting & reachability**
- ✅ Extracts:
  - Company name from `<title>`
  - Website URL (input)
  - Email addresses (first match)
  - Phone numbers (first match)
- ✅ Handles:
  - Network failures
  - Missing or malformed data
- ✅ Saves results to a clean `output.csv` file

---

## 🧪 Extraction Level

| Field         | How it's Extracted       | Level         |
|---------------|---------------------------|---------------|
| Company Name  | `<title>` tag             | Page-level    |
| Website URL   | Input directly             | Source-level  |
| Email / Phone | Regex from body text      | Shallow       |

> ⚠️ This scraper does **not** crawl subpages like `/contact` unless added to the seed list.

---

## ⚙️ Setup Instructions

1. **Clone this repository**
```bash
git clone https://github.com/your-username/web-scrapper.git
cd web-scrapper
npm install
npm start
