// import express from "express";
// import cors from "cors";
// import helmet from "helmet";
// import session from "express-session";
// import MongoStore from "connect-mongo";
// import dotenv from "dotenv";

// // Load environment variables FIRST
// dotenv.config();

// // Now import modules that need environment variables
// import connectDB from "./config/database.js";

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Connect to MongoDB
// connectDB();

// // Trust proxy for secure cookies (if using reverse proxy)
// app.set("trust proxy", 1);

// // Middleware
// app.use(
//   helmet({
//     crossOriginEmbedderPolicy: false,
//   })
// );

// app.use(
//   cors({
//     origin: process.env.CLIENT_URL,
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true }));

// // Session configuration
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore.create({
//       mongoUrl: process.env.MONGODB_URI,
//       touchAfter: 24 * 3600, // lazy session update
//     }),
//     cookie: {
//       secure: process.env.NODE_ENV === "production", // HTTPS in production
//       httpOnly: true,
//       maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
//     },
//   })
// );

// // Import and configure passport AFTER dotenv.config()
// const { default: passport } = await import("./config/passport.js");
// app.use(passport.initialize());
// app.use(passport.session());

// // Import routes AFTER passport is configured
// const { default: authRoutes } = await import("./routes/auth.js");
// const { default: movieRoutes } = await import("./routes/movies.js");

// // Routes
// app.use("/auth", authRoutes);
// app.use("/api/movies", movieRoutes);

// // Basic test route
// app.get("/api/test", (req, res) => {
//   res.json({
//     message: "Server is running with authentication!",
//     timestamp: new Date().toISOString(),
//     environment: process.env.NODE_ENV,
//     authenticated: req.isAuthenticated ? req.isAuthenticated() : false,
//   });
// });

// // Health check route
// app.get("/health", (req, res) => {
//   res.status(200).json({
//     status: "OK",
//     uptime: process.uptime(),
//     timestamp: new Date().toISOString(),
//   });
// });

// // 404 handler
// app.use("*", (req, res) => {
//   res.status(404).json({
//     success: false,
//     message: "Route not found",
//   });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error("Error:", err.stack);
//   res.status(500).json({
//     success: false,
//     message:
//       process.env.NODE_ENV === "production"
//         ? "Something went wrong!"
//         : err.message,
//   });
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
//   console.log(`📊 Environment: ${process.env.NODE_ENV}`);
//   console.log(`🔗 Client URL: ${process.env.CLIENT_URL}`);
//   console.log(
//     `🔐 Google OAuth: ${
//       process.env.GOOGLE_CLIENT_ID ? "✅ Configured" : "❌ Missing"
//     }`
//   );
// });











import express from "express";
import cors from "cors";
import helmet from "helmet";
import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";

// Load environment variables FIRST
dotenv.config();

// Now import modules that need environment variables
import connectDB from "./config/database.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Trust proxy for secure cookies (if using reverse proxy)
app.set("trust proxy", 1);

// Middleware
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
  })
);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      touchAfter: 24 * 3600, // lazy session update
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production", // HTTPS in production
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
  })
);

// Import and configure passport AFTER dotenv.config()
const { default: passport } = await import("./config/passport.js");
app.use(passport.initialize());
app.use(passport.session());

// Import routes AFTER passport is configured
const { default: authRoutes } = await import("./routes/auth.js");
const { default: movieRoutes } = await import("./routes/movies.js");

// Routes
app.use("/auth", authRoutes);
app.use("/api/movies", movieRoutes);

// Basic test route
app.get("/api/test", (req, res) => {
  res.json({
    message: "Server is running with authentication!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    authenticated: req.isAuthenticated ? req.isAuthenticated() : false,
  });
});

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong!"
        : err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Client URL: ${process.env.CLIENT_URL}`);
  console.log(
    `🔐 Google OAuth: ${
      process.env.GOOGLE_CLIENT_ID ? "✅ Configured" : "❌ Missing"
    }`
  );
});