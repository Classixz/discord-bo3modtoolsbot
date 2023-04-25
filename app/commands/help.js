const Discord = require("discord.js");
const { isHigher } = require("../Utils");

module.exports = class Help {
	constructor() {
		this.command = "help";
		this.help = "Display a list of commands at your disposal";
		this.isHigher = false;
	}

	async execute(message, client, bot, commands) {
		if (message.guild === null) {
			return;
		}

		const higher = isHigher(message.member);

		let cmds = "";
		commands
			.filter((e) => !(!higher && e.isHigher))
			.map((e) => {
				cmds += `\`${bot.prefix}${e.command}\` _${e.help}_\n`;
			});

		await (higher ? message.member : message.channel).send({
			embeds: [
				new Discord.EmbedBuilder()
					.setColor(0x0099ff)
					.setTitle("Command List")
					.setDescription(
						"A list of commands for our bot" +
						(!higher
							? ""
							: "\nYou have been DM'd this list as it contains sensitive commands")
					)
					.addFields({ name: "Commands", value: `${cmds}`, inline: false })
					.setFooter({
						text: "If you encounter any issues with the bot then please contact an owner or moderator.",
					}),
			],
		});
	}
};
