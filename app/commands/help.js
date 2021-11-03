const Discord = require("discord.js");
const {isHigher} = require("../Utils");

module.exports = class Help {
    constructor() {
        this.command = "help";
        this.help = "Display a list of commands at your disposal";
        this.isHigher = false;
    }

    async execute(message, client, bot, commands) {
        if(message.guild === null)
            return;
            
        const higher = isHigher(message.member);
        
        var cmds = '';
        commands.filter(e => !(!higher && e.isHigher)).map(e => {
            cmds += `\`${bot.prefix}${e.command}\` _${e.help}_\n`
        });

        await (higher ? message.member : message.channel).send({ embeds: [
            new Discord.MessageEmbed()
                .setColor('#00a8ff')
                .setTitle("Command List")
                .setDescription("A list of commands for our bot" + (!higher ? '' : '\nYou have been DM\'d this list as it contains sensitive commands'))
                .addField('Commands', cmds)
                .setFooter("If you encounter any issues with the bot then please contact an owner or moderator.")
        ]});
    }
};