const Discord = require("discord.js");
const pjson = require("../../package.json");
const moment = require("moment");
const humanizeDuration = require("humanize-duration");

module.exports = class Status {
	constructor() {
		this.command = "status";
		this.help = "Provides detailed information about the bot.";
		this.isHigher = true;
	}

	// eslint-disable-next-line no-unused-vars
	async execute(message, client, bot) {
		const memoryUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
			2
		);
		const uptime = humanizeDuration(
			moment.duration(moment().diff(bot.startTime)).asMilliseconds(),
			{ round: true }
		);
		const exampleEmbed = new Discord.EmbedBuilder()
			.setColor(0x0099ff)
			.setTitle("Status Log")
			.addFields(
				{
					name: "Bot Version",
					value: `${pjson.version}`,
					inline: true,
				},
				{
					name: "Logged in as:",
					value: `${client.user.tag}`,
					inline: true,
				},
				{
					name: "Uptime:",
					value: `${uptime}`,
					inline: true,
				},
				{
					name: "Memory Usage:",
					value: `${memoryUsage} MB`,
					inline: true,
				},
				{
					name: "Users:",
					value: `${client.users.cache.size}`,
					inline: true,
				},
				{
					name: "Channels:",
					value: `${client.channels.cache.size}`,
					inline: true,
				},
				{
					name: "Guilds:",
					value: `${client.guilds.cache.size}`,
					inline: true,
				},
				{
					name: "Discord.js version:",
					value: `v${Discord.version}`,
					inline: true,
				},
				{
					name: "Node version:",
					value: `${process.version}`,
					inline: true,
				},
				{
					name: "OS version:",
					value: `${process.platform}, ${process.arch}`,
					inline: true,
				}
			)
			.setTimestamp()
			.setFooter({
				text: `Requested by ${message.author.tag}`,
				iconURL: message.author.avatarURL(),
			});

		await message.channel.send({ embeds: [exampleEmbed] });
	}
};
