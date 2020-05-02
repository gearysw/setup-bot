const Discord = require('discord.js');
const config = require('../config.json');
const fs = require('fs');
const { date } = require('../filterdate.json');

module.exports = {
    name: 'search',
    aliases: ['searchfiles', 'filesearch', 'files'],
    description: 'Searches through the repository for files with the search term(s)',
    args: false,
    easteregg: false,
    usage: '<search terms>',
    execute: async (bot, message, args) => {
        if (!args.length) {
            const helpEmbed = new Discord.RichEmbed()
                .setColor('#ff5555')
                .setTitle('Searching for setups')
                .setDescription(`Search for setups by typing \`${config.prefix}search <terms>\`\nUpdate the filter date by typing \`${config.prefix}search filterdate <date>\`. This makes sure the bot only searches for files uploaded after the given date.\nDiscord only supports up to 25 embed fields, so only the latest 25 setups is shown.`);

            return message.channel.send(helpEmbed);
        }

        if (args[0] === 'filterdate') {
            const newDate = Date.parse(args.slice(1).join(' '));
            fs.readFile('./filterdate.json', (err, data) => {
                if (err) return console.error(err);
                let json = JSON.parse(data);

                json["date"] = newDate;
                fs.writeFile('./filterdate.json', JSON.stringify(json, null, '\t'), err => {
                    if (err) return console.error(err);
                    const dateString = new Date(newDate);
                    message.channel.send(`Filter date updated: ${dateString.toUTCString()}`);
                });
            });
            return;
        }

        const searching = await message.channel.send('Searching...');
        let msgAttachments = [];
        let msgUrl = [];
        bot.guilds.get(config.CARLServer).channels.get(config.Repository).fetchMessages({
            limit: 100
        }).then(fetched1 => bot.guilds.get(config.CARLServer).channels.get(config.Repository).fetchMessages({
            limit: 100,
            before: fetched1.last().id
        })).then(fetched2 => bot.guilds.get(config.CARLServer).channels.get(config.Repository).fetchMessages({
            limit: 100,
            before: fetched2.last().id
        })).then(fetched3 => bot.guilds.get(config.CARLServer).channels.get(config.Repository).fetchMessages({
            limit: 100,
            before: fetched3.last().id
        })).then(fetched4 => bot.guilds.get(config.CARLServer).channels.get(config.Repository).fetchMessages({
            limit: 100,
            before: fetched4.last().id
        })).catch(console.error);

        message.guild.channels.get(config.Repository).messages.map(a => {
            if (a.attachments.size && a.createdTimestamp > date) {
                msgAttachments.push(a.attachments.first().filename);
                msgUrl.push(a.url);
            }
        });

        const embed = new Discord.RichEmbed().setTitle('Setup search results').setColor('#FF5555').setFooter('Only up to 25 latest setups shown due to Discord limitations');
        let k = 0;
        for (const [i, f] of msgAttachments.entries()) {
            if (args.every(subs => f.toLowerCase().includes(subs.toLowerCase()))) {
                // console.log(f);
                embed.addField(msgAttachments[i], msgUrl[i]);
                k++;
            }
            if (k === 25) break;
        }
        if (!embed.fields.length) return searching.edit('No results found.').then(searching.delete(5000));
        searching.edit('Found!').then(searching.delete(5000));
        message.channel.send(embed);
    }
}