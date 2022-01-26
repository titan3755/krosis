const { SlashCommandBuilder, codeBlock, inlineCode, bold } = require('@discordjs/builders')
const axios = require('axios').default
const { MessageEmbed, Message } = require('discord.js')
const randomColor = require('randomcolor')
const fs = require('fs')
const path = require('path')
const desc = JSON.parse(fs.readFileSync(path.join(__dirname, '/../data/cmd_desc.json')))
module.exports = {
    data: new SlashCommandBuilder()
        .setName(path.basename(__filename, '.js'))
        .setDescription(desc[path.basename(__filename, '.js')])
        .addStringOption(option => option.setName('name').setDescription('The name for the age is to be guessed').setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply()
        try {
            let res = await (await axios.get(`https://api.agify.io`, {
                params: {
                    name: interaction.options.getString('name').split(' ').length > 1 ? interaction.options.getString('name').split(' ')[0] : interaction.options.getString('name')
                }
            })).data
            await interaction.editReply({embeds: [
                new MessageEmbed()
                .setColor(randomColor())
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setTitle(`Age from name`)
                .setDescription(`${bold(interaction.options.getString('name') + ', ' + 'you are')} ${inlineCode(res.age)} ${bold('years old!')}`)
                .setFooter('©️Krosis')
                .setTimestamp()
            ]})
        }
        catch (err) {
            await interaction.editReply({content: codeBlock('An error occured! Error: ' + err)})
        }
    }
}