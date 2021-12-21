const { Collection, Intents } = require('discord.js')
const fs = require('fs')
const dotenv = require('dotenv').config()
const client = require('./clients/discord')
const colors = require('colors');

client.commands = new Collection()
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
    const command = require(`./commands/${file}`)
    client.commands.set(command.data.name, command)
    console.log(`Command loaded: ${file} ⚙️`.green)
}

client.once('ready', () => {
    console.log('\nAll commands loaded successfully! 📒')
    console.log('All event handlers loaded successfully! 🔔')
    console.log('Bot is online and ready to be used! ✅')
})

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return
    const command = client.commands.get(interaction.commandName)
    if (!command) return
    try {
        await command.execute(interaction)
    }
    catch (err) {
        console.log(err)
        await interaction.reply({content: 'Something went wrong when executing this command!', ephemeral: true})
    }
})

client.login(process.env.TOKEN)