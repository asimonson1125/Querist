const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });
const auth = require('./auth.json');
const roleHandler = require('./roleHandler.js');
const basics = require('./basics.js');
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
        //no test functions at this time
    }

    if (msg.content.startsWith('^emojiTrack ')) { // syntax: ^emojiTrack +:100:+ "role100" +:one:+ "role1" --msg msgLink
        let msgStart = msg.content.indexOf('--msg ');
        let mutated = msg.content.substring(11, msgStart);
        let commands = [[], []];
        mutated = mutated.substring(mutated.indexOf('+') + 1);
        while (mutated.indexOf('+') != -1) {
            commands[0].push(mutated.substring(0, mutated.indexOf('+')).replace(/\s/g, ''));
            mutated = mutated.substring(mutated.indexOf('"') + 1);
            commands[1].push(mutated.substring(0, mutated.indexOf('"')));
            mutated = mutated.substring(mutated.indexOf('+') + 1);
        }
        let msgID, chanID, guildID;
        let IDs = (msg.content.substring(msg.content.indexOf("--msg ") + 6));
        if(IDs.indexOf("https://discord.com/channels/") != -1){
            IDs = IDs.substring(IDs.indexOf("https://discord.com/channels/") +29);
            guildID = IDs.substring(0,IDs.indexOf('/'));
            IDs = IDs.substring(IDs.indexOf('/')+1);
            chanID = IDs.substring(0,IDs.indexOf('/'));
            IDs = IDs.substring(IDs.indexOf('/')+1);
            msgID = IDs;
        }
        try {
            parseInt(msgID);
        }
        catch (e) {
            msg.author.send('Error: Message id recieved is not an integer')
        }
        try {
            initCollector(msg, msgID, chanID, guildID, commands);
        } catch (e) {
            msg.author.send(`error: ${e}`);
        }
        msg.delete({});
    }


});

async function initCollector(msg, msgID, chanID, guildID, commands) {
    try {
        let msgGuild = await client.guilds.cache.get(guildID);
        let msgChannel = await msgGuild.channels.cache.get(chanID);
        let trackedMessage = await msgChannel.messages.fetch(msgID);
        let out = `For message ${msgID}, which is in channel #${msgChannel.name} of '${msgGuild.name}':\n`;
        for (let i = 0; i < commands[0].length; i++) {
            out += commands[0][i] + " assigns " + commands[1][i] + "\n";
            trackedMessage.react(commands[0][i]);
        }
        DB.addTracker(msgID, chanID, guildID, commands);
        roleHandler.makeEmojiCollector(trackedMessage, commands);
        msg.author.send(out);
    } catch (e) {
        msg.author.send(`Error while creating emoji collector: ${e}`);
    }
}


client.login(auth.token);
// https://discord.com/api/oauth2/authorize?client_id=879861591670149150&permissions=8&scope=bot