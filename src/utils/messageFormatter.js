class MessageFormatter {
  static formatAttendanceReport(data) {
    if (!data.subjects || data.subjects.length === 0) {
      return '❌ No attendance data found.';
    }

    let message = '📊 *Attendance Report*\n\n';

    data.subjects.forEach((subject) => {
      message += `📘 *${subject.subject}*\n`;
      message += `└ Theory: ${subject.theory}\n`;
      if (subject.practical !== 'N/A') {
        message += `└ Practical: ${subject.practical}\n`;
      }
      message += '\n';
    });

    message += `📈 *Overall Attendance: ${data.averageAttendance}%*\n`;
    message += '\n_Updated as of ' + new Date().toLocaleDateString() + '_';

    return message;
  }
}

module.exports = MessageFormatter;
