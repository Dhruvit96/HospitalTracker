const mongoose = require("mongoose");

const HospitalSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  contact_num: { type: String, required: true, unique: true },
  city: { type: String, required: true },
});

HospitalSchema.method("toJSON", function () {
  const { __v, _id, password, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = new mongoose.model("Hospital", HospitalSchema);
