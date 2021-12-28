module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
        console.log('\nAll commands loaded successfully! 📒')
        console.log('All event handlers loaded successfully! 🔔')
        console.log('Bot is online and ready to be used! ✅')
        client.user.setPresence({activities: [{name: '/help', type: 'LISTENING'}], status: 'online'})
	},
};