const Sequelize = require('sequelize');
const auth = require('./auth.json');
const basics = require('./basics.js');
const roleHandler = require('./roleHandler');


let trackedPosts;

exports.DB_init = function () {
    const sequelize = new Sequelize('database', auth.SQLUser, auth.SQLPass, {
        host: 'localhost',
        dialect: 'sqlite',
        logging: false,
        // SQLite only
        storage: 'database.sqlite',
    });

    trackedPosts = sequelize.define('trackedPosts', {
        GuildID: Sequelize.STRING,
        MsgChannel: Sequelize.STRING,
        MsgID: Sequelize.STRING,
        EmojiString: Sequelize.STRING,
        RoleString: Sequelize.STRING
    });
}

exports.sync = async function (client) {
    let msg, msgGuild, channel;
    let commands = [[], []];
    let mutatedEmojiStr, mutatedRoleStr;
    await trackedPosts.sync();
    DBread = await trackedPosts.findAll();
    for (let i = 0; i < DBread.length; i++) {
        mutatedEmojiStr = DBread[i].get('EmojiString');
        mutatedRoleStr = DBread[i].get('RoleString');
        while (mutatedEmojiStr.indexOf("+") != -1) {
            commands[0].push(mutatedEmojiStr.substring(0, mutatedEmojiStr.indexOf('+')));
            mutatedEmojiStr = mutatedEmojiStr.substring(mutatedEmojiStr.indexOf('+') + 1);
        }
        while (mutatedRoleStr.indexOf("+") != -1) {
            commands[1].push(mutatedRoleStr.substring(0, mutatedRoleStr.indexOf('+')));
            mutatedRoleStr = mutatedRoleStr.substring(mutatedRoleStr.indexOf('+') + 1);
        }

        msgGuild = await client.guilds.cache.get(DBread[i].get('GuildID'));
        msgchannel = await msgGuild.channels.cache.get(DBread[i].get('MsgChannel'));
        try {
            msg = await msgchannel.messages.fetch(DBread[i].get('MsgID'));
        } catch (e) {
            console.log("Invalid message id: " + DBread[i].get('MsgID'));
        }

        roleHandler.makeEmojiCollector(msg, commands);
    }
}

exports.addTracker = async function (msgID, chanID, guildID, commands) {
    let emojiString = "";
    let roleString = "";
    commands[0].forEach(function (x) { // convery array to string to store in sequelize
        emojiString += x + "+";
    });
    commands[1].forEach(function (x) { // convery array to string to store in sequelize
        roleString += x + "+";
    });
    let tracker = await trackedPosts.create({
        GuildID: guildID,
        MsgChannel: chanID,
        MsgID: msgID,
        EmojiString: emojiString,
        RoleString: roleString
    });
}