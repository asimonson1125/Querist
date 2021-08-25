const basics = require('./basics.js');

exports.sleep = function (ms) { //make wait function
    return new Promise(resolve => setTimeout(resolve, ms));
}

exports.deleteMessage = async function (msg, response, wait) {
    let delme = await msg.reply(response);
    await basics.sleep(wait);
    delme.delete({});
}