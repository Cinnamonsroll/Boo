class card {
  constructor(name = null, picture = null, type = null) {
    this.cardObject = {
      id: null,
      name,
      rating: null,
      rarity: null,
      picture,
      type,
      started: false
    };
  }
  createCard() {
    this.cardObject.started = true;
    return this
  }
  setRarity(rarity) {
    if (!this.cardObject.started)
      throw new Error("You have not initialized the card");
    this.cardObject.rarity = rarity;
    return this
  }
  setRating(rating) {
    if (!this.cardObject.started)
      throw new Error("You have not initialized the card");
    this.cardObject.rating = rating;
    return this
  }
  async setId(client) {
    if (!this.cardObject.started)
      throw new Error("You have not initialized the card");
    let createId = len => {
      let string = "abcdefghijklmnopqrstuvwxyz".split('')
      return Array.from(
        { length: len || 6 },
        (_, i) => string[Math.floor(Math.random() * string.length)]
      ).join("");
    };
    let data = require("@db.guild");
    async function getId() {
      const id = createId(5);
      return {
        id,
        exists: await client.db.findInstance({ id }, data)
      };
    }

    let id = await getId();
    while (id.exists) id = await getId();
    this.cardObject.id = id.id
    return this
  }
  build(){
    return this.cardObject
  }
}
module.exports = card;
