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
    DB.sync(client);
    client.user.setActivity('your messages with horror', { type: 'WATCHING' });
    client.user.setStatus('idle');
});

client.on('messageCreate', msg => {
    if (msg.author.bot || !msg.guild) return;

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


    if (msg.content.startsWith('^emojiTrack ')) { // syntax: ^emojiTrack +:100:+ "role100" +:one:+ "role1" --msg msgID
        let msgStart = msg.content.indexOf('--msg ');
        let mutated = msg.content.substring(11, msgStart);
        let commands = [[], []];
        let trackedMessage;
        mutated = mutated.substring(mutated.indexOf('+') + 1);
        while (mutated.indexOf('+') != -1) {
            commands[0].push(mutated.substring(0, mutated.indexOf('+')).replace(/\s/g, ''));
            mutated = mutated.substring(mutated.indexOf('"') + 1);
            commands[1].push(mutated.substring(0, mutated.indexOf('"')));
            mutated = mutated.substring(mutated.indexOf('+') + 1);
        }
        let msgID = (msg.content.substring(msg.content.indexOf("--msg ") + 6));
        try{
            parseInt(msgID);
        }
        catch(e){
            msg.author.send('Error: Message id recieved is not an integer')
        }
        try {
            DB.addTracker(msg, msgID, commands);
            unnecessaryFunction(msg, msgID, trackedMessage, commands);
        } catch (e) {
            msg.author.send(`error: ${e}`);
        }
        msg.delete({});
    }


});

async function unnecessaryFunction(msg, msgID, trackedMessage, commands) {
    trackedMessage = await msg.channel.messages.fetch(msgID);
    let out = `For message ${msgID}:\n`;
    for (let i = 0; i < commands[0].length; i++) {
        out += commands[0][i] + " assigns " + commands[1][i] + "\n";
        trackedMessage.react(commands[0][i]);
    }
    roleHandler.makeEmojiCollector(trackedMessage, commands);
    msg.author.send(out);
}


client.login(auth.token);
// https://discord.com/api/oauth2/authorize?client_id=879861591670149150&permissions=8&scope=bot