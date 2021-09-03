const Discord = require('discord.js');
const request = require('request');
const _ = require('underscore');
module.exports = class Verify {
    constructor() {
        this.command = "verify";
        this.help = "Check if a user is verified";
        this.isHigher = true;
    }

    execute(message, client, bot) {
        const member = message.mentions.members.first();

        if( !message.content.split(" ")[1] )
            return message.channel.send(`You didn't provide a user, ${message.author}!`);

        if( !member )
            return message.channel.send(`Unable to get information about that user, ${message.author}!`);

        request.get({
            url: `${process.env.VERIFICATION_URL}?task=isVerified&id=${member.id}&api_key=${process.env.VERIFICATION_API_KEY}`,
            json: true
        }, async (err, res, data) => {
            if (err) {
                client.logger.error('Verification API Error:', err);
                return;
            }

            if (res.statusCode !== 200) {
                client.logger.warn('Verification API returned following status:', res.statusCode);
                return;
            }

            if (_.isEmpty(data)) {
                await message.channel.send(`${member} is not verified, the user might be verified on another Discord account.`);
                return;
            }

            if (data.hasOwnProperty('error')) {
                await message.reply(`Sorry, but I'm not able to check the status of ${member} at the moment.`);
                return;
            } else {
                await message.channel.send(`${member} is verified and perform the verification this date: ${data[0].created_at}.`);
                await message.member.send(
                    new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle(`Verification Information`)
                        .addField('Discord Name', member, true)
                        .addField('Discord ID', data[0].discord_id, true)
                        .addField('\u200B', '\u200B', false)
                        .addField('Steam Name', data[0].steam_name, true)
                        .addField('Steam ID', data[0].steam_id, true)
                        .addField('Verification Date', data[0].created_at, false)
                        .setTimestamp()
                        .setFooter('Requested by ' + message.author.tag, message.author.avatarURL())
                );
            } 
        });
    }
};