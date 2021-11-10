module.exports = class Ping {
	constructor() {
		this.command = 'ping';
		this.help = 'It like... Pings. Then Pongs. And it\'s not Ping Pong.';
		this.isHigher = true;
	}

	// eslint-disable-next-line no-unused-vars
	async execute(message, client, bot) {
		const msg = await message.channel.send('Ping?');
		msg.edit(`Pong! Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
	}
};