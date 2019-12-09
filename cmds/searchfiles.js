const Discord = require('discord.js');
const config = require('../config.json');

module.exports = {
    name: 'search',
    aliases: ['searchfiles', 'filesearch', 'files'],
    description: 'Searches through a channel for files with the search term',
    args: true,
    easteregg: false,
    usage: '<search term>',
    execute: async (message, args) => {
        let msgAttachments = [];
        let msgUrl = [];

        message.guild.channels.get(config.Repository).messages.map(a => {
            if (a.attachments.size) {
                msgAttachments.push(a.attachments.first().filename.toLowerCase());
                msgUrl.push(a.url);
            }
        });

        const embed = new Discord.RichEmbed().setTitle('Setup search results').setColor('#FF5555');

        for (const [i, f] of msgAttachments.entries()) {
            if (args.every(subs => f.includes(subs))) {
                console.log(f);
                embed.addField(msgAttachments[i], msgUrl[i]);
            }
        }
        message.channel.send(embed);
    }
}