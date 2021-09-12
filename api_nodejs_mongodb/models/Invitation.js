const mongoose = require("mongoose");

const InvitationSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  address: { type: String, required: true, unique: true },
  city: { type: String, required: true },
});

InvitationSchema.method("toJSON", function () {
  const { __v, _id, city, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = new mongoose.model("Invitation", InvitationSchema);
