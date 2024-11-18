const constants = require('../config/constants');
const logger = require('../utils/logger');

class PortalService {
  constructor(page) {
    this.page = page;
  }

  async login(mobileNumber) {
    try {
      logger.info(`Navigating to portal: ${constants.PORTAL_URL}`);
      await this.page.goto(constants.PORTAL_URL, {
        waitUntil: 'networkidle0',
        timeout: constants.TIMEOUTS.NAVIGATION
      });

      logger.info('Waiting for login form');
      await this.page.waitForSelector(constants.SELECTORS.LOGIN_FORM, {
        timeout: constants.TIMEOUTS.ELEMENT_WAIT
      });

      logger.info('Filling login credentials');
      await this.page.type(constants.SELECTORS.MOBILE_INPUT, mobileNumber);
      await this.page.type(constants.SELECTORS.PASSWORD_INPUT, constants.DEFAULT_PASSWORD);

      logger.info('Submitting login form');
      await Promise.all([
        this.page.evaluate(() => {
          document.querySelector('form').submit();
        }),
        this.page.waitForNavigation({
          waitUntil: 'networkidle0',
          timeout: constants.TIMEOUTS.LOGIN_WAIT
        })
      ]);

      // Check for login errors
      const errorElement = await this.page.$('.error-message, .alert-danger');
      if (errorElement) {
        const errorText = await this.page.evaluate(el => el.textContent, errorElement);
        throw new Error(`Login failed: ${errorText.trim()}`);
      }

      logger.info('Login successful');
    } catch (error) {
      logger.error('Login failed', { error: error.message, mobileNumber });
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  async extractAttendanceData() {
    try {
      logger.info('Waiting for attendance table');
      await this.page.waitForSelector(constants.SELECTORS.SUBJECT_ROW, {
        timeout: constants.TIMEOUTS.ELEMENT_WAIT
      });

      // Take screenshot for debugging
      await this.page.screenshot({ path: 'attendance-page.png' });

      logger.info('Extracting attendance data');
      const data = await this.page.evaluate((selectors) => {
        const rows = Array.from(document.querySelectorAll(selectors.SUBJECT_ROW));
        const subjects = [];
        let totalAttendance = 0;
        let subjectCount = 0;

        // Skip header row
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          const subject = row.querySelector(selectors.SUBJECT_CELL)?.innerText?.trim();
          const theory = row.querySelector(selectors.THEORY_CELL)?.innerText?.trim();
          const practical = row.querySelector(selectors.PRACTICAL_CELL)?.innerText?.trim();

          if (subject && theory && !subject.toLowerCase().includes('subject')) {
            const theoryPercentage = parseFloat(theory.replace('%', '')) || 0;
            subjects.push({
              subject,
              theory: theory || 'N/A',
              practical: practical || 'N/A'
            });
            totalAttendance += theoryPercentage;
            subjectCount++;
          }
        }

        const averageAttendance = subjectCount > 0 
          ? (totalAttendance / subjectCount).toFixed(2) 
          : 0;

        return {
          subjects,
          averageAttendance
        };
      }, constants.SELECTORS);

      if (!data.subjects.length) {
        throw new Error('No attendance data found in the table');
      }

      logger.info('Successfully extracted attendance data', { 
        subjectsCount: data.subjects.length,
        averageAttendance: data.averageAttendance 
      });

      return data;
    } catch (error) {
      logger.error('Failed to extract attendance data', { error: error.message });
      throw new Error(`Failed to extract attendance data: ${error.message}`);
    }
  }
}

module.exports = PortalService;