const { SlashCommandBuilder, inlineCode } = require('@discordjs/builders')
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const randomColor = require('randomcolor')
const fs = require('fs')
const path = require('path')
const desc = JSON.parse(fs.readFileSync(path.join(__dirname, '/../data/cmd_desc.json')))
module.exports = {
    data: new SlashCommandBuilder()
        .setName(path.basename(__filename, '.js'))
        .setDescription(desc[path.basename(__filename, '.js')]),
    async execute(interaction) {
        const possibleChoices = ['rock', 'paper', 'scissors']
        let rockBtn = new MessageButton()
                        .setCustomId('rock')
                        .setLabel('Rock')
                        .setEmoji('🪨')
                        .setStyle('PRIMARY')
        let paperBtn = new MessageButton()
                        .setCustomId('paper')
                        .setLabel('Paper')
                        .setEmoji('🧻')
                        .setStyle('PRIMARY')
        let scissorsBtn = new MessageButton()
                        .setCustomId('scissors')
                        .setLabel('Scissors')
                        .setEmoji('✂️')
                        .setStyle('PRIMARY')
        let botChoice = possibleChoices[Math.floor(Math.random() * possibleChoices.length)]
        interaction.reply({embeds: [
            new MessageEmbed()
                .setColor(randomColor())
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setTitle('Rock-paper-scissors game')
                .setDescription('I have made my choice, now it\'s time for yours! Use the buttons below to make your choice. Try to choose between 20 seconds or the game will end.')
                .setFooter('©️Krosis')
                .setTimestamp()
        ], components: [
            new MessageActionRow()
                .addComponents(rockBtn, paperBtn, scissorsBtn)
        ]})
        const filter = (i) => {
            if (i.user.id === interaction.user.id) return true
            return i.reply({content: 'This button is not for you!', ephemeral: true})
        }
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 20 * 1000, max: 1 })
        collector.on('end', async collected => {
            if (collected.size !== 0) {
                if ((collected.first().customId === 'rock' && botChoice === 'scissors') || (collected.first().customId === 'paper' && botChoice === 'rock') || (collected.first().customId === 'scissors' && botChoice === 'paper')) {
                    await interaction.editReply({embeds: [
                        new MessageEmbed()
                        .setTitle('You won!')
                        .setColor('GREEN')
                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                        .setTimestamp()
                        .setFooter('©️Krosis')
                        .setDescription(`Congrats, you won! You chose ${collected.first().customId} and I chose ${botChoice}  - consider yourself lucky!`)
                    ], components: []})
                }
                else if ((collected.first().customId === 'rock' && botChoice === 'paper') || (collected.first().customId === 'paper' && botChoice === 'scissors') || (collected.first().customId === 'scissors' && botChoice === 'rock')) {
                    await interaction.editReply({embeds: [
                        new MessageEmbed()
                            .setTitle('You lost!')
                            .setColor('RED')
                            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                            .setTimestamp()
                            .setFooter('©️Krosis')
                            .setDescription(`Sadly, you lost! You chose ${collected.first().customId} and I chose ${botChoice} - not so lucky, are you?`)
                    ], components: []})
                }
                else {
                    await interaction.editReply({embeds: [
                        new MessageEmbed()
                            .setTitle('Draw!')
                            .setColor('WHITE')
                            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                            .setTimestamp()
                            .setFooter('©️Krosis')
                            .setDescription(`Woah, You and I chose the same thing! Great minds think alike indeed! I chose ${botChoice} and you chose ${collected.first().customId}.`)
                    ], components: []})
                }
            }
            else {
                await interaction.editReply({embeds: [
                    new MessageEmbed()
                        .setTitle('Time ran out!')
                        .setColor('RED')
                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                        .setTimestamp()
                        .setFooter('©️Krosis')
                        .setDescription(`It seems that you didn\'t want to play after all...`)
                ], components: []})
            }
        })
    }
}