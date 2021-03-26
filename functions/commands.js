String.prototype.replaceAt = function(index, replacement) {
  return (
    this.substr(0, index) +
    replacement +
    this.substr(index + replacement.length)
  );
};
module.exports = {
  async getUser(ctx) {
    await ctx.guild.members.fetch({
      withPresences: true
    });
    let joins = ctx.guild.members.cache
      .sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
      .array();
    return (
      ctx.message.mentions.members.first() ||
      ctx.guild.members.cache.get(ctx.args[0]) ||
      joins[ctx.args[0]] ||
      ctx.message.guild.members.cache.find(m =>
        [m.user.username, m.displayName, m.user.tag].some(
          e => e.toLowerCase() === ctx.args.join(" ").toLowerCase()
        )
      ) ||
      ctx.message.member
    );
  },
  async pagify(ctx, options = {}) {
    let message = ctx.message;
    if (!(message instanceof ctx.Discord.Message))
      throw new TypeError(
        "First parameter must be a type of <discord.js>.Message"
      );
    options = {
      page: options.page,
      type: ["message", "embed"].includes(
        options.type && options.type.toString().toLowerCase()
      )
        ? options.type
        : "message",
      messages: Array.isArray(options.messages) ? options.messages : [],
      pages: options.pages || true
    };
    if (!options.messages.length)
      throw new TypeError("'options.messages' must have at least one element");
    if (
      options.type === "embed" &&
      !options.messages.every(m => m instanceof ctx.Discord.MessageEmbed)
    )
      throw new TypeError(
        "'options.type' were chosen as 'embed' but not every element of 'options.messages' were an instance of <discord.js>.MessageEmbed"
      );
    let pages = 0,
      reactions =
        options.messages.length > 1
          ? ["⏪", "◀️", "#️⃣", "▶️", "⏩", "⏹️"]
          : ["⏹️"],
      mainMessage = await message.channel.send(
        `${
          options.messages.length > 1 && options.pages === true
            ? `[${pages + 1}/${options.messages.length}] ${"○"
                .repeat(options.messages.length)
                .replaceAt(pages, "●")}`
            : ""
        }`,
        options.messages[pages]
      );
    await Promise.all(reactions.map(r => mainMessage.react(r)));
    let collector = mainMessage.createReactionCollector(
      (reaction, user) =>
        reactions.some(r => r === reaction.emoji.name) &&
        user.id === message.author.id,
      {
        time: options.time
      }
    );
    collector.on("collect", async (reaction, user) => {
      switch (reaction.emoji.name) {
        case "⏪":
          if (pages === 0) return;
          pages = 0;
          break;
        case "◀️":
          if (pages === 0) {
            pages = options.messages.length - 1;
          } else {
            pages -= 1;
          }
          break;
        case "⏹️":
          for (let reaction of mainMessage.reactions.cache
            .filter(r => r.users.cache.has(ctx.client.user.id))
            .array()) {
            await reaction.users.remove(ctx.client.user.id);
          }
          return collector.stop();
          break;
        case "▶️":
          if (pages === options.messages.length - 1) {
            pages = 0;
          } else {
            pages += 1;
          }
          break;
        case "⏩":
          if (pages === options.messages.length - 1) return;
          pages = options.messages.length - 1;
          break;
        case "#️⃣":
          let m = await message.channel.send("What page do you wish to go to?");
          let collected = await m.channel.awaitMessages(
            response => message.content,
            {
              max: 1,
              errors: ["time"]
            }
          );
          try {
            m.delete();
            let content = parseInt(collected.first().content);
            if (content && content > 0 && content <= options.messages.length)
              pages = content - 1;
          } catch (err) {
            console.log(err.message);
            m.delete();
          }

          break;
      }
      await mainMessage.edit(
        `${
          options.messages.length > 1 && options.pages === true
            ? `[${pages + 1}/${options.messages.length}] ${"○"
                .repeat(options.messages.length)
                .replaceAt(pages, "●")}`
            : ""
        }`,
        options.type === "message"
          ? options.messages[pages]
          : {
              embed: options.messages[pages]
            }
      );
    });
  },
  async validateUser(ctx, member) {
    let msg = await ctx.client.createMessage(
      ctx,
      `Hey ${member}, ${ctx.message.member} has challenged you to a battle in tic tac toe. Do you accept?`
    );
    let reactions = ["✅", "❌"];
    await Promise.all(reactions.map(x => msg.react(x)));

    const filter = (reaction, user) =>
      user.id === member.id && reactions.includes(reaction.emoji.name);

    const challengeCheck = await msg.awaitReactions(filter, {
      time: 30000,
      max: 1
    });
    if (challengeCheck.size < 1)
      return msg.edit(
        "Looks like they didn't react in time, the challenge has been cancelled"
      );

    if (challengeCheck.first().emoji.name === "❌")
      return msg.edit(
        "Looks like they declined your challenge. Operation cancelled."
      );
    return "done"
  }
};
