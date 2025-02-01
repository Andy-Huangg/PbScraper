const puppeteer = require("puppeteer");

async function scrapePage(url) {
  const browser = await puppeteer.launch({
    headless: false, // Set to true for headless mode
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  // Set a realistic user agent
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
  );

  try {
    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    // Wait for the page to load completely
    await page.waitForSelector("body", { timeout: 15000 });

    // Check for Add to Cart button
    const addToCartButton = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button")).filter(
        (el) => el.textContent.trim().toLowerCase().includes("add to cart")
      );
      return buttons.map((button) => button.getAttribute("data-product-id"));
    });

    if (addToCartButton.length > 0) {
      addToCartButton.map((productID) => console.log(productID));
    } else {
      console.log("No cards found");
    }
  } catch (error) {
    console.error("Error during scraping:", error);
  } finally {
    await browser.close();
  }
}

scrapePage(
  "https://www.pbtech.co.nz/category/components/graphics-cards/nvidia-desktop-graphics-cards/geforce-rtx-4060"
);
