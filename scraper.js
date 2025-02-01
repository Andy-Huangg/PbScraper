require("dotenv").config({ path: "./details.env" });
const puppeteer = require("puppeteer");
const nodemailer = require("nodemailer");
const cron = require("node-cron");

urlToScrape =
  "https://www.pbtech.co.nz/category/components/graphics-cards/nvidia-desktop-graphics-cards/geforce-rtx-5080";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

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
async function scrapePage(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
  );

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

    if (addToCartButton.length > 0) {
      addToCartButton.map((productID) => console.log(productID));
      await sendNotification(addToCartButton, url);
    } else {
      console.log("Result: No cards found");
    }
  } catch (error) {
    console.error("Result: Error during scraping:", error);
  } finally {
    await browser.close();
  }
}

cron.schedule("15,30,45,0 * * * *", async () => {
  console.log(`Checking for stock at ${new Date().toLocaleString()}`);
  scrapePage(urlToScrape);
});

console.log(`Checking for stock at ${new Date().toLocaleString()}`);
console.log("Will be ran again at xx:15, xx:30, xx:45, xx:00");
scrapePage(urlToScrape);
