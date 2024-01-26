const Telegraf = require('telegraf');
const OpenAI = require('openai');
require('dotenv').config();


const telegramToken = `${process.env.BOT_TOKEN}`;
const openaiApiKey = `${process.env.GPT_TOKEN}`;

console.log(telegramToken, 'telegramtoken')

const bot = new Telegraf.Telegraf(telegramToken);

bot.start((ctx) => ctx.reply('Привет! Я ваш телеграм-бот. Отправьте мне текст, и я попробую ответить на него.'));
bot.help((ctx) => ctx.reply('Помогу тебе чем смогу'));

const openai = new OpenAI({
    apiKey: openaiApiKey,
    organization: 'org-8tGsmHfqLqCpB8sqPsLNCZiO'
});


bot.on('text', async (ctx) => {
    try {
        const chatCompletion = await openai.chat.completions.create({
            messages: [{ role: 'user', content: ctx.message.text }],
            model: 'gpt-3.5-turbo',
        });
        console.log(chatCompletion, 'chatCompletion');
        ctx.reply(chatCompletion.choices[0].message.content);
    } catch (error) {
        console.error(error);
        ctx.reply('Произошла ошибка при обработке вашего запроса.');
    }
});


bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
