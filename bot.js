require('dotenv').config();

const Discord = require("discord.js");
const pjson = require('./package.json');
const moment = require('moment');
const commands = require('./app/commands');

const client = new Discord.Client({
    ws: {
      intents: ["GUILDS","GUILD_MESSAGES","DIRECT_MESSAGES","GUILD_BANS","GUILD_EMOJIS","GUILD_INTEGRATIONS","GUILD_WEBHOOKS","GUILD_INVITES","GUILD_VOICE_STATES","GUILD_MESSAGE_REACTIONS","GUILD_MESSAGE_TYPING","DIRECT_MESSAGE_REACTIONS","DIRECT_MESSAGE_TYPING","GUILD_PRESENCES","GUILD_MEMBERS"]
    }
});

const {con, dbConnect, addRoles, saveRole} = require("./app/Utils");

// Require our logger
client.logger = require("./app/Logger");

class Bot {
    constructor() {
        this.prefix = process.env.BOT_PREFIX;
        this.startTime = moment();
        this.start()
    }

    start() {
        client.logger.log("BO3 MT Bot v" + pjson.version + " is starting");
        
        client.on("ready", () => this.ready());
        client.on("message", message => this.message(message));

        client.on('guildCreate', (guild) => client.logger.log(`[GUILD JOIN] ${guild.name} (${guild.id}) added the bot. Owner: ${guild.owner.user.tag} (${guild.owner.user.id})`));
        client.on('guildDelete', (guild) => client.logger.log(`[GUILD LEAVE] ${guild.name} (${guild.id}) removed the bot.`));
        client.on('guildMemberAdd', (member) => client.logger.log(`[GUILD MEMBER] ${member.user.username} has joined ${member.guild.name}!`));
        client.on('guildMemberRemove', (member) => client.logger.log(`[GUILD MEMBER] ${member.user.username} has left ${member.guild.name}!`));
        
        client.on('warn', (warn) => client.logger.warn(warn));
        client.on('error', (error) => client.logger.error(`An error event was sent by Discord.js: \n${JSON.stringify(error)}`, "error"));
        client.on('debug', (info) => client.logger.debug(info));

        // Automatically reconnect if the bot disconnects due to inactivity
        client.on('disconnect', function(err, code) {
            client.logger.log('----- Bot disconnected from Discord with code', code, 'for reason:', err, '-----');
            client.connect();
        });

        con.on('error', (err) => client.logger.error("[mysql error]", err));

        client.login(process.env.BOT_TOKEN);
    }

    ready() {                
        // Establish the database connection
        dbConnect();
        
        // This event will run if the bot starts, and logs in, successfully.
        client.logger.ready(`Logged in as ${client.user.tag}!`);
        client.logger.ready(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);
        client.logger.ready(`Command Prefix is: "${process.env.BOT_PREFIX}", Loaded ${commands.length} commands: ${commands.map(c => `${c.command}`).join(', ')}`);
        
        // Set the bots status
        setInterval(() => { client.user.setActivity(`Serving ${client.users.cache.size} modders!`); }, 30000); // Runs this every 30 seconds.
    }

    async message(message) {
        if (message.author.bot)
            return;

        // Don't waste time.
        if(!message.content.startsWith(this.prefix))
            return;

        const args = message.content.slice(this.prefix).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        commands.forEach(e => {
            if( !command.includes(e.command) )
                return;

                client.logger.cmd(`${message.author.username} (${message.author.id}) ran command "${e.command}"`);    

            // Help requires our singleton array of commands classes (js is odd)
            if( e.command === 'help' )
                e.execute(message, client, this, commands);
            else
                e.execute(message, client, this);
        });
    }
}

// Start the bot :D
new Bot();