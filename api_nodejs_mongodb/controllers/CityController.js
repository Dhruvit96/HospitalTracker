const { Hospital } = require("../models");
const BaseController = require("./BaseController");

module.exports = class CityController extends BaseController {
  async getCities(req, res) {
    try {
      //Getting data
      let cities = await Hospital.distinct("city").lean();
      return this.sendJSONResponse(
        res,
        "Cities",
        {
          length: cities.length,
        },
        cities
      );
    } catch (error) {
      if (error.code) return this.sendErrorResponse(req, res, error);
      else throw error;
    }
  }
};
