const Discord = require('discord.js');
const pjson = require('../../package.json');
const moment = require('moment');
const humanizeDuration = require('humanize-duration');

module.exports = class Status {
	constructor() {
		this.command = 'status';
		this.help = 'Provides detailed information about the bot.';
		this.isHigher = true;
	}

	// eslint-disable-next-line no-unused-vars
	async execute(message, client, bot) {
		await message.channel.send({ embeds: [
			new Discord.MessageEmbed()
				.setColor('#0099ff')
				.setTitle('Status Log')
				.addField('Bot Version', pjson.version, true)
				.addField('Logged in as:', client.user.tag, true)
				.addField('Uptime:', humanizeDuration(moment.duration(moment().diff(bot.startTime)).asMilliseconds(), { round: true }))
				.addField('Memory Usage:', `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`)
				.addField('Users:', `${client.users.cache.size}`, true)
				.addField('Channels:', `${client.channels.cache.size}`, true)
				.addField('Guilds:', `${client.guilds.cache.size}`, true)
				.addField('Discord.js version:', `v${Discord.version}`, true)
				.addField('Node version:', process.version, true)
				.addField('OS version:', `${process.platform}, ${process.arch}`, true)
				.setTimestamp()
				.setFooter('Requested by ' + message.author.tag, message.author.avatarURL()),
		] });
	}
};