# Node.js Books Scraper

A books scraping application built with Node.js and Cheerio to extract book information from [Books to Scrape](https://books.toscrape.com/), with pagination, error handling, data exports, and automated scheduling.

## 📦 Installation

Install globally using npm:

```bash
npm install -g nodejs-books-scraper
```

## 🚀 Usage

Run the scraper:

```bash
nodejs-books-scraper
```

## ✨ Features

* Extracts book titles, prices, availability, ratings, and URLs.
* Automatically navigates through multiple pages using pagination.
* Handles HTTP errors, request timeouts, and missing data.
* Exports scraped data into JSON and CSV formats.
* Supports UTF-8 encoding for proper character display in Excel.
* Automates scraping at regular intervals using `setInterval()`.
* Prevents overlapping scraping executions.

## 🛠️ Tech Stack

* Node.js
* JavaScript
* Cheerio
* Fetch API
* File System (fs)
* Path
* setInterval()

## 📦 npm Package

[View package on npm](https://www.npmjs.com/package/nodejs-books-scraper)
