const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema({
    degree: { type: String, required: true },
    image: { type: String, required: true },
    name: { type: String, required: true },
    speciality: { type: String, required: true },
    hospital_id: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital" },
});

DoctorSchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

module.exports = new mongoose.model("Doctor", DoctorSchema);
