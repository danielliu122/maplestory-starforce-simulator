const express = require("express");
const app = express();
const Discord = require("discord.js");
//const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
const { averageAeesCalc, averageEesCalc } = require('./eescalc.js');

var onRdy = false
var client = undefined
var timeoutLen = 0

app.listen(3000, () => {
  console.log("App is running");
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

while (client === undefined && onRdy == false) {
  try {
    client = new Discord.Client({
      intents: 131071,
      partials: ['CHANNEL', 'GUILD_MEMBER', 'GUILD_SCHEDULED_EVENT', 'MESSAGE', 'REACTION', 'USER']
    })
    client.login(process.env['token']);

    client.on('ready', () => {
      console.log('I am ready!');
      onRdy = true
      timeoutLen = 5000
    });
  }
  catch {
    onRdy = false
    timeoutLen += 5000
    if (timeoutLen >= 60000) timeoutLen = 5000
    console.log("Client is not responding... trying to connect again in + ${timeoutLen} + seconds...")
    setTimeout(timeoutLen)
  }
}

client.on("messageCreate", message => {
  if (message.content === "ping") {
    message.channel.send("pong");
    setTimeout(3333)
  }
  const toLoop = message.content.split(" ")
  if (toLoop[0] === 'eescalc') {
    const defaultsfp = [0, 5, 10]

    var start = parseFloat(toLoop[1])
    if (start < 0) start = 0
    var end = parseFloat(toLoop[2])
    if (end > 15) end = 15
    var simulations = parseFloat(toLoop[3])
    if (simulations > 999) simulations = 999

    var sfp = toLoop[4]
    if (sfp === undefined) sfp = defaultsfp
    else sfp = toLoop[4] + defaultsfp

    console.log(start, end, simulations, sfp)
    var msg = averageEesCalc(start, end, simulations, sfp)
    message.channel.send(msg.toString())
  }
  if (toLoop[0] === 'aeescalc') {
    var start = parseFloat(toLoop[1])
    var end = parseFloat(toLoop[2])
    var simulations = parseFloat(toLoop[3])
    var sfp = toLoop[4]
    if (sfp === undefined) sfp = [0, 5, 10]

    console.log(start, end, simulations, sfp)
    var msg = averageAeesCalc(start, end, simulations, sfp)
    message.channel.send(msg.toString())
    setTimeout(3333)
  }
});










