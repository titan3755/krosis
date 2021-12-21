const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
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
            .setURL('https://discord.js.org/')
            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL(), 'https://discord.js.org')
            .setDescription('Krosis is a Discord bot with some simple functionality such as minigames, currency, fun commands, trivia, memes and much more. The bot is currently in beta stage, which means there may be a whole bunch of bugs and other bad stuff. Be sure to report them right after you encounter them with the \"/report\" command.')
            .setThumbnail('https://i.imgur.com/AfFp7pu.png')
            .addField('Useful Commands', 'Some useful commands are listed below along with their functionality', true)
            .addFields(
                { name: '/help', value: 'Invoke to get help & assistance on all commands', inline: false},
                { name: '/report', value: 'Report bugs using this command and the bug will be removed eventually', inline: true },
                { name: '/status', value: 'Get information related to the current status of the bot', inline: true },
            )
            .setImage('https://i.imgur.com/AfFp7pu.png')
            .setTimestamp()
            .setFooter('Bot created by Titan', 'https://i.imgur.com/AfFp7pu.png')
        ], ephemeral: true})
    }
}