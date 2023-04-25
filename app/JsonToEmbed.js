const Discord = require("discord.js");

const jsonToEmbed = (data) => {
	const embed = new Discord.EmbedBuilder();

	embed.setTitle(data.title);
	embed.setDescription(data.description);

	if (data.author) {
		embed.setAuthor(data.author.name, data.author.icon);
	}

	if (data.color) {
		embed.setColor(data.color);
	}

	if (data.fields) {
		data.fields.forEach((e) =>
			embed.addField(e.title, e.value, e.inline ? e.inline : false)
		);
	}

	if (data.timestamp) {
		embed.setTimestamp();
	}

	if (data.footer) {
		embed.setFooter(data.footer.title, data.footer.value);
	}

	return embed;
};

module.exports = { jsonToEmbed };
