const basics = require('./basics.js');

async function deleteMessage(chan, response, wait) {
    let delme = await chan.send(response);
    await sleep(wait);
    delme.delete({});
}

exports.add = async function (msg, id){
    let acknowledgement = await msg.reply(`Message read, role id: ${id}.`);
    //find role and assign to msg.author asynchronously
    await basics.sleep(3000);
    acknowledgement.delete({});
    msg.delete({});
}