const { SlashCommandBuilder, inlineCode, codeBlock } = require('@discordjs/builders')
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const fs = require('fs')
const path = require('path')
const client = require('../clients/discord')
const desc = JSON.parse(fs.readFileSync(path.join(__dirname, '/../data/cmd_desc.json')))
module.exports = {
    permission: 'ADMINISTRATOR',
    data: new SlashCommandBuilder()
        .setName(path.basename(__filename, '.js'))
        .setDescription(desc[path.basename(__filename, '.js')])
        .addStringOption(option => option.setName('userid').setDescription('A userID for the unban').setRequired(true)),
    async execute(interaction) {
        const userId = interaction.options.getString('userid')
        if (userId === String(client.user.id)) {
            await interaction.reply({embeds: [
                new MessageEmbed()
                .setTitle('Command error')
                .setColor('RED')
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setTimestamp()
                .setFooter('©️Krosis')
                .setDescription('Mention another user to unban.')
            ], components: [], ephemeral: true})
            return
        }
        else {
            await interaction.reply({ embeds: [
                new MessageEmbed()
                    .setTitle('Unban user')
                    .setColor('YELLOW')
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                    .setTimestamp()
                    .setFooter('©️Krosis')
                    .setDescription(
                        `❗ Are you sure you want to unban this user from (${interaction.guild.name}) ?`
                    )
            ], components: [
                new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setStyle('SUCCESS')
                            .setCustomId('yes')
                            .setLabel('🔨 Ban'),
                        new MessageButton()
                            .setStyle('DANGER')
                            .setCustomId('no')
                            .setLabel('🚫 Cancel')
                    )
            ], ephemeral: true})
        }
        const filter = (i) => {
            if (i.user.id === interaction.user.id) return true
            return i.reply({content: 'This button is not for you!', ephemeral: true})
        }
        const collector = interaction.channel.createMessageComponentCollector({ filter, max: 1, time: 20 * 1000 })
        collector.on('end', async collection => {
            if (collection.size !== 0) {
                if (collection.first().customId === 'yes') {
                    try {
                        await interaction.guild.members.unban(userId)
                        await interaction.editReply({embeds: [
                            new MessageEmbed()
                            .setTitle('Unbanned user!')
                            .setColor('GREEN')
                            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                            .setTimestamp()
                            .setFooter('©️Krosis')
                            .setDescription('The user has been unbanned successfully!')
                        ], components: [], ephemeral: true})
                    }
                    catch (err) {
                        await interaction.editReply({content: codeBlock('An error occured! Most likely, the user to be unbanned doesn\'t exist or hasn\'t been banned from this server before.'), ephemeral: true, embeds: [], components: []})
                    }
                }
                else {
                    await interaction.editReply({embeds: [
                        new MessageEmbed()
                        .setTitle('Action cancelled!')
                        .setColor('RED')
                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                        .setTimestamp()
                        .setFooter('©️Krosis')
                        .setDescription('The ban action has been cancelled by the invoker.')
                    ], components: [], ephemeral: true})
                }
            }
            else {
                await interaction.editReply({embeds: [
                    new MessageEmbed()
                    .setTitle('Action cancelled!')
                    .setColor('RED')
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                    .setTimestamp()
                    .setFooter('©️Krosis')
                    .setDescription('The ban action has been cancelled as the 20 second allocated interaction time ran out.')
                ], components: [], ephemeral: true})
            }
        })
    }
}