const Discord = require("discord.js");

module.exports = class Help {
    constructor() {
        this.command = "help";
        this.help = "Display a list of commands at your disposal";
    }

    async execute(message, client, bot, commands) {
        const space = 50;

        await message.channel.send(
            new Discord.RichEmbed()
                .setColor('#00a8ff')
                .setTitle("Command List")
                .setDescription("A list of commands for our bot")
                .addField('Commands', commands.map(e => `\`${bot.prefix}${e.command}\` _${e.help}_`))
                .setFooter("If you encounter any issues with the bot then please contact an owner or moderator")
        );
    }
};