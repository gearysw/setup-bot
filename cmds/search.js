const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { date, repository } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('search')
        .setDescription('Searches through the repository for files with the search term(s)')
        .addStringOption(option => option.setName('terms').setDescription('Search terms to use').setRequired(true)),
    execute: async (interaction) => {
        const searchTerms = interaction.options.getString('terms').toLowerCase().split(/ +/)
        // cache the messages
        await interaction.guild.channels.cache.get(repository).messages.fetch({ limit: 100, cache: true })

        const msgAttachments = []
        const msgUrl = []

        interaction.guild.channels.cache.get(repository).messages.cache.map(m => {
            if (m.attachments.size && m.createdTimestamp > date) {
                msgAttachments.push(m.attachments.first().name)
                msgUrl.push(m.url)
            }
        })

        const embed = new EmbedBuilder().setTitle('Setup search results').setColor('#FF5555').setFooter({ text: 'Only up to 25 latest setups shown due to Discord limitations' })
        let k = 0
        for (const [i, f] of msgAttachments.entries()) {
            if (searchTerms.every(subs => f.toLowerCase().includes(subs.toLowerCase()))) {
                embed.addFields({ name: msgAttachments[i], value: msgUrl[i] })
                k++
            }
            if (k === 25) break
        }

        interaction.reply({ embeds: [embed] })
    }
}