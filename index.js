import axios from "axios";
import { load } from "cheerio";
import validator from "validator";
import readline from "readline-sync";
import { writeFile } from "fs/promises";

// Helper to check if URL is reachable
const isReachable = async (url) => {
  try {
    const res = await axios.head(url, { timeout: 5000 });
    return res.status >= 200 && res.status < 400;
  } catch {
    return false;
  }
};

// Ask user for input
const userInput = readline.question(
  "Enter a search query OR comma-separated seed URLs:\n> "
);

// Process input into URLs
const extractUrls = (input) => {
  const possibleUrls = input
    .split(",")
    .map((url) => url.trim())
    .filter((url) => validator.isURL(url));
  return possibleUrls;
};

// Simulate query-based discovery (simplified)
const simulateSearchQuery = async (query) => {
  console.log("🔍 Simulating search for query:", query);
  // Normally you'd use a search API or scraper; here are sample discovered URLs:
  return ["https://stripe.com", "https://www.cloudflare.com"];
};

// Extract company data
const extractData = async (url) => {
  const data = {
    companyName: "",
    website: url,
    contact: "",
  };

  try {
    const res = await axios.get(url, { timeout: 10000 });
    const $ = load(res.data);

    data.companyName = $("title").text().trim();

    const bodyText = $("body").text().replace(/\s+/g, " "); // clean whitespace

    // Extract email
    const emailMatch = bodyText.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i);

    // Extract phone
    const phoneMatch = bodyText.match(
      /(\+?\d{1,3}[-.\s]?)?\(?\d{2,5}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/
    );

    // Log only if found
    if (emailMatch) console.log("📧 Email:", emailMatch[0]);
    if (phoneMatch) console.log("📞 Phone:", phoneMatch[0]);
    const email = bodyText.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i);
    const phone = bodyText.match(
      /(\+?\d{1,3}[-.\s]?)?\(?\d{2,5}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/
    );

    data.contact = email?.[0] || phone?.[0] || "Not found";
  } catch (err) {
    console.error(`❌ Could not process ${url}: ${err.message}`);
  }

  return data;
};

// Save output to CSV
const saveToCSV = async (data) => {
  const header = "Company Name,Website URL,Contact Info\n";
  const rows = data
    .map((d) => `"${d.companyName}","${d.website}","${d.contact}"`)
    .join("\n");

  await writeFile("output.csv", header + rows);
  console.log("✅ Output saved to output.csv");
};

// Main logic
const run = async () => {
  let urls = extractUrls(userInput);

  // If not URLs, assume search query
  if (urls.length === 0) {
    urls = await simulateSearchQuery(userInput);
  }

  const reachableUrls = [];

  for (const url of urls) {
    if (!validator.isURL(url)) {
      console.log(`⚠️ Invalid URL skipped: ${url}`);
      continue;
    }

    const reachable = await isReachable(url);
    if (reachable) {
      reachableUrls.push(url);
    } else {
      console.log(`⚠️ Unreachable URL skipped: ${url}`);
    }
  }

  if (!reachableUrls.length) {
    console.log("❌ No valid and reachable URLs to process.");
    return;
  }

  const results = [];

  for (const url of reachableUrls) {
    console.log(`🌐 Scraping: ${url}`);
    const data = await extractData(url);
    results.push(data);
  }

  await saveToCSV(results);
};

run();
