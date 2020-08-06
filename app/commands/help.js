const Discord = require("discord.js");
const {isHigher} = require("../Utils");

module.exports = class Help {
    constructor() {
        this.command = "help";
        this.help = "Display a list of commands at your disposal";
    }

    async execute(message, client, bot, commands) {
        if(message.guild === null)
            return;
            
        const higher = isHigher(message.member) !== null;

        await (higher ? message.member : message.channel).send(
            new Discord.RichEmbed()
                .setColor('#00a8ff')
                .setTitle("Command List")
                .setDescription("A list of commands for our bot" + (!higher ? '' : 'You have been DM\'d this list as it contains sensitive commands'))
                .addField('Commands', commands.filter(e => !(!higher && e.isHigher)).map(e => {
                    return `\`${bot.prefix}${e.command}\` _${e.help}_`
                }))
                .setFooter("If you encounter any issues with the bot then please contact an owner or moderator.")
        );
    }
};