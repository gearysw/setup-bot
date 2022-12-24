const { REST, Routes } = require('discord.js')
const { token, guildId, appId } = require('./config.json')
const fs = require('fs')

const commands = []
const commandFiles = fs.readdirSync('./cmds').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
    const command = require(`./cmds/${file}`)
    commands.push(command.data.toJSON())
}

console.log(commands);
const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        const data = await rest.put(Routes.applicationGuildCommands(appId, guildId), { body: commands })
        console.log(`Successfully reloaded ${data.length} commands`);
    } catch (error) {
        console.error(error);
    }
})()