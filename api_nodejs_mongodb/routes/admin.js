const express = require("express");
const router = express.Router();

const { AdminController } = require("../controllers");

const adminController = new AdminController();

router.post("/login", (req, res) => adminController.loginAdmin(req, res));

module.exports = router;
