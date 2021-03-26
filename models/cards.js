let { model, Schema } = require("mongoose");
let cardSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  rating: { type: String, required: true },
  rarity: { type: String, required: true },
  user: { type: String, required: true },
  picture: { type: String, required: true }
});
module.exports = model("Cards", cardSchema);
