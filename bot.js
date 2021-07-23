require('dotenv').config();
const Telegraf = require('telegraf');
const api = require('covid19-api');
const Markup = require('telegraf/markup');
const COUNTRIES_LIST = require('./constants');

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) =>
    ctx.reply(
        `
Привет, ${ctx.message.from.first_name}!
Узнай статистику по COVID-19.
Введи на ангийском языке название страны и получи статистику.
Посмотреть весь список можно командой /help.
`,
        Markup.keyboard([
            ['US', 'Russia'],
            ['Ukraine', 'Portugal'],
        ])
            .resize()
            .extra()
    )
);

bot.help((ctx) => ctx.reply(COUNTRIES_LIST))

bot.on('text', async (ctx) => {
    let data = {};

    try {
        data = await api.getReportsByCountries(ctx.message.text);

        const formatData = `
Страна: ${data[0][0].country}
Случаи: ${data[0][0].cases}
Смерти: ${data[0][0].deaths}
Вылечелись: ${data[0][0].recovered}
  `;
        ctx.reply(formatData)
    } catch {
        ctx.reply('Ошибка, такой страны не существует! Посмотрите /help');

    }
});
bot.launch();

// eslint-disable-next-line no-console
console.log('Бот запущен');