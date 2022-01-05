const { SlashCommandBuilder, codeBlock, bold, blockQuote, italic } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const randomColor = require('randomcolor')
const axios = require('axios').default
const fs = require('fs')
const path = require('path')
const desc = JSON.parse(fs.readFileSync(path.join(__dirname, '/../data/cmd_desc.json')))
module.exports = {
    data: new SlashCommandBuilder()
        .setName(path.basename(__filename, '.js'))
        .setDescription(desc[path.basename(__filename, '.js')])
        .addStringOption(option => option.setName('word').setDescription('The word to get definitions for').setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply()
        try {
            let response = await (await axios.get('https://api.api-ninjas.com/v1/dictionary', {
                params: {
                    word: interaction.options.getString('word')
                },
                headers: {
                    "X-Api-Key": "3UcuJxhFZTrXNo6Rkq/pAw==fRvtLwK7qnuZt103"
                }
            })).data
            if (response.valid) {
                if (response.definition.length > 1023) {
                    await interaction.editReply({embeds: [
                        new MessageEmbed()
                            .setColor(randomColor())
                            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                            .setTitle('Dictionary')
                            .setDescription('This command when invoked will display the definitions of the given English word from the dictionary. If the word is invalid, an error message will be shown. Otherwise, if the word is a valid English word, the definitions will be displayed accordingly.')
                            .addField(`Definitions for ${blockQuote(bold(italic(response.word)))}`, codeBlock(response.definition.slice(0, 1000) + '...'))
                            .setFooter('©️Krosis')
                            .setTimestamp() 
                    ]})
                }
                else {
                    await interaction.editReply({embeds: [
                        new MessageEmbed()
                            .setColor(randomColor())
                            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                            .setTitle('Dictionary')
                            .setDescription('This command when invoked will display the definitions of the given English word from the dictionary. If the word is invalid, an error message will be shown. Otherwise, if the word is a valid English word, the definitions will be displayed accordingly.')
                            .addField(`Definitions for ${blockQuote(bold(italic(response.word)))}`, codeBlock(response.definition))
                            .setFooter('©️Krosis')
                            .setTimestamp() 
                    ]})
                }
            }
            else {
                await interaction.editReply({embeds: [
                    new MessageEmbed()
                        .setColor('RED')
                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                        .setTitle('Dictionary')
                        .setDescription('The word you entered is not valid! Pls check if there are any typos or spelling errors in the word and reinvoke.')
                        .setFooter('©️Krosis')
                        .setTimestamp() 
                ]})
            }
        }
        catch (err) {
            await interaction.editReply({content: codeBlock('An error occured! Error: ' + err)})
        }
    }
}