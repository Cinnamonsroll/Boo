const { cmd } = require("../utils/cmd.js");
cmd("rank", "rankcard", async ctx => {
  let {
    client: { createMessage, createEmbed, color },
    client,
    message,
    commandFunctions: { getUser }
  } = ctx;
  let model = require("@db.user");
  let user = await getUser(ctx);
  if (user.user.bot)
    return await createMessage(ctx, "Bots can't have ranks silly");
  const Canvas = require("canvas");
  const {
    fillTextWithTwemoji
  } = require("node-canvas-with-twemoji-and-discord-emoji");
  const canvas = Canvas.createCanvas(726, 177);
  const context = canvas.getContext("2d");
  const font = "Manrope";
  let { roundRect, canvasUsername } = require("@functions.canvas");
  let RankData = await ctx.client.getUserFromDb(ctx, user.id);
  let rank = await model.find();
  rank = rank
    .sort((b, a) => a.level - b.level)
    .filter(u =>
      client.users.cache.get(u.user)
        ? client.users.cache.get(u.user).bot !== true
        : u
    );
  rank = rank.indexOf(rank.find(r => r.user === user.id)) + 1;
  if (RankData.xp <= 100) RankData.xp = 100;
  context.fillStyle = "#37393F";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#202225";
  roundRect(context, 10, 10, 500, 160, 15, true, false);
  roundRect(context, 520, 10, 200, 80, 15, true, false);
  roundRect(context, 520, 100, 200, 70, 15, true, false);
  context.fillStyle = "#18191C";
  roundRect(
    context,
    10,
    160,
    500,
    10,
    { tl: 0, tr: 0, bl: 15, br: 15 },
    true,
    false
  );
  context.fillStyle = color;
  roundRect(
    context,
    10,
    160,
    (100 / RankData.xpToLevelUp) * RankData.xp * 5,
    10,
    { tl: 0, tr: 0, bl: 15, br: 0 },
    true,
    false
  );
  context.fillStyle = "#7E7E7E";
  context.font = `bold 15px ${font}`;
  context.textAlign = "center";
  context.fillText("LEVEL", 620, 40);
  context.fillStyle = "#18191C";
  roundRect(context, 536, 48, 170, 35, 10, true, false);
  context.fillStyle = color;
  context.font = `bold 20px ${font}`;
  context.textAlign = "center";
  context.fillText(
    RankData.level >= 1000
      ? `${(RankData.level / 1000).toPrecision(1)}k`
      : `${RankData.level}`,
    620,
    75
  );
  context.fillStyle = "#7E7E7E";
  context.font = `bold 15px ${font}`;
  context.textAlign = "center";
  context.fillText("EXP", 620, 125);
  context.fillStyle = "#18191C";
  roundRect(context, 536, 130, 170, 35, 10, true, false);
  context.fillStyle = color;
  context.font = `bold 20px ${font}`;
  context.textAlign = "center";
  context.fillText(
    `${
      RankData.xp >= 1000
        ? (RankData.xp / 1000).toPrecision(1) + "k"
        : RankData.xp
    } / ${
      RankData.level * 300 >= 1000
        ? ((RankData.level * 300) / 1000).toPrecision(1) + "k"
        : RankData.xpToLevelUp
    }`,
    620,
    155
  );
  context.fillStyle = "rgba(0,0,0,0.0)";
  context.fillRect(20, 20, 960, 300);
  const avatar_x = 55;
  const avatar_y = 40;
  const diameter = 100;
  const halfsize = diameter / 2;
  const shadow_size = 2;
  const shading_color = "rgba(0,0,0,0.0)";
  context.save();
  context.beginPath();
  const sx = avatar_x + halfsize,
    sy = avatar_y + halfsize;
  context.arc(sx, sy, halfsize - shadow_size, 0, 2 * Math.PI, true);
  context.closePath();
  context.clip();
  context.fillStyle = shading_color;
  context.fillRect(avatar_x, avatar_y, diameter, diameter);
  context.restore();
  context.save();
  context.beginPath();
  context.arc(sx, sy, halfsize - shadow_size * 2, 0, 2 * Math.PI, true);
  context.closePath();
  context.clip();
  const url = user.user.avatarURL({
    format: "png",
    size: 4096
  });
  const img = await Canvas.loadImage(url);
  context.drawImage(img, avatar_x, avatar_y, diameter, diameter);
  context.restore();
  context.font = `bold 30px ${font}`;
  context.fillStyle = color;
  context.textAlign = "center";
  await fillTextWithTwemoji(
    context,
    canvasUsername(
      context,
      canvas,
      user.user.username,
      user.user.discriminator,
      canvas.width / 2.5,
      context.font,
      context.textAlign,
      0,
      300
    ),
    canvas.width / 2.5 - 2,
    60
  );
  context.fillStyle = "#7E7E7E";
  context.font = `bold 15px ${font}`;
  context.textAlign = "center";
  context.fillText("RANK", 195, 100);
  context.fillStyle = color;
  context.fillText(
    rank >= 1000 ? `#${(rank / 1000).toPrecision(3)}k` : `#${rank}`,
    190,
    120
  );
  const attachment = new ctx.Discord.MessageAttachment(
    canvas.toBuffer(),
    `${user.id}-rank.png`
  );
  ctx.message.channel.send(attachment);
}).help({
  name: "rank",
  description: "Sends a users ran card",
  aliases: ["rankcard"],
  usage: "[user]",
  category: "leveling"
});
