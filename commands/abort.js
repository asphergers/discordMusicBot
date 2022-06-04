const { info, time } = require('console');
const map = require('./map')
const play = require('play-dl');
const ytSearch = require('yt-search');
const { createAudioPlayer, createAudioResource , StreamType, demuxProbe, joinVoiceChannel, NoSubscriberBehavior, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection } = require('@discordjs/voice');
const video = require('ffmpeg/lib/video');

const queue = map.map;

const abort = async (guild, message) => {

    const song_queue = queue.get(guild.id);

    const connection = joinVoiceChannel({
        channelId: message.member.voice.channel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator
    })


    connection.destroy();
    queue.delete(guild.id);
    return;
}

module.exports = {
    name: 'abort',
    aliases: ['abort'],
    cooldown: 0,
    description: 'clear the queue and leave the vc',
    async execute(message, args, cmd, client, Discord){
        const voice_channel = message.member.voice.channel;
        if (!voice_channel) return message.channel.send('get in vc bozo');
        const permissions = voice_channel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT')) return message.channel.send('You dont have the correct permissins');
        if (!permissions.has('SPEAK')) return message.channel.send('You dont have the correct permissins');

        const server_queue = queue.get(message.guild.id);


        try {
            abort(message.guild, message);
        } catch (e) {
            console.log(e);
            message.channel.send("unkown error");
        }
    }
}