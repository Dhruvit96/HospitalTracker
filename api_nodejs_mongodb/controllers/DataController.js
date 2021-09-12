const BaseController = require("./BaseController");
const BadRequest = require("../errors/BadRequest");
const NotFound = require("../errors/NotFound");
const { Data } = require("../models");
const mongoose = require("mongoose");
const Joi = require("joi");

module.exports = class DataController extends BaseController {
  dataSchema = Joi.object({
    recovery_rate: Joi.number().min(0).required(),
    total_available_beds: Joi.number().min(0).required(),
    total_beds: Joi.number().min(1).required(),
    total_special_ward: Joi.number().min(0).required(),
    available_special_wards: Joi.number().min(0).required(),
    available_general_wards: Joi.number().min(0).required(),
  })
  async updateData(req, res) {
    try {
      // Get id
      const { id } = req.user;
      // Get parameters
      let {
        recovery_rate,
        total_available_beds,
        total_beds,
        total_special_ward,
        available_special_wards,
        available_general_wards,
      } = req.body;
      const { error } = this.dataSchema.validate({
        recovery_rate,
        total_available_beds,
        total_beds,
        total_special_ward,
        available_special_wards,
        available_general_wards,
      });
      if (error) {
        throw new BadRequest(error);
      }
      // Update Data
      await Data.findOneAndUpdate(
        { hospital_id: id },
        {
          recovery_rate,
          total_available_beds,
          total_beds,
          total_special_ward,
          available_special_wards,
          available_general_wards,
          isDataAdded: true
        }
      );
      return this.sendJSONResponse(res, "Data updated successfully.");
    } catch (error) {
      if (error.code) return this.sendErrorResponse(req, res, error);
      else throw error;
    }
  }

  async getData(req, res) {
    try {
      // Get parameters
      const { id } = req.params;
      // Check id
      if (!mongoose.Types.ObjectId.isValid(id))
        throw new BadRequest("Invalid Id");
      let data = await Data.findOne({ hospital_id: id });
      if (!data) throw new NotFound(`data with id ${id} not found.`);
      return this.sendJSONResponse(
        res,
        "Success",
        {
          length: 1,
        },
        data
      );
    } catch (error) {
      if (error.code) return this.sendErrorResponse(req, res, error);
      else throw error;
    }
  }
};
