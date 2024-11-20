require('dotenv').config();
const { Telegraf } = require('telegraf');
const { fetchAttendance } = require('./attendance');
const logger = require('./utils/logger');

const bot = new Telegraf(process.env.BOT_TOKEN);

const PORTAL_URLS = {
  NGIT: 'http://ngit-netra.teleuniv.in/',
  KMEC: 'http://kmec-netra.teleuniv.in/',
};

const userSessions = new Map();

bot.catch((err, ctx) => {
  logger.error('Bot error', { error: err.message });
  ctx.reply('🚨 Oops! An unexpected error occurred. Please try again later.');
});

bot.command('start', (ctx) => {
  userSessions.set(ctx.from.id, { step: 'askInstitute' }); 
  ctx.reply('👋 Welcome to the Attendance Bot!\nAre you from *NGIT* or *KMEC*? Please reply with *ngit* or *kmec*.\n\n✨ Note: This will only work if your password in the Netra portal is the default password, i.e., *Ngit123$* or *Kmec123$*.', {
    parse_mode: 'Markdown',
  });
});

bot.on('text', async (ctx) => {
  const userId = ctx.from.id;
  const userSession = userSessions.get(userId);

  if (!userSession) {
    return ctx.reply('⚠️ Please start with the /start command to begin.');
  }

  const userInput = ctx.message.text.trim().toUpperCase();

  if (userSession.step === 'askInstitute') {
    if (userInput !== 'NGIT' && userInput !== 'KMEC') {
      return ctx.reply('❌ Invalid input. Please reply with *ngit* or *kmec*.', {
        parse_mode: 'Markdown',
      });
    }

    userSessions.set(userId, { step: 'askMobile', institute: userInput });
    return ctx.reply(`✅ You selected *${userInput}*. Now, please send your 10-digit mobile number.`);
  }

  if (userSession.step === 'askMobile') {
    if (!/^\d{10}$/.test(userInput)) {
      return ctx.reply('🚫 Please send a valid 10-digit mobile number.');
    }

    const { institute } = userSession;
    const portalUrl = PORTAL_URLS[institute];
    userSessions.delete(userId); 

    try {
      await ctx.reply('⏳ Fetching your attendance data... Please wait a moment. It usually takes 10-15 seconds.');
      const attendanceData = await fetchAttendance(portalUrl, userInput, institute); 
      await ctx.reply(attendanceData, { parse_mode: 'Markdown' });
    } catch (error) {
      logger.error('Attendance fetch error', {
        error: error.message,
        userId: ctx.from.id,
      });
      await ctx.reply(`⚠️ Error: ${error.message}`);
    }
  }
});

process.on('unhandledRejection', (error) => {
  logger.error('Unhandled rejection', { error: error.message });
});

bot.launch()
  .then(() => {
    logger.info('Bot started successfully');
    console.log('🤖 Bot is running!');
  })
  .catch((error) => {
    logger.error('Failed to start bot', { error: error.message });
    console.error('❌ Failed to start bot:', error.message);
  });
