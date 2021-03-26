module.exports = async (client, guild) => {
  let data = require("@db.guild");
  let fetched = await client.db.findInstance({ guild: guild.id }, data);
  if (fetched) await client.db.deleteInstance({ guild: guild.id }, data);
};
