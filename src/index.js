require('dotenv').config();
const { Telegraf } = require('telegraf');
const { fetchAttendance } = require('./attendance');
const logger = require('./utils/logger');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.catch((err, ctx) => {
  logger.error('Bot error', { error: err.message });
  ctx.reply('An unexpected error occurred. Please try again later.');
});

bot.command('start', (ctx) => {
  ctx.reply('Welcome! Please send your mobile number to check attendance.');
});

bot.on('text', async (ctx) => {
  const mobileNumber = ctx.message.text.trim();
  
  if (!/^\d{10}$/.test(mobileNumber)) {
    return ctx.reply('Please send a valid 10-digit mobile number.');
  }

  try {
    await ctx.reply('Fetching attendance data... Please wait.');
    const attendanceData = await fetchAttendance(mobileNumber);
    await ctx.reply(attendanceData, { parse_mode: 'Markdown' });
  } catch (error) {
    logger.error('Attendance fetch error', { 
      error: error.message, 
      userId: ctx.from.id 
    });
    await ctx.reply(`Error: ${error.message}`);
  }
});

process.on('unhandledRejection', (error) => {
  logger.error('Unhandled rejection', { error: error.message });
});

bot.launch()
  .then(() => {
    logger.info('Bot started successfully');
    console.log('Bot is running!');
  })
  .catch((error) => {
    logger.error('Failed to start bot', { error: error.message });
    console.error('Failed to start bot:', error.message);
  });