const Discord = require('discord.js');
const logger = require('../Logger');
const fs = require('fs');
const closestMatch = require('closest-match');
const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');

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

		const jsonData = fs.readFileSync('ScriptAPI.json', 'utf8');
		const parsedData = JSON.parse(jsonData);
		const result = Object.values(parsedData).filter(user => new RegExp(command, 'i').test(user.functionName));

		const returnValue = {
			'void': 'No value returned by this function.',
			'bool': 'This function returns a boolean value (TRUE|FALSE).',
			'int': 'This function returns an integer value.',
			'entity': 'This function returns an entity.',
			'string': 'This function returns an string value.',
			'istring': 'This function returns an string value.',
			'vector': 'This function returns an vector value (x, y, z).',
			'float': 'This function returns a float value.',
			'vector[]': 'This function returns a vector array [(x, y, z), (x, y, z), ...].',
			'anim': 'This function returns an animation.',
			'object': 'This function returns an object.',
			'entity[]': 'This function returns an entity array [entA, entB, ...].',
			'int[]': 'This function returns an integer array [0, 1, 2, ...].',
			'pathnode[]': 'This function returns a pathnode array.',
			'string[]': 'This function returns a string array ["strA", "strB", ...].',
			'float[]': 'This function returns a string array [0.1, 0.2, 0.3, ...].',
		};

		const referenceVariable = {
			'<actor>': 'Call this function on an actor.',
			'<player>': 'Call this function on an player.',
			'<entity>': 'Call this function on an entity.',
			'<actor_or_player>': 'Call this function on either an actor or a player.',
			'<ai_or_player>': 'Call this function on either an AI or a player.',
			'<ball>': 'Call this function on a ball.',
			'<turret>': 'Call this function on a turret.',
			'<client>': 'Call this function on a client.',
			'<vehicle>': 'Call this function on a vehicle.',
			'<ai>': 'Call this function on an AI.',
			'<light>': 'Call this function on a light.',
			'<turret_or_vehicle>': 'Call this function on a turret or vehicle.',
			'<pathnode>': 'Call this function on a pathnode.',
			'<weapon>': 'Call this function on a weapon.',
			'<parententity>': 'Call this function on a parent entity.',
			'<grenade>': 'Call this function on a grenade.',
			'<player_or_playercorpse>': 'Call this function on a player or player corpse.',
			'<attacker>': 'Call this function on an attacker.',
			'<non_player_entity>': 'Call this function on a non-player entity.',
			'<script_model>': 'Call this function on a script model.',
			'<destructible>': 'Call this function on a destructible.',
			'<missile>': 'Call this function on a missile.',
			'<script_model/script_origin/script_brushmodel>': 'Call this function on a script model, script origin, or script brushmodel.',
			'<ent>': 'Call this function on an entity.',
			'<linked_player>': 'Call this function on a linked player.',
			'<trigger>': 'Call this function on a trigger.',
			'<flag>': 'Call this function on a flag.',
			'<sentient>': 'Call this function on a sentient.',
			'<bot>': 'Call this function on a bot.',
			'<hud_element>': 'Call this function on a HUD element.',
			'<hud_clock_element>': 'Call this function on a HUD clock element.',
			'<hud_timer_element>': 'Call this function on a HUD timer element.',
			'<hud_value_element>': 'Call this function on a HUD value element.',
			'<plane>': 'Call this function on a plane vehicle.',
		};

		if (result.length === 0) {
			logger.debug(`${interaction.user.username}#${interaction.user.discriminator} searched for API function ${command} but it was not found.`);
			await interaction.reply({ content: `Sorry, but I was unable to find the function \`${command}\`.`, ephemeral: true });
		} else {
			let functionNames = result.map((x) => {
				return x.functionName;
			});

			// Save the index of the closest match
			const index = functionNames.indexOf(closestMatch.closestMatch(command.toLowerCase(), functionNames));

			const variables = result[index].variables.map((x) => {
				if (x.mandatory) {
					return '<' + x.name + '>';
				} else {
					return '[' + x.name + ']';
				}
			}).join(', ');

			const apiEmbed = new Discord.MessageEmbed()
				.setColor('#0099ff')
				.setAuthor(`<${result[index].returnValue}> ${result[index].functionName}(${variables})`)
				.setDescription(result[index].description)
				.setTimestamp()
				.setFooter(`Requested by ${interaction.user.username}#${interaction.user.discriminator}`, interaction.user.avatarURL());

			// Add paramters if they exists
			const parameters = result[index].variables.map((x) => {
				if (x.mandatory) {
					return '`' + x.name + '` **<Manditory>** ' + x.description;
				} else {
					return '`' + x.name + '` **[Optional]** ' + x.description;
				}
			}).join('\n');

			if (result[index].variables.length > 0) {
				apiEmbed.addField('Parameters', String(parameters), false);
			}

			if (result[index].example != null) {
				apiEmbed.addField('Example', codeBlock('c', result[index].example), false);
			}

			if (result[index].section !== '') {
				apiEmbed.addField('Section', result[index].section.charAt(0).toUpperCase() + result[index].section.slice(1), true);
			}

			if (result[index].access !== '') {
				apiEmbed.addField('Access', result[index].access, true);
			}

			if (result[index].returnValue !== '') {
				apiEmbed.addField('Returns', returnValue[result[index].returnValue], true);
			}

			if (result[index].referenceVariable !== '') {
				apiEmbed.addField('Reference Variable', referenceVariable[result[index].referenceVariable], true);
			}

			if (result.length > 1) {
				const closeMatches = functionNames.length - 1;
				functionNames = result.slice(0, 8).map((x) => {
					if (x.functionName !== result[index].functionName) {
						return '`' + x.functionName + '`';
					}
				});
				apiEmbed.addField('There were also ' + closeMatches + ' close matches to `' + command.toLowerCase() + '` here are they:', functionNames.filter(item => item).join(', ') + ' ' + (result.length < 8 ? '' : ' ... and ' + (closeMatches - 8) + ' more.'), false);
			}

			await interaction.reply({ embeds: [apiEmbed] });
		}
	},
};