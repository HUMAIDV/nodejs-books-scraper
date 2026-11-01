#!/usr/bin/env node

const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')

const [format] = process.argv.slice(3)

function convertToCSV(books) {
    const headers = ["title", "price", "availability", "rating", "bookUrl"];
    const rows = books.map(book => {
        return headers.map(header => {
            const value = String(book[header] ?? "");
            return `"${value.replace(/"/g, '""')}"`

        }).join(",")
    })

    return [headers.join(","), ...rows].join("\n")
}

async function scrapeBooks() {

    try {
        const baseUrl = "https://books.toscrape.com/";
        let currentUrl = baseUrl;
        const books = []

        while (currentUrl) {
            console.log("Fetching URL:", currentUrl);

            const response = await fetch(currentUrl, { signal: AbortSignal.timeout(30000) })

            if (!response.ok) {
                throw new Error(`HTTP Error : ${response.status}`)
            }

            const html = await response.text()

            const $ = cheerio.load(html)

            $(".product_pod").each((index, element) => {
                const title = $(element).find("h3 a").attr("title") || "Title unavailable";
                const price = $(element).find(".price_color").text() || "Price unavailble";
                const availability = $(element).find(".availability").text()?.trim() || "Availability unknown";
                const rating = $(element).find(".star-rating").attr("class")?.replace("star-rating ", "") || "Rating unavailable";
                const bookUrl = $(element).find("h3 a").attr("href") || "Url unavailable"

                books.push({ title, price, availability, rating, bookUrl })

            });
            const nextPage = $("li.next a").attr("href")
            currentUrl = nextPage ? new URL(nextPage, currentUrl).href : null;
        };

        if (books.length === 0) {
            throw new Error("No books found. The website structure may have changed")
        }

        const dataDir = path.join(__dirname, "data")
        const filePath = path.join(dataDir, "books.json")

        const csv = convertToCSV(books)
        const csvPath = path.join(dataDir, "books.csv")

        console.log(`${books.length} books scraped successfully!`);

        switch (format) {
            case "json":
                fs.writeFileSync(filePath, JSON.stringify(books, null, 2))
                console.log(`JSON saved to ${filePath}`);
                break;
            case "csv":
                fs.writeFileSync(csvPath, "\uFEFF" + csv, "utf-8")
                console.log(`CSV saved to ${csvPath}`);
                break;
            default:
                fs.writeFileSync(filePath, JSON.stringify(books, null, 2))
                fs.writeFileSync(csvPath, "\uFEFF" + csv, "utf-8")
                console.log(`JSON saved to ${filePath}`);
                console.log(`CSV saved to ${csvPath}`);
        }

    } catch (error) {
        console.log("Error fetching data:", error);
    }
}

console.log("Scraper will run after 1 minute.");
let isRunning = false

setInterval(async () => {
    if (isRunning) {
        console.log("Already running...");
        return;
    }
    isRunning = true
    try {
        await scrapeBooks()
        console.log("Scraper will run after 1 minute.");

    } catch (error) {
        console.log(error.message);

    } finally {
        isRunning = false;
    }
}, 60 * 1000)
