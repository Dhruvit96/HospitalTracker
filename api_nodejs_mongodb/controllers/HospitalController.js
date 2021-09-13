const BaseController = require("./BaseController");
const BadRequest = require("../errors/BadRequest");
const NotFound = require("../errors/NotFound");
const { Hospital, Data, Invitation } = require("../models");
const Joi = require("joi");
const validator = require("validator");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = class HospitalController extends BaseController {
  userSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().min(6).max(15).required(),
    invitation_id: Joi.string().required(),
    contact_num: Joi.string().min(10).max(10).required(),
  });

  async addHospital(req, res) {
    try {
      // Get parameters
      let { email, password, invitation_id, contact_num } = req.body;
      // Checking invitation_id
      if (!mongoose.Types.ObjectId.isValid(invitation_id))
        throw new BadRequest("Invalid invitation Id");
      let invitation = await Invitation.findById(invitation_id).lean();
      if (!invitation) throw new BadRequest("Invitation not found.");
      // Checking required field
      const { error } = this.userSchema.validate({ email, password, invitation_id, contact_num });
      if (error) {
        throw new BadRequest(error);
      }
      // Check email
      if (!validator.default.isEmail(email))
        throw new BadRequest("Invalide email.");
      let encryptedPassword = await bcrypt.hash(password, 10);
      // Create hospital
      let hospital = new Hospital({
        email: email.toLowerCase(), password: encryptedPassword, name: invitation.name,
        address: invitation.address,
        contact_num,
        city: invitation.city.toLowerCase()
      });
      hospital = await hospital.save();
      let data = new Data({ hospital_id: hospital.toObject()._id });
      await data.save();
      await Invitation.findByIdAndDelete(invitation_id);
      // Send response
      return this.sendJSONResponse(
        res,
        "Hospital registered successfully",
        {
          length: 1,
        },
      );
    } catch (error) {
      console.log(error);
      if (error.code === 11000) {
        return this.sendErrorResponse(
          req,
          res,
          new BadRequest("Hospital email or contact already registered.")
        );
      }
      if (error.code) return this.sendErrorResponse(req, res, error);
      else throw error;
    }
  }

  async loginHospital(req, res) {
    try {
      // Get parameters
      let { email, password } = req.body;
      // Checking required field
      if (!email || !password)
        throw new BadRequest("Email and password are required.");
      let hospital = await Hospital.findOne({ email: email.toLowerCase() });
      let obj = hospital?.toObject();
      // Checking password// Checking password
      if (
        !(await bcrypt.compare(password, obj ? obj.password : ""))
      ) {
        throw new BadRequest("Invalide email or password.");
      }
      // Creating token
      const token = jwt.sign(
        { id: obj._id, role: "user" },
        process.env.JWT_SECRET,
        { expiresIn: "28d" }
      );
      return this.sendJSONResponse(
        res,
        "Login success",
        {
          length: 1,
        },
        { ...hospital.toJSON(), token }
      );
    } catch (error) {
      if (error.code) return this.sendErrorResponse(req, res, error);
      else throw error;
    }
  }

  async getHospital(req, res) {
    try {
      // get id
      const { id } = req.user;
      // get hospital
      let hospital = await Hospital.findById(id);
      if (!hospital) throw new NotFound(`Hospital with id ${id} not found.`);
      return this.sendJSONResponse(
        res,
        "Success",
        {
          length: 1,
        },
        hospital
      );
    } catch (error) {
      if (error.code) return this.sendErrorResponse(req, res, error);
      else throw error;
    }
  }

  async getAllHospitals(req, res) {
    try {
      let { pageNumber, pageSize, name, city } = req.query;
      pageNumber = pageNumber ? Number.parseInt(pageNumber) : 1;
      pageSize = pageSize ? Number.parseInt(pageSize) : 10;
      name = name ? "^" + name : "";
      let query = {
        name: new RegExp(name, "i"),
      };
      if (city) query.city = city;
      let hospitals = await Hospital.find(query)
        .skip(pageSize * (pageNumber - 1))
        .limit(pageSize);
      return this.sendJSONResponse(
        res,
        "Success",
        {
          length: hospitals.length,
        },
        { totalHospitals: hospitals.length, hospitals }
      );
    } catch (error) {
      if (error.code) return this.sendErrorResponse(req, res, error);
      else throw error;
    }
  }

  async changePassword(req, res) {
    try {
      // Get parameters
      let { oldPassword, newPassword } = req.body;
      const { id } = req.user;
      // Checking required field
      if (!oldPassword || !newPassword)
        throw new BadRequest("Old and new both password are required.");
      let hospital = await Hospital.findById(id).lean();
      // Checking password
      if (
        !(await bcrypt.compare(
          oldPassword,
          hospital ? hospital.password : ""
        ))
      ) {
        throw new BadRequest("Invalide password.");
      }
      // Changing password
      let encryptedPassword = await bcrypt.hash(newPassword, 10);
      await Hospital.findByIdAndUpdate(id, {
        password: encryptedPassword,
      });
      return this.sendJSONResponse(res, "Password changed.");
    } catch (error) {
      if (error.code) return this.sendErrorResponse(req, res, error);
      else throw error;
    }
  }

};
