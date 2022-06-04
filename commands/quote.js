const { quote } = require('@discordjs/builders');
const { MessageSelectMenu } = require('discord.js');
const lib = require('node-inspirobot');
var InspiroBot = new lib();


module.exports = {
    name: 'quote',
    aliases: ['quote', 'qt'],
    cooldown: 0,
    description: 'gets an inspriobot quote',
    async execute(message, args, cmd, client, Discord) {
        function handleQuote(error, qoute) {
          if (error) {
            return message.channel.send("unexpected error");
          }
          else {
            return message.channel.send(qoute.url);
          }
        }
        
        InspiroBot.fetchQuote(handleQuote);
    }
}