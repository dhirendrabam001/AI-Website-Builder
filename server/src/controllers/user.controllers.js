const bcrypt = require("bcrypt");
const { User } = require("../models/user.models");
const register = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    // validation required or not
    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please every field are required neccessary",
      });
    }
    // check password and confirm password
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Password is not matched" });
    }

    // check password length
    if (password.length < 8) {
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
    const hashPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      fullName: fullName.trim(),
      email: normalizeEmail,
      password: hashPassword,
    });

    return res.status(201).json({
      success: true,
      user,
      message: "Registeration successful",
    });
  } catch (error) {
    console.error("Register error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// login controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ALL field are required
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please all field are required" });
    }

    // normalize email
    const normalizeEmail = email.trim().toLowerCase();

    // find user and password
    const user = await User.findOne({
      email: normalizeEmail,
    }).select("+password");
    console.log(user);

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User is not found" });
    }

    // account active or not
    if (!user.isActive) {
      return res
        .status(403)
        .json({ success: false, message: "Account is not active" });
    }

    // compare passwoasrd
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Password is not matched" });
    }

    // 6. Update last login time
    user.lastLoginAt = new Date();
    await user.save();

    // 7. Return safe user data
    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
          isVerified: user.isVerified,
          isActive: user.isActive,
          plan: user.plan,
          aiCredits: user.aiCredits,
          lastLoginAt: user.lastLoginAt,
        },
      },
    });
  } catch (error) {
    console.error("error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

module.exports = { register, login };
