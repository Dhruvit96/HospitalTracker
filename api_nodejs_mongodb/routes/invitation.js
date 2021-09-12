const express = require("express");
const router = express.Router();

const { InvitationController } = require("../controllers");
const { authenticate } = require("../helper");

const invitationController = new InvitationController();

router.post("/", authenticate, (req, res) => invitationController.addInvitation(req, res));
router.get("/", authenticate, (req, res) =>
  invitationController.getAllInvitation(req, res)
);
router.get("/:code", (req, res) => invitationController.checkInvitation(req, res));
router.delete("/:id", (req, res) => invitationController.deleteInvitation(req, res));

module.exports = router;
