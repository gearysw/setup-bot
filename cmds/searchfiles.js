const Discord = require('discord.js');
const config = require('../config.json');

module.exports = {
    name: 'search',
    aliases: ['searchfiles', 'filesearch', 'files'],
    description: 'Searches through a channel for files with the search term',
    args: true,
    easteregg: false,
    usage: '<search term>',
    execute: async (bot, message, args) => {
        let msgAttachments = [];
        let msgUrl = [];
        bot.guilds.get(config.CARLServer).channels.get(config.Repository).fetchMessages({
            limit: 100
        });

        message.guild.channels.get(config.Repository).messages.map(a => {
            if (a.attachments.size) {
                msgAttachments.push(a.attachments.first().filename);
                msgUrl.push(a.url);
            }
        });

        const embed = new Discord.RichEmbed().setTitle('Setup search results').setColor('#FF5555');
        let k = 0;
        for (const [i, f] of msgAttachments.entries()) {
            if (args.every(subs => f.toLowerCase().includes(subs.toLowerCase()))) {
                console.log(f);
                embed.addField(msgAttachments[i], msgUrl[i]);
                k++;
            }
            if (k === 25) break;
        }
        message.channel.send(embed);
    }
}