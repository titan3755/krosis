const { SlashCommandBuilder, inlineCode, bold, codeBlock, quote } = require('@discordjs/builders')
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js')
const env = require('dotenv').config()
const axios = require('axios').default
const randomColor = require('randomcolor')
const fs = require('fs')
const path = require('path')
const desc = JSON.parse(fs.readFileSync(path.join(__dirname, '/../data/cmd_desc.json')))
module.exports = {
    data: new SlashCommandBuilder()
        .setName(path.basename(__filename, '.js'))
        .setDescription(desc[path.basename(__filename, '.js')])
        .addStringOption(option => option.setName('type').setDescription('The type of content that will be returned').setRequired(true).addChoice('Astronomy Pictures', 'apod').addChoice('Mars images', 'mars')),
    async execute(interaction) {
        await interaction.deferReply()
        if (interaction.options.getString('type') === 'apod') {
            let res = await (await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}&count=1`)).data[0]
            await interaction.editReply({embeds: [
                new MessageEmbed()
                .setColor(randomColor())
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setTitle(`${bold(res.title)} [${res.date}]`)
                .setURL(res.url)
                .setDescription(res.explanation)
                .setThumbnail('https://i.imgur.com/GBtoSqS.png'),
                new MessageEmbed()
                    .setImage(res.hdurl)
                    .setFooter('©️Krosis')
                    .setTimestamp()
            ]})
        }
        else if (interaction.options.getString('type') === 'mars') {
            await interaction.editReply({content: 'Coming soon!', ephemeral: true})
        }
        else {
            await interaction.editReply({content: 'Unknown type!', ephemeral: true})
        }
        
    }
}