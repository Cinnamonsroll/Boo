module.exports = async (client, message, ctx) => {
  let guildData = await client.getAllGuildData(ctx, ctx.message.guild.id);
  if (guildData.leveling === false) return;
  if (client.xpCooldowns.has(message.author.id)) return;
  let userData = await client.getUserFromDb(ctx, ctx.message.author.id);
  let randomXp = Math.round((Math.floor(Math.random() * 45) + 1) * 1);
  userData.xp += randomXp;
  userData.totalXp += randomXp;
 await userData.save()
  if (userData.xp >= userData.xpToLevelUp) {
    userData.level += 1;
    userData.xp = 0;
    userData.xpToLevelUp += 300;
    await userData.save()
  }
  client.xpCooldowns.add(message.author.id);
  setTimeout(() => {
    client.xpCooldowns.delete(message.author.id);
  }, 60 * 1000);
};
