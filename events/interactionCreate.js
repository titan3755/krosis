const client = require('../clients/discord')
module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName)
            if (!command) return
            if (command.permission) {
                const authorPerms = interaction.channel.permissionsFor(interaction.member)
                if (!authorPerms || !authorPerms.has(command.permission)) {
                    return await interaction.reply({embeds: [
                        new MessageEmbed()
                            .setColor('RED')
                            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                            .setTitle('Permissions required!')
                            .setDescription(`You lack the required permissions[${command.permission}] to use this command.`)
                            .setTimestamp()
                            .setFooter('©️Krosis')
                        ], ephemeral: true
                    })
                }
            }
            try {
                await command.execute(interaction)
            }
            catch (err) {
                console.log(err)
                try {
                    await interaction.reply({content: 'Something went wrong when executing this command!', ephemeral: true})
                }
                catch {
                    await interaction.editReply({content: 'Something went wrong when executing this command!', ephemeral: true})
                }
            }
        }
        else if (interaction.isButton()) {
            // Pass if the interaction is of button component
        }
        else if (interaction.isSelectMenu()) {
            // Pass if the interaction is of selectMenu component
        }
        else {
            return
        }
	},
}