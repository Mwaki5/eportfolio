const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");
const { User } = require("../models");
const { validateAndSaveFile } = require("../services/fileHandler");
const AppError = require("../utils/AppError");
const registerUser = async (req, res, next) => {
  try {
    const {
      userId,
      email,
      gender,
      firstname,
      level,
      lastname,
      role,
      department,
    } = req.body;

    const existing = await User.findOne({
      where: {
        [Op.or]: [{ userId: userId }, { email: email }],
      },
    });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "userid  or email  already exists" });
    }

    const hashedPassword = await bcrypt.hash(userId, 10);

    if (!req.file)
      return res.status(400).json({ message: "Profile image required" });

    // Validate and save file
    const profilePicPath = await validateAndSaveFile(req.file, "profilePic", {
      allowedTypes: ["image/jpeg", "image/png", "image/webp"],
      maxSize: 2 * 1024 * 1024,
    });

    const filepath = profilePicPath.replace(/\\/g, "/").replace("public/", "");
    const user = await User.create({
      userId,
      email,
      password: hashedPassword,
      firstname,
      department,
      lastname,
      level: level || null,
      gender,
      profilePic: filepath,
      role,
    });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    next(error);
    // res.status(500).json({ error: error.message });
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { userId, password } = req.body;
    //find user
    const user = await User.findOne({ where: { userId } });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    //check password
    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) {
    //   return res.status(400).json({ message: "Invalid credentials" });
    // }
    //generate access token
    const accessToken = generateAccessToken({
      userId: user.userId,
      role: user.role,
    });
    //generate refresh token
    const refreshToken = generateRefreshToken({
      userId: user.userId,
      role: user.role,
    });

    //save refresh token in db
    user.refreshToken = refreshToken;
    await user.save();

    // set refresh token in httpOnly cookie
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        accessToken,
        userId: user.userId,
        id: user.id,
        role: user.role,
        email: user.email,
        firstname: user.firstname,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    next(error);
    // res.status(500).json({ error: error.message });
  }
};

const logoutUser = async (req, res) => {
  try {
    const refreshToken = req.cookies.jwt;

    // If no cookie exists, logout is still successful
    if (!refreshToken) {
      return res.sendStatus(204);
    }

    // Find user with this refresh token
    const user = await User.findOne({
      where: { refreshToken },
    });

    // If token not found in DB, clear cookie anyway
    if (!user) {
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });
      return res.sendStatus(204);
    }

    // Invalidate refresh token in DB
    user.refreshToken = null;
    await user.save();

    // Clear refresh token cookie
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return res.sendStatus(204);
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Logout failed" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
