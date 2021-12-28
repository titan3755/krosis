const { SlashCommandBuilder, italic, blockQuote, codeBlock } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
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
            let joke = await (await axios.get('https://v2.jokeapi.dev/joke/Any?type=twopart')).data
            await interaction.editReply({embeds: [
                new MessageEmbed()
                    .setColor(randomColor())
                    .setTitle(joke.setup)
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                    .setDescription(blockQuote(italic(joke.delivery)))
                    .setTimestamp()
                    .setFooter('©️Krosis')
            ]})
        }
        catch (err) {
            await interaction.editReply({content: codeBlock('An error occured! Error: ' + err)})
        }
    }
} 