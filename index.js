// const Discord = require('discord.js');
// const { joinVoiceChannel } = require('discord.js');
// const config = require("./config.json");
// const client = new Discord.Client;
// const fs = require('fs');
// const { SlashCommandSubcommandGroupBuilder } = require('@discordjs/builders');
// const message = require('./events/client/message');
// client.commands = new Discord.Collection();
// client.events = new Discord.Collection();

const Discord = require('discord.js');
const { joinVoiceChannel } = require('discord.js');
const config = require("./config.json");
const { Client, Intents } = require('discord.js')
const usedintents = new Intents();
const client = new Client({ intents: [
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.DIRECT_MESSAGES, 
    Intents.FLAGS.GUILD_INTEGRATIONS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_MESSAGES, 
    Intents.FLAGS.GUILD_MESSAGE_TYPING,
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_INTEGRATIONS,
    Intents.FLAGS.GUILD_WEBHOOKS,
    Intents.FLAGS.DIRECT_MESSAGE_TYPING,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
] })
const fs = require('fs');
const { SlashCommandSubcommandGroupBuilder } = require('@discordjs/builders');
const message = require('./events/client/message');
client.commands = new Discord.Collection();
client.events = new Discord.Collection();

['command_handler', 'event_handler'].forEach(handler =>{
    require(`./handlers/${handler}`)(client, Discord);
})



client.on('message', message => {

    if(message.content === "@edmundmcmillen") {
        message.channel.send("```You litte F**ker You made a shit of piece with your trash Issac it’s f**King Bad this trash game I will become back my money I hope you will in your next time a cow on a trash farm you sucker```")
    }

})


client.login(config.token);