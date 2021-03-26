const { cmd } = require("../utils/cmd.js");
cmd("view", "cards", "collection", async ctx => {
  let {
    client: { createMessage, createEmbed, color, getUserFromDb },
    args,
    commandFunctions: { getUser }
  } = ctx;
  let user = await getUser(ctx);
  let userData = await getUserFromDb(ctx, user.id);
  if (!userData.cards.length)
    return await createMessage(ctx, "You have no cards");
  await createMessage(
    ctx,
    createEmbed({
      color,
      description: `${userData.cards
        .map(
          card =>
            `\`${card.id}\` ${"★".repeat(card.rating)}${"☆".repeat(
              4 - card.rating
            )} ${card.rarity} ${card.name}`
        )
        .join("\n")}`
    })
  );
}).help({
  name: "cards",
  description: "View a users collection",
  aliases: ["collection", "view"],
  usage: "[user]",
  category: "cards"
});
