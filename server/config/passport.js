import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

// Debug: Check environment variables
console.log("🔍 Passport Config - Environment Check:");
console.log(
  "GOOGLE_CLIENT_ID:",
  process.env.GOOGLE_CLIENT_ID ? "✅ Available" : "❌ Missing"
);
console.log(
  "GOOGLE_CLIENT_SECRET:",
  process.env.GOOGLE_CLIENT_SECRET ? "✅ Available" : "❌ Missing"
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log(
          "🔐 Google OAuth callback received for:",
          profile.displayName
        );

        // Check if user already exists
        let existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) {
          console.log("✅ Existing user found:", existingUser.name);
          return done(null, existingUser);
        }

        // Check if user exists with same email
        existingUser = await User.findOne({ email: profile.emails[0].value });

        if (existingUser) {
          // Update existing user with Google ID
          existingUser.googleId = profile.id;
          existingUser.avatar = profile.photos[0].value;
          await existingUser.save();
          console.log(
            "✅ Updated existing user with Google ID:",
            existingUser.name
          );
          return done(null, existingUser);
        }

        // Create new user
        const newUser = new User({
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          avatar: profile.photos[0].value,
          savedMovies: [],
        });

        const savedUser = await newUser.save();
        console.log("✅ New user created:", savedUser.name);
        return done(null, savedUser);
      } catch (error) {
        console.error("❌ Error in Google Strategy:", error);
        return done(error, null);
      }
    }
  )
);

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
