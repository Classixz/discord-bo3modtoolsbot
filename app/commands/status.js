module.exports = class Status {
    constructor() {
        this.command = "status";
        this.help = "Provides detailed information about the bot.";

        // Removes the command from the help list unless the user is management
        this.isHigher = true;
    }

    execute(message, client, bot) {
        console.log(process.env.MANAGEMENT_ROLES)
    }
};