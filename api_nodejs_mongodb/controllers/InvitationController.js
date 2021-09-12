const BaseController = require("./BaseController");
const BadRequest = require("../errors/BadRequest");
const Forbidden = require("../errors/Forbidden");
const NotFound = require("../errors/NotFound");
const { Invitation } = require("../models");
const Joi = require("joi");
const crypto = require("crypto");
const { Types: { ObjectId } } = require("mongoose");

module.exports = class InvitationController extends BaseController {
  InvitationSchema = Joi.object({
    name: Joi.string().required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
  });

  async addInvitation(req, res) {
    try {
      // Check role
      const { role } = req.user;
      if (role !== "admin") throw new Forbidden("User must be admin");
      //Getting data
      const { name, address, city } = req.body;
      const { error } = this.InvitationSchema.validate({ name, address, city });
      if (error) {
        throw new BadRequest(error);
      }
      let code = crypto.randomBytes(4).toString('hex');;
      // Add Invitation
      let invitation = new Invitation({ code, name, address, city });
      await invitation.save();
      return this.sendJSONResponse(res, "Invitation Added with code " + code);
    } catch (error) {
      if (error.code === 11000) {
        return this.sendErrorResponse(
          req,
          res,
          new BadRequest("Hospital with given name or address already exist.")
        );
      }
      if (error.code) return this.sendErrorResponse(req, res, error);
      else throw error;
    }
  }

  async getAllInvitation(req, res) {
    try {
      // Check role
      const { role } = req.user;
      if (role !== "admin") throw new Forbidden("User must be admin");
      //Getting data
      let { pageNumber, pageSize, name } = req.query;
      pageNumber = pageNumber ? Number.parseInt(pageNumber) : 1;
      pageSize = pageSize ? Number.parseInt(pageSize) : 10;
      let options = name ? { name } : {};
      let invitations = await Invitation.find(options)
        .sort("-datetime")
        .skip(pageSize * (pageNumber - 1))
        .limit(pageSize);
      return this.sendJSONResponse(
        res,
        "Invitations",
        { length: invitations.length },
        { totalInvitations: invitations.length, invitations }
      );
    } catch (error) {
      if (error.code) return this.sendErrorResponse(req, res, error);
      else throw error;
    }
  }

  async checkInvitation(req, res) {
    try {
      //Getting data
      const { code } = req.params;
      let invitation = await Invitation.findOne({ code });
      if (!invitation) throw new BadRequest("Invitation code is not valid.")
      return this.sendJSONResponse(
        res,
        "Invitation",
        { length: 1 },
        invitation
      );
    } catch (error) {
      if (error.code) return this.sendErrorResponse(req, res, error);
      else throw error;
    }
  }

  async deleteInvitation(req, res) {
    try {
      // Get parameters
      const { id } = req.params;
      // Check id
      if (!ObjectId.isValid(id))
        throw new BadRequest("Invalid Id");
      let invitation = await Invitation.findById(id);
      if (!invitation) throw new NotFound(`Invitation with id ${id} not found.`);
      await Invitation.findByIdAndDelete(id);
      return this.sendJSONResponse(res, "invitation Deleted");
    } catch (error) {
      if (error.code) return this.sendErrorResponse(req, res, error);
      else throw error;
    }
  }
};
