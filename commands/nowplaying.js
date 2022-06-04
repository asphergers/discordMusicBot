const ytdl = require('play-dl');
const ytSearch = require('yt-search');
const { info } = require('console');
const map = require('./map');


const queue = map.map;



module.exports = {
    name: 'nowplaying',
    aliases: ['nowplaying', 'np'],
    cooldown: 0,
    description: 'now playing',
    async execute(message, args, cmd, client, Discord){

        const voice_channel = message.member.voice.channel;
        if (!voice_channel) return message.channel.send('get in vc bozo');
        const permissions = voice_channel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT')) return message.channel.send('You dont have the correct permissins');
        if (!permissions.has('SPEAK')) return message.channel.send('You dont have the correct permissins');


        const server_queue = queue.get(message.guild.id);
        console.log(message.guild)

        if(cmd === 'np' || cmd === 'nowplaying') {
    
            try {
                console.log(server_queue.songs[0].length)
                return message.channel.send(
                `now playing:  **${require('util').inspect(server_queue.songs[0].title)}** \n duration: ${server_queue.songs[0].length}`
                )
            } catch {
                return message.channel.send("nothing in queue");
            }
        }

    }
}