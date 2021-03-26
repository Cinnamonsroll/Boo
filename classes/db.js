class db {
  constructor() {}
  async set(value, ops = {}) {
    if (!value) throw new Error("Value was not found");
    if (
      !ops ||
      !ops.by ||
      !ops.model ||
      (!ops.newValue && ops.newValue !== false)
    )
      throw new Error("No new value nor model was found");
    let model = ops.model;
    let data = await model.findOne(ops.by);
    if (!data) throw new Error("No data found");
    data[value] = ops.newValue;
    await data.save();
  }
  async create(by, model) {
    if (!by) throw new Error("Please include a by");
    if (!model) throw new Error("Please include a model");
    await model.create(by);
    let data = await model
      .findOne(by)
      .select("-__v")
      .select("-_id");
    return data || undefined;
  }
  async findInstance(by, model) {
    if (!by) throw new Error("Please include a by");
    if (!model) throw new Error("Please include a model");
    let data = await model.findOne(by);
    return data || undefined;
  }
  async deleteInstance(by, model) {
    if (!by) throw new Error("Please include a by");
    if (!model) throw new Error("Please include a model");
    await model.findOneAndDelete(by);
  }
}
module.exports = db;
