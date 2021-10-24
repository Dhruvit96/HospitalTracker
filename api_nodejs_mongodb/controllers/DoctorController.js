const BaseController = require("./BaseController");
const BadRequest = require("../errors/BadRequest");
const NotFound = require("../errors/NotFound");
const { Doctor } = require("../models");
const Joi = require("joi");
const mongoose = require("mongoose");

module.exports = class DoctorController extends BaseController {
  doctorSchema = Joi.object({
    degree: Joi.string().required(),
    name: Joi.string().min(6).max(15).required(),
    speciality: Joi.string().required(),
  });

  async addDoctorData(req, res) {
    try {
      // Get id
      const { id } = req.user;
      // Get parameters
      let { degree, name, speciality } = req.body;
      // Checking images
      if (!req.file) throw new BadRequest("Image is required.");
      req.file = req.file.path.replace(/\\/g, "/");
      // Checking required field
      const { error } = this.doctorSchema.validate({
        degree,
        name,
        speciality,
      });
      if (error) {
        throw new BadRequest(error);
      }
      let doctor = new Doctor({
        degree: degree.toUpperCase(),
        name: name.toLowerCase(),
        speciality: speciality.toLowerCase(),
        hospital_id: id,
        image: req.file,
      });
      doctor = await doctor.save();
      // Send response
      return this.sendJSONResponse(res, "Doctor data added.", {
        length: 1,
      });
    } catch (error) {
      console.log(error);
      if (error.code) return this.sendErrorResponse(req, res, error);
      else throw error;
    }
  }

  async updateDoctorData(req, res) {
    try {
      // Get parameters
      const { id: hospital_id } = req.user;
      let { id } = req.params;
      let { degree, name, speciality } = req.body;
      if (req.file) req.file = req.file.path.replace(/\\/g, "/");
      // Checking if data is available
      if (!mongoose.Types.ObjectId.isValid(id))
        throw new BadRequest("Invalid Id");
      let doctor = await Doctor.findById(id).lean();
      if (!doctor || doctor.hospital_id != hospital_id)
        throw new NotFound("Doctor with given id not found.");
      await Doctor.findByIdAndUpdate(
        id,
        {
          degree: degree?.toUpperCase(),
          name: name?.toLowerCase(),
          speciality: speciality?.toLowerCase(),
          image: req.file,
        },
        {
          omitUndefined: true,
        }
      );
      // Send response
      return this.sendJSONResponse(res, "Doctor data Updated.", {
        length: 1,
      });
    } catch (error) {
      console.log(error);
      if (error.code) return this.sendErrorResponse(req, res, error);
      else throw error;
    }
  }

  async deleteDoctorData(req, res) {
    try {
      // get id
      const { id: hospital_id } = req.user;
      let { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id))
        throw new BadRequest("Invalid Id");
      let doctor = await Doctor.findById(id).lean();
      if (!doctor || doctor.hospital_id != hospital_id)
        throw new NotFound("Doctor with given id not found.");
      await Doctor.findByIdAndDelete(id);
      return this.sendJSONResponse(res, "Doctor data deleted.");
    } catch (error) {
      if (error.code) return this.sendErrorResponse(req, res, error);
      else throw error;
    }
  }

  async getAllDoctorsData(req, res) {
    try {
      let { id } = req.params;
      let doctors = await Doctor.find({ hospital_id: id });
      return this.sendJSONResponse(
        res,
        "Success",
        {
          length: doctors.length,
        },
        { totalData: doctors.length, doctors }
      );
    } catch (error) {
      if (error.code) return this.sendErrorResponse(req, res, error);
      else throw error;
    }
  }
};
