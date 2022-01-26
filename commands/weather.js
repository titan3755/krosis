const { SlashCommandBuilder, codeBlock, bold, inlineCode } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const client = require('../clients/discord')
const randomColor = require('randomcolor')
const axios = require('axios').default
const fs = require('fs')
const path = require('path')
const desc = JSON.parse(fs.readFileSync(path.join(__dirname, '/../data/cmd_desc.json')))
module.exports = {
    data: new SlashCommandBuilder()
        .setName(path.basename(__filename, '.js'))
        .setDescription(desc[path.basename(__filename, '.js')])
        .addStringOption(option => option.setName('query').setRequired(true).setDescription('The city/country to get the weather for'))
        .addStringOption(option => option.setName('units').setRequired(false).setDescription('The units to use for weather information (default: metric)').addChoices([['metric', 'metric'], ['imperial', 'imperial']])),
        async execute(interaction) {
        await interaction.deferReply()
        try {
            let response = await (await axios.get('https://api.openweathermap.org/data/2.5/weather', {
                params: {
                    'q': interaction.options.getString('query'),
                    'units': interaction.options.getString('units') || 'metric',
                    'appid': process.env.OPENWEATHERMAP_KEY
                }
            })).data
            if (response.cod === '404') {
                await interaction.editReply({embeds: [
                    new MessageEmbed()
                    .setTitle('Non-existent region!')
                    .setColor('RED')
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                    .setTimestamp()
                    .setFooter('©️Krosis')
                    .setDescription('The city or country that you have entered is invalid! Please provide a valid region.')
                ], ephemeral: true})
            }
            else {
                await interaction.editReply({embeds: [
                    new MessageEmbed()
                    .setTitle('Weather data for ' + response.name + ', ' + response.sys.country)
                    .setColor(randomColor())
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                    .setTimestamp()
                    .setFooter('©️Krosis')
                    .setDescription(`The current weather conditions in ${bold(response.name)}, ${bold(response.sys.country)} are given below in separate fields for different types of weather information.`)
                    .addFields([
                        {
                            name: '🌡️ Temperature',
                            value: inlineCode(`${response.main.temp}${interaction.options.getString('units') === 'imperial' ? '°F' : '°C'}`),
                            inline: true
                        },
                        {
                            name: '☁️ Conditions',
                            value: inlineCode(response.weather[0].main),
                            inline: true
                        },
                        {
                            name: '⬇️ Pressure',
                            value: inlineCode(`${response.main.pressure} mb`),
                            inline: true
                        },
                        {
                            name: '💧 Humidity',
                            value: inlineCode(`${response.main.humidity}%`),
                            inline: true
                        },
                        {
                            name: '🔭 Visibility',
                            value: inlineCode(`${response.visibility} m`),
                            inline: true
                        },
                        {
                            name: '💨 Wind',
                            value: inlineCode(`${response.wind.speed} ${interaction.options.getString('units') === 'imperial' ? 'mph' : 'm/s'} at ${response.wind.deg}°`),
                            inline: true
                        },
                        {
                            name: '🌫️ Clouds',
                            value: inlineCode(`${response.clouds.all}%`),
                            inline: true
                        }
                    ])
                ]})
            }
        }
        catch (err) {
            await interaction.editReply({embeds: [
                new MessageEmbed()
                .setTitle('Non-existent region!')
                .setColor('RED')
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setTimestamp()
                .setFooter('©️Krosis')
                .setDescription('The city or country that you have entered is invalid! Please provide a valid region.')
            ]})
        }
    }
}