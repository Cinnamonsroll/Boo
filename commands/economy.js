const { cmd } = require("../utils/cmd.js");
cmd("bal", "balance", async ctx => {
  let {
    client: { createMessage, createEmbed, color, getUserFromDb },
    commandFunctions: { getUser }
  } = ctx;
  let user = await getUser(ctx);
  let userData = await getUserFromDb(ctx, user.id);
  await createMessage(
    ctx,
    createEmbed({
      color,
      author: {
        name: `${user.user.username}\'s balance`,
        iconURL: user.user.avatarURL({ dynamic: true }),
        url: user.user.avatarURL({ dynamic: true })
      },
      fields: [
        {
          name: "Lollipops",
          value: `${
            user.user.username
          } has \`${userData.lollipops.toLocaleString()}🍭\` lollipops`
        },
        {
          name: "Magic points",
          value: `${
            user.user.username
          } has \`${userData.magicPoints.toLocaleString()}✨\` magicpoints`
        }
      ]
    })
  );
}).help({
  name: "bal",
  description: "Sends a users balance",
  aliases: ["balance"],
  usage: "[user]",
  category: "economy"
});
cmd("shop", "store", async ctx => {
 
}).help({
  name: "shop",
  description: "Sends the store",
  aliases: ["store"],
  usage: "",
  category: "economy"
});
cmd("daily", "d", async ctx => {
  let {
    client: { createMessage, createEmbed, color, getUserFromDb }
  } = ctx;
  let userData = await getUserFromDb(ctx, ctx.message.author.id);
  let cooldown = parseInt(userData.dailyCooldown);
  let onDaily = Date.now() >= parseInt(cooldown) + 1000 * 60 * 60 * 24;
  let amount = userData.cards.find(x => x.name.toLowerCase() === "wumpus")
    ? 800
    : 400;
  let otherAmount =
    500 +
    (userData.effects.find(x => x.name === "promo")
      ? userData.effects.find(x => x.name === "promo").amount * 30
      : 0);
  if (!onDaily) {
    let ms = require("parse-ms");
    let time = ms(1000 * 60 * 60 * 24 - (Date.now() - cooldown));
    await createMessage(
      ctx,
      createEmbed({
        color,
        description: `you can claim your daily in **${time.hours}h ${time.minutes}m ${time.seconds}s**`
      })
    );
  } else {
    userData.lollipops += amount;
    userData.magicPoints += otherAmount;
    userData.dailyCooldown = Date.now();
    await userData.save();
    await createMessage(
      ctx,
      createEmbed({
        color,
        description: `**${ctx.message.author.username}**, you recieved **${amount}** \`🍭\` and **${otherAmount}** \`✨\``,
        fields: [
          {
            name: "Multipliers",
            value: `If you have the promo effect enabled the amount of \`✨\` you get is increased by 30%! If you have the wumpus card you get 800 \`🍭\` instead of 400!`
          }
        ]
      })
    );
  }
}).help({
  name: "daily",
  description: "Collects daily reward",
  aliases: ["d"],
  usage: "",
  category: "economy"
});
