const BaseController = require("./BaseController");
const BadRequest = require("../errors/BadRequest");
const { Admin } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

module.exports = class AdminController extends BaseController {
  async loginAdmin(req, res) {
    try {
      //Getting data
      const { username, password } = req.body;
      if (typeof username !== "string" || username.length > 30)
        throw new BadRequest("Invalid username format.");
      if (typeof password !== "string")
        throw new BadRequest("Invalid password format.");
      if ((await Admin.find()).length == 0) {
        let encryptedPassword = await bcrypt.hash(
          process.env.ADMIN_PASSWORD,
          10
        );
        let newAdmin = new Admin({
          username: process.env.ADMIN_USERNAME,
          password: encryptedPassword,
        });
        await newAdmin.save();
      }
      // Getting User
      let admin = await Admin.findOne({ username });
      let adminObject = admin?.toObject();
      // Checking password
      if (
        !(await bcrypt.compare(
          password,
          adminObject ? adminObject.password : ""
        ))
      ) {
        throw new BadRequest("Invalide username/password.");
      }
      // Creating token
      const token = jwt.sign(
        { id: adminObject._id, username: admin.username, role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "28d" }
      );
      return this.sendJSONResponse(
        res,
        "Login success",
        {
          length: 1,
        },
        { ...admin.toJSON(), token }
      );
    } catch (error) {
      if (error.code) return this.sendErrorResponse(req, res, error);
      else throw error;
    }
  }
};
