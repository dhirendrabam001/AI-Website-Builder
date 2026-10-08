const bcrypt = require("bcrypt");
const { User } = require("../models/user.models");
const register = async (req, res) => {
  try {
    const { fullName, email, passoword, confirmPassword } = req.body;

    // validation required or not
    if (!fullName || !email || !passoword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please every field are required neccessary",
      });
    }
    // check password and confirm password
    if (passoword !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Password is not matched" });
    }

    // check password length
    if (passoword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password much be include at least 8 charater",
      });
    }

    // normalize email
    const normalizeEmail = email.toLowerCase().trim();

    // find existing user
    const existingUser = await User.findOne({
      email: normalizeEmail,
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email is aready exits" });
    }

    // hash password
    const hashPassword = await bcrypt.hash(passoword, 10);

    // create user
    const user = await User.create({
      firstName,
      email: normalizeEmail,
      passoword: hashPassword,
    });

    // return safe user data
    return res
      .status(201)
      .json({ success: true, user, message: "Registeration successful" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

module.exports = { register };
