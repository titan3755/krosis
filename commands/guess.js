const { SlashCommandBuilder, italic, bold } = require('@discordjs/builders')
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const client = require('../clients/discord')
const randomColor = require('randomcolor')
const randomNumber = require('../helpers/randomRange')
const fs = require('fs')
const path = require('path')
const desc = JSON.parse(fs.readFileSync(path.join(__dirname, '/../data/cmd_desc.json')))
module.exports = {
    data: new SlashCommandBuilder()
        .setName(path.basename(__filename, '.js'))
        .setDescription(desc[path.basename(__filename, '.js')]),
    async execute(interaction) {
        let random = randomNumber(1, 100)
        let guess = randomNumber(1, 100)
        await interaction.reply({embeds: [
            new MessageEmbed()
                .setColor(randomColor())
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setTitle('Guessing game')
                .setDescription(`I have selected a number between 1 and 100. \n Is it ${italic('higher')} or ${italic('lower')} or ${italic('equal')} to ${bold(guess)}?`)
                .setFooter('©️Krosis')
                .setTimestamp()
        ], components: [
            new MessageActionRow()
                .addComponents([
                    new MessageButton()
                        .setCustomId('lower')
                        .setLabel('Lower')
                        .setEmoji('⬇️')
                        .setStyle('DANGER'),
                    new MessageButton()
                        .setCustomId('equal')
                        .setLabel('Equal')
                        .setEmoji('🎯')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('higher')
                        .setLabel('Higher')
                        .setEmoji('⬆️')
                        .setStyle('SUCCESS')
                ])
        ]})
        const filter = (i) => {
            if (i.user.id === interaction.user.id) return true
            return i.reply({content: 'This button is not for you!', ephemeral: true})
        }
        const collector = interaction.channel.createMessageComponentCollector({ filter, max: 1, time: 1000 * 15 })
        collector.on('end', async collection => {
            if (collection.size !== 0) {
                if (collection.first().customId === 'lower' && random < guess) {
                    await interaction.editReply({components: []})
                    await interaction.followUp({embeds: [
                        new MessageEmbed()
                            .setTitle('Correct!')
                            .setColor('GREEN')
                            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                            .setTimestamp()
                            .setFooter('©️Krosis')
                            .setDescription(`You have selected the correct answer, congrats! ${bold(random)} is indeed ${bold('lower')} than ${bold(guess)}!`)
                    ], components: []})
                }
                else if (collection.first().customId === 'higher' && random > guess) {
                    await interaction.editReply({components: []})
                    await interaction.followUp({embeds: [
                        new MessageEmbed()
                            .setTitle('Correct!')
                            .setColor('GREEN')
                            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                            .setTimestamp()
                            .setFooter('©️Krosis')
                            .setDescription(`You have selected the correct answer, congrats! ${bold(random)} is indeed ${bold('higher')} than ${bold(guess)}!`)
                    ], components: []})
                }
                else if (collection.first().customId === 'equal' && random === guess) {
                    await interaction.editReply({components: []})
                    await interaction.followUp({embeds: [
                        new MessageEmbed()
                            .setTitle('Correct!')
                            .setColor('GREEN')
                            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                            .setTimestamp()
                            .setFooter('©️Krosis')
                            .setDescription(`You have selected the correct answer, congrats! ${bold(random)} is indeed ${bold('equal')} to ${bold(guess)} - that's extremely lucky!`)
                    ], components: []})
                }
                else {
                    await interaction.editReply({components: []})
                    await interaction.followUp({embeds: [
                        new MessageEmbed()
                            .setTitle('Incorrect!')
                            .setColor('RED')
                            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                            .setTimestamp()
                            .setFooter('©️Krosis')
                            .setDescription(`You have selected the wrong answer! I selected ${bold(random)}. Better luck next time.`)
                    ], components: []})
                }
            }
            else {
                await interaction.editReply({embeds: [
                    new MessageEmbed()
                        .setTitle('Failed to answer!')
                        .setColor('RED')
                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                        .setTimestamp()
                        .setFooter('©️Krosis')
                        .setDescription('You did not answer within the given time! Try to answer as quick as possible from next time onwards.')
                ], components: []})
            }
        })
    }
}