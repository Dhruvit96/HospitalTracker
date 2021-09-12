const express = require("express");
const router = express.Router();

const { CityController } = require("../controllers");

const cityController = new CityController();
router.get("/", (req, res) => cityController.getCities(req, res));

module.exports = router;
