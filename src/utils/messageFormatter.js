class MessageFormatter {
  static formatAttendanceReport(totalAttendance, todaysAttendance) {
    // Initialize the message variable first
    let message = '📊 *✨ Attendance Report ✨*\n\n';

     // Add today's attendance
     if (todaysAttendance && todaysAttendance.length > 0) {
      message += `📅 *Today's Attendance:*\n\n${todaysAttendance.join(' ')}\n\n`;
    } else {
      message += '📅 *Today\'s Attendance:* No data available.\n';
    }

    // Add overall attendance
    if (totalAttendance) {
      message += `📈 *Overall Attendance: ${totalAttendance}%* 🎉\n\n`;
    } else {
      return '❌ No attendance data found.';
    }

    // Add last updated time
    message += '\n🕒 _Last Updated: ' + new Date().toLocaleString() + '_\n';

    return message;
  }
}

module.exports = MessageFormatter;
