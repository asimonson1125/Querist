const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const auth = require('./auth.json');
const roleHandler = require('./roleHandler.js');
const basics = require('./basics.js');
const editHandler = require('./editHandler');
const DB = require('./database.js');

DB.DB_init();
const bot_owner_id = auth.ownerID;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    DB.sync();
    client.user.setActivity('your messages with horror', { type: 'WATCHING' });
    client.user.setStatus('idle');
});

client.on('messageCreate', msg => {
    if (msg.author.bot || !msg.guild) return;
    if (msg.content.substring(0, 11) == "^impossible") {
        msg.channel.send("​​​​");
    }


    if (msg.author.id == bot_owner_id) { //if bot owner is the author
        if (msg.content.substring(0, 7) == "^track ") {
            try {
                DB.addTracker(msg);
            } catch (e) {
                msg.reply(`error while adding tracker: ${e}`);
            }
        }

        if (msg.content == "^print") {
            DB.printAll(msg)
        }
    }

    if (msg.content.substring(0, 5).toLowerCase() === '^add ') {
        let space = false;
        let i = 6;
        while (!space) {
            if (msg.content[i] == " " || i == msg.content.length) {
                space = true;
            }
            else {
                i += 1;
            }
        }
        const id = msg.content.substring(5, i);
        try {
            roleHandler.add(msg, id);
        }
        catch (e) {
            console.log("error giving role")
        }
    }
    
});

client.login(auth.token);
// https://discord.com/api/oauth2/authorize?client_id=879861591670149150&permissions=8&scope=bot