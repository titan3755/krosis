const { Collection, Intents } = require('discord.js')
const { MessageEmbed } = require('discord.js')
const fs = require('fs')
const dotenv = require('dotenv').config()
const client = require('./clients/discord')
const colors = require('colors');
const { setTimeout } = require('timers/promises')

client.commands = new Collection()
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
const structData = []

for (const file of commandFiles) {
    const command = require(`./commands/${file}`)
    client.commands.set(command.data.name, command)
    structData.push({command: '/' + command.data.name, status: '✅'})
}
console.table(structData)
client.once('ready', () => {
    console.log('\nAll commands loaded successfully! 📒')
    console.log('All event handlers loaded successfully! 🔔')
    console.log('Bot is online and ready to be used! ✅')
    client.user.setPresence({activities: [{name: '/help', type: 'LISTENING'}], status: 'online'})
})

client.on('interactionCreate', async interaction => {
    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName)
        if (!command) return
        if (command.permission) {
            const authorPerms = interaction.channel.permissionsFor(interaction.member)
            if (!authorPerms || !authorPerms.has(command.permission)) {
                return await interaction.reply({embeds: [
                    new MessageEmbed()
                        .setColor('RED')
                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                        .setTitle('Permissions required!')
                        .setDescription(`You lack the required permissions[${command.permission}] to use this command.`)
                        .setTimestamp()
                        .setFooter('©️Krosis')
                    ], ephemeral: true
                })
            }
        }
        try {
            await command.execute(interaction)
        }
        catch (err) {
            console.log(err)
            try {
                await interaction.reply({content: 'Something went wrong when executing this command!', ephemeral: true})
            }
            catch {
                await interaction.editReply({content: 'Something went wrong when executing this command!', ephemeral: true})
            }
        }
    }
    else if (interaction.isButton()) {
        // Pass if the interaction is of button component
    }
    else if (interaction.isSelectMenu()) {
        // Pass if the interaction is of select menu component
    }
    else {
        return
    }
})

client.login(process.env.TOKEN)
