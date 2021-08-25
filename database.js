const Sequelize = require('sequelize');
const auth = require('./auth.json');


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
        postId: Sequelize.INTEGER
    });
}

exports.sync = function (){
    trackedPosts.sync();
}