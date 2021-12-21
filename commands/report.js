const djs = require('discord.js')
const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const prisma = require('../clients/prisma')
const fs = require('fs')
const path = require('path')
const desc = JSON.parse(fs.readFileSync(path.join(__dirname, '/../data/cmd_desc.json')))
const cooldown = new Set()
module.exports = {
    data: new SlashCommandBuilder()
        .setName(path.basename(__filename, '.js'))
        .setDescription(desc[path.basename(__filename, '.js')])
        .addStringOption(option =>
            option.setName('report')
                .setDescription('Description of the bug you\'re reporting for')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('email')
                .setDescription('Optional email to contact you after the bug is fixed')
                .setRequired(false)),
    async execute(interaction) {
        if (cooldown.has(interaction.user.id)) {
            await interaction.reply({content: codeBlock('This command is on cooldown! /report cannot be run within 24hrs of the last invocation!'), ephemeral: true})
        }
        else {
            try {
                await interaction.deferReply({ephemeral: true})
                await prisma.reports.create({
                    data: {
                        username: interaction.user.username,
                        userId: interaction.user.id,
                        userTag: interaction.user.tag,
                        email: interaction.options.getString('email'),
                        server: interaction.guild.name,
                        report: interaction.options.getString('report'),
                        timestamp: new Date(Date.now())
                    }
                })
                await interaction.editReply({embeds: [
                    new MessageEmbed()
                        .setColor('#ffffff')
                        .setTitle('Bug successfully reported!')
                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                        .setDescription('The bug you\'ve encountered has been successfully reported to the developers and it will be fixed shortly. Do not report any information other than bugs or vulnerabilities and a cooldown of 24hrs is set after using this command in order to prevent spam reports.')
                        .setTimestamp()
                        .setFooter('©️Krosis')
                    ], ephemeral: true
                })
                cooldown.add(interaction.user.id)
                setTimeout(() => {
                    cooldown.delete(interaction.user.id)
                }, 86400000)
            }
            catch (err) {
                await interaction.reply({content: codeBlock('An error occured! Error: ' + err)})
            }
        }
    }
}