const { token, prefix, CARLServer, Repository } = require('./config.json');
const Discord = require('discord.js');
const bot = new Discord.Client({
    disableEveryone: true,
    messageCacheMaxSize: 1000
});
const fs = require('fs');

bot.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./cmds').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./cmds/${file}`);
    bot.commands.set(command.name, command);
    // console.log(`${command.name} loaded`);
}

bot.login(token);

bot.on('ready', async () => {
    console.log(`Bot logged in as ${bot.user.username}`);
    // console.log(bot.guilds.cache.first().name);
    bot.guilds.cache.get(CARLServer).members.cache.get(bot.user.id).setNickname('Democratic Bot').catch(console.error);

    // try {
    //     const invite = await bot.generateInvite(['SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY']);
    //     console.log(invite);
    // } catch (error) {
    //     console.error(error);
    // }
    bot.guilds.cache.get(CARLServer).channels.cache.get(Repository).messages.fetch({ limit: 100 }, true)
        .then(fetched => bot.guilds.cache.get(CARLServer).channels.cache.get(Repository).messages.fetch({ limit: 100, before: fetched.first().id }, true))
        .then(fetched => bot.guilds.cache.get(CARLServer).channels.cache.get(Repository).messages.fetch({ limit: 100, before: fetched.first().id }, true))
        .then(fetched => bot.guilds.cache.get(CARLServer).channels.cache.get(Repository).messages.fetch({ limit: 100, before: fetched.first().id }, true))
        .then(fetched => bot.guilds.cache.get(CARLServer).channels.cache.get(Repository).messages.fetch({ limit: 100, before: fetched.first().id }, true))
        .catch(err => console.error(err));
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
            if (!command) return;
            if (command.args && !args.length) return message.channel.send('You need to provide arguments for that command.');

            command.execute(bot, message, args);
        } catch (error) {
            console.error(error);
            message.channel.send('Helpful error message');
            message.guild.members.cache.get('197530293597372416').send(error);
        }
    }
});