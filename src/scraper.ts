const puppeteer = require('puppeteer');

(async () => {
    // Launch the browser
    const browser = await puppeteer.launch({
        headless: true, // Set to false if you want to see the browser UI
    });
    const page = await browser.newPage();

    // Go to the predefined URL (replace with your URL)
    const url = 'https://example.com/invoices';
    await page.goto(url, { waitUntil: 'networkidle2' });

    let invoices = [];

    let hasNextPage = true;

    while (hasNextPage) {
        // Wait for the invoice table to load
        await page.waitForSelector('.invoice-table');

        // Extract invoice data from the current page
        let newInvoices = await page.evaluate(() => {
            const rows = document.querySelectorAll('.invoice-row');
            let data = [];
            rows.forEach(row => {
                const invoiceNumber = row.querySelector('.invoice-number').innerText;
                const date = row.querySelector('.invoice-date').innerText;
                const amount = row.querySelector('.invoice-amount').innerText;

                data.push({
                    invoiceNumber,
                    date,
                    amount
                });
            });
            return data;
        });

        invoices = invoices.concat(newInvoices);

        // Check if a "next page" button or link is present
        const nextPageButton = await page.$('.pagination-next');

        if (nextPageButton) {
            await Promise.all([
                page.waitForNavigation({ waitUntil: 'networkidle2' }),
                nextPageButton.click(),
            ]);
        } else {
            hasNextPage = false;
        }
    }

    // Output the extracted data
    console.log(invoices);

    // Close the browser
    await browser.close();
})();
