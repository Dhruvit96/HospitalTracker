const express = require("express");
const router = express.Router();

const { HospitalController } = require("../controllers");
const { authenticate } = require("../helper");

const hospitalController = new HospitalController();

router.post("/", (req, res) => hospitalController.addHospital(req, res));
router.get("/", (req, res) =>
  hospitalController.getAllHospitals(req, res)
);
router.post("/login", (req, res) => hospitalController.loginHospital(req, res));
router.get("/id", authenticate, (req, res) => hospitalController.getHospital(req, res));
router.post("/changePassword", authenticate, (req, res) =>
  hospitalController.changePassword(req, res)
);
module.exports = router;
