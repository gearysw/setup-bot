const { Client, Events, GatewayIntentBits, Collection } = require('discord.js')
const { token } = require('./config.json')
const fs = require('fs')
const path = require('node:path')

const bot = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] })

bot.commands = new Collection()
const cmdsDir = path.join(__dirname, 'cmds')
const cmdsFiles = fs.readdirSync(cmdsDir).filter(file => file.endsWith('.js'))

for (const file of cmdsFiles) {
    const filePath = path.join(cmdsDir, file)
    const command = require(filePath)

    if ('data' in command && 'execute' in command) {
        bot.commands.set(command.data.name, command)
    } else {
        console.warn(`The command ${file} is missing required fields.`);
    }
}

bot.once(Events.ClientReady, c => {
    console.log(`Logged in as ${c.user.tag}`);
})

bot.login(token)

bot.on(Events.InteractionCreate, async interaction => {
    if (interaction.isChatInputCommand()) {
        const command = interaction.client.commands.get(interaction.commandName)

        if (!command) {
            interaction.reply({
                content: 'What are you on about?',
                ephemeral: true
            })
            console.error(`No command ${interaction.commandName} found`)
            return
        }

        try {
            await command.execute(interaction)
        } catch (error) {
            console.error(error)
            await interaction.reply({
                content: 'Error executing this command',
                ephemeral: true
            })
        }
    } else if (interaction.isAutocomplete()) {
        const command = interaction.client.commands.get(interaction.commandName)

        if (!command) return console.error(`Command ${interaction.commandName} not found`)

        try {
            await command.autocomplete(interaction)
        } catch (error) {
            console.error(error)
            await interaction.reply({
                content: 'Error executing this command',
                ephemeral: true
            })
        }
    }

})