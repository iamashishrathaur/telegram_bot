require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);
const channelId = process.env.YOUR_CHANNEL_ID;
const channelLink= process.env.YOUR_CHANNEL_URL;
const contractId= process.env.CONTRACT_ID;

const commands = [
    { command: 'start', description: 'Start the bot' },
    { command: 'help', description: 'Get help' },
    { command: 'contract', description: 'View contract information' }
];
bot.telegram.setMyCommands(commands);

const welcomeMessage = `
Welcome to AI prediction bot! 
Hello, I'm your helpful bot.
Feel free to ask questions, seek help, or simply have a friendly chat!
Let's make this a seamless and enjoyable experience together.
And don't forget, let's get started!
`;

bot.start(async (ctx) => {
    try {
        const userId = ctx.from.id;
        const isAdmin = isAdminUser(userId);
   
        const isJoined = await isGroupJoined(userId, channelId);

        if (isJoined) {
            if (isAdmin) {
                ctx.reply('Welcome, admin!', Markup
                    .keyboard([['Send Data']]).oneTime().resize()
                );
            } else {
                ctx.reply(welcomeMessage, Markup
                    .keyboard([
                        ['👑 Premium', '🔧 Setting'],
                        ['💵 Money']
                    ])
                    .oneTime()
                    .resize()
                );
            }
        } else {
            ctx.reply('Please join one of our Telegram channels to use this bot and tap the "Joined" button below to confirm your membership.',
                Markup.inlineKeyboard([
                    [Markup.button.url("Join Channel 1", `https://t.me/${channelLink}`), Markup.button.url("Join Channel 2", "https://t.me/joinchat/AAAAAFl")],
                    [Markup.button.callback("Joined", "joined_confirmation")]
                ]));
        }
    } catch (error) {
        console.error('Error in start handler:', error);
        ctx.reply('Sorry, something went wrong. Please try again later.');
    }
});

bot.hears(['💵 Money', '👑 Premium', '🔧 Setting'], (ctx) => {
    const option = ctx.message.text;
    ctx.reply(`You selected: ${option}`);
});

bot.hears('Send Data', (ctx) => {
    ctx.reply('Send Data option selected');
});

function isAdminUser(userId) {
    const adminIds = ['1439063755'];
    return adminIds.includes(userId);
}

bot.action('joined_confirmation', async (ctx) => {
    try {
        const userId = ctx.from.id;

        const isJoined = await isGroupJoined(userId, channelId);

        if (isJoined) {
            ctx.reply('Welcome to the channel!');
        } else {
            ctx.reply('Please join one of our Telegram channels first.');
        }
        ctx.answerCbQuery('');
    } catch (error) {
        console.error('Error in joined_confirmation action:', error);
        ctx.reply('Sorry, something went wrong. Please try again later.');
    }
});

const isGroupJoined = async (userId, channelId) => {
    try {
        const member = await bot.telegram.getChatMember(channelId, userId);
        return member.status !== 'left';
    } catch (error) {
        console.error('Error checking group membership:', error);
        return false;
    }
};

bot.command('contract', (ctx) => {
    ctx.reply("💯 Solve your problem, \n  contract here 👇", Markup.inlineKeyboard([
        Markup.button.url('View Contract', `https://t.me/${contractId}`)
    ]));
});

bot.launch(()=>{
    console.log("bot start");
})

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
