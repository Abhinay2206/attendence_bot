const browserService = require('./services/browser');
const PortalService = require('./services/portal');
const MessageFormatter = require('./utils/messageFormatter');

async function fetchAttendance(portalUrl,mobileNumber,institute) {
  let browser;
  try {
    // Initialize browser and page
    browser = await browserService.initialize();
    const page = await browser.newPage();
    const portalService = new PortalService(page);

    // Log in and fetch attendance data
    await portalService.login(portalUrl, mobileNumber,institute);
    const attendanceData = await portalService.extractAttendanceData();

    // Log the extracted attendance data for debugging
    console.log('Extracted Attendance Data:', attendanceData);

    // Format the message
    return MessageFormatter.formatAttendanceReport(attendanceData.overallAttendance);
  } catch (error) {
    // Handle timeout-specific errors
    if (error.name === 'TimeoutError') {
      throw new Error('Unable to connect to the attendance portal. Please try again later.');
    }

    // Handle other errors
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
