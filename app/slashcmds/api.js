const request = require('request');
const Discord = require('discord.js');
const _ = require('underscore');
const logger = require('../Logger');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('api')
		.setDescription('Returns how to use a specific BO3 GSC function with a description and example')
		.addStringOption(option =>
			option.setName('function')
				.setDescription('The function you would like to have information about')
				.setRequired(true)),

	async slash(interaction) {
		const command = interaction.options.getString('function');

		request.get({
			url: `https://code.zombiemodding.com/api.php/get/function/${command}/`,
			json: true,
		}, async (err, res, data) => {
			if (err) {
				console.error('Command: API returned following error:', err);
				return;
			}

			if (res.statusCode !== 200) {
				console.warn('Command: API returned following status:', res.statusCode);
				return;
			}

			// eslint-disable-next-line no-prototype-builtins
			if (!data.hasOwnProperty('functionName')) {
				logger.debug(`${interaction.user.username}#${interaction.user.discriminator} searched for API function ${command} but it was not found.`);
				await interaction.reply({ content: `Sorry, but I was unable to find the function \`${command}\`.`, allowedMentions: { repliedUser: false } });
				return;
			}

			const apiData = data;
			const vars = JSON.parse(data.vars);
			const keys = Object.keys(vars);

			let title = apiData.entity === '' ? 'void ' + apiData.functionName + '(' : 'void <' + apiData.entity + '> ' + apiData.functionName + '(';

			const parametersMan = [];
			const parametersOpt = [];
			const functionNames = [];
			for (let i = 0; i < keys.length; i++) {
				if (vars[keys[i]].mandatory) {
					functionNames.push('<' + keys[i] + '>');
					parametersMan.push('**<' + keys[i] + '>** ' + _.unescape(vars[keys[i]].description));
				} else {
					functionNames.push('[' + keys[i] + ']');
					parametersOpt.push('**[' + keys[i] + ']** ' + _.unescape(vars[keys[i]].description));
				}
			}

			// Print funcitons with comma separation
			title += functionNames.join(', ');
			// Close Function
			title += ')';
			await interaction.reply({ embeds: [
				new Discord.MessageEmbed()
					.setColor('#0099ff')
					.setTitle('Description:')
					.setAuthor('Usage of the function: ' + apiData.functionName)
					.setDescription(apiData.summary !== '' ? apiData.summary : 'N/A')
					.addField('EXAMPLE:', '```' + title + '```')
					.addField('Mandatory Parameters:', parametersMan.length > 0 ? parametersMan.join('\n') : 'N/A')
					.addField('Optional Parameters:', parametersOpt.length > 0 ? parametersOpt.join('\n') : 'N/A')
					.addField('RETURN:', apiData.return !== '' ? apiData.return : 'N/A', true)
					.addField('CATEGORY:', apiData.category !== '' ? apiData.category : 'N/A', true)
					.addField('SERVER/CLIENT:', apiData.clientserver !== '' ? apiData.clientserver : 'N/A', true)
					.addField('EXAMPLE USAGE:', apiData.example !== '' ? '```' + apiData.example + '```' : 'N/A')
					.setTimestamp()
					.setFooter(`Requested by ${interaction.user.username}#${interaction.user.discriminator}`, interaction.user.avatarURL()),
			] });

			logger.debug(`${interaction.user.username}#${interaction.user.discriminator} searched for API function ${command}`);

		});
	},
};