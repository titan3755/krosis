const { SlashCommandBuilder, inlineCode } = require('@discordjs/builders')
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js')
const fs = require('fs')
const path = require('path')
const desc = JSON.parse(fs.readFileSync(path.join(__dirname, '/../data/cmd_desc.json')))
const helpDesc = JSON.parse(fs.readFileSync(path.join(__dirname, '/../data/help_cmd.json')))
module.exports = {
    data: new SlashCommandBuilder()
        .setName(path.basename(__filename, '.js'))
        .setDescription(desc[path.basename(__filename, '.js')]),
    async execute(interaction) {
        let selectMenu = new MessageSelectMenu()
        .setCustomId('category')
        .setPlaceholder('Category')
        .addOptions([
            {
                label: 'Fun',
                description: 'Commands in the \"Fun\" category',
                value: 'fun',
                emoji: '🎉'
            },
            {
                label: 'Games',
                description: 'Commands in the \"Games\" category',
                value: 'games',
                emoji: '🎯'
            },
            {
                label: 'Moderation',
                description: 'Commands in the \"Moderation\" category',
                value: 'moderation',
                emoji: '🛡️'
            },
            {
                label: 'Utility',
                description: 'Commands in the \"Utility\" category',
                value: 'utility',
                emoji: '⚙️'
            }
        ])
        let funSelectMenu = new MessageSelectMenu()
        .setCustomId('category')
        .setPlaceholder('Category')
        .addOptions([
            {
                label: 'Fun',
                description: 'Commands in the \"Fun\" category',
                value: 'fun',
                emoji: '🎉',
                default: true
            },
            {
                label: 'Games',
                description: 'Commands in the \"Games\" category',
                value: 'games',
                emoji: '🎯'
            },
            {
                label: 'Moderation',
                description: 'Commands in the \"Moderation\" category',
                value: 'moderation',
                emoji: '🛡️'
            },
            {
                label: 'Utility',
                description: 'Commands in the \"Utility\" category',
                value: 'utility',
                emoji: '⚙️'
            }
        ])
        let gamesSelectMenu = new MessageSelectMenu()
        .setCustomId('category')
        .setPlaceholder('Category')
        .addOptions([
            {
                label: 'Fun',
                description: 'Commands in the \"Fun\" category',
                value: 'fun',
                emoji: '🎉',
            },
            {
                label: 'Games',
                description: 'Commands in the \"Games\" category',
                value: 'games',
                emoji: '🎯',
                default: true
            },
            {
                label: 'Moderation',
                description: 'Commands in the \"Moderation\" category',
                value: 'moderation',
                emoji: '🛡️'
            },
            {
                label: 'Utility',
                description: 'Commands in the \"Utility\" category',
                value: 'utility',
                emoji: '⚙️'
            }
        ])
        let moderationSelectMenu = new MessageSelectMenu()
        .setCustomId('category')
        .setPlaceholder('Category')
        .addOptions([
            {
                label: 'Fun',
                description: 'Commands in the \"Fun\" category',
                value: 'fun',
                emoji: '🎉',
            },
            {
                label: 'Games',
                description: 'Commands in the \"Games\" category',
                value: 'games',
                emoji: '🎯'
            },
            {
                label: 'Moderation',
                description: 'Commands in the \"Moderation\" category',
                value: 'moderation',
                emoji: '🛡️',
                default: true
            },
            {
                label: 'Utility',
                description: 'Commands in the \"Utility\" category',
                value: 'utility',
                emoji: '⚙️'
            }
        ])
        let utilitySelectMenu = new MessageSelectMenu()
        .setCustomId('category')
        .setPlaceholder('Category')
        .addOptions([
            {
                label: 'Fun',
                description: 'Commands in the \"Fun\" category',
                value: 'fun',
                emoji: '🎉',
            },
            {
                label: 'Games',
                description: 'Commands in the \"Games\" category',
                value: 'games',
                emoji: '🎯'
            },
            {
                label: 'Moderation',
                description: 'Commands in the \"Moderation\" category',
                value: 'moderation',
                emoji: '🛡️'
            },
            {
                label: 'Utility',
                description: 'Commands in the \"Utility\" category',
                value: 'utility',
                emoji: '⚙️',
                default: true
            }
        ])
        let funEmbed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('Fun commands')
                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                        .setDescription('Given below is a list of all available fun commands and their functionality as well as their usage.')
                        .setTimestamp()
                        .setFooter('©️Krosis');
        for (const item of helpDesc.fun) {
            funEmbed.addField(item.command, '⤷' + inlineCode(item.desc) || inlineCode('No desc'))
        }
        let gamesEmbed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('Game commands')
                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                        .setDescription('Given below is a list of all available game commands and their functionality as well as their usage.')
                        .setTimestamp()
                        .setFooter('©️Krosis');
        for (const item of helpDesc.games) {
            gamesEmbed.addField(item.command, '⤷' + inlineCode(item.desc) || inlineCode('No desc'))
        }
        let moderationEmbed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('Moderation commands')
                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                        .setDescription('Given below is a list of all available moderation commands and their functionality as well as their usage.')
                        .setTimestamp()
                        .setFooter('©️Krosis');
        for (const item of helpDesc.moderation) {
            moderationEmbed.addField(item.command, '⤷' + inlineCode(item.desc) || inlineCode('No desc'))
        }
        let utilityEmbed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('Utility commands')
                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                        .setDescription('Given below is a list of all available utility commands and their functionality as well as their usage.')
                        .setTimestamp()
                        .setFooter('©️Krosis');
        for (const item of helpDesc.utility) {
            utilityEmbed.addField(item.command, '⤷' + inlineCode(item.desc) || inlineCode('No desc'))
        }
        await interaction.reply({embeds: [
            new MessageEmbed()
            .setColor('#ffffff')
            .setTitle('Help command')
            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
            .setDescription('Welcome to the help section of Krosis bot. Here you will find all the information related to all available commands, their usage and their description. Use the select menu below to select a specific category of commands and all commands available in that category will be shown to you.')
            .setTimestamp()
            .setFooter('©️Krosis')
        ], components: [
            new MessageActionRow()
                .addComponents(
                    selectMenu
                )
        ]})
        const filter = (i) => {
            if (i.user.id === interaction.user.id) return true
            return i.reply({content: 'This menu is not for you!', ephemeral: true})
        }
        const collector = interaction.channel.createMessageComponentCollector({filter, time: 60 * 1000})
        collector.on('collect', async item => {
            if (item.values[0] === 'fun') {
                await item.update({embeds: [funEmbed], components: [new MessageActionRow().addComponents(funSelectMenu)]})
            }
            if (item.values[0] === 'games') {
                await item.update({embeds: [gamesEmbed], components: [new MessageActionRow().addComponents(gamesSelectMenu)]})
            }
            if (item.values[0] === 'moderation') {
                await item.update({embeds: [moderationEmbed], components: [new MessageActionRow().addComponents(moderationSelectMenu)]})
            }
            if (item.values[0] === 'utility') {
                await item.update({embeds: [utilityEmbed], components: [new MessageActionRow().addComponents(utilitySelectMenu)]})
            }
        })
        collector.on('end', async collection => {
            await interaction.editReply({components: []})
        })
    }
}