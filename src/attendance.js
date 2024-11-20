const browserService = require('./services/browser');
const PortalService = require('./services/portal');
const MessageFormatter = require('./utils/messageFormatter');

async function fetchAttendance(portalUrl,mobileNumber,institute) {
  let browser;
  try {
    browser = await browserService.initialize();
    const page = await browser.newPage();
    const portalService = new PortalService(page);

    await portalService.login(portalUrl, mobileNumber,institute);
    const attendanceData = await portalService.extractAttendanceData();

    console.log('Extracted Attendance Data:', attendanceData);

    return MessageFormatter.formatAttendanceReport(attendanceData.overallAttendance);
  } catch (error) {
    if (error.name === 'TimeoutError') {
      throw new Error('Unable to connect to the attendance portal. Please try again later.');
    }

    console.error('Error in fetchAttendance:', error.message);
    throw new Error('Failed to fetch attendance data. Please check your mobile number and try again.');
  } finally {
    if (browser) {
      await browserService.close();
    }
  }
}

module.exports = { fetchAttendance };
