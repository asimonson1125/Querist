const basics = require('./basics.js');

async function deleteMessage(msg, response, wait) {
    let delme = await msg.reply(response);
    await basics.sleep(wait);
    delme.delete({});
}

exports.add = async function (msg, id) {
    //let acknowledgement = await msg.reply(`Message from ${msg.author.username} read, role id: ${id}.`);
    //find role and assign to msg.author asynchronously
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