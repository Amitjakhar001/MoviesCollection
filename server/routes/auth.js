import express from "express";
import passport from "passport";

const router = express.Router();

// @route   GET /auth/google
// @desc    Start Google OAuth flow
// @access  Public
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// @route   GET /auth/google/callback
// @desc    Google OAuth callback
// @access  Public
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}?error=auth_failed`,
    successRedirect: process.env.CLIENT_URL,
  })
);

// @route   GET /auth/user
// @desc    Get current user
// @access  Private
router.get("/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      success: true,
      user: {
        _id: req.user._id,
        googleId: req.user.googleId,
        email: req.user.email,
        name: req.user.name,
        avatar: req.user.avatar,
        createdAt: req.user.createdAt,
      },
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Not authenticated",
    });
  }
});

// @route   POST /auth/logout
// @desc    Logout user
// @access  Private
router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error logging out",
      });
    }

    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error destroying session",
        });
      }

      res.clearCookie("connect.sid");
      res.json({
        success: true,
        message: "Logged out successfully",
      });
    });
  });
});

export default router;




