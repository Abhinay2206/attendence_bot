module.exports = {
  DEFAULT_PASSWORD: 'Ngit123$',
  PORTAL_URL: 'http://ngit-sanjaya.teleuniv.in/',
  SELECTORS: {
    MOBILE_INPUT: '#login_mobilenumber',
    PASSWORD_INPUT: '#login_password',
    LOGIN_FORM: '#login', // Made selector more specific
    SUBMIT_BUTTON: 'button[type="submit"].ant-btn.ant-btn-primary.ant-btn-lg.btn-signin',
    ATTENDANCE_PROGRESS: '.ant-progress-bg'
  },
  TIMEOUTS: {
    NAVIGATION: 60000,
    ELEMENT_WAIT: 60000, // Increased timeout for slow connections
    LOGIN_WAIT: 30000 // Increased login wait timeout
  }
};