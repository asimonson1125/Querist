const Sequelize = require('sequelize');
const auth = require('./auth.json');
const basics = require('./basics.js');


let trackedPosts;

exports.DB_init = function () {
    const sequelize = new Sequelize('database', auth.SQLUser, auth.SQLPass, {
        host: 'localhost',
        dialect: 'sqlite',
        logging: false,
        // SQLite only
        storage: 'database.sqlite',
    });

    trackedPosts = sequelize.define('trackedPosts', {
        author: Sequelize.INTEGER,
        channelId: Sequelize.INTEGER,
        postId: Sequelize.INTEGER,
        content: Sequelize.STRING
    });
}

exports.sync = function (){
    trackedPosts.sync();
}

exports.addTracker = async function (msg){
    let tracker = await trackedPosts.create({
        author: msg.author.id,
        channelId: msg.channelId,
        postId: msg.id,
        content: msg.content
    });
    basics.deleteMessage(msg, `tracker created.`, 5000);
    let ver = await trackedPosts.findOne({ where: { postId: msg.id } });
    basics.deleteMessage(msg,`verification: tracking post ${ver.get('postId')}, which said "${ver.get('content')}".`,10000)
}

exports.printAll = async function(msg){
    let allContent = await trackedPosts.findAll({attributes: ['content']});
    let response = await msg.reply("DM'ing you all post content tracked on this host...");
    allContent.forEach(function(x){
        msg.author.send(x.get('content'));
    });
    response.edit(response.content + " Done!");
}