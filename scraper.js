const dotenv = require("dotenv");
const puppeteer = require("puppeteer");
const nodemailer = require("nodemailer");
const cron = require("node-cron");
dotenv.config();

// Set the URL to a page on PBTECH that has an "add to cart" button
const urlToScrape =
  "https://www.pbtech.co.nz/category/components/graphics-cards/nvidia-desktop-graphics-cards/geforce-rtx-5080";
// Set filter to ignore products, just add in the ID
const productIDFilter = ["VGAPNY150801"];

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Send Email
async function sendNotification(products, url) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: "PBTECH items available!",
    text: `Available Product Links:
    ${products.map((productID) => {
      return `https://www.pbtech.co.nz/product/${productID} \n`;
    })}
    Scrape page: ${url}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("CARD FOUND! Notification email sent");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
async function scrapePage(page, url) {
  try {
    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    await page.waitForSelector("body", { timeout: 15000 });

    const addToCartButton = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button")).filter(
        (el) => el.textContent.trim().toLowerCase().includes("add to cart")
      );
      return buttons.map((button) => button.getAttribute("data-product-id"));
    });
    productsAvailable = addToCartButton.filter(
      (product) => !productIDFilter.includes(product)
    );

    if (productsAvailable.length > 0) {
      addToCartButton.map((productID) => console.log(productID));

      await sendNotification(productsAvailable, url);
    } else {
      console.log("Result: No cards found");
    }
  } catch (error) {
    console.error("Result: Error during scraping:", error);
  }
}

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
  );

  // Check for products in the set intervals.
  cron.schedule("* * * * *", async () => {
    console.log(`Checking for stock at ${new Date().toLocaleString()}`);
    await scrapePage(page, urlToScrape);
    await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
  });

  console.log(`Checking for stock at ${new Date().toLocaleString()}`);
  console.log("Will be ran every minute from now on");
  scrapePage(page, urlToScrape);
})();
