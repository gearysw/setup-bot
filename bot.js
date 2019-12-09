const {
    token,
    prefix,
    CARLServer,
    Repository
} = require('./config.json');
const Discord = require('discord.js');
const bot = new Discord.Client({
    disableEveryone: true,
    messageCacheMaxSize: 500
});
const fs = require('fs');

bot.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./cmds').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./cmds/${file}`);
    bot.commands.set(command.name, command);
    console.log(`${command.name} loaded`);
}

bot.login(token);

bot.on('ready', async () => {
    console.log(`Bot logged in as ${bot.user.username}`);
    console.log(bot.guilds.first().name)

    // try {
    //     const invite = await bot.generateInvite(['SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY']);
    //     console.log(invite);
    // } catch (error) {
    //     console.error(error);
    // }
    bot.guilds.get(CARLServer).channels.get(Repository).fetchMessages({
        limit: 100
    }).then(fetched1 => bot.guilds.get(CARLServer).channels.get(Repository).fetchMessages({
        limit: 100,
        before: fetched1.last().id
    })).then(fetched2 => bot.guilds.get(CARLServer).channels.get(Repository).fetchMessages({
        limit: 100,
        before: fetched2.last().id
    })).then(fetched3 => bot.guilds.get(CARLServer).channels.get(Repository).fetchMessages({
        limit: 100,
        before: fetched3.last().id
    })).catch(console.error);
});

bot.on('message', async (message) => {
    if (message.author.bot) return; //*  ignores messages made by bots
    if (message.channel.type === ('dm' || 'group')) return; //* ignores messages outside of channels
    if (message.content.toLowerCase().includes('\`')) return; //* ignores messages with code blocks

    const args = message.content.toLowerCase().split(/ +/);
    const commandName = args.shift();

    if (commandName.startsWith(prefix)) { //* dynamic command handler
        try {
            const cmds = commandName.slice(prefix.length);
            const command = bot.commands.get(cmds) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmds));
            if (cmds.includes(prefix)) return;
            if (!command) return (message.channel.send('That command does not exist.'));
            if (command.args && !args.length) return message.channel.send('You need to provide arguments for that command.');

            command.execute(bot, message, args);
        } catch (error) {
            console.error(error);
            message.channel.send('There was an error executing that command.');
        }
    }
});