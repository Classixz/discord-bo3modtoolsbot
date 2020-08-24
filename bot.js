require('console-stamp')(console, 'yyyy-mm-dd HH:MM:ss.l');
require('dotenv').config();

const Discord = require("discord.js");
const dayjs = require('dayjs');
const pjson = require('./package.json');
const commands = require('./app/commands');
const client = new Discord.Client();
const {con, dbConnect, addRoles, saveRole} = require("./app/Utils");
      
class Bot {
    constructor() {
        this.prefix = process.env.BOT_PREFIX;
        this.startTime = dayjs();
        this.start()
    }

    start() {
        console.log("BO3 Mod Tools bot v" + pjson.version + " is starting")
        
        client.on("ready", () => this.ready());
        client.on("message", message => this.message(message));

        client.on('warn', (warn) => console.warn(warn));
        client.on('error', (error) => console.error(error));

        client.on('guildMemberAdd', (member) => addRoles(member));
        client.on('guildMemberRemove', (member) => saveRole(member.guild.id, member.user.id, JSON.stringify(member._roles)));

        // Automatically reconnect if the bot disconnects due to inactivity
        client.on('disconnect', function(err, code) {
            console.log('----- Bot disconnected from Discord with code', code, 'for reason:', err, '-----');
            client.connect();
        });

        con.on('error', (err) => console.error("[mysql error]", err));

        client.login(process.env.BOT_TOKEN);
    }

    ready() {
        // Establish the database connection
        dbConnect();
        
        // This event will run if the bot starts, and logs in, successfully.
        console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);
        // Example of changing the bot's playing game to something useful. `client.user` is what the
        // docs refer to as the "ClientUser".
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