const Discord = require('discord.js');
const moment = require('moment');

module.exports = class Whois {
    constructor() {
        this.command = "whois";
        this.help = "Returns user information!";
        this.isHigher = true;
    }

    execute(message, client, bot) {
        const member = message.mentions.members.first();

        if( !message.content.split(" ")[1] )
            return message.channel.send(`You didn't provide a user, ${message.author}!`);

        if( !member )
            return message.channel.send(`Unable to get information about that user, ${message.author}!`);

        const roles = member.roles.cache.map(roles => `${roles}`).join(', ');

        const embed = new Discord.MessageEmbed()
            .setFooter(member.displayName, member.user.displayAvatarURL)
            .setThumbnail(member.user.displayAvatarURL)
            .setColor(member.displayHexColor === '#000000' ? '#ffffff' : member.displayHexColor)

            .addField('Member information:', `
                        **- Display name:** ${member.displayName}
                        **- Joined at:** ${moment.utc(member.joinedAt).format("YYYY-MM-DD")}                        
                        **- Created at**: ${moment.utc(member.user.createdAt).format("YYYY-MM-DD")}
                        **- Roles:** ${roles}`, true)

            .addField('User information:', `
                        **- ID:** ${member.user.id}
                        **- Username**: ${member.user.username}
                        **- Tag**: ${member.user.tag}                        
                        **- Nickname**: ${member.nickname !== null ? `${member.nickname}` : 'None'}`, true)
            
            .addField('Misc Information:', `
                        **- Game:** ${member.presence.game ? member.presence.game.name : 'None'}
                        **- Server:** ${message.guild.name}
                        **- Status:** ${member.presence.status}`, true)
            
            .setTimestamp()
            .setFooter('Requested by ' + message.author.tag, message.author.avatarURL())

        message.channel.send(embed);
    }

};