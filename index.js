const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });
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

    const filter = (reaction, user) => (reaction.emoji.name === '1️⃣' || reaction.emoji.name === '4️⃣' || reaction.emoji.name === '6️⃣') && !user.bot;

    






    if (msg.content.substring(0, 11) == "^impossible") {
        msg.channel.send("​​​​");
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
        const id = msg.content.substring(5, i).toLowerCase();
        if (id == 'section-1' || id == 'section-4' || id == 'section-6' || id == 'student') {
            try {
                roleHandler.add(msg, id);
            }
            catch (e) {
                console.log("error giving role")
            }
        }
        else {
            basics.deleteBoth(msg, "invalid role or not up for adding via bot at this time.", 5000);
        }
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

    if (msg.content.substring(0, 11) == "^rolereact ") {
        roleHandler.roleReact(msg);
    }
    if (msg.content.substring(0, 3) == "^p ") {
        msg.react(msg.content.substring(3).substring(1));
        console.log(msg.content);
    }






    if (msg.content.substring(0, 3) == "^r ") {
        /*try {
            DB.addTracker(msg);
        } catch (e) {
            msg.reply(`error while adding tracker: ${e}`);
        }*/
        msg.react('1️⃣');
        msg.react('4️⃣');
        msg.react('6️⃣');
        const collector = msg.createReactionCollector({filter});
        collector.on('collect', (reaction, user) => {
            switch (reaction.emoji.name){
                case '1️⃣':
                    roleHandler.addTo(msg,"Section 1",user);
                    break;
                case '4️⃣':
                    roleHandler.addTo(msg,"Section 4",user);
                    break;
                case '6️⃣':
                    roleHandler.addTo(msg,"Section 6",user);
                    break;
            }
            reaction.users.remove(user);
        });

        collector.on('end', collected => {
            console.log(`Collected ${collected.size} items`);
        });

    }


});

client.login(auth.token);
// https://discord.com/api/oauth2/authorize?client_id=879861591670149150&permissions=8&scope=bot