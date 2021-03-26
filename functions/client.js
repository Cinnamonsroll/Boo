let { MessageEmbed } = require("discord.js");
module.exports = {
  async createMessage(ctx, content, ops = {}) {
    let m = await ctx.channel.send(content);
    return m;
  },
  createEmbed(ops = {}) {
    return new MessageEmbed({ ...ops });
  },
  async getPrefix(ctx, guildId) {
    let data = require("@db.guild");
    let cache = ctx.client.cachedPrefixs;
    let fetched = await ctx.client.db.findInstance({ guild: guildId }, data);
    if (!fetched)
      fetched = await ctx.client.db.create({ guild: guildId }, data);
    if (cache[guildId]) return cache[guildId];
    cache[guildId] = fetched.prefix;
    return cache[guildId];
  },
  async getUserFromDb(ctx, userId) {
    let data = require("@db.user");
    let fetched = await ctx.client.db.findInstance({ user: userId }, data);
    if (!fetched) fetched = await ctx.client.db.create({ user: userId }, data);
    return fetched;
  },
  async getAllGuildData(ctx, guildId) {
    let data = require("@db.guild");
    let fetched = await ctx.client.db.findInstance({ guild: guildId }, data);
    if (!fetched)
      fetched = await ctx.client.db.create({ guild: guildId }, data);
    return fetched;
  },
  owners: ["606279329844035594"],
  color: "#dbbddb",
  xpCooldowns: new Set(),
  cachedPrefixs: {},
  db: new (require("../classes/db.js"))()
};
