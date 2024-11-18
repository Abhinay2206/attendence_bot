module.exports = {
  DEFAULT_PASSWORD: 'Ngit123$',
  PORTAL_URL: 'http://ngit-sanjaya.teleuniv.in/parent/attendance',
  SELECTORS: {
    MOBILE_INPUT: 'input[name="mobile"]',
    PASSWORD_INPUT: 'input[name="password"]',
    LOGIN_FORM: 'form',
    SUBJECT_ROW: 'table tr',
    SUBJECT_CELL: 'td:first-child',
    THEORY_CELL: 'td:nth-child(2)',
    PRACTICAL_CELL: 'td:nth-child(3)'
  },
  TIMEOUTS: {
    NAVIGATION: 60000,
    ELEMENT_WAIT: 10000,
    LOGIN_WAIT: 20000
  }
};