const dayjs = require('dayjs');
const Discord = require("discord.js");

module.exports = class Status {
    constructor() {
        this.command = "status";
        this.help = "Provides detailed information about the bot.";

        // Removes the command from the help list unless the user is management
        this.isHigher = true;
    }

    async execute(message, client, bot) {
        await message.channel.send(
            new Discord.RichEmbed()
                .setColor('#0099ff')
                .setTitle('Status Log')
                .addField('Logged in as:', client.user.tag)
                .addField('Uptime:', `${dayjs().diff(bot.startTime, 'hour')} Hours`) // todo, improve
                .addField('Memory Usage:', `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`)
                .addField('Total Members:', `${client.guilds.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}`)
                .addField('Discord.js version:', Discord.version, true)
                .addField('Node version:', process.version, true)
                .addField('OS version:', `${process.platform}, ${process.arch}`, true)
                .setTimestamp()
                .setFooter('Requested by ' + message.author.tag, message.author.avatarURL)
        );
    }
};