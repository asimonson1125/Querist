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


exports.addTo = async function (msg, id, target) {
    let gTarget = await msg.guild.members.fetch(target.id);
    let role = await msg.guild.roles.cache.find(r => r.name == id);
    if (role) {
        try {
            if(!gTarget.roles.cache.find(r => r == role)){
                await gTarget.roles.add(role);
                gTarget.send("You now have the role '" + role.name + "'")
            }
            else{
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


async function react(msg) {
    let arr = [];
    try {
        for (let i = 7; msg.content[i] !="-"; i++) {
            if (msg.content.substring(i, i + 2) == "\\") {
                arr.push(msg.content[i+1])
            }
        }
        arr.forEach(function(x){
            msg.react(x);
        })
    } catch (e) {
        return e;
    }
    return true;
}

exports.roleReact = async function (msg) {
    let valid = await react(msg);
    if (valid) {
        basics.deleteMessage(msg,"Success!", 5000);
    }
}
