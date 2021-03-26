let { model, Schema } = require("mongoose");
let guildSchema = new Schema({
  guild: { type: String, required: true },
  prefix: { type: String, default: "bo." },
  leveling: { type: Boolean,  default: false }
});
module.exports = model("Guilds", guildSchema);
