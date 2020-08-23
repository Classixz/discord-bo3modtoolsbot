require('console-stamp')(console, 'yyyy-mm-dd HH:MM:ss.l');
require('dotenv').config();

const Discord = require("discord.js");
const dayjs = require('dayjs');
const mysql = require('mysql');

const commands = require('./app/commands');
const client = new Discord.Client();

// Connect to the database
const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
      
class Bot {
    constructor() {
        this.prefix = process.env.BOT_PREFIX;
        this.startTime = dayjs();
        this.start()
    }

    start() {
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

        con.on('error', function(err) {
            console.log("[mysql error]",err);
        });

        client.login(process.env.BOT_TOKEN);
    }

    ready() {
        con.connect(function(err) {
            if (err) throw err;
                console.log("Connected to Database!");
        });
        
        // This event will run if the bot starts, and logs in, successfully.
        console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);
        // Example of changing the bot's playing game to something useful. `client.user` is what the
        // docs refer to as the "ClientUser".
        setInterval(() => {
            client.user.setActivity(`Serving ${client.users.cache.size} modders!`);
        }, 30000); // Runs this every 30 seconds.
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

function addRoles(member) {
    con.query("SELECT * FROM rolehistory WHERE memberid = '" + member.user.id + "' AND guild = '" + member.guild.id + "' LIMIT 1", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        if(result.length > 0) {
            const oldRoles = JSON.parse(result[0].roles);
            member.roles.set(oldRoles).catch(console.error);
            console.log("Added " + oldRoles.length + " from roleHistory to " + member.user.username + "#" + member.user.discriminator);

            // Cleanup on the database
            var sql = "DELETE FROM rolehistory WHERE memberid = '" + member.user.id + "' AND guild = '" + member.guild.id + "'";
            con.query(sql, function (err, result) {
                if (err) throw err;
            });
        }
      });
}

function saveRole(guild, memberid, roles) {
    var sql = "INSERT INTO rolehistory (guild, memberid, roles) VALUES ('" + guild + "', '" + memberid + "', '" + roles + "')";
    con.query(sql, function (err, result) {
        if (err) throw err;
    });
}

// Start the bot :D
new Bot();