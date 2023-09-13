/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */
module.exports = class Contest {
	constructor() {
		this.command = "contest";
		this.help = "Contest registration for the BO3 MT Contest!";
		this.isHigher = true;
	}

	// eslint-disable-next-line no-unused-vars
	execute(message, client, bot) {
		message.delete().catch((O_o) => { });

		const contestEmbed = {
			"content": process.env.CONTEST_MESSAGE,
			"tts": false,
			"components": [
				{
					"type": 1,
					"components": [
						{
							"style": 3,
							"label": `Register`,
							"custom_id": `contest_register`,
							"disabled": false,
							"type": 2
						},
						{
							"style": 4,
							"label": `Withdraw`,
							"custom_id": `contest_withdraw`,
							"disabled": false,
							"type": 2
						}
					]
				}
			],
			"embeds": [
				{
					"type": "rich",
					"title": process.env.CONTEST_TITLE,
					"description": process.env.CONTEST_DESCRIPTION,
					"color": 0x00FFFF,
					"image": {
						"url": process.env.CONTEST_IMAGE,
						"height": 0,
						"width": 0
					},
					"thumbnail": {
						"url": process.env.CONTEST_HOST_AVATAR,
						"height": 0,
						"width": 0
					},
					"footer": {
						"text": process.env.CONTEST_FOOTER_TEXT,
						"icon_url": process.env.CONTEST_FOOTER_ICON,
					},
					"url": process.env.CONTEST_ANNOUNCMENT_URL,
				}
			]
		};


		// Get the content of the message, so we can check if we have a message ID
		const args = message.content.slice(bot.prefix).trim().split(/ +/g);

		// Check if there is a message with the ID
		if (args.length > 1) {
			message.channel.messages.fetch(args[1])
				.then(fetchedMsg => {
					if (fetchedMsg) {
						// Check if the message is in the same channel
						if (fetchedMsg.channel.id === message.channel.id) {
							// Check if the message is from the bot
							if (fetchedMsg.author.id === client.user.id) {
								// Update the message
								fetchedMsg.edit(contestEmbed);
							} else {
								message.channel.send("The message is not from the bot.");
							}
						} else {
							message.channel.send("The message is not from this channel.");
						}
					} else {
						console.log(args[1]);
						message.channel.send("There is no message with that ID.");
					}

				});


		} else {
			message.channel.send(contestEmbed);
		}

	}
};
