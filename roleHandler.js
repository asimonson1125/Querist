const basics = require('./basics.js');
const roleHandler = require('./roleHandler.js');

exports.add = async function (msg, id) {
    let role = await msg.guild.roles.cache.find(r => r.name == id);
    if (role) {
        try {
            await msg.member.roles.add(role);
        }
        catch (e) {
            msg.author.send(`Error while assigning role '${id}'`)
            msg.delete({});
            return;
        }
        msg.author.send("You now have the role '" + role.name + "'")
    }
    else {
        msg.author.send(`Role '${id}' not found.`);
    }
    msg.delete({});
}


exports.addTo = async function (msg, id, target) {
    let gTarget = await msg.guild.members.fetch(target.id);
    let role = await msg.guild.roles.cache.find(r => r.name == id);
    if (role) {
        try {
            if (!gTarget.roles.cache.find(r => r == role)) {
                await gTarget.roles.add(role);
                gTarget.send("You now have the role '" + role.name + "'")
            }
            else {
                await gTarget.roles.remove(role);
                gTarget.send("You no longer have the role '" + role.name + "'")
            }

        }
        catch (e) {
            gTarget.send(`Error while assigning role '${id}': ${e}`)
            return;
        }
    }
    else {
        gTarget.send(`Role '${id}' not found.`);
    }
}

exports.makeEmojiCollector = function (msg, commands) { //Make sure last command functions (wasn't saved?) and do error management with msg ids
    const filter = (reaction, user) => !user.bot;
    const collector = msg.createReactionCollector({ filter });
    collector.on('collect', (reaction, user) => {
        if (commands[0].indexOf(reaction.emoji.toString()) != -1) {
            roleHandler.addTo(msg, commands[1][commands[0].indexOf(reaction.emoji.toString())], user);
        }
        reaction.users.remove(user);
    });
}