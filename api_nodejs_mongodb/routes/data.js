const express = require("express");
const router = express.Router();

const { DataController } = require("../controllers");
const { authenticate } = require("../helper");

const dataController = new DataController();

router.get("/:id", (req, res) => dataController.getData(req, res));
router.put("/", authenticate, (req, res) =>
  dataController.updateData(req, res)
);

module.exports = router;
