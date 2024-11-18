const puppeteer = require('puppeteer');

class BrowserService {
  constructor() {
    this.browser = null;
  }

  async initialize() {
    this.browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox']
    });
    return this.browser;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

module.exports = new BrowserService();