const Discord = require('discord.js');
const mysql = require('mysql');
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
    con.connect(function(err) {
        if (err) {
            // throw err;
            logger.error("[DB] " + err);
        } else {
            logger.log("[DB] Successfully established a connection with MySQL database");
        }
    });
};

// Add roles from the database
const addRoles = member => {
    con.query("SELECT * FROM rolehistory WHERE memberid = '" + member.user.id + "' AND guild = '" + member.guild.id + "' LIMIT 1", function (err, result, fields) {
        if (err) throw err;
        if(result.length > 0) {
            const oldRoles = JSON.parse(result[0].roles);
            member.roles.set(oldRoles).catch(console.error);
            console.log("Added " + oldRoles.length + " from roleHistory to " + member.user.username + "#" + member.user.discriminator);

            // Cleanup on the database
            var sql = "DELETE FROM rolehistory WHERE memberid = '" + member.user.id + "' AND guild = '" + member.guild.id + "'";
            con.query(sql, function (err, result) {
                if (err) throw err;
            });
        }
      });
};

// Save roles to the database
const saveRole = (guild, memberid, roles) => {
    var sql = "INSERT INTO rolehistory (guild, memberid, roles) VALUES ('" + guild + "', '" + memberid + "', '" + roles + "')";
    con.query(sql, function (err, result) {
        if (err) throw err;
    });
};

module.exports = {isHigher, getHigherRoles, con, dbConnect, addRoles, saveRole};