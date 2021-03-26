module.exports = async (client, message, context) => {
  const { trigger } = require("../../utils/cmd");
  let Discord = require("discord.js");
  try {
    let prefix = await client.getPrefix({ client }, message.guild.id);
    let args = message.content
      .slice(prefix.length)
      .trim()
      .split(/ +/g);
    let ctx = require("../../utils/ctx.js")(client, message, Discord, args, prefix)
    if (message.author.bot || message.channel.type === "dm") return;
    client.emit("showPrefix", ctx, prefix)
    client.emit("level", message, ctx);
    if (!message.content.startsWith(prefix)) return;
    await trigger("cmd", ctx, message.member, args, prefix);
  } catch (e) {
    console.log(e);
  }
};