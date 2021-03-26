let { model, Schema } = require("mongoose");
let userSchema = new Schema({
  user: { type: String, required: true },
  lollipops: { type: Number, default: 0 },
  magicPoints: { type: Number, default: 0 },
  cards: { type: Array, default: [] },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  totalXp: { type: Number, default: 0 },
  xpToLevelUp: { type: Number, default: 300 },
  dailyCooldown: { type: String, default: 0 },
  shop: { type: Array, default: [] },
  team: { type: Array, default: [] },
  effects: { type: Array, default: [] }
});
module.exports = model("Users", userSchema);
