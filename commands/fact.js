const { SlashCommandBuilder, bold, blockQuote, codeBlock } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const axios = require('axios').default
const randomColor = require('randomcolor')
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
            let res = await (await axios.get('https://api.api-ninjas.com/v1/facts?limit=1', {
                headers: {
                    "X-Api-Key": process.env.API_NINJAS_KEY
                }
            })).data
            await interaction.editReply({embeds: [
                new MessageEmbed()
                    .setColor(randomColor())
                    .setTitle(bold('Did you know?'))
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                    .setDescription(blockQuote(res[0].fact))
                    .setTimestamp()
                    .setFooter('©️Krosis')
            ]})
        }
        catch (err) {
            await interaction.editReply({content: codeBlock('An error occured! Error: ' + err)})
        }
    }
}