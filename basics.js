const basics = require('./basics.js');

exports.sleep = function (ms) { //make wait function
    return new Promise(resolve => setTimeout(resolve, ms));
}

exports.deleteMessage = async function (msg, response, wait) {
    let delme = await msg.reply(response);
    await basics.sleep(wait);
    delme.delete({});
}
exports.deleteBoth = async function (msg, response, wait) {
    let delme = await msg.reply(response);
    await basics.sleep(wait);
    delme.delete({});
    msg.delete({});
}

exports.dmHandler = async function (msg, response, time){
    try{
        await msg.author.send(response);
    }
    catch(e){
        basics.deleteMessage(msg, response, time);
    }
}