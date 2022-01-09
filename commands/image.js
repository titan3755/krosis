const { SlashCommandBuilder, inlineCode, codeBlock } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const client = require('../clients/discord')
const randomColor = require('randomcolor')
const axios = require('axios').default
const fs = require('fs')
const path = require('path')
const desc = JSON.parse(fs.readFileSync(path.join(__dirname, '/../data/cmd_desc.json')))
module.exports = {
    data: new SlashCommandBuilder()
        .setName(path.basename(__filename, '.js'))
        .setDescription(desc[path.basename(__filename, '.js')])
        .addStringOption(option => option.setName('category').setRequired(false).setDescription('The category of random images to fetch. If not specified, a totally random image will be chosen.').addChoices([['Nature', 'nature'], ['Space', 'space'], ['People', 'people'], ['Health', 'health'], ['Art', 'art'], ['City', 'city'], ['Animals', 'animals'], ['Travel', 'travel'], ['Technology', 'technology'], ['3D-Renders', '3d-renders'], ['Street-Photography', 'street-photography']])),
    async execute(interaction) {
        await interaction.deferReply()
        try { 
            let imgUrl = await (await axios.get(`https://source.unsplash.com/random${interaction.options.getString('category') ? '?' + interaction.options.getString('category') : ''}`)).request.res.responseUrl
            await interaction.editReply({embeds: [
                new MessageEmbed()
                    .setColor(randomColor())
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                    .setTitle('Random Images')
                    .setDescription('This command will display a random image from the Unsplash API. The random image may be of a specific category if the category is specified.')
                    .addField('Category', interaction.options.getString('category') ? inlineCode(interaction.options.getString('category')) : inlineCode('None'), true)
                    .setImage(imgUrl)
                    .setFooter('©️Krosis')
                    .setTimestamp()
            ]})
        }
        catch (err) {
            await interaction.editReply({content: codeBlock('An error occured! Error: ' + err)})
        }
    }
}