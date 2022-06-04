const queue = require('./map').map

module.exports = {
    name: 'clear',
    aliases: ['clear'],
    cooldown: 0,
    description: 'clears the song queue',

    async execute(message, args, cmd, client, Discord) {
        const voice_channel = message.member.voice.channel;
        if (!voice_channel) return message.channel.send('get in vc bozo');
        const permissions = voice_channel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT')) return message.channel.send('You dont have the correct permissins');
        if (!permissions.has('SPEAK')) return message.channel.send('You dont have the correct permissins');

        const server_queue = queue.get(message.guild.id);

        if(cmd === 'clear') {
            const song_queue = queue.get(message.guild.id)
            song_queue.songs = song_queue.songs[0]
            console.log(song_queue.songs)

        }
    }
}