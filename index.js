require('dotenv').config();
const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
const TelegramBot = require('node-telegram-bot-api');

const telegramToken = process.env.TELEGRAM_TOKEN;
const telegramBot = new TelegramBot(telegramToken, { polling: true });

const client = new Client();

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('WhatsApp bot is ready!');
});

telegramBot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text) {
        client.sendMessage(process.env.WHATSAPP_NUMBER, text);
        telegramBot.sendMessage(chatId, 'Message sent to WhatsApp!');
    }
});

client.initialize();


---
