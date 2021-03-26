const { pcmd } = require("../utils/cmd.js");
pcmd(
  [
    require("discord.js").Permissions.FLAGS.SEND_MESSAGES,
    require("discord.js").Permissions.FLAGS.MANAGE_MESSAGES
  ],
  "prefix",
  "setprefix",
  "sp",
  "newprefix",
  async ctx => {
    let {
      client: { createMessage, createEmbed, color, db, cachedPrefixs },
      args,
      guildPrefix,
      message
    } = ctx;
    let prefix = args[0];
    if (!prefix)
      return await createMessage(
        ctx,
        createEmbed({
          color,
          description: `This servers current prefix is \`${guildPrefix}\``
        })
      );
    prefix = prefix.toLowerCase() === "default" ? "bo." : prefix;
    await db.set("prefix", {
      model: require("@db.guild"),
      by: { guild: ctx.message.guild.id },
      newValue: prefix
    });
    let cache = cachedPrefixs;
    cache[message.guild.id] = prefix;
    return await createMessage(
      ctx,
      createEmbed({
        color,
        description: `New prefix \`${prefix}\``
      })
    );
  }
).help({
  name: "prefix",
  description: "Changes prefix",
  aliases: ["setprefix", "sp", "newprefix"],
  usage: "[newprefix]",
  category: "config"
});

pcmd(
  [
    require("discord.js").Permissions.FLAGS.SEND_MESSAGES,
    require("discord.js").Permissions.FLAGS.MANAGE_GUILD
  ],
  "settings",
  "config",
  async ctx => {
    let {
      client: {
        createMessage,
        createEmbed,
        color,
        db,
        cachedPrefixs,
        getAllGuildData,
        changeSettings
      },
      args,
      guildPrefix,
      message
    } = ctx;
    let model = require("@db.guild");
    let type = boolean => ctx.emojis[boolean === true ? "yes" : "no"];
    let data = await getAllGuildData(ctx, ctx.guild.id);
    let things = [{ name: "Leveling", db: "leveling" }];
    let nums = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
    return await createMessage(
      ctx,
      createEmbed({
        color,
        title: `${ctx.workers.text.this.guild.settings}`,
        description: `${things.map(
          (item, i) => `${nums[i]} ${item.name}: ${type(data[item.db])}`
        )}`,
        footer: { text: `${ctx.workers.text.this.guild.help.settings}` }
      })
    ).then(async m => {
      await Promise.all(nums.slice(0, things.length).map(r => m.react(r)));
      await m.react("❌");
      let newReactions = nums.slice(0, things.length);
      newReactions.push("❌");
      let filter = (reaction, user) =>
        user.id === ctx.message.author.id &&
        newReactions.includes(reaction.emoji.name);
      let col = m.createReactionCollector(filter);
      col.on("collect", async (reaction, user) => {
        switch (reaction.emoji.name) {
          case "❌":
            await m.edit(
              createEmbed({
                color,
                title: `${ctx.workers.text.this.guild.settings}`,
                description: `Settings menu ended`,
                footer: { text: `${ctx.workers.text.this.guild.help.settings}` }
              })
            );
            col.stop();
            break;
          default:
            let newReactions = nums.slice(0, things.length);
            let index = newReactions.indexOf(reaction.emoji.name);
            await db.set(things[index].db, {
              model: require("@db.guild"),
              by: { guild: ctx.message.guild.id },
              newValue: !data[things[index].db]
            });
            let newData = await db.findInstance(
              { guild: ctx.message.guild.id },
              model
            );
            m.edit(
              createEmbed({
                color,
                title: `${ctx.workers.text.this.guild.settings}`,
                description: `${things.map(
                  (item, i) =>
                    `${nums[i]} ${item.name}: ${type(newData[item.db])}`
                )}`,
                footer: { text: `${ctx.workers.text.this.guild.help.settings}` }
              })
            );
            break;
        }
      });
    });
  }
).help({
  name: "settings",
  description: "Settings menu",
  aliases: ["config"],
  usage: "",
  category: "config"
});
