const { SlashCommandBuilder, inlineCode, bold } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const axios = require('axios').default
const randomColor = require('randomcolor')
const fs = require('fs')
const path = require('path')
const desc = JSON.parse(fs.readFileSync(path.join(__dirname, '/../data/cmd_desc.json')))
module.exports = {
    data: new SlashCommandBuilder()
        .setName(path.basename(__filename, '.js'))
        .setDescription(desc[path.basename(__filename, '.js')]),
    async execute(interaction) {
        await interaction.deferReply()
        let res = await (await axios.get('https://randomuser.me/api/')).data.results[0]
        await interaction.editReply({embeds: [
            new MessageEmbed()
            .setColor(randomColor())
            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
            .setTitle(`Random person generated!`)
            .setDescription(
                `
                ${bold(res.name.title)}. ${bold(res.name.first)} ${bold(res.name.last)}
                `
            )
            .addFields([
                {
                    name: 'Gender', value: inlineCode(res.gender), inline: true
                },
                {
                    name: 'Country', value: inlineCode(res.location.country), inline: true
                },
                {
                    name: 'State', value: inlineCode(res.location.state), inline: true
                },
                {
                    name: 'City', value: inlineCode(res.location.city), inline: true
                },
                {
                    name: 'Latitude', value: inlineCode(res.location.coordinates.latitude), inline: true
                },
                {
                    name: 'Longitude', value: inlineCode(res.location.coordinates.longitude), inline: true
                },
                {
                    name: 'Street', value: inlineCode(`${res.location.street.number} ${res.location.street.name} street`), inline: true
                },
                {
                    name: 'Timezone', value: inlineCode(`${res.location.timezone.offset} ${res.location.timezone.description}`), inline: true
                },
                {
                    name: 'Email', value: inlineCode(res.email), inline: true
                },
                {
                    name: 'Date of Birth', value: inlineCode(res.dob.date), inline: true
                },
                {
                    name: 'Age', value: inlineCode(String(res.dob.age)), inline: true
                },
                {
                    name: 'Mobile No.', value: inlineCode(res.phone), inline: true
                }

            ]),
            new MessageEmbed()
                .setImage(res.picture.large)
                .setFooter('©️Krosis')
                .setTimestamp()
        ]})
    }
}