import express from "express";
import { requireAuth } from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

// @route   GET /api/movies/saved
// @desc    Get user's saved movies
// @access  Private
router.get("/saved", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user.savedMovies,
      count: user.savedMovies.length,
    });
  } catch (error) {
    console.error("Error fetching saved movies:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   POST /api/movies/save
// @desc    Save a movie to user's collection
// @access  Private
router.post("/save", requireAuth, async (req, res) => {
  try {
    const {
      movieId,
      title,
      poster_path,
      release_date,
      vote_average,
      media_type,
    } = req.body;

    // Validate required fields
    if (!movieId || !title || !media_type) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: movieId, title, media_type",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if movie is already saved
    const isAlreadySaved = user.savedMovies.some(
      (movie) => movie.movieId === parseInt(movieId)
    );

    if (isAlreadySaved) {
      return res.status(400).json({
        success: false,
        message: "Movie already saved",
      });
    }

    // Add movie to user's collection
    const movieData = {
      movieId: parseInt(movieId),
      title,
      poster_path,
      release_date,
      vote_average: parseFloat(vote_average) || 0,
      media_type,
    };

    await user.addMovie(movieData);

    res.status(201).json({
      success: true,
      message: "Movie saved successfully",
      data: movieData,
    });
  } catch (error) {
    console.error("Error saving movie:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   DELETE /api/movies/:movieId
// @desc    Remove a movie from user's collection
// @access  Private
router.delete("/:movieId", requireAuth, async (req, res) => {
  try {
    const { movieId } = req.params;

    if (!movieId) {
      return res.status(400).json({
        success: false,
        message: "Movie ID is required",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if movie exists in user's collection
    const movieExists = user.savedMovies.some(
      (movie) => movie.movieId === parseInt(movieId)
    );

    if (!movieExists) {
      return res.status(404).json({
        success: false,
        message: "Movie not found in collection",
      });
    }

    // Remove movie from user's collection
    await user.removeMovie(parseInt(movieId));

    res.json({
      success: true,
      message: "Movie removed successfully",
    });
  } catch (error) {
    console.error("Error removing movie:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   POST /api/movies/toggle
// @desc    Toggle save/unsave movie
// @access  Private
router.post("/toggle", requireAuth, async (req, res) => {
  try {
    const {
      movieId,
      title,
      poster_path,
      release_date,
      vote_average,
      media_type,
    } = req.body;

    if (!movieId || !title || !media_type) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: movieId, title, media_type",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isAlreadySaved = user.savedMovies.some(
      (movie) => movie.movieId === parseInt(movieId)
    );

    if (isAlreadySaved) {
      // Remove movie
      await user.removeMovie(parseInt(movieId));
      res.json({
        success: true,
        action: "removed",
        message: "Movie removed from collection",
      });
    } else {
      // Add movie
      const movieData = {
        movieId: parseInt(movieId),
        title,
        poster_path,
        release_date,
        vote_average: parseFloat(vote_average) || 0,
        media_type,
      };

      await user.addMovie(movieData);
      res.json({
        success: true,
        action: "added",
        message: "Movie added to collection",
        data: movieData,
      });
    }
  } catch (error) {
    console.error("Error toggling movie:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

export default router;



























// import express from "express";
// import { requireAuth } from "../middleware/auth.js";

// const router = express.Router();

// // @route   GET /api/movies/saved
// // @desc    Get user's saved movies
// // @access  Private
// router.get("/saved", requireAuth, async (req, res) => {
//   try {
//     res.json({
//       success: true,
//       data: req.user.savedMovies,
//       count: req.user.savedMovies.length,
//     });
//   } catch (error) {
//     console.error("Error fetching saved movies:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// });

// // @route   POST /api/movies/save
// // @desc    Save a movie to user's collection
// // @access  Private
// router.post("/save", requireAuth, async (req, res) => {
//   try {
//     const {
//       movieId,
//       title,
//       poster_path,
//       release_date,
//       vote_average,
//       media_type,
//     } = req.body;

//     // Validate required fields
//     if (!movieId || !title || !media_type) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing required fields: movieId, title, media_type",
//       });
//     }

//     // Check if movie is already saved
//     const isAlreadySaved = req.user.savedMovies.some(
//       (movie) => movie.movieId === parseInt(movieId)
//     );

//     if (isAlreadySaved) {
//       return res.status(400).json({
//         success: false,
//         message: "Movie already saved",
//       });
//     }

//     // Add movie to user's collection
//     const movieData = {
//       movieId: parseInt(movieId),
//       title,
//       poster_path,
//       release_date,
//       vote_average: parseFloat(vote_average) || 0,
//       media_type,
//     };

//     await req.user.addMovie(movieData);

//     res.status(201).json({
//       success: true,
//       message: "Movie saved successfully",
//       data: movieData,
//     });
//   } catch (error) {
//     console.error("Error saving movie:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// });

// // @route   DELETE /api/movies/:movieId
// // @desc    Remove a movie from user's collection
// // @access  Private
// router.delete("/:movieId", requireAuth, async (req, res) => {
//   try {
//     const { movieId } = req.params;

//     // Remove movie from user's collection
//     await req.user.removeMovie(parseInt(movieId));

//     res.json({
//       success: true,
//       message: "Movie removed successfully",
//     });
//   } catch (error) {
//     console.error("Error removing movie:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// });

// export default router;