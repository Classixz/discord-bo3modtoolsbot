const fs = require('fs');
const {resolve} = require('path');
const Discord = require('discord.js');
const {jsonToEmbed} = require("../JsonToEmbed");

module.exports = class Update {
    constructor() {
        this.command = "update";
        this.help = "Trigger updates to specific messages from a list of locally stored message files";

        this.isHigher = true;
    }

    async execute(message, client, bot) {
        if(message.guild === null)
            return;

        const updateFile = message.content.split(" ")[1];

        // List the files we have that'll update things
        if( !updateFile ) {
            await message.reply("You've not included the target you'd like to use to update");
            await message.channel.send(
                new Discord.MessageEmbed()
                    .setTitle("Available Targets")
                    .setDescription("Use one of the below target names with the +update <target> command")
                    .addField("Targets", this.getEmbedFiles().map(e => e.replace(".json", "")))
            );

            return;
        }

        const files = this.getEmbedFiles();
        if( !files.includes(updateFile + ".json") )
            return await message.reply(`${updateFile} does not exist. Use \`+update\` to find available targets`)

        const fileData = fs.readFileSync(resolve(`./app/embeds/${updateFile}.json`));
        const json = JSON.parse(fileData);

        json.forEach(e => {

            
            client.channels.fetch(e.channel_snowflake)
            .then(channel => {
                channel.messages.fetch({
                    around: e.message_snowflake,
                    limit: 1
                }).then(messages => {
                    const msg = messages.first();
    
                    msg.edit(jsonToEmbed(e))
                        .then(() => {
                            message.channel.send(`Successfully updated http://discordapp.com/channels/${msg.guild.id}/${e.channel_snowflake}/${e.message_snowflake}`)
                        })
                        .catch(e => client.logger.log(e.message));
                })
            }).catch(client.logger.error);;

            // if( !channel )
            //     return message.channel.send(`Error: Unable to find a channel with the snowflake of ${e.channel_snowflake}`);



        })
    }

    getEmbedFiles() {
        return fs.readdirSync(resolve('./app/embeds/')).filter(e => e.includes('.json'));
    }
};