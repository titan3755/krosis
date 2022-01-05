const { bold, blockQuote } = require('@discordjs/builders')
const randomColor = require('randomcolor')
const { MessageEmbed } = require('discord.js')
module.exports = {
	name: 'guildMemberAdd',
	async execute(member) {
        try {
            await member.send({embeds: [
                new MessageEmbed()
                    .setColor(randomColor())
                    .setAuthor(member.user.username, member.user.displayAvatarURL())
                    .setTitle(`Welcome to ${member.guild.name}!`)
                    .setDescription(`We are glad to have you here and we hope that you will have a good time in this server.`)
                    .addField(`Top activities in ${bold(member.guild.name)}`, blockQuote(
                        `
• Take a good look at the server rules.
• Don\'t do anything that will offend other members.
• Have fun while you are here!
                        `
                    ))
                    .setFooter('©️Krosis')
                    .setTimestamp()
            ]})
        }
        catch (err) {
            console.log(err)
        }
	}
}