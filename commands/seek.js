const { info, time } = require('console');
const map = require('./map')
const play = require('play-dl');
const ytSearch = require('yt-search');
const { createAudioPlayer, createAudioResource , StreamType, demuxProbe, joinVoiceChannel, NoSubscriberBehavior, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection } = require('@discordjs/voice');
const video = require('ffmpeg/lib/video');


const queue = map.map;


const video_player = async (guild, song, message, seconds) => {

    const song_queue = queue.get(guild.id);
    const time = seconds
    const connection = joinVoiceChannel({
        channelId: message.member.voice.channel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator
    })

    const stream = await play.stream(song.url, {seek: time});
    const player = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Play
        }
    })
    const resource = createAudioResource(stream.stream, {inputType: stream.type});
    player.play(resource);
    connection.subscribe(player)
    player.on(AudioPlayerStatus.Idle, () => {
        if (song_queue.songs.loop){
            video_player(guild, song_queue.songs[0], message)
        } else {
            try{
                song_queue.songs.shift()
                video_player(guild, song_queue.songs[0], message)
            } catch (err) {
                console.log(err);
                message.channel.send('error lol' - err);
            }
        }
    });
}

module.exports = {
    name: 'seek',
    aliases: ['seek'],
    cooldown: 0,
    description: 'displays upcoming songs',
    async execute(message, args, cmd, client, Discord){
        const voice_channel = message.member.voice.channel;
        if (!voice_channel) return message.channel.send('get in vc bozo');
        const permissions = voice_channel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT')) return message.channel.send('You dont have the correct permissins');
        if (!permissions.has('SPEAK')) return message.channel.send('You dont have the correct permissins');

        const server_queue = queue.get(message.guild.id);

        const time = parseInt(args[0]);
        //const time = args[0]
        if (Number.isInteger(time)) { //FIGURE OUT  HOW TO CHECK IF SKIP GOES OVER TIME!!!!!!!!!!
            try {
                return video_player(message.guild, server_queue.songs[0], message, args[0]);
            } catch {
                return message.channel.send("nothing in queue");
            }

        } else {
            return message.channel.send("not an integer or trying to skip too far ahead");
        }

        
    }
}
