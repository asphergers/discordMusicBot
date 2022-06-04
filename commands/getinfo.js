const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const { info } = require('console');
const map = require('./map');

const queue = map.map
console.log(queue + "for getinfo")

module.exports = {
    async execute(message, Discord) {
        const server_queue = queue.get(message.guild.id);
        console.log(server_queue.connection.dispatcher)
        console.log('----------------------------------------------------------------------------')
        console.log(server_queue.connection)
    }

}