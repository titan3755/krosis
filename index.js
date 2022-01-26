const dotenv = require('dotenv').config()
const { Collection, Intents } = require('discord.js')
const { MessageEmbed } = require('discord.js')
const fs = require('fs')
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
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'))
for (const file of eventFiles) {
	const event = require(`./events/${file}`)
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args))
	} else {
		client.on(event.name, (...args) => event.execute(...args))
	}
}
client.login(process.env.TOKEN)
