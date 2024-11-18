const constants = require('../config/constants');

class PortalService {
  constructor(page) {
    this.page = page;
  }

  async login(mobileNumber) {
    try {
      await this.page.goto(constants.PORTAL_URL, {
        waitUntil: 'networkidle0',
        timeout: constants.TIMEOUTS.NAVIGATION,
      });

      // Wait for the login form
      await this.page.waitForSelector(constants.SELECTORS.LOGIN_FORM, {
        timeout: constants.TIMEOUTS.ELEMENT_WAIT,
      });

      // Fill login details
      await this.page.type(constants.SELECTORS.MOBILE_INPUT, mobileNumber);
      await this.page.type(
        constants.SELECTORS.PASSWORD_INPUT,
        constants.DEFAULT_PASSWORD
      );

      // Submit form and wait for navigation
      await Promise.all([
        this.page.evaluate(() => {
          document.querySelector('form').submit();
        }),
        this.page.waitForNavigation({
          waitUntil: 'networkidle0',
          timeout: constants.TIMEOUTS.LOGIN_WAIT,
        }),
      ]);
    } catch (error) {
      throw new Error(
        'Login failed. Please check your credentials and try again.'
      );
    }
  }

  async extractAttendanceData() {
    try {
      // Wait for the attendance data to load
      await this.page.waitForSelector(constants.SELECTORS.SUBJECT_ROW, {
        timeout: constants.TIMEOUTS.ELEMENT_WAIT,
      });

      return await this.page.evaluate((selectors) => {
        const rows = document.querySelectorAll(selectors.SUBJECT_ROW);
        const subjects = [];
        let totalAttendance = 0;
        let subjectCount = 0;

        rows.forEach((row) => {
          const subject = row
            .querySelector(selectors.SUBJECT_CELL)
            ?.innerText?.trim();
          const theory = row
            .querySelector(selectors.THEORY_CELL)
            ?.innerText?.trim();
          const practical = row
            .querySelector(selectors.PRACTICAL_CELL)
            ?.innerText?.trim();

          if (subject && theory && !subject.toLowerCase().includes('subject')) {
            const theoryPercentage = parseFloat(theory.replace('%', '')) || 0;
            subjects.push({
              subject,
              theory: theory || 'N/A',
              practical: practical || 'N/A',
            });
            totalAttendance += theoryPercentage;
            subjectCount++;
          }
        });

        const averageAttendance =
          subjectCount > 0 ? (totalAttendance / subjectCount).toFixed(2) : 0;

        return {
          subjects,
          averageAttendance,
        };
      }, constants.SELECTORS);
    } catch (error) {
      throw new Error('Failed to extract attendance data. Please try again.');
    }
  }
}

module.exports = PortalService;
