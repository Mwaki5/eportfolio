const AppError = require("../utils/AppError");
const { generateAccessToken } = require("../utils/token");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const refreshToken = async (req, res, next) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return next(new AppError("Cookies not found", 401));
  }

  const refreshTokenFromCookie = cookies.jwt;

  try {
    // Verify JWT signature
    const decoded = jwt.verify(
      refreshTokenFromCookie,
      process.env.REFRESH_TOKEN_SECRET
    );

    // Find user and verify refresh token matches database
    const user = await User.findOne({
      where: { userId: decoded.userInfor.userId },
    });

    if (!user) {
      return next(new AppError("User not found", 401));
    }

    // Check if refresh token in cookie matches the one in database
    if (user.refreshToken !== refreshTokenFromCookie) {
      return next(
        new AppError("Refresh token mismatch - please login again", 401)
      );
    }

    // Generate new access token
    const accessToken = generateAccessToken({
      userId: decoded.userInfor.userId,
      role: decoded.userInfor.role,
    });

    res.json({
      accessToken,
      user: {
        userId: decoded.userInfor.userId,
        role: decoded.userInfor.role,
        email: user.email,
        profilePic: user.profilePic,
        firstname: user.firstname,
        lastname: user.lastname,
      },
    });
  } catch (err) {
    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
      return next(new AppError("Invalid or expired refresh token", 401));
    }
    return next(err);
  }
};

module.exports = { refreshToken };
