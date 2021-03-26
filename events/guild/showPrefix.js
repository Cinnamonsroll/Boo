module.exports = async (client, ctx, prefix) => {
if(ctx.message.content.match(new RegExp(`^<@!?${client.user.id}>`, "gi"))){
  return await client.createMessage(ctx, `This guilds current prefix is \`${prefix}\``)
}
};
