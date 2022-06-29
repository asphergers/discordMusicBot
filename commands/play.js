const play = require('play-dl'); //FINISH SWITCHING TO PLAY-DL
const ytSearch = require('yt-search');
const { info } = require('console');
const map = require('./map')
const ytdl = require('ytdl-core')
console.log(map)
const { createAudioPlayer, createAudioResource , StreamType, demuxProbe, joinVoiceChannel, NoSubscriberBehavior, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection } = require('@discordjs/voice')

play.getFreeClientID().then((clientID) => play.setToken({
    soundcloud : {
        client_id : clientID
    }
}))


//global queue for bot
const queue = map.map
console.log(queue)
//console.log(video_player)


module.exports = {
    name: 'play',
    aliases: ['skip', 'upcoming', 'clear', 'nowplaying', 'loop', 'p'],
    cooldown: 0,
    description: 'Advanced music bot',
    async execute(message, args, cmd, client, Discord) {
        const voice_channel = message.member.voice.channel;
        if (!voice_channel) return message.channel.send('get in vc bozo');
        const permissions = voice_channel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT')) return message.channel.send('You dont have the correct permissins');
        if (!permissions.has('SPEAK')) return message.channel.send('You dont have the correct permissins');
        


        const server_queue = queue.get(message.guild.id);


        if (cmd === 'play' || cmd === 'p'){
            if (!args.length) return message.channel.send('input a second argument and stop trying to break me :(');
            let song = {};
            //if args[0] is link
            if (args[0].startsWith('http') && (play.validate(args[0]) === "so_track" || "so_playlist" || "yt_video")) {
                console.log((await play.validate(args[0])));
                var song_info = null;
                // if (await play.validate(args[0]) === "so_track" || "so_playlist") {
                //     song_info = await play.soundcloud(args[0]);
                //     console.log(song_info);
                //     song = { 
                //         title: song_info.name,
                //         url: song_info.permalink,
                //         length: song_info.durationInSec,
                //         type: "soundcloud"
                //     }
                // } else {
                    song_info = await play.video_basic_info(args[0]);
                    song = { 
                        title: song_info.video_details.title,
                        url: song_info.video_details.url,
                        length: song_info.video_details.durationInSec,
                        type: "youtube"
                    //}
                }
            } else {
                //if no url use ytsearch
                const video_finder = async (query) => {
                    const video_result = await ytSearch(query);
                    return (video_result.videos.length > 1) ? video_result.videos[0] : null;
                }

                const video = await video_finder(args.join(' '));
                if (video){
                    song = { title: video.title, url: video.url, length: video.duration}
                } else {
                     message.channel.send('error lol.');
                     return
                }
            }

            //creqte server queue if one does not exist
            if (!server_queue){
                const queue_constructor = {
                    voice_channel: voice_channel,
                    text_channel: message.channel,
                    connection: null,
                    songs: []
                }
                
                //Add key and value pair into the global queue. use this to grab our server queue.
                queue.set(message.guild.id, queue_constructor);
                queue_constructor.songs.push(song);
    
                //connect to vc
                try {
                    //const connection = await voice_channel.join();
                    const connection = joinVoiceChannel({
                        channelId: message.member.voice.channel.id,
                        guildId: message.guild.id,
                        adapterCreator: message.guild.voiceAdapterCreator
                    })
                    queue_constructor.connection = connection;
                    video_player(message.guild, queue_constructor.songs[0], message);
                } catch (err) {
                    queue.delete(message.guild.id);
                    message.channel.send('error lol');
                    console.log(err);
                    return;
                }

            } else{
                server_queue.songs.push(song);
                return message.channel.send(`${song.title} added to queue!`);
            }
        }

        else if(cmd === 'skip' || cmd === 's') skip_song(message, server_queue);
        else if(cmd === 'loop')loop(message, server_queue);
        //else if(cmd === 'seek')seek(args[0], message, server_queue);
    }
    
}




const video_player = async (guild, song, message) => {

    const connection = joinVoiceChannel({
        channelId: message.member.voice.channel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator
    })

    const song_queue = queue.get(guild.id);
    //If no song is left in the server queue. Leave the voice channel and delete the key and value pair from the global queue.
    if (!song) {
        connection.destroy();
        queue.delete(guild.id);
        return;
    }
    const stream = await play.stream(song.url);
    const player = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Play
        }
    })
    const resource = createAudioResource(stream.stream, {inputType : stream.type});
    player.play(resource);
    connection.subscribe(player)
    player.on('error', error => {
        console.log("error found during playtime");
        console.log(error);
    })
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
    await song_queue.text_channel.send(`Now playing ${song.title}`)
}




const skip_song = (message, server_queue) => {

    const song_queue = queue.get(message.guild.id);
    const voice_channel = message.member.voice.channel;
    if (!voice_channel) {
        return message.channel.send('get in a channel bozo');
    }
    if (!server_queue) {
        return message.channel.send(`There are no songs in queue`);
    }

    const connection = joinVoiceChannel({
        channelId: message.member.voice.channel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator
    })
    
    try{
        queue.get(message.guild.id).songs.shift()
        video_player(message.guild, song_queue.songs[0], message);
    } catch {
        connection.destroy();
        message.channel.send("unexpected error, leaving and deleting current queue");
        queue.delete(guild.id);
        return;
    }

}


const loop = (message, server_queue) => {
    try{
        const queue = server_queue.songs;
        queue.loop = !queue.loop;
        return message.channel.send(`Loop is now ${queue.loop ? "on" : "off"}`).catch(console.error);
    } catch {
        return message.reply("There is nothing playing.").catch(console.error);
    }
}

