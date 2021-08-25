const basics = require('./basics.js');

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