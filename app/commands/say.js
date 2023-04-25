/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */
module.exports = class Say {
	constructor() {
		this.command = "say";
		this.help = "Say something as the bot!";
		this.isHigher = true;
	}

	// eslint-disable-next-line no-unused-vars
	execute(message, client, bot) {
		const sayMessage = message.content.replace(
			`${bot.prefix}${this.command}`,
			""
		);

		message.delete().catch((O_o) => { });
		message.channel.send(sayMessage);
	}
};
