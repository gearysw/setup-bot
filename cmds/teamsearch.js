const Discord = require('discord.js');
const config = require('../config.json');

module.exports = {
    name: 'teamsearch',
    aliases: ['secret', 'carldok', 'teamsetup', 'sekrit'],
    description: 'Searches through the team role repository for files with the search term(s)',
    args: false,
    easteregg: true,
    usage: '<search terms>',
    execute: async (bot, message, args) => {
        const teams = ['Team 1', 'Team 2', 'Team 3', 'Team 4', 'Team 5'];
        const channels = ['teams-overall-chat', 'team-1', 'team-2', 'team-3', 'team-4', 'team-5'];
        const memberRoles = message.member.roles.map(r => r.name);
        const eligible = teams.some(t => memberRoles.includes(t));

        if (!eligible) return;
        if (!channels.some(c => c.includes(message.channel.name))) return;

        if (!args.length) {
            const helpEmbed = new Discord.MessageEmbed()
                .setColor('#ff5555')
                .setTitle('Searching for setups')
                .setDescription(`Search for setups by typing \`${config.prefix}teamsearch <terms>\`\nDiscord only supports up to 25 embed fields, so only the latest 25 setups is shown.`);

            return message.channel.send(helpEmbed);
        }

        const searching = await message.channel.send('Searching...');
        let msgAttachments = [];
        let msgUrl = [];
        bot.guilds.cache.get(config.CARLServer).channels.cache.get(config.PrivateRepo).messages.fetch({ limit: 100 }, true)
            .then(fetched => bot.guilds.cache.get(config.CARLServer).channels.cache.get(config.PrivateRepo).messages.fetch({ limit: 100, before: fetched.first().id }, true))
            .catch(err => console.error(err));

        message.guild.channels.cache.get(config.PrivateRepo).messages.cache.map(a => {
            if (a.attachments.size) {
                msgAttachments.push(a.attachments.first().name);
                msgUrl.push(a.url);
            }
        });

        const embed = new Discord.MessageEmbed().setTitle('Setup search results').setColor('#FF5555').setFooter('Only up to 25 latest setups shown due to Discord limitations');
        let k = 0;
        for (const [i, f] of msgAttachments.entries()) {
            if (args.every(subs => f.toLowerCase().includes(subs.toLowerCase()))) {
                // console.log(f);
                embed.addField(msgAttachments[i], msgUrl[i]);
                k++;
            }
            if (k === 25) break;
        }
        if (!embed.fields.length) return searching.edit('No results found.');
        searching.edit('Found!').then(searching.delete({ timeout: 5000 }));
        message.channel.send(embed);
    }
}