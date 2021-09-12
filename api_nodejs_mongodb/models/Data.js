const mongoose = require("mongoose");

const DataSchema = new mongoose.Schema({
  recovery_rate: { type: Number, required: true, default: 0 },
  total_available_beds: { type: Number, required: true, default: 0 },
  total_beds: { type: Number, required: true, default: 0 },
  total_special_ward: { type: Number, required: true, default: 0 },
  available_special_wards: { type: Number, required: true, default: 0 },
  available_general_wards: { type: Number, required: true, default: 0 },
  hospital_id: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital", unique: true },
  isDataAdded: { type: Boolean, required: true, default: false },
});

DataSchema.method("toJSON", function () {
  const { __v, _id, hospital_id, ...object } = this.toObject();
  object.id = hospital_id;
  return object;
});

module.exports = new mongoose.model("HospitalData", DataSchema);
