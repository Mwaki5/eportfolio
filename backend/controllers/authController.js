const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");
const { User } = require("../models");
const AppError = require("../utils/AppError");
const { logAudit, logError } = require("../utils/logger");
const { validateAndSaveFile } = require("../services/fileHandler");

// ===== REGISTER USER =====
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

    // Check if userId or email exists
    const existing = await User.findOne({
      where: { [Op.or]: [{ userId }, { email }] },
    });
    if (existing) throw new AppError("UserId or email already exists", 400);

    if (!req.file) throw new AppError("Profile image required", 400);

    // Hash password
    const hashedPassword = await bcrypt.hash(userId, 10);

    // Validate and save profile picture
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
      lastname,
      gender,
      department,
      level: level || null,
      role,
      profilePic: filepath,
    });

    logAudit(`User registered: ${userId}`, req); // Audit log

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: { userId, email, role },
    });
  } catch (error) {
    logError("Register User Error", req, error); // Error log
    next(error);
  }
};

// ===== LOGIN USER =====
const loginUser = async (req, res, next) => {
  try {
    const { userId, password } = req.body;

    const user = await User.findOne({ where: { userId } });
    if (!user) {
      logAudit("FAIL - Invalid credentials", req); // Audit log
      throw new AppError("Invalid credentials", 400);
    }

    // Optionally compare password
    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) {
    //   logAudit("FAIL - Invalid credentials", req);
    //   throw new AppError("Invalid credentials", 400);
    // }

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.userId,
      role: user.role,
    });
    const refreshToken = generateRefreshToken({
      userId: user.userId,
      role: user.role,
    });

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    // Set cookie
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    logAudit(`User login: ${userId}`, req); // Audit log

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
    logError("Login User Error", req, error); // Error log
    next(error);
  }
};

// ===== LOGOUT USER =====
const logoutUser = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.jwt;

    if (!refreshToken) return res.sendStatus(204);

    const user = await User.findOne({ where: { refreshToken } });

    // Clear refresh token in DB if exists
    if (user) {
      user.refreshToken = null;
      await user.save();
      logAudit(`User logout: ${user.userId}`, req); // Audit log
    }

    // Clear cookie
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.sendStatus(204);
  } catch (error) {
    logError("Logout User Error", req, error); // Error log
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
