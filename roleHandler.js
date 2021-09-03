const basics = require('./basics.js');
const roleHandler = require('./roleHandler.js');

exports.add = async function (msg, id) {
    let role = await msg.guild.roles.cache.find(r => r.name == id);
    if (role) {
        try {
            await msg.member.roles.add(role);
        }
        catch (e) {
            basics.dmHandler(msg, `Error while assigning role '${id}'`, 5000)
            msg.delete({});
            return;
        }
        basics.dmHandler(msg,"You now have the role '" + role.name + "'", 5000)
    }
    else {
        basics.dmHandler(msg`Role '${id}' not found.`, 5000);
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
                basics.silentDM(gTarget, "You now have the role '" + role.name + "'")
            }
            else {
                await gTarget.roles.remove(role);
                basics.silentDM(gTarget, "You no longer have the role '" + role.name + "'")
            }

        }
        catch (e) {
            basics.silentDM(gTarget, `Error while assigning role '${id}': ${e}`)
            return;
        }
    }
    else {
        basics.silentDM(gTarget, `Role '${id}' not found.`);
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