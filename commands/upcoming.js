const { info } = require('console');
const map = require('./map')

const queue = map.map;


module.exports = {
    name: 'upcoming',
    aliases: ['upcoming', 'queue', 'q'],
    cooldown: 0,
    description: 'displays upcoming songs',
    async execute(message, args, cmd, client, Discord){
        const voice_channel = message.member.voice.channel;
        if (!voice_channel) return message.channel.send('get in vc bozo');
        const permissions = voice_channel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT')) return message.channel.send('You dont have the correct permissins');
        if (!permissions.has('SPEAK')) return message.channel.send('You dont have the correct permissins');

        const server_queue = queue.get(message.guild.id);
        
        if(cmd === 'upcoming' || cmd === 'queue' || cmd === 'q') {
            var list = []
            try {
                for(var i = 0; i < server_queue.songs.length; i++) {
                    list.push(`${server_queue.songs[i].title}\n`)
                }
            } catch {
                return message.channel.send("nothing in queue");
            }
            try{
                var output = "";
                for (var i = 0; i<list.length; i++) {
                    output += `${i+1}. ${list[i]}\n`;
                }
                message.channel.send(output)
            } catch {
                message.channel.send('queue is empty')
            }
        }
    }
}
