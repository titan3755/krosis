const { SlashCommandBuilder, inlineCode } = require('@discordjs/builders')
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const client = require('../clients/discord')
const randomColor = require('randomcolor')
const fs = require('fs')
const path = require('path')
const desc = JSON.parse(fs.readFileSync(path.join(__dirname, '/../data/cmd_desc.json')))
module.exports = {
    data: new SlashCommandBuilder()
        .setName(path.basename(__filename, '.js'))
        .setDescription(desc[path.basename(__filename, '.js')]),
    async execute(interaction) {
        interaction.reply({embeds: [
            new MessageEmbed()
                .setColor(randomColor())
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setTitle('Vote the bot')
                .setDescription('Want to increase the bot\'s popularity while supporting it\'s creator at the same time? Upvote Krosis on Top.gg by clicking on the buttons below!')
                .setFooter('©️Krosis')
                .setTimestamp()
        ], components: [
            new MessageActionRow()
                .addComponents([
                    new MessageButton()
                        .setLabel('Vote')
                        .setStyle('LINK')
                        .setEmoji('👍')
                        .setURL('https://top.gg/bot/922545151191187476/vote')
                ])
        ]})
    }
}