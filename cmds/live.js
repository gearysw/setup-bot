const { SlashCommandBuilder } = require('discord.js')
const path = require('node:path')
const fs = require('fs')
const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/

const livePath = path.join(process.cwd(), 'live.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('live')
        .setDescription('Add or show live streams')
        .addStringOption(option =>
            option.setName('channel')
                .setDescription('Your channel URL with format https://url.domain/channel')
                .setRequired(false)
        ),
    execute: async (interaction) => {
        const data = await fs.promises.readFile('./live.json')
        const json = JSON.parse(data)

        const userId = interaction.user.id
        const username = (!interaction.member.nickname) ? interaction.user.username : interaction.member.nickname
        const channel = interaction.options.getString('channel') ?? false

        const userIndex = Object.keys(json).indexOf(userId)

        if (!json[userId] && !channel) {
            return await interaction.reply({
                content: 'Add your channel first by typing `/live [channel URL]`',
                ephemeral: true
            })
        }

        if (channel) {
            if (!urlRegex.test(channel)) return interaction.reply({
                content: 'Please input a valid URL with format `https://url.domain/channel`',
                ephemeral: true
            })

            if (userIndex > -1) {
                json[userId]['channel'] = channel

                fs.writeFileSync(livePath, JSON.stringify(json, null, '\t'))
                return await interaction.reply({
                    content: `You've updated your channel: ${channel}`,
                    ephemeral: true
                })
            }

            json[userId] = {
                name: username,
                channel: channel
            }

            fs.writeFileSync(livePath, JSON.stringify(json, null, '\t'))
            return await interaction.reply({
                content: `Your channel URL has been stored: ${channel}`,
                ephemeral: true
            })
        }

        const channelUrl = json[userId]['channel']
        await interaction.reply(`${username} is now live at ${channelUrl}`)
    }
}