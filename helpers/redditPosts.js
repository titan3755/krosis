const fs = require('fs')
const path = require('path')
const axios = require('axios').default
const randomNumber = require('../helpers/randomRange')
const subreddits = JSON.parse(fs.readFileSync(path.join(__dirname, '/../data/subreddits.json')))
async function redditPosts (subreddit = null) {
    if (subreddit === null) {
        try {
            let memes = await (await axios.get(`https://www.reddit.com/r/${subreddits[Math.floor(Math.random() * subreddits.length)]}.json`)).data
            let specificMeme = memes.data.children[randomNumber(1, memes.data.children.length)]
            return specificMeme
        }
        catch (err) {
            return null
        }
    }
    else {
        try {
            let memes = await (await axios.get(`https://www.reddit.com/r/${subreddit}.json`)).data
            let specificMeme = memes.data.children[randomNumber(1, memes.data.children.length)]
            return specificMeme
        }
        catch (err) {
            return null
        }
    }
}
module.exports = redditPosts