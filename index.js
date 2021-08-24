const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const auth = require('./auth.json');
const roleHandler = require('./roleHandler.js');
const basics = require('./basics.js');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('your messages with horror', { type: 'WATCHING' });
    client.user.setStatus('idle');
});

client.on('messageCreate', msg => {
    if (msg.author.bot || !msg.guild) return;
    if (msg.content.substring(0, 5).toLowerCase() === '^add ') {
        let space = false;
        let i = 6;
        while(!space){
            if (msg.content[i] == " " || i == msg.content.length){
                space = true;
            }
            else{
                i += 1;
            }
        }
        const id = parseInt(msg.content.substring(5, i));
        try{
            roleHandler.add(msg, id);
        }
        catch(e){
            console.log("wut?")
        }
    }
    if (msg.content.substring(0, 11) == "^impossible") {
        msg.channel.send("​​​​");
    }
});

client.login(auth.token);
// https://discord.com/api/oauth2/authorize?client_id=879861591670149150&permissions=8&scope=bot