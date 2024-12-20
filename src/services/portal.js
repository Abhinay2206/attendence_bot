const constants = require('../config/constants');
const logger = require('../utils/logger');

class PortalService {
  constructor(page) {
    this.page = page;
  }

  async login(portalUrl,mobileNumber,institute) {
    try {
      logger.info(`Navigating to portal: ${portalUrl}`);
      await this.page.goto(portalUrl, {
        waitUntil: 'domcontentloaded',
        timeout: constants.TIMEOUTS.NAVIGATION
      });

      logger.info('Waiting for login form');
      await this.page.waitForSelector(constants.SELECTORS.LOGIN_FORM, {
        timeout: constants.TIMEOUTS.ELEMENT_WAIT
      });

      logger.info('Filling login credentials');
      await this.page.type(constants.SELECTORS.MOBILE_INPUT, mobileNumber);
      const password = institute === 'NGIT' ? 'Ngit123$' : 'Kmec123$';
      await this.page.type(constants.SELECTORS.PASSWORD_INPUT, password);

      logger.info('Submitting login form');
      await Promise.all([
        this.page.click(constants.SELECTORS.SUBMIT_BUTTON),
        this.page.waitForNavigation({
          waitUntil: 'domcontentloaded',
          timeout: constants.TIMEOUTS.LOGIN_WAIT
        })
      ]);

      const errorElement = await this.page.$('.error-message, .alert-danger');
      if (errorElement) {
        const errorText = await this.page.evaluate(el => el.textContent, errorElement);
        throw new Error(`Login failed: ${errorText.trim()}`);
      }

      logger.info('Navigating to attendance page after login');
      const attendanceUrl = institute === 'NGIT' 
        ? 'http://ngit-netra.teleuniv.in/student/attendance' 
        : 'http://kmec-netra.teleuniv.in/student/attendance';
      await this.page.goto(attendanceUrl, {
        waitUntil: 'domcontentloaded',
        timeout: constants.TIMEOUTS.NAVIGATION
      });
      
      logger.info('Login and navigation successful');
    } catch (error) {
      const errorMessage = error.message || 'Unknown error';
      logger.error('Login failed', { error: errorMessage, mobileNumber });
      throw new Error(`Login failed: ${errorMessage}`);
    }
  }

  async extractAttendanceData() {
    try {
      logger.info('Waiting for attendance section');
      await this.page.waitForSelector('.ant-collapse-item', {
        visible: true,
        timeout: constants.TIMEOUTS.ELEMENT_WAIT,
      });
  
      logger.info('Expanding the "Overall" attendance section');
      await this.page.evaluate(() => {
        const overallSection = Array.from(document.querySelectorAll('.ant-collapse-item')).find(section =>
          section.textContent.includes('Overall')
        );
        if (overallSection) {
          overallSection.querySelector('.ant-collapse-header').click();
        } else {
          throw new Error('Overall section not found');
        }
      });
  
      logger.info('Waiting for progress bar in "Overall" section');
      await this.page.waitForSelector('.ant-collapse-item-active .ant-progress-bg', {
        visible: true,
        timeout: constants.TIMEOUTS.ELEMENT_WAIT,
      });
  
      const overallAttendance = await this.page.evaluate(() => {
        const overallProgressElement = document.querySelector('.ant-collapse-item-active .ant-progress-bg');
        if (!overallProgressElement) {
          throw new Error('Progress bar not found in "Overall" section');
        }
  
        const computedStyle = window.getComputedStyle(overallProgressElement);
        const widthStyle = computedStyle.getPropertyValue('width');
  
        const percentageMatch = overallProgressElement.style.width.match(/([\d.]+)%/);
        if (percentageMatch && percentageMatch[1]) {
          return parseFloat(percentageMatch[1]).toFixed(2);
        }
  
        if (widthStyle && widthStyle.includes('px')) {
          const pixelWidth = parseFloat(widthStyle);
          const containerWidth = overallProgressElement.parentElement.clientWidth;
          if (containerWidth > 0) {
            return ((pixelWidth / containerWidth) * 100).toFixed(2);
          }
        }
  
        throw new Error('Could not extract attendance percentage from "Overall" section');
      });
  
      logger.info('Successfully extracted overall attendance', { overallAttendance });
      return { overallAttendance };
    } catch (error) {
      const errorMessage = error.message || 'Unknown error';
      logger.error('Failed to extract overall attendance', { error: errorMessage });
      throw new Error(`Failed to extract overall attendance: ${errorMessage}`);
    }
  } 
  
  async extractTodaysAttendance() {
    try {
      logger.info('Extracting today\'s attendance');
      
      await this.page.waitForSelector('.ant-collapse-content-active .ant-collapse-content-box', {
        visible: true,
        timeout: constants.TIMEOUTS.ELEMENT_WAIT,
      });
  
      const todaysAttendance = await this.page.evaluate(() => {
        const attendanceIcons = Array.from(
          document.querySelectorAll('.ant-collapse-content-active .ant-collapse-content-box svg')
        );
        
        return attendanceIcons.map(icon => {
          const fillColor = icon.getAttribute('fill');
          if (fillColor === 'green') {
            return '🟢'; // Green circle
          } else if (fillColor === 'red') {
            return '🔴'; // Red circle
          } else {
            return '⚪️'; // Empty circle
          }
        }).slice(0, 7); // Ensure only 7 attendance icons are returned
      });
  
      logger.info('Successfully extracted today\'s attendance', { todaysAttendance });
      return todaysAttendance;
    } catch (error) {
      const errorMessage = error.message || 'Unknown error';
      logger.error('Failed to extract today\'s attendance', { error: errorMessage });
      throw new Error(`Failed to extract today's attendance: ${errorMessage}`);
    }
  }  
}
module.exports = PortalService;
