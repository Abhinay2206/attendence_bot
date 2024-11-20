class MessageFormatter {
  static formatAttendanceReport(totalAttendance) {
    if (!totalAttendance) {
      return '❌ No attendance data found.';
    }

    let message = '📊 *Attendance Report*\n\n';
    message += `📈 *Overall Attendance: ${totalAttendance}%*\n`;
    message += '\n_Updated as of ' + new Date().toLocaleDateString() + '_';

    return message;
  }
}

module.exports = MessageFormatter;
