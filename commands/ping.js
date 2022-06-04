module.exports = {
    name: 'ping',
    description: 'basic ping pong command',
    execute(message, args) {
        console.log("ping")
        message.channel.send('pong')

    }
}