module.exports = {
  DEFAULT_PASSWORD: 'Ngit123$',
  PORTAL_URL: 'http://ngit-sanjaya.teleuniv.in/parent/attendance',
  SELECTORS: {
    MOBILE_INPUT: '#mobile',
    PASSWORD_INPUT: '#password',
    LOGIN_FORM: 'form',
    SUBJECT_ROW: 'tr',
    SUBJECT_CELL: 'td:nth-child(1)',
    THEORY_CELL: 'td:nth-child(2)',
    PRACTICAL_CELL: 'td:nth-child(3)'
  },
  TIMEOUTS: {
    NAVIGATION: 30000,
    ELEMENT_WAIT: 5000,
    LOGIN_WAIT: 10000
  }
};