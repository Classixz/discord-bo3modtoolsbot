const request = require('request');
const Discord = require('discord.js');
const _ = require('underscore');

module.exports = class Api {
    constructor() {
        this.command = "api";
        this.help = "Returns how to use a specific BO3 GSC function with a description and example";
    }

    execute(message, client, bot) {
       
        const command = message.content.split(" ")[1];
        if( !command )
            return message.channel.send(`You didn't provide any arguments, ${message.author}!`);

        request.get({
            url: `https://code.zombiemodding.com/api.php/get/function/${command}/`,
            json: true
        }, async (err, res, data) => {
            if (err) {
                console.error('Command: API returned following error:', err);
                return;
            }

            if (res.statusCode !== 200) {
                console.warn('Command: API returned following status:', res.statusCode);
                return;
            }

            if (!data.hasOwnProperty('functionName')) {
                console.info(message.author.tag + ` searched for API function ${command} but it was not found.`);
                await message.reply(`sorry, but I was unable to find the function ${command}.`);
                return;
            }

            let apiData = data;
            let vars = JSON.parse(data.vars);
            let keys = Object.keys(vars);

            let title = apiData.entity === "" ?  "void " + apiData.functionName + "(" : "void <" + apiData.entity + "> " + apiData.functionName + "(";

            let parametersMan = [];
            let parametersOpt = [];
            let functionNames = [];
            for (let i = 0; i < keys.length; i++) {
                if (vars[keys[i]].mandatory) {
                    functionNames.push("<" + keys[i] + ">");
                    parametersMan.push("**<" + keys[i] + ">** " + _.unescape(vars[keys[i]].description));
                } else {
                    functionNames.push("[" + keys[i] + "]");
                    parametersOpt.push("**[" + keys[i] + "]** " + _.unescape(vars[keys[i]].description));
                }
            }

            //Print funcitons with comma separation
            title += functionNames.join(", ");
            //Close Function
            title += ")";

            await message.channel.send(
                new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Description:')
                .setAuthor("Usage of the function: " + apiData.functionName)
                .setDescription(apiData.summary !== "" ? apiData.summary : "N/A")
                .addField('EXAMPLE:', '```' + title + '```')
                .addField('Mandatory Parameters:', parametersMan.length > 0 ? parametersMan.join('\n') : "N/A")
                .addField('Optional Parameters:', parametersOpt.length > 0 ? parametersOpt.join('\n') : "N/A")
                .addField('RETURN:', apiData.return !== "" ? apiData.return : "N/A", true)
                .addField('CATEGORY:', apiData.category !== "" ? apiData.category : "N/A", true)
                .addField('SERVER/CLIENT:', apiData.clientserver !== "" ? apiData.clientserver : "N/A", true)
                .addField('EXAMPLE USAGE:', apiData.example !== "" ? '```' + apiData.example + '```' : "N/A")
                .setTimestamp()
                .setFooter('Requested by ' + message.author.tag, message.author.avatarURL()));

            console.log(message.author.tag + ` searched for API function ${command}`);
        });
    }
};