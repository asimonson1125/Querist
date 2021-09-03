const basics = require('./basics.js');

exports.sleep = function (ms) { //make wait function
    return new Promise(resolve => setTimeout(resolve, ms));
}

exports.deleteMessage = async function (msg, response, wait) {
    let delme = await msg.channel.send(msg.author.username +", " + response);
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
        msg.author.send(response).catch(() => console.log("I hate myself")).then(variable => msg.delete({}));
    }
    catch(e){
        basics.deleteBoth(msg, response, time);
    }
}

exports.silentDM = function(author,response){
    author.send(response).catch(() => console.log("I hate myself"));;
}