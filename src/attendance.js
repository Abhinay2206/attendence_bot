const browserService = require('./services/browser');
const PortalService = require('./services/portal');
const MessageFormatter = require('./utils/messageFormatter');

async function fetchAttendance(mobileNumber) {
  try {
    const browser = await browserService.initialize();
    const page = await browser.newPage();
    const portalService = new PortalService(page);

    await portalService.login(mobileNumber);
    const attendanceData = await portalService.extractAttendanceData();
    return MessageFormatter.formatAttendanceReport(attendanceData);

  } catch (error) {
    if (error.name === 'TimeoutError') {
      throw new Error('Unable to connect to the attendance portal. Please try again later.');
    }
    throw new Error('Failed to fetch attendance data. Please check your mobile number and try again.');
  } finally {
    await browserService.close();
  }
}

module.exports = { fetchAttendance };