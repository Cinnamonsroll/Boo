module.exports = function(client, message, Discord, args, prefix) {
  return {
    client,
    message,
    channel: message.channel,
    guild: message.guild,
    Discord,
    args,
    guildPrefix: prefix,
    commandFunctions: require("@functions.commands"),
    canvasFunctions: require("@functions.canvas"),
    emojis: {
      yes: "<:goodboi:786069262481621012>",
      no: "<:badboi:788537874140233759>"
    },
    tree:require("./cmd.js").tree,
    workers: {
      text: {
        this: {
          guild: {
            settings: `${message.guild.name}'\s settings`,
            help: {
              settings: `React with the number which matches the setting you want to change`
            }
          }
        }
      }
    }
  };
};
