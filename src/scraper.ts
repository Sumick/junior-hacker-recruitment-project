import puppeteer from 'puppeteer';

async function scrapeInvoices() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://example.com');
  // Add scraping logic here
  await browser.close();
}

scrapeInvoices();