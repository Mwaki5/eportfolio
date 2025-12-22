const express = require("express");
const { sequelize } = require("./models");
const errorHandler = require("./middlewares/errorHandler");
const credentials = require("./middlewares/credentials");
const corsOption = require("./config/corsOptions");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const AppError = require("./utils/AppError");
const multer = require("multer");
const { verifyJwt } = require("./middlewares/verifyJwt");

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

// Log every request
app.use((req, res, next) => {
  // console.log("Incoming request:", req.method, req.url);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public/"));
app.use(express.static("uploads/"));
app.use(credentials);
app.use(cors(corsOption));
app.use(cookieParser());

app.use("/api/auth/", require("./routes/authRoutes"));

app.use(verifyJwt);

// Protected routes
app.use("/api/units", require("./routes/unitRoutes"));
app.use("/api/enrollments", require("./routes/enrollmentRoutes"));
app.use("/api/evidence", require("./routes/evidenceRoutes"));
app.use("/api/marks", require("./routes/markRoutes"));
app.use("/api/students", require("./routes/studentRoutes"));

app.use((req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

// Centralized error handler (LAST)
app.use(errorHandler);

(async () => {
  try {
    await sequelize.authenticate();
    //await sequelize.sync({ alter: true });
    // await sequelize.sync({ force: true });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Backend running on port ${PORT}`);
    });
    console.log("Mysql connected successfully");
  } catch (error) {
    console.error("Unable to connect to Mysql:", error);
  }
})();
