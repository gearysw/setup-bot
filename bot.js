const {
    token,
    prefix,
    CARLServer,
    Repository
} = require('./config.json');
const Discord = require('discord.js');
const bot = new Discord.Client({
    disableEveryone: true
});
const fs = require('fs');

bot.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./cmds').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./cmds/${file}`);
    bot.commands.set(command.name, command);
    console.log(`${command.name} loaded`);
}

bot.login(process.env.BOT_TOKEN);

bot.on('ready', async () => {
    console.log(`Bot logged in as ${bot.user.username}`);

    // try {
    //     const invite = await bot.generateInvite(['SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY']);
    //     console.log(invite);
    // } catch (error) {
    //     console.error(error);
    // }
    try {
        bot.guilds.get(CARLServer).channels.get(Repository).fetchMessages({
            limit: 100
        });
    } catch (error) {
        console.error(error);
    }
});

bot.on('message', async (message) => {
    if (message.author.bot) return; //*  ignores messages made by bots
    if (message.channel.type === ('dm' || 'group')) return; //* ignores messages outside of channels
    if (message.content.toLowerCase().includes('\`')) return; //* ignores messages with code blocks

    const args = message.content.toLowerCase().split(/ +/);
    const commandName = args.shift();

    if (commandName.startsWith(prefix)) { //* dynamic command handler
        const cmds = commandName.slice(prefix.length);
        const command = bot.commands.get(cmds) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmds));
        try {
            if (command.args && !args.length) {
                message.channel.send('You need to provide arguments for that command.');
            } else {
                command.execute(bot, message, args);
            }
        } catch (error) {
            console.error(error);
            message.channel.send('There was an error executing that command.');
        }
    }
});