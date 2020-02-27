require('console-stamp')(console, 'yyyy-mm-dd HH:MM:ss.l');
require('dotenv').config();

const Discord = require("discord.js");
const dayjs = require('dayjs');

const commands = require('./app/commands');
const client = new Discord.Client();

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

        // Automatically reconnect if the bot disconnects due to inactivity
        client.on('disconnect', function(err, code) {
            console.log('----- Bot disconnected from Discord with code', code, 'for reason:', err, '-----');
            client.connect();
        });

        client.login(process.env.BOT_TOKEN);
    }

    ready() {
        // This event will run if the bot starts, and logs in, successfully.
        console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
        // Example of changing the bot's playing game to something useful. `client.user` is what the
        // docs refer to as the "ClientUser".
        setInterval(() => {
            client.user.setActivity(`Serving ${client.users.size} modders!`);
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

// Start the bot :D
new Bot();

// //Warn on script errors TODO
//
// /*  var scriptErrors = [ "Error: Could not find", "Error linking script", "apa"];
//
//   if (message.content.includes(scriptErrors)){
//       if(message.channel.name != "scripting") {
//           var channelScripting = message.guild.channels.find(channel => channel.name === "scripting").toString();
//           message.reply(`looks like you have a problem with your code, you can ask for help in the ${channelScripting} channel!`);
//       }
//   }
// */
//
// if (message.channel.type == "dm") {
//     message.channel.send("Sorry but I'm unable to provide assistance at the moment :slight_frown: You can contact <@210581530752319489> if you have any questions regarding me...");
//
//     const fs = require('fs');
//     fs.writeFile("dms.txt", "DM From user: " + message.author.tag + ", Message contains following content: " + message.content, function(err) {
//         if (err) {
//             return console.log(err);
//         }
//
//         console.log("Bot got a PM, PM has been saved to file :)");
//     });
// }
