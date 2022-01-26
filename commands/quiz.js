const { MessageActionRow, MessageButton } = require('discord.js')
const { MessageEmbed } = require('discord.js')
const { SlashCommandBuilder, italic, codeBlock, bold, inlineCode } = require('@discordjs/builders')
const randomColor = require('randomcolor')
const axios = require('axios').default
const { decode } = require('html-entities')
const shuffler = require('../helpers/arrayShuffle')
const fs = require('fs')
const path = require('path')
const desc = JSON.parse(fs.readFileSync(path.join(__dirname, '/../data/cmd_desc.json')))
module.exports = {
    data: new SlashCommandBuilder()
        .setName(path.basename(__filename, '.js'))
        .setDescription(desc[path.basename(__filename, '.js')]),
    async execute(interaction) {
        await interaction.deferReply()
        try {
            let quizData = await (await axios.get('https://opentdb.com/api.php?amount=1&type=multiple')).data
            let shuffledAnswers = shuffler([{answer: quizData.results[0].correct_answer, correct: true}].concat(quizData.results[0].incorrect_answers.map(item => {return {answer: item, correct: false}})))
            await interaction.editReply({embeds: [
                new MessageEmbed()
                    .setTitle(decode(quizData.results[0].question))
                    .setDescription(
                    `${italic('You have 15 seconds to answer')}
                    
                        ${inlineCode('A.')}  ${bold(decode(shuffledAnswers[0].answer))}
                        ${inlineCode('B.')}  ${bold(decode(shuffledAnswers[1].answer))}
                        ${inlineCode('C.')}  ${bold(decode(shuffledAnswers[2].answer))}
                        ${inlineCode('D.')}  ${bold(decode(shuffledAnswers[3].answer))}
                    `
                    )
                    .setColor(randomColor())
                    .setAuthor(interaction.user.username + '\'s Question', interaction.user.displayAvatarURL())
                    .setTimestamp()
                    .setFooter('©️Krosis')
                ], components: [
                new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('0')
                            .setLabel('A')
                            .setStyle('SUCCESS')
                    )
                    .addComponents(
                        new MessageButton()
                            .setCustomId('1')
                            .setLabel('B')
                            .setStyle('SUCCESS')
                    )
                    .addComponents(
                        new MessageButton()
                            .setCustomId('2')
                            .setLabel('C')
                            .setStyle('SUCCESS')
                    )
                    .addComponents(
                        new MessageButton()
                            .setCustomId('3')
                            .setLabel('D')
                            .setStyle('SUCCESS')
                    )
            ]})
            const filter = (i) => {
                if (i.user.id === interaction.user.id) return true
                return i.reply({content: 'This button is not for you!', ephemeral: true})
            }
            const collector = interaction.channel.createMessageComponentCollector({ filter, max: 1, time: 1000 * 15 })
            collector.on('end', async collection => {
                if (collection.size !== 0) {
                    let selected = shuffledAnswers[Number(collection.first().customId)]
                    if (selected.correct) {
                        await interaction.editReply({components: []})
                        await interaction.followUp({embeds: [
                            new MessageEmbed()
                                .setTitle('Correct!')
                                .setColor('GREEN')
                                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                                .setTimestamp()
                                .setFooter('©️Krosis')
                                .setDescription('You have selected the correct answer, congrats! ' + bold(selected.answer) + ' was indeed the correct answer to the question.')
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
                                .setDescription('You have selected the wrong answer! Better luck next time.')
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
        catch (err) {
            await interaction.editReply({content: codeBlock('An error occured! Error: ' + err)})
        }
    }
}