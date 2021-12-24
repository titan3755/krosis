const { SlashCommandBuilder, inlineCode } = require('@discordjs/builders')
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
        .addUserOption(option => option.setName('target').setDescription('@Mention the user to be kicked').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('An optional reason for the kick').setRequired(false)),
    async execute(interaction) {
        const user = interaction.options.getMember('target')
        const reason = interaction.options.getString('reason') || 'No reason provided'
        if (!user) {
            await interaction.reply({embeds: [
                new MessageEmbed()
                .setTitle('User doesn\'t exist!')
                .setColor('RED')
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setTimestamp()
                .setFooter('©️Krosis')
                .setDescription('The mentioned user no longer exists in this server!')
            ], components: [], ephemeral: true})
            return
        }
        else if (user.user.id === client.user.id) {
            await interaction.reply({embeds: [
                new MessageEmbed()
                .setTitle('I cannot kick myself 😢')
                .setColor('RED')
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setTimestamp()
                .setFooter('©️Krosis')
                .setDescription('Mention another user to kick or if you really want to kick me, do it yourself 😎')
            ], components: [], ephemeral: true})
            return
        }
        else if (user.roles.highest.position >= interaction.member.roles.highest.position) {
            await interaction.reply({embeds: [
                new MessageEmbed()
                .setTitle('Cannot kick user!')
                .setColor('RED')
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setTimestamp()
                .setFooter('©️Krosis')
                .setDescription('You cannot kick this user as you don\'t have the required permissions.')
            ], components: [], ephemeral: true})
            return
        }
        else {
            await interaction.reply({ embeds: [
                new MessageEmbed()
                    .setTitle('Kick user')
                    .setColor('YELLOW')
                    .setAuthor(interaction.user.username + ' [Admin]', interaction.user.displayAvatarURL())
                    .setTimestamp()
                    .setFooter('©️Krosis')
                    .setDescription(
                        `❗ Are you sure you want to kick this user (${user}) from (${interaction.guild.name}) ?
                        ❗ ${inlineCode('WARNING')} This action is irreversible, choose wisely! 
                        `
                    )
            ], components: [
                new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setStyle('SUCCESS')
                            .setCustomId('yes')
                            .setLabel('🥾 Kick'),
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
                    user.kick(reason)
                    await interaction.editReply({embeds: [
                        new MessageEmbed()
                        .setTitle('Kicked user!')
                        .setColor('GREEN')
                        .setAuthor(interaction.user.username + ' [Admin]', interaction.user.displayAvatarURL())
                        .setTimestamp()
                        .setFooter('©️Krosis')
                        .setDescription('The user has been kicked successfully!')
                    ], components: [], ephemeral: true})
                }
                else {
                    await interaction.editReply({embeds: [
                        new MessageEmbed()
                        .setTitle('Action cancelled!')
                        .setColor('RED')
                        .setAuthor(interaction.user.username + ' [Admin]', interaction.user.displayAvatarURL())
                        .setTimestamp()
                        .setFooter('©️Krosis')
                        .setDescription('The kick action has been cancelled by the invoker.')
                    ], components: [], ephemeral: true})
                }
            }
            else {
                await interaction.editReply({embeds: [
                    new MessageEmbed()
                    .setTitle('Action cancelled!')
                    .setColor('RED')
                    .setAuthor(interaction.user.username + ' [Admin]', interaction.user.displayAvatarURL())
                    .setTimestamp()
                    .setFooter('©️Krosis')
                    .setDescription('The kick action has been cancelled as the 20 second allocated interaction time ran out.')
                ], components: [], ephemeral: true})
            }
        })
    }
}