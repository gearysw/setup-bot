const { SlashCommandBuilder } = require('discord.js')
const { twitchClientId, twitchSecret, twitchToken, twitchRefreshToken } = require('../config.json')
const path = require('node:path')
const fs = require('fs/promises')
const fetch = require('node-fetch')

const configPath = path.join(process.cwd(), 'config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clip')
        .setDescription('Create a clip of a currently live channel')
        .addStringOption(option => option.setName('channel').setDescription('Name of the channel').setRequired(true)),
    execute: async (interaction) => {
        await interaction.deferReply()
        const channelName = interaction.options.getString('channel')
        const broadcasterId = await getUser(channelName, twitchToken)
        const clipId = await createClip(broadcasterId, twitchToken)

        if (!clipId) return interaction.followUp(`The streamer ${channelName} is currently not live or has clipping disabled`)

        await new Promise(resolve => setTimeout(resolve, 5000))

        const clipUrl = await getClip(clipId)


        interaction.followUp(clipUrl)
    }
}

async function getUser(channel, token) {
    try {
        const res = await fetch(`https://api.twitch.tv/helix/users?login=${channel}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Client-Id': twitchClientId
            }
        })

        if (res.status === 401) {
            const newToken = await refreshToken()
            return await getUser(channel, newToken)
        }

        const response = await res.json()

        const userId = response.data[0].id
        return userId
    } catch (error) {
        console.error(error)
        return 'error'
    }
}

/**
 * 
 * @param {string} token refresh token
 */
async function refreshToken() {
    const params = new URLSearchParams()
    params.append('client_id', twitchClientId)
    params.append('client_secret', twitchSecret)
    params.append('grant_type', 'refresh_token')
    params.append('refresh_token', twitchRefreshToken)

    const response = await fetch('https://id.twitch.tv/oauth2/token', {
        method: 'POST',
        body: params
    })
    const res = await response.json()
    const newToken = res.access_token

    const data = await fs.readFile(configPath)
    const config = JSON.parse(data)
    config['twitchToken'] = newToken
    await fs.writeFile(configPath, JSON.stringify(config, null, '\t'))
    return newToken
}

async function createClip(channel, token) {
    try {
        const response = await fetch(`https://api.twitch.tv/helix/clips?broadcaster_id=${channel}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Client-Id': twitchClientId
            }
        })

        if (response.status !== 202) {
            return false
        }

        const res = await response.json()
        const clipId = res.data[0].id
        return clipId
    } catch (error) {
        console.error(error)
        return 'An error occurred'
    }
}

async function getClip(clip) {
    try {
        const response = await fetch(`https://api.twitch.tv/helix/clips?id=${clip}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${twitchToken}`,
                'Client-Id': twitchClientId
            }
        })

        // console.log(response);
        const res = await response.json()
        // console.log(res);
        const clipUrl = res.data[0].url
        return clipUrl
    } catch (error) {
        console.error(error)
        return 'An error occurred'
    }
}
