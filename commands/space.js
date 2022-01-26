const { SlashCommandBuilder, inlineCode, bold, codeBlock, quote } = require('@discordjs/builders')
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js')
const axios = require('axios').default
const randomColor = require('randomcolor')
const fs = require('fs')
const path = require('path')
const desc = JSON.parse(fs.readFileSync(path.join(__dirname, '/../data/cmd_desc.json')))
module.exports = {
    data: new SlashCommandBuilder()
        .setName(path.basename(__filename, '.js'))
        .setDescription(desc[path.basename(__filename, '.js')])
        .addStringOption(option => option.setName('type').setDescription('The type of content that will be returned').setRequired(true).addChoice('Astronomy Pictures', 'apod').addChoice('Random Bodies [WIP]', 'rbd')),
    async execute(interaction) {
        await interaction.deferReply()
        try {
            if (interaction.options.getString('type') === 'apod') {
                let res = await (await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}&count=1`)).data[0]
                await interaction.editReply({embeds: [
                    new MessageEmbed()
                    .setColor(randomColor())
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                    .setTitle(`${bold(res.title)} [${res.date}]`)
                    .setURL(res.url)
                    .setDescription(res.explanation)
                    .setThumbnail('https://i.imgur.com/GBtoSqS.png'),
                    new MessageEmbed()
                        .setImage(res.hdurl)
                        .setFooter('©️Krosis')
                        .setTimestamp()
                ]})
            }
            else if (interaction.options.getString('type') === 'rbd') {
                let response = await (await axios.get('https://api.le-systeme-solaire.net/rest/bodies')).data.bodies
                let randomBody = response[Math.floor(Math.random() * response.length)]
                await interaction.editReply({embeds: [
                    new MessageEmbed()
                        .setColor(randomColor())
                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                        .setTitle(`Random astronomical body [${randomBody.englishName}]`)
                        .setDescription('Here is a random astronomical body from the solar system along with all its associated information.')
                        .addFields([
                            {
                                name: 'Name',
                                value: inlineCode(`${randomBody.englishName}`),
                                inline: true
                            },
                            {
                                name: 'Mass',
                                value: inlineCode(!randomBody.mass ? 'N/A' : `${randomBody.mass.massValue} x 10^${randomBody.mass.massExponent} kg`),
                                inline: true
                            },
                            {
                                name: 'Gravity',
                                value: inlineCode(`${randomBody.gravity} m/s²`),
                                inline: true
                            },
                            {
                                name: 'Density',
                                value: inlineCode(`${randomBody.density} g/cm³`),
                                inline: true
                            },
                            {
                                name: 'Escape',
                                value: inlineCode(`${randomBody.escape} m/s`),
                                inline: true
                            },
                            {
                                name: 'Radius',
                                value: inlineCode(`${!randomBody.equaRadius ? '< 1' : randomBody.equaRadius} Km`),
                                inline: true
                            },
                        ])
                ]})
            }
            else {
                await interaction.editReply({content: 'Unknown type!', ephemeral: true})
            }
        }
        catch (err) {
            await interaction.editReply({content: codeBlock('An error occured! Error: ' + err)})
        }
    }
}