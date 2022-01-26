const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const { decode } = require('html-entities')
const randomColor = require('randomcolor')
const redditPostFetcher = require('../helpers/redditPosts')
const fs = require('fs')
const path = require('path')
const desc = JSON.parse(fs.readFileSync(path.join(__dirname, '/../data/cmd_desc.json')))
module.exports = {
    data: new SlashCommandBuilder()
        .setName(path.basename(__filename, '.js'))
        .setDescription(desc[path.basename(__filename, '.js')]),
    async execute(interaction) {
        await interaction.deferReply()
        try {
            let specificMeme = await redditPostFetcher('memes')
            if (specificMeme) {
                await interaction.editReply({embeds: [
                    new MessageEmbed()
                        .setColor(randomColor())
                        .setTitle(decode(specificMeme.data.title))
                        .setURL('https://www.reddit.com' + specificMeme.data.permalink)
                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                        .setThumbnail('https://i.imgur.com/DUC2xA2.png')
                        .setImage(specificMeme.data.post_hint === 'image' ? specificMeme.data.url_overridden_by_dest : 'https://via.placeholder.com/750/000000/FFFFFF/?text=ImageNotAvailable!')
                        .setTimestamp()
                        .setFooter(' 👍 ' + String(specificMeme.data.ups) + ' 🤖 ' + 'r/' + specificMeme.data.subreddit + ' 📒 ' + specificMeme.data.author)
                ]})
            }
            else {
                await interaction.editReply({content: codeBlock('An error occured! Error: ' + err)})
            }
        }
        catch (err) {
            await interaction.editReply({content: codeBlock('An error occured! Error: ' + err)})
        }
    }
}