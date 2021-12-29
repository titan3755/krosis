const { SlashCommandBuilder, inlineCode } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const randomColor = require('randomcolor')
const fs = require('fs')
const path = require('path')
const pingTest = require('../helpers/serverPinger')
const desc = JSON.parse(fs.readFileSync(path.join(__dirname, '/../data/cmd_desc.json')))
module.exports = {
    data: new SlashCommandBuilder()
        .setName(path.basename(__filename, '.js'))
        .setDescription(desc[path.basename(__filename, '.js')]),
    async execute(interaction) {
        let ping = await (await pingTest('google.com')).time
        interaction.reply({embeds: [
            new MessageEmbed()
                .setColor(randomColor())
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setTitle('Latency test')
                .setDescription('This command when invoked measures your latency by making an HTTP request to Google\'s servers. The measured latency is shown in miliseconds unit in a field below. Remember, for ping, lower is better!')
                .addField('Latency', inlineCode(ping + ' ms'))
                .setFooter('©️Krosis')
                .setTimestamp()
        ]})
    }
}