const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const randomColor = require('randomcolor')
const fs = require('fs')
const path = require('path')
const { setTimeout } = require('timers')
const desc = JSON.parse(fs.readFileSync(path.join(__dirname, '/../data/cmd_desc.json')))
module.exports = {
    data: new SlashCommandBuilder()
        .setName(path.basename(__filename, '.js'))
        .setDescription(desc[path.basename(__filename, '.js')]),
    async execute(interaction) {
        let urlMaps = {
            1: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Alea_1.png',
            2: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Alea_2.png',
            3: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Alea_3.png',
            4: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Alea_4.png',
            5: 'https://upload.wikimedia.org/wikipedia/commons/5/55/Alea_5.png',
            6: 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Alea_6.png'
        }
        let randomNum = Math.floor(Math.random() * (6 - 1) + 1)
        await interaction.reply({embeds: [
            new MessageEmbed()
                .setColor(randomColor())
                .setTitle('Roll die')
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setDescription(`You rolled a ${randomNum}!`)
                .setThumbnail(urlMaps[randomNum])
                .setTimestamp()
                .setFooter('©️Krosis')
        ]})
    }
}