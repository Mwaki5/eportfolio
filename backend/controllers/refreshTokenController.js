const AppError = require("../utils/AppError");
const { generateAccessToken } = require("../utils/token");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const {
  auditLogger,
  errorLogger,
  addRequestMetadata,
} = require("../utils/logger");

const refreshToken = async (req, res, next) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    errorLogger.error(
      "Refresh token missing from cookies",
      addRequestMetadata({ req })
    );
    return next(new AppError("Cookies not found", 401));
  }

  const refreshTokenFromCookie = cookies.jwt;

  try {
    // Verify JWT signature
    const decoded = jwt.verify(
      refreshTokenFromCookie,
      process.env.REFRESH_TOKEN_SECRET
    );

    // Find user and verify refresh token
    const user = await User.findOne({
      where: { userId: decoded.userInfor.userId },
    });

    if (!user) {
      errorLogger.warn(
        "User not found during refresh token verification",
        addRequestMetadata({ req, userId: decoded.userInfor.userId })
      );
      return next(new AppError("User not found", 401));
    }

    if (user.refreshToken !== refreshTokenFromCookie) {
      auditLogger.warn(
        "Refresh token mismatch",
        addRequestMetadata({ req, userId: user.userId })
      );
      return next(
        new AppError("Refresh token mismatch - please login again", 401)
      );
    }

    // Generate new access token
    const accessToken = generateAccessToken({
      userId: user.userId,
      role: user.role,
    });

    auditLogger.info(
      "Refresh token used to generate new access token",
      addRequestMetadata({ req, userId: user.userId })
    );

    res.json({
      accessToken,
      user: {
        userId: user.userId,
        role: user.role,
        email: user.email,
        profilePic: user.profilePic,
        firstname: user.firstname,
        lastname: user.lastname,
      },
    });
  } catch (err) {
    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
      errorLogger.warn(
        "Invalid or expired refresh token",
        addRequestMetadata({ req, error: err })
      );
      return next(new AppError("Invalid or expired refresh token", 401));
    }
    errorLogger.error(
      "Unexpected error in refresh token",
      addRequestMetadata({ req, error: err })
    );
    return next(err);
  }
};

module.exports = { refreshToken };
