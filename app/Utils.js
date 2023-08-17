/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
const logger = require("./Logger");
const request = require("request");
const _ = require("underscore");

const isHigher = (user) => {
	const roles = getHigherRoles();
	for (let i = 0; i < user._roles.length; i++) {
		for (let x = 0; x < roles.length; x++) {
			if (user._roles[i] === roles[x]) {
				return true;
			}
		}
	}
	return false;
};

const getHigherRoles = () => {
	return process.env.MANAGEMENT_ROLES.split(",");
};

// Query the API to check if the user is verified.
const isVerified = (member) => {
	logger.debug(`Checking if ${member.user.username} is verified`);

	request.get(
		{
			url: `${process.env.VERIFICATION_API_URL}?task=isVerified&id=${member.user.id}&api_key=${process.env.VERIFICATION_API_KEY}`,
			json: true,
		},
		async (err, res, data) => {
			if (err) {
				logger.error("Verification API Error:", err);
				return;
			}

			if (res.statusCode !== 200) {
				logger.warn(
					"Verification API returned following status:",
					res.statusCode
				);
				return;
			}

			if (_.isEmpty(data)) {
				logger.debug(`${member.user.username} is not verified.`);
			} else {
				logger.debug(
					`${member.user.username} got verified at ${data[0].created_at}, adding role.`
				);
				member.roles
					.add(process.env.VERIFIED_ROLE, "Previously Verified")
					.catch(console.error);
			}
		}
	);
};

const verificationHelp = (message, member, Discord) => {
	logger.debug(`Helping ${member.user.username} with verification.`);
	const verify = new Discord.ButtonBuilder()
		.setLabel("Verify Account")
		.setURL(process.env.VERIFICATION_URL)
		.setStyle(Discord.ButtonStyle.Link);

	const help = new Discord.ButtonBuilder()
		.setCustomId("verify_help")
		.setLabel("Having issues verifying? Contact our staff.")
		.setStyle(Discord.ButtonStyle.Primary);

	const row = new Discord.ActionRowBuilder().addComponents(verify, help);

	message.reply({
		content: `Hello ${message.author}! :wave:\nAre you having trouble with the verification process? If so, you can use the buttons below to get assistance. Please keep in mind that this server is intended for Black Ops 3 modders who are using the **official mod tools for PC** that were released by Treyarch. If you're not interested in learning more about modding, this might not be the appropriate Discord server for you. However, if you're interested in modding, feel free to proceed. We require that you have a public Steam profile that shows you own Call of Duty: Black Ops 3 *(please note that your profile only needs to be public during the verification process)*.`,
		components: [row],
	});
};

const verificationHelpModal = async (interaction, Discord) => {
	// Create the modal
	const modal = new Discord.ModalBuilder()
		.setCustomId("verification_modal")
		.setTitle("Verification help");

	// Create the text input components
	const steamURLInput = new Discord.TextInputBuilder()
		.setCustomId("steamURLInput")
		// The label is the prompt the user sees for this input
		.setLabel("Please enter a link to your Steam profile")
		.setPlaceholder("https://steamcommunity.com/profiles/76561198017324234")
		// Short means only a single line of text
		.setStyle(Discord.TextInputStyle.Short);

	// Create the text input components
	const triedToVerifyInput = new Discord.TextInputBuilder()
		.setCustomId("triedToVerifyInput")
		// The label is the prompt the user sees for this input
		.setLabel("Have you tried to verify before?")
		// Short means only a single line of text
		.setStyle(Discord.TextInputStyle.Short);

	const moreInfoInput = new Discord.TextInputBuilder()
		.setCustomId("moreInfoInput")
		.setLabel("What kind of issues did you have verifying?")
		// Paragraph means multiple lines of text.
		.setStyle(Discord.TextInputStyle.Paragraph);

	// An action row only holds one text input,
	// so you need one action row per text input.
	const firstActionRow = new Discord.ActionRowBuilder().addComponents(
		steamURLInput
	);
	const secondActionRow = new Discord.ActionRowBuilder().addComponents(
		triedToVerifyInput
	);
	const threeActionRow = new Discord.ActionRowBuilder().addComponents(
		moreInfoInput
	);

	// Add inputs to the modal
	modal.addComponents(firstActionRow, secondActionRow, threeActionRow);

	// Show the modal to the user
	await interaction.showModal(modal);
};

const verificationHelpModalSubmit = async (interaction, Discord, client) => {
	const steamURL = interaction.fields.getTextInputValue("steamURLInput");
	const triedToVerify =
		interaction.fields.getTextInputValue("triedToVerifyInput");
	const moreInfo = interaction.fields.getTextInputValue("moreInfoInput");
	console.log({ steamURL, triedToVerify, moreInfo });

	// Send a message to the staff channel
	const issueChannel = client.channels.cache.get(
		process.env.VERIFICATION_ISSUES_CHANNEL
	);
	const exampleEmbed = new Discord.EmbedBuilder()
		.setColor(0x0099ff)
		.setTitle("Verification issue")
		.setDescription(`${interaction.member} has an issue with verification`)
		.addFields({
			name: "Steam URL",
			value: `${steamURL}`,
			inline: false,
		})
		.addFields({
			name: "Tried verifying?",
			value: `${triedToVerify}`,
			inline: false,
		})
		.addFields({
			name: "More information",
			value: `${moreInfo}`,
			inline: false,
		})
		.setTimestamp();

	issueChannel.send({ embeds: [exampleEmbed] });

	await interaction.reply({
		content:
			"The staff team has been notified of your issue, and will be in touch shortly.",
		ephemeral: true,
	});
};

module.exports = {
	isHigher,
	getHigherRoles,
	isVerified,
	verificationHelp,
	verificationHelpModal,
	verificationHelpModalSubmit,
};
