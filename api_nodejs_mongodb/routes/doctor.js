const express = require("express");
const router = express.Router();

const { DoctorController } = require("../controllers");
const { authenticate, imageUpload } = require("../helper");

const doctorController = new DoctorController();

router.post("/", authenticate, imageUpload.single("image"), (req, res) =>
  doctorController.addDoctorData(req, res)
);
router.put("/:id", authenticate, imageUpload.single("image"), (req, res) =>
  doctorController.updateDoctorData(req, res)
);
router.get("/:id", (req, res) => doctorController.getAllDoctorsData(req, res));
router.delete("/:id", authenticate, (req, res) =>
  doctorController.deleteDoctorData(req, res)
);
module.exports = router;
