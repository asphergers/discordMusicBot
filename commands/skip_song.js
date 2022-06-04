// const { info } = require('console');
// const map = require('./map')
// const ytdl = require('ytdl-core');
// const ytSearch = require('yt-search');
// const video_player = require('./play');
// const play = require('./play');

// const queue = map.map;

// module.exports = {
//     name: 'skip',
//     aliases: ['skip', 's'],
//     cooldown: 0,
//     description: 'displays upcoming songs',
//     async execute(message, args, cmd, client, Discord) {
//         const voice_channel = message.member.voice.channel;
//         if (!voice_channel) return message.channel.send('get in vc bozo');
//         const permissions = voice_channel.permissionsFor(message.client.user);
//         if (!permissions.has('CONNECT')) return message.channel.send('You dont have the correct permissins');
//         if (!permissions.has('SPEAK')) return message.channel.send('You dont have the correct permissins');
//         const server_queue = queue.get(message.guild.id);


//         if (cmd === 'skip' || cmd === 's') {
//             const song_queue = queue.get(message.guild.id);
//             const voice_channel = message.member.voice.channel;
//             if(!voice_channel) return message.channel.send('get in a channel bozo');
//             if(!song_queue.songs){
//                 return message.channel.send(`There are no songs in queue`);
//             }
//             try{
//                 queue.get(message.guild.id).songs.shift()
//                 video_player(message.guild, song_queue.songs[0]);
//             } catch {
//                 server_queue.connection.dispatcher.end();
//             }
//         }
//     }
// }