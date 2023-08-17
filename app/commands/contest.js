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

		message.channel.send({
			"content": "@everyone, NoahJ456's Second Mapping Contest is now open for registration!",
			"tts": false,
			"components": [
				{
					"type": 1,
					"components": [
						{
							"style": 3,
							"label": `Register`,
							"custom_id": `contest2_register`,
							"disabled": false,
							"type": 2
						},
						{
							"style": 4,
							"label": `Withdraw`,
							"custom_id": `contest2_withdraw`,
							"disabled": false,
							"type": 2
						}
					]
				}
			],
			"embeds": [
				{
					"type": "rich",
					"title": `NoahJ456's Second Mapping Contest`,
					"description": `• 20 winners each get $500\n• Timeframe: <t:1692136800:D> to <t:1696197540:f>\n• Theme: Horror\n• Duo / Solo (Duos split winnings)\n\nMore Information in the announcement: https://discord.com/channels/230615005194616834/230616112805445632/1141447938766290995\n\n** Maps have to be submitted by  <t:1696197540:f> in  https://discord.com/channels/230615005194616834/1111953746159747112 **\n\nRegister by clicking on the button below, you can also \n`,
					"color": 0x00FFFF,
					"image": {
						"url": `https://cdn.discordapp.com/attachments/230616112805445632/1141447938334269521/noahj456.png`,
						"height": 0,
						"width": 0
					},
					"footer": {
						"text": `NoahJ456's Second Mapping Contest, register by clicking the button bellow.`,
						"icon_url": `https://cdn.discordapp.com/avatars/158073705040183296/7922d22a6e8aedaf79f97bfa6f6a4605.png`
					},
					"url": `https://discord.com/channels/230615005194616834/230616112805445632/1141447938766290995`
				}
			]
		});
	}
};
