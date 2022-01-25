const { SlashCommandBuilder, blockQuote, bold } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const randomNumber = require('../helpers/randomRange')
const env = require('dotenv').config()
const client = require('../clients/discord')
const randomColor = require('randomcolor')
const axios = require('axios').default
const fs = require('fs')
const path = require('path')
const desc = JSON.parse(fs.readFileSync(path.join(__dirname, '/../data/cmd_desc.json')))
module.exports = {
    data: new SlashCommandBuilder()
        .setName(path.basename(__filename, '.js'))
        .setDescription(desc[path.basename(__filename, '.js')]),
    async execute(interaction) {
        await interaction.deferReply()
        try {
            let random = randomNumber(0, 2)
            if (random === 1) {
                let response = await (await axios.get('https://api.api-ninjas.com/v1/quotes', {
                    headers: {
                        "X-Api-Key": process.env.API_NINJAS_KEY
                    }
                })).data[0]
                await interaction.editReply({embeds: [
                    new MessageEmbed()
                        .setColor(randomColor())
                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                        .setTitle('Random Quote')
                        .setDescription(blockQuote(response.quote) + ' - ' + bold(response.author))
                        .setFooter('©️Krosis')
                        .setTimestamp()
                ]})
            }
            else {
                let response = await (await axios.get('https://zenquotes.io/api/random')).data[0]
                await interaction.editReply({embeds: [
                    new MessageEmbed()
                        .setColor(randomColor())
                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                        .setTitle('Random Quote')
                        .setDescription(blockQuote(response.q) + ' - ' + bold(response.a))
                        .setFooter('©️Krosis')
                        .setTimestamp()
                ]})
            }
        }
        catch (err) {
            await interaction.editReply({content: codeBlock('An error occured! Error: ' + err)})
        }
    }
}