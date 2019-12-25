const { prefix } = require('../config.json');
const Discord = require('discord.js');

module.exports = {
    name: 'help',
    aliases: ['commands'],
    description: 'List of commands the bot can perform or info about a specific command.',
    args: false,
    usage: '[command name]',
    execute: async (bot, message, args) => {
        let usage = [];
        let cmdDesc = [];
        bot.commands.map(c => {
            if (!c.easteregg && c.easteregg != undefined) {
                usage.push(`${prefix}${c.name} ${c.usage}`);
                cmdDesc.push(c.description);
            }
        });

        const embed = new Discord.RichEmbed().setTitle('Setup Bot Commands').setColor('#FF5555');

        for (let i = 0; i < usage.length; i++) {
            embed.addField(usage[i], cmdDesc[i]);
        }

        message.channel.send(embed);
    }
}