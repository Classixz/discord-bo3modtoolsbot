const Discord = require('discord.js');
const mysql = require('mysql2');
const logger = require("./Logger");

const isHigher = user => {
    const roles = getHigherRoles();
    for (var i = 0; i < user._roles.length; i++) {
        for (var x = 0; x < roles.length; x++) {
            if(user._roles[i] === roles[x]) {
                return true;
            }
        }
    }
    return false;
};

const getHigherRoles = () => {
    return process.env.MANAGEMENT_ROLES.split(",");
};

// Database Connection
const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

//Connect to the database
const dbConnect = () => {
    // con.connect(function(err) {
    //     if (err) {
    //         // throw err;
    //         logger.error("[DB] " + err);
    //     } else {
    //         logger.log("[DB] Successfully established a connection with MySQL database");
    //     }
    // });
};

// Add roles from the database
const addRoles = member => {
    con.query('SELECT * FROM rolehistory WHERE memberid = ? AND guild = ? LIMIT 1', [member.user.id, member.guild.id],
    function(err, results) {
        var roles = JSON.parse(results[0].roles);
        member.roles.add(roles, 'Role History').catch(console.error);
        logger.debug(`${member.user.username} has ${roles.length} roles in role history.`);
       
        // Cleanup on the database
        con.query('DELETE FROM rolehistory WHERE memberid = ? AND guild = ?', [member.user.id, member.guild.id],
        function(err, results) {
            logger.debug(`Cleaned up role history for ${member.user.username}`);
        });
    });
};

// Save roles to the database
const saveRoles = (guild, memberid, roles) => {
    con.query('INSERT INTO rolehistory (guild, memberid, roles) VALUES (?, ?, ?)', [guild, memberid, roles],
    function(err, results) {
        logger.debug(`Saved roles for guild ${guild} and member ${memberid}, roles: ${roles}`);
    });
};

module.exports = {isHigher, getHigherRoles, con, dbConnect, addRoles, saveRoles};