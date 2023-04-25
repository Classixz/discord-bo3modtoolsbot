module.exports = [
	new (require("./commands/say"))(),
	new (require("./commands/status"))(),
	new (require("./commands/update"))(),
	new (require("./commands/help"))(),
	new (require("./commands/ping"))(),
	new (require("./commands/api"))(),
	new (require("./commands/verify"))(),
];
