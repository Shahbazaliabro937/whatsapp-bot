require('dotenv').config();
const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
const TelegramBot = require('node-telegram-bot-api');

// WhatsApp Setup
const client = new Client();

client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('✅ WhatsApp Bot is ready!');
});

// Telegram Setup
const telegramBot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

telegramBot.onText(/\/send (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const message = match[1];

  try {
    const chats = await client.getChats();
    const target = chats.find(c => c.name.includes("YourContactName")); // change this

    if (target) {
      await client.sendMessage(target.id._serialized, message);
      telegramBot.sendMessage(chatId, "📤 Message sent to WhatsApp.");
    } else {
      telegramBot.sendMessage(chatId, "❌ Contact not found.");
    }
  } catch (err) {
    console.error(err);
    telegramBot.sendMessage(chatId, "❌ Error sending message.");
  }
});

client.initialize();
