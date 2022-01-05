const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const client = require('../clients/discord')
const fs = require('fs')
const path = require('path')
const desc = JSON.parse(fs.readFileSync(path.join(__dirname, '/../data/cmd_desc.json')))
module.exports = {
    data: new SlashCommandBuilder()
        .setName(path.basename(__filename, '.js'))
        .setDescription(desc[path.basename(__filename, '.js')]),
    async execute(interaction) {
        await interaction.reply({embeds: [
            new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Krosis Bot')
            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
            .setDescription('Krosis is a Discord bot with some simple functionality such as minigames, currency, fun commands, trivia, memes and much more. The bot is currently in beta stage, which means there may be a whole bunch of bugs and other bad stuff. Be sure to report them right after you encounter them with the \"/report\" command. \n ' + 'This bot is being developed by Titan, who is currently a high-school student and a web developer. Contact the developer directly via the social links which are given below.')
            .addField('Useful Commands', 'Some useful commands are listed below along with their functionality', false)
            .addFields(
                { name: '/help', value: 'Invoke to get help & assistance on all commands', inline: true},
                { name: '/report', value: 'Report bugs using this command and the bug will be removed eventually', inline: true },
                { name: '/status', value: 'Get information related to the current status of the bot', inline: true },
            )
            .setImage(client.user.displayAvatarURL())
            .setTimestamp()
            .setFooter('©️Krosis')
        ], components: [
            new MessageActionRow()
                .addComponents([
                    new MessageButton()
                        .setLabel('Dev\'s Facebook')
                        .setStyle('LINK')
                        .setEmoji('📰')
                        .setURL('https://www.facebook.com/mahmud.almuhaimin.90/'),
                    new MessageButton()
                        .setLabel('Dev\'s Youtube')
                        .setStyle('LINK')
                        .setEmoji('📽️')
                        .setURL('https://www.youtube.com/channel/UCEcYWjxit79ocsay5g8sv5w'),
                    new MessageButton()
                        .setLabel('Support Server')
                        .setStyle('LINK')
                        .setEmoji('🤖')
                        .setURL('https://discord.gg/4ZTYqw7Sme')
                ])
        ], ephemeral: true})
    }
}