class MessageFormatter {
  static formatAttendanceReport(totalAttendance) {
    if (!totalAttendance) {
      return '❌ No attendance data found.';
    }

    let message = '📊 *✨ Attendance Report ✨*\n\n';
    message += `📈 *Overall Attendance: ${totalAttendance}%* 🎉\n`;
    message += '\n🕒 _Last Updated: ' + new Date().toLocaleString() + '_\n';

    return message;
  }
}

module.exports = MessageFormatter;
