require('dotenv').config();
const { Telegraf } = require('telegraf');
const { fetchAttendance } = require('./attendance');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.command('start', (ctx) => {
  ctx.reply('Welcome! Please send your mobile number to check attendance.');
});

bot.on('text', async (ctx) => {
  const mobileNumber = ctx.message.text.trim();
  
  if (!/^\d{10}$/.test(mobileNumber)) {
    return ctx.reply('Please send a valid 10-digit mobile number.');
  }

  try {
    ctx.reply('Fetching attendance data... Please wait.');
    const attendanceData = await fetchAttendance(mobileNumber);
    ctx.reply(attendanceData, { parse_mode: 'Markdown' });
  } catch (error) {
    ctx.reply(`Error: ${error.message}`);
  }
});

bot.launch().then(() => {
  console.log('Bot is running!');
});