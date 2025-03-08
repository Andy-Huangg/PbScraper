# PBTech URL Scraper

This Node.js application scrapes a URL of the PBTech website and sends an email notification when products are available.

## Features

- Scrapes the PBTech website for available stock.
- Filter to ignore unwated products.
- Sends an email notification when new products are available.
- Uses Puppeteer for web scraping.
- Uses Nodemailer for sending email notifications.
- Scheduled to run at specified intervals using node-cron.

## Prerequisites

- Node.js
- npm (Node Package Manager)

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/pbtech-scraper.git
   cd pbtech-scraper
2. Install the dependencies:
   ```
   npm install
3. Create a .env file in the root directory and add these details
   ```
   EMAIL_USER="your-email@gmail.com"
   EMAIL_PASSWORD="your-email-password"
## Usage

1. Update the urlToScrape variable in scraper.js with the URL you want to scrape e.g
   ```
   const urlToScrape = "https://www.pbtech.co.nz/category/components/graphics-cards/nvidia-desktop-graphics-cards/geforce-rtx-5080";
2. Run the scraper:
   ```
   node scraper.js
## Example
The application will log the following when it finds a product in stock and an email will be sent with the link to the product.
```
CARD FOUND! Notification email sent
