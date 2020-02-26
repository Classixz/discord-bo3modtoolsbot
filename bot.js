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

// client.on("guildCreate", guild => {
//     // This event triggers when the bot joins a guild.
//     console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
//     client.user.setActivity(`Serving ${client.guilds.size} servers`);
// });
//
// client.on("guildDelete", guild => {
//     // this event triggers when the bot is removed from a guild.
//     console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
//     client.user.setActivity(`Serving ${client.guilds.size} servers`);
// });

// client.on("message", async message => {
//     // This event will run on every single message received, from any channel or DM.
//
//     // It's good practice to ignore other bots. This also makes your bot ignore itself
//     // and not get into a spam loop (we call that "botception").
//     if (message.author.bot) return;

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
    //
    // // Also good practice to ignore any message that does not start with our prefix,
    // // which is set in the configuration file.
    // if (message.content.indexOf(process.env.BOT_PREFIX) !== 0) return;
    //
    // // Here we separate our "command" name, and our "arguments" for the command.
    // // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
    // // command = say
    // // args = ["Is", "this", "the", "real", "life?"]
    // const args = message.content.slice(process.env.BOT_PREFIX.length).trim().split(/ +/g);
    // const command = args.shift().toLowerCase();
    //
    // // Let's go with a few common example commands! Feel free to delete or change those.
    //
    // if (command === "ping") {
    //     // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    //     // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    //     const m = await message.channel.send("Ping?");
    //     m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
    // }
    //
    // if (command === "say") {
    //     // makes the bot say something and delete the message. As an example, it's open to anyone to use.
    //     // To get the "message" itself we join the `args` back into a string with spaces:
    //     const sayMessage = args.join(" ");
    //     // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    //     message.delete().catch(O_o => {});
    //     // And we get the bot to say the thing:
    //     message.channel.send(sayMessage);
    // }
    //
    // if (command === "status") {
    //     String.prototype.toHHMMSS = function() {
    //         var sec_num = parseInt(this, 10); // don't forget the second param
    //         var hours = Math.floor(sec_num / 3600);
    //         var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    //         var seconds = sec_num - (hours * 3600) - (minutes * 60);
    //
    //         if (hours < 10) {
    //             hours = hours;
    //         }
    //         if (minutes < 10) {
    //             minutes = minutes;
    //         }
    //         if (seconds < 10) {
    //             seconds = seconds;
    //         }
    //         var time = hours + ' hours, ' + minutes + ' minutes & ' + seconds + ' seconds';
    //         return time;
    //     }
    //
    //     var uptime = (process.uptime() + "").toHHMMSS();
    //
    //     const {
    //         version: discordVersion
    //     } = require('discord.js');
    //     const statusEmbed = new Discord.RichEmbed()
    //         .setColor('#0099ff')
    //         .setTitle('Status Log')
    //         .addField('Logged in as:', client.user.tag)
    //         .addField('Uptime:', uptime)
    //         .addField('Memory Usage:', `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`)
    //         .addField('Total Members:', `${client.guilds.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}`)
    //         .addField('Discord.js version:', discordVersion, true)
    //         .addField('Node version:', process.version, true)
    //         .addField('OS version:', `${process.platform}, ${process.arch}`, true)
    //         .setTimestamp()
    //         .setFooter('Requested by ' + message.author.tag, message.author.avatarURL);
    //     message.channel.send(statusEmbed);
    // }
    //
    // //Print info from the BO3 scripting API
    // if (command === "api") {
    //     if (!args.length) {
    //         return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
    //     } else {
    //         var request = require('request');
    //         var url = `http://ehdgaming.co.uk/blops3api/api.php/get/function/${args}/`;
    //         request.get({
    //             url: url,
    //             json: true
    //         }, (err, res, data) => {
    //             if (err) {
    //                 console.error('Command: API returned following error:', err);
    //             } else if (res.statusCode !== 200) {
    //                 console.warn('Command: API returned following status:', res.statusCode);
    //             } else {
    //                 if (data[0].hasOwnProperty('functionName')) {
    //                     var apiData = data[0];
    //                     var vars = JSON.parse(data[0].vars);
    //                     var keys = Object.keys(vars);
    //
    //                     var title = "";
    //                     if (apiData.entity === "") {
    //                         title = "void " + apiData.functionName + "(";
    //                     } else {
    //                         title = "void <" + apiData.entity + "> " + apiData.functionName + "(";
    //                     }
    //
    //                     var parametersMan = []
    //                     var parametersOpt = []
    //                     var functionNames = []
    //                     for (var i = 0; i < keys.length; i++) {
    //                         if (vars[keys[i]].mandatory) {
    //                             functionNames.push("<" + keys[i] + ">");
    //                             parametersMan.push("**<" + keys[i] + ">** " + vars[keys[i]].description);
    //                         } else {
    //                             functionNames.push("[" + keys[i] + "]");
    //                             parametersOpt.push("**[" + keys[i] + "]** " + vars[keys[i]].description);
    //                         }
    //                     }
    //
    //                     //Print funcitons with comma separation
    //                     title += functionNames.join(", ");
    //                     //Close Function
    //                     title += ")";
    //
    //                     const GSCApiEmbed = new Discord.RichEmbed()
    //                         .setColor('#0099ff')
    //                         .setTitle('Description:')
    //                         .setAuthor("Usage of the function: " + apiData.functionName)
    //                         .setDescription(apiData.summary != "" ? apiData.summary : "N/A")
    //                         .addField('EXAMPLE:', '```' + title + '```')
    //                         .addField('Mandatory Parameters:', parametersMan != "" ? parametersMan : "N/A")
    //                         .addField('Optional Parameters:', parametersOpt != "" ? parametersOpt : "N/A")
    //                         .addField('RETURN:', apiData.return != "" ? apiData.return : "N/A", true)
    //                         .addField('CATEGORY:', apiData.category != "" ? apiData.category : "N/A", true)
    //                         .addField('SERVER/CLIENT:', apiData.clientserver != "" ? apiData.clientserver : "N/A", true)
    //                         .addField('EXAMPLE USAGE:', apiData.example != "" ? '```' + apiData.example + '```' : "N/A")
    //                         .setTimestamp()
    //                         .setFooter('Requested by ' + message.author.tag, message.author.avatarURL);
    //                     message.channel.send(GSCApiEmbed);
    //
    //                     console.log(message.author.tag + ` searched for API function ${args}`);
    //                 } else {
    //                     console.info(message.author.tag + ` searched for API function ${args} but it was not found.`);
    //                     message.reply(`sorry, but I was unable to find the function ${args}.`);
    //                 }
    //             }
    //         });
    //     }
    // }
    //
    // if (command === "mutedupdate") {
    //     const MUTED = new Discord.RichEmbed()
    //         .setColor('#ff6a00')
    //         .setTitle('You have been muted!')
    //         .setAuthor('Muted :(', 'https://i.imgur.com/TcwFQMj.png')
    //         .setDescription("While muted we recommend you to check out our rules. You can find them in " + message.guild.channels.get('230654595767074817').toString() + ".")
    //         .addField('Precautions against getting muted in the future', 'Having a good knowledge of the rules will prevent you from getting muted in the future, if you feel that you have been wrongfully muted you can contact a member of the staff team.')
    //         .addField('Automation ', 'Some keywords might trigger an automatic mute, refrain from using them.')
    //         .addField('Durations', 'Mutes are not permanent and will expire after a set amount of time, after it has expired you are free to use the server once again.')
    //     message.channel.send(MUTED);
    // }
    //
    // if (command === "ruleupdate") {
    //     message.channel.fetchMessages({
    //             around: "625923440985112614",
    //             limit: 1
    //         })
    //         .then(messages => {
    //             const fetchedMsg = messages.first();
    //             const LINKS = new Discord.RichEmbed()
    //                 .setColor('#ff6a00')
    //                 .setTitle('Downloading Mods and Maps')
    //                 .setAuthor('Some links we recomend to check out:', 'https://img.icons8.com/cotton/64/000000/info.png')
    //                 .setDescription("http://steamcommunity.com/sharedfiles/filedetails/?id=768774420")
    //                 .addField('Maps and mods can be downloaded here:', 'https://steamcommunity.com/workshop/browse/?appid=311210')
    //                 .addField('How-to-guide by Treyarch for creating mods:', 'http://steamcommunity.com/sharedfiles/filedetails/?id=770558798')
    //                 .addField('Getting started with Mod Tools:', 'https://www.youtube.com/watch?v=x8cMkTSgCoI')
    //                 .addField('A script API can be found here:', 'http://ehdgaming.co.uk/blops3api/')
    //                 .addField('Verify your discord account in order to chat:', 'http://auth.cod.tools/');
    //             fetchedMsg.edit(LINKS);
    //         });
    //
    //     message.channel.fetchMessages({
    //             around: "625923442125832192",
    //             limit: 1
    //         })
    //         .then(messages => {
    //             const fetchedMsg = messages.first();
    //             const RANKS = new Discord.RichEmbed()
    //                 .setColor('#ff6a00')
    //                 .setTitle('Server Ranks')
    //                 .setAuthor('Want to get a rank?', 'https://img.icons8.com/cotton/64/000000/info.png')
    //                 .setDescription("If you want a YouTuber, Mapper, Scripter rank or another rank, PM any member of the staff team to request the rank.")
    //                 .addField('Requirements for YouTubers/Streamers', 'Have a minimum of 5k+ Subscribers')
    //                 .addField('Mappers', 'Have a map publicly released for Black Ops 3 that is not a box map and must also have decent knowledge in <:radiant:230728887875796992>.')
    //                 .addField('Scripters ', 'Have decent knowledge in the GSC language.')
    //                 .addField('Nitro ', 'By boosting the server you will automatically be assigned the nitro rank. More information about Nitro boost can be found here: http://dis.gd/boost')
    //                 .addField('Please note', 'For every rank except nitro we will require some sort of proof.')
    //             fetchedMsg.edit(RANKS);
    //         });
    //
    //     message.channel.fetchMessages({
    //             around: "625923443170344980",
    //             limit: 1
    //         })
    //         .then(messages => {
    //             const fetchedMsg = messages.first();
    //             const RULES = new Discord.RichEmbed()
    //                 .setColor('#ff6a00')
    //                 .setTitle('Few Words')
    //                 .setAuthor('Welcome to the server!', 'https://cdn.discordapp.com/emojis/230683116853788673.png?v=1')
    //                 .setDescription("Hello and welcome to the Black Ops 3 Mod Tools Discord server! Here you can chat and learn something new about the tools! In order for us all to get along, we have a set of rules that are enforced on the server.")
    //                 .addField("Rules of the server", "**1)** No harassment - Including sexual harassment or encouraging of harassment.\n\n**2)** If someone has a problem with something very obvious, explain to him nicely, don't be rude.\n\n**3)** Make sure the discussion is in a proper channel to avoid spam.\n\n**4)** Don't talk in languages other than English, unless you provide a translation.\n\n**5)** Don't post a shitload of memes where it doesn't belong. While we all like to have some fun, it can become annoying over time.\n\n**6)** Don't spam emotes.\n\n**7)** Don't spam full CAPS sentences.\n\n**8)** No offensive nicknames - Anything that a reasonable person might find offensive.\n\n**9)** Don't post someone's personal information.\n\n**10)** No Gorey, Sexual, porn, nudity or other NSFW content.\n\n **11)** Some words deemed offensive will get you muted for a time, be respectful!\n\n**12)** Don't try to self moderate, if something needs sorting out please contact a member of the staff team. Or send a message to <@575252669443211264> for assistance.\n\n")
    //
    //                 .addField('Discord Rules', 'Discord Terms of Service: https://discordapp.com/terms\n Discord Community Guidelines: https://discordapp.com/guidelines\n\n')
    //                 .addField('Complaints', 'There may be situations not covered by the rules or times where the rule may not fit the situation. If this happens the staff team are trusted to handle the situation appropriately. Feel free to contact any another member of the staff team regarding the complaint.')
    //
    //                 .setTimestamp()
    //                 .setFooter('Updated', 'https://cdn.discordapp.com/icons/230615005194616834/a_6348df7be488485fa70fae728b809d15.webp?size=128');
    //             fetchedMsg.edit(RULES);
    //         });
    // }
// });