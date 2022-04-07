require('dotenv').config();

const Discord = require('discord.js');
const pjson = require('./package.json');
const moment = require('moment');
const commands = require('./app/commands');
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const client = new Discord.Client({
	intents: [Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_PRESENCES, Discord.Intents.FLAGS.GUILD_MEMBERS],
});

const { isHigher, isVerified } = require('./app/Utils');

// Initialize Slash Commands
const slashCommands = [];
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./app/slashcmds').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./app/slashcmds/${file}`);
	// Check and make sure that the function allows for slash commands
	if (typeof command.slash === 'function') {
		client.commands.set(command.data.name, command);
		slashCommands.push(command.data.toJSON());
	}
}

// Require our logger
client.logger = require('./app/Logger');

class Bot {
	constructor() {
		this.prefix = process.env.BOT_PREFIX;
		this.startTime = moment();
		this.start();
	}

	start() {
		client.logger.log('BO3 MT Bot v' + pjson.version + ' is starting');

		client.on('ready', () => this.ready());
		client.on('messageCreate', message => this.message(message));

		client.on('guildCreate', (guild) => client.logger.log(`[GUILD JOIN] ${guild.name} (${guild.id}) added the bot.`));
		client.on('guildDelete', (guild) => client.logger.log(`[GUILD LEAVE] ${guild.name} (${guild.id}) removed the bot.`));
		client.on('guildMemberAdd', (member) => this.memberJoin(member));
		client.on('guildMemberRemove', (member) => this.memberLeave(member));

		client.on('warn', (warn) => client.logger.warn(warn));
		client.on('error', (error) => client.logger.error(`An error event was sent by Discord.js: \n${JSON.stringify(error)}`, 'error'));
		client.on('debug', (info) => client.logger.debug(info));

		// Automatically reconnect if the bot disconnects due to inactivity
		client.on('disconnect', function(err, code) {
			client.logger.log('----- Bot disconnected from Discord with code', code, 'for reason:', err, '-----');
			client.connect();
		});

		client.on('interactionCreate', async interaction => {
			if (!interaction.isCommand()) return;

			const command = client.commands.get(interaction.commandName);

			if (!command) return;

			client.logger.cmd(`${interaction.user.username} (${interaction.user.id}) ran slash command "${interaction.commandName}"`);

			try {
				await command.slash(interaction);
			} catch (error) {
				client.logger.error(error);
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		});

		client.login(process.env.BOT_TOKEN);
	}

	ready() {

		// This event will run if the bot starts, and logs in, successfully.
		client.logger.ready(`Logged in as ${client.user.tag}!`);
		client.logger.ready(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);
		client.logger.ready(`Command Prefix is: "${process.env.BOT_PREFIX}", Loaded ${commands.length} commands: ${commands.map(c => `${c.command}`).join(', ')}`);

		// Initialize slash commands for all guilds
		client.logger.debug(`Preparing registration of ${slashCommands.length} application commands for ${client.guilds.cache.size} guilds`);
		const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);
		client.guilds.cache.forEach(server => {
			rest.put(Routes.applicationGuildCommands(client.user.id, server.id), { body: slashCommands })
				.then(() => client.logger.debug(`Successfully registered application commands for ${server.name} id: ${server.id}`))
				.catch(console.error);
		});
		// Set the bots status (This runs every 30 seconds)
		setInterval(() => { client.user.setPresence({ activities: [{ name: `Serving ${client.users.cache.size} modders!` }] }); }, 30000);
	}

	async message(message) {
		if (message.author.bot) {
			return;
		}

		// To save some time, lets quickly verify any non verified member we might have missed if they type.
		if (message.channelId == process.env.VERIFICATION_HELP_CHANNEL && !message.member.roles.cache.has(process.env.VERIFIED_ROLE)) {
			isVerified(message.member);
		}

		// Don't waste time.
		if (!message.content.startsWith(this.prefix)) {
			return;
		}

		const args = message.content.slice(this.prefix).trim().split(/ +/g);
		const command = args.shift().toLowerCase();

		commands.forEach(e => {
			if (!command.includes(e.command)) {
				return;
			}

			// Ignore the command if the user is not staff
			if (e.isHigher && !isHigher(message.member)) {
				return;
			}

			client.logger.cmd(`${message.author.username} (${message.author.id}) ran command "${e.command}"`);

			// Help requires our singleton array of commands classes (js is odd)
			if (e.command === 'help') {
				e.execute(message, client, this, commands);
			} else {
				e.execute(message, client, this);
			}
		});
	}

	async memberJoin(member) {
		client.logger.log(`[GUILD MEMBER] ${member.user.username} has joined ${member.guild.name}!`);
		// Check if the user is verified
		isVerified(member);
	}

	async memberLeave(member) {
		client.logger.log(`[GUILD MEMBER] ${member.user.username} has left ${member.guild.name}!`);
	}
}

// Start the bot :D
new Bot();