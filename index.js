require("module-alias/register");
const{
  Client,
  MessageAttachment,
  Collection,
  MessageEmbed
} = require("discord.js");
const client = new Client({
  fetchAllMembers: true,
  partials: ["MESSAGE", "USER", "REACTION"],
  restTimeOffset: 60,
  ws: {
    intents: 32767
  }
});
let config = require("./config.json");
let functions = require("./functions/client.js");
let mongo = require("mongoose");
const { tree } = require("./utils/cmd.js");
for (const [K, V] of Object.entries(functions)) client[K] = V;
mongo.connect(config.uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});
["economy", "leveling", "general", "config", "cards", "owner"].map(dir => {
  console.log(`[Command] loading ${dir}`);
  require(`./commands/${dir}.js`);
});
let db = mongo.connection;
db.once("open", () => console.log("DB connected"));
["event"].map(handler => {
  require(`./handler/${handler}`)(client);
});
client.login(config.token);
module.exports = client;
