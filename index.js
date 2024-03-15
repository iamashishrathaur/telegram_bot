require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);
const CHANNEL_ID = process.env.YOUR_CHANNEL_ID;
const CHANNEL_URL = process.env.YOUR_CHANNEL_URL;
const CONTRACT_ID = process.env.CONTRACT_ID

bot.command('start', async (ctx) => {
    const userId = ctx.from.id;   
    try {
        const isMember = await bot.telegram.getChatMember(CHANNEL_ID, userId)
            .then(member => member.status !== 'left')
            .catch(() => false);

        if (isMember) {
            ctx.reply('Choose an option:', Markup
                .keyboard([
                    ['Option 1', 'Option 2'],
                    ['Option 3', 'Option 4']
                ])
                .oneTime()
                .resize()
            );
        } else {
            ctx.reply('Please join the channel to proceed.', Markup.inlineKeyboard([
                Markup.button.url('Join Channel', `https://t.me/${CHANNEL_URL}`)
            ]));
        }
    } catch (error) {
        console.error('Error:', error);
        ctx.reply('An error occurred. Please try again later.');
    }
});

bot.command('help', (ctx) => {
    ctx.reply('For assistance, please contact us:', Markup.inlineKeyboard([
        Markup.button.url('Contact here', `https://t.me/${CONTRACT_ID}`)
    ]));
});

bot.hears('Option 1', (ctx) => ctx.reply('You chose Option 1'));
bot.hears('Option 2', (ctx) => ctx.reply('You chose Option 2'));
bot.hears('Option 3', (ctx) => ctx.reply('You chose Option 3'));
bot.hears('Option 4', (ctx) => ctx.reply('You chose Option 4'));

bot.launch().then(() => {
    console.log('Bot started');
});
