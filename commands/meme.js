const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const randomColor = require('randomcolor')
const axios = require('axios').default
const fs = require('fs')
const path = require('path')
const randomNumber = require('../helpers/randomRange')
const desc = JSON.parse(fs.readFileSync(path.join(__dirname, '/../data/cmd_desc.json')))
module.exports = {
    data: new SlashCommandBuilder()
        .setName(path.basename(__filename, '.js'))
        .setDescription(desc[path.basename(__filename, '.js')]),
    async execute(interaction) {
        await interaction.deferReply()
        try {
            let subreddits = ['memes', 'holup', 'me_irl']
            let memes = await (await axios.get(`https://www.reddit.com/r/memes.json`)).data
            let specificMeme = memes.data.children[randomNumber(1, memes.data.children.length)]
            await interaction.editReply({embeds: [
                new MessageEmbed()
                    .setColor(randomColor())
                    .setTitle(specificMeme.data.title)
                    .setURL('https://www.reddit.com' + specificMeme.data.permalink)
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                    .setThumbnail('https://i.imgur.com/DUC2xA2.png')
                    .setImage(specificMeme.data.post_hint === 'image' ? specificMeme.data.url_overridden_by_dest : 'https://via.placeholder.com/750/000000/FFFFFF/?text=ImageNotAvailable!')
                    .setTimestamp()
                    .setFooter(' 👍 ' + String(specificMeme.data.ups) + '\t' + ' 📒 ' + specificMeme.data.author)
            ]})
        }
        catch (err) {
            await interaction.editReply({content: codeBlock('An error occured! Error: ' + err)})
        }
    }
}