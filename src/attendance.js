const browserService = require('./services/browser');
const PortalService = require('./services/portal');
const MessageFormatter = require('./utils/messageFormatter');

async function fetchAttendance(portalUrl, mobileNumber, institute) {
  let browser;
  try {
    // Initialize the browser and portal service
    browser = await browserService.initialize();
    const page = await browser.newPage();
    const portalService = new PortalService(page);

    // Login and fetch attendance data
    await portalService.login(portalUrl, mobileNumber, institute);
    const overallAttendance = await portalService.extractAttendanceData();
    const todaysAttendance = await portalService.extractTodaysAttendance();

    console.log('Extracted Attendance Data:', { overallAttendance, todaysAttendance });

    // Format the attendance report
    return MessageFormatter.formatAttendanceReport(overallAttendance.overallAttendance, todaysAttendance);

  } catch (error) {
    // Handle errors properly
    console.error('Error in fetchAttendance:', error.message);

    throw new Error('Failed to fetch attendance data. Please check your mobile number and try again.');
  } finally {
    // Ensure the browser is closed
    if (browser) {
      await browserService.close();
    }
  }
}

module.exports = { fetchAttendance };
