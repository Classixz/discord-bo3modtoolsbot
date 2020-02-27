module.exports = class Say {
    constructor() {
        this.command = "say";
        this.help = "Say something as the bot!";

        this.isHigher = true;
    }

    execute(message, client, bot) {
            const sayMessage = message.content.replace(`${bot.prefix}${this.command}`, "");

            message.delete().catch(O_o => {});
            message.channel.send(sayMessage);
    }
};