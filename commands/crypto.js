const { SlashCommandBuilder, inlineCode } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const client = require('../clients/discord')
const truncate = require('../helpers/truncate')
const randomColor = require('randomcolor')
const stripTags = require('striptags')
const axios = require('axios').default
const fs = require('fs')
const path = require('path')
const desc = JSON.parse(fs.readFileSync(path.join(__dirname, '/../data/cmd_desc.json')))
module.exports = {
    data: new SlashCommandBuilder()
        .setName(path.basename(__filename, '.js'))
        .setDescription(desc[path.basename(__filename, '.js')])
        .addStringOption(option => option.setName('id').setRequired(true).setDescription('The cryptocurrency to get information for').addChoices([
            ['Bitcoin', 'bitcoin'], ['Ethereum', 'ethereum'], ['Tether', 'tether'], ['Binance Coin', 'binancecoin'],
            ['Litecoin', 'litecoin'], ['Cardano', 'cardano'], ['Polkadot', 'polkadot'], ['Stellar', 'stellar'], ['Dogecoin', 'dogecoin'],
            ['Monero', 'monero'], ['Solana', 'solana'], ['Avalanche', 'avalanche'], ['Nano', 'nano'], ['NEM', 'nem']
        ])),
    async execute(interaction) {
        await interaction.deferReply()
        try {
            let response = await (await axios.get(`https://api.coingecko.com/api/v3/coins/${interaction.options.getString('id')}`)).data
            await interaction.editReply({embeds: [
                new MessageEmbed()
                .setColor(randomColor())
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setTitle(response.name)
                .setDescription(truncate(stripTags(response.description.en) + '\n\n', 4000))
                .setURL(response.links.homepage[0] || 'https://www.coingecko.com')
                .setThumbnail(response.image.large)
                .addFields([
                    {
                        name: `${String(response.symbol).toUpperCase()} to USD`,
                        value: inlineCode(`${response.market_data.current_price.usd} USD`),
                        inline: true
                    },
                    {
                        name: `${String(response.symbol).toUpperCase()} to EUR`,
                        value: inlineCode(`${response.market_data.current_price.eur} EUR`),
                        inline: true
                    },
                    {
                        name: `${String(response.symbol).toUpperCase()} to GBP`,
                        value: inlineCode(`${response.market_data.current_price.gbp} GBP`),
                        inline: true
                    },
                    {
                        name: `${String(response.symbol).toUpperCase()} to JPY`,
                        value: inlineCode(`${response.market_data.current_price.jpy} JPY`),
                        inline: true
                    },
                    {
                        name: `${String(response.symbol).toUpperCase()} to AUD`,
                        value: inlineCode(`${response.market_data.current_price.aud} AUD`),
                        inline: true
                    },
                    {
                        name: `${String(response.symbol).toUpperCase()} to CAD`,
                        value: inlineCode(`${response.market_data.current_price.cad} CAD`),
                        inline: true
                    }
                ])
                .setFooter('©️Krosis')
                .setTimestamp()
            ]})
        }
        catch (err) {
            await interaction.editReply({content: codeBlock('An error occured! Error: ' + err)})
        }
    }
}