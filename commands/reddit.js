const { SlashCommandBuilder, codeBlock, quote } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const { decode } = require('html-entities')
const randomColor = require('randomcolor')
const fs = require('fs')
const path = require('path')
const redditPostFetcher = require('../helpers/redditPosts')
const desc = JSON.parse(fs.readFileSync(path.join(__dirname, '/../data/cmd_desc.json')))
const subreddits = JSON.parse(fs.readFileSync(path.join(__dirname, '/../data/subreddits.json')))
let choiceList = []
for (let i = 0; i < subreddits.length; i++) {
    choiceList.push([subreddits[i], subreddits[i]])
}
module.exports = {
    data: new SlashCommandBuilder()
        .setName(path.basename(__filename, '.js'))
        .setDescription(desc[path.basename(__filename, '.js')])
        .addStringOption(option => option.setName('subreddit').setDescription('An option to select a specific subreddit').setRequired(false).addChoices(choiceList)),
    async execute(interaction) {
        await interaction.deferReply()
        try {
            if (!interaction.options.getString('subreddit')) {
                let specificMeme = await redditPostFetcher()
                if (!specificMeme) {
                    throw 'That subreddit does not exist!'
                }
                else {
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
            }
            else {
                let specificMeme = await redditPostFetcher(interaction.options.getString('subreddit'))
                if (!specificMeme) {
                    throw 'That subreddit does not exist!'
                }
                else {
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
            }
        }
        catch (err) {
            await interaction.editReply({content: codeBlock('An error occured! Error: ' + err)})
        }
    }
}