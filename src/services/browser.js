const puppeteer = require('puppeteer');
const logger = require('../utils/logger');

class BrowserService {
  constructor() {
    this.browser = null;
  }

  async initialize() {
    try {
      logger.info('Initializing Chrome browser');
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox']
      });
      logger.info('Chrome browser initialized successfully');
      return this.browser;
    } catch (error) {
      logger.error('Failed to initialize browser', { error: error.message });
      throw new Error('Unable to start browser service. Please try again later.');
    }
  }

  async close() {
    if (this.browser) {
      try {
        await this.browser.close();
        this.browser = null;
        logger.info('Browser closed successfully');
      } catch (error) {
        logger.error('Error closing browser', { error: error.message });
      }
    }
  }
}

module.exports = new BrowserService();