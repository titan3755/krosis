const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const fs = require('fs')
const path = require('path')
const desc = JSON.parse(fs.readFileSync(path.join(__dirname, '/../data/cmd_desc.json')))
module.exports = {
    permission: 'ADMINISTRATOR',
    data: new SlashCommandBuilder()
        .setName(path.basename(__filename, '.js'))
        .setDescription(desc[path.basename(__filename, '.js')])
        .addIntegerOption(option => option.setName('amount').setDescription('Number of messages to delete').setRequired(true)),
    async execute(interaction) {
        await interaction.channel.bulkDelete(interaction.options.getInteger('amount'))
        await interaction.reply({embeds: [
            new MessageEmbed()
                .setTitle('Message deletion')
                .setDescription(`Deletion of ${interaction.options.getInteger('amount')} messages is successful! Invoke this command again along with the amount of messages to be deleted if you wish to delete more messages.`)
                .setColor('GREEN')
                .setAuthor(interaction.user.username + ' [Admin]', interaction.user.displayAvatarURL())
                .setTimestamp()
                .setFooter('©️Krosis')
        ], ephemeral: true})
    }
}