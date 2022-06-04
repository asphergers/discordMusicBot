var request = require('request');

class InspirationalQuote {
  constructor(url)
  {
    this.url = url
    //this.base64 TBD
  }
}

class InspiroBot {
  constructor()
  {

  }

  fetchQuote(callback) //callback(error, InspirationalQuote)
  {
    request("http://inspirobot.me/api?generate=true", (error, response, body) => { if (error) { callback(error, undefined) } else { this.quoteGenerated(callback, body) } })
  }

  quoteGenerated(callback, body)
  {
    let quote = new InspirationalQuote(body)

    callback(undefined, quote)
  }


}

module.exports = InspiroBot
