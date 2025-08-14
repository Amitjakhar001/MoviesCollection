import mongoose from "mongoose";

const savedMovieSchema = new mongoose.Schema({
  movieId: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  poster_path: {
    type: String,
    default: null,
  },
  release_date: {
    type: String,
    default: null,
  },
  vote_average: {
    type: Number,
    default: 0,
  },
  media_type: {
    type: String,
    enum: ["movie", "tv"],
    required: true,
  },
  savedAt: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    savedMovies: [savedMovieSchema],
  },
  {
    timestamps: true,
  }
);

// Instance method to add movie
userSchema.methods.addMovie = function (movieData) {
  const isAlreadySaved = this.savedMovies.some(
    (movie) => movie.movieId === movieData.movieId
  );

  if (!isAlreadySaved) {
    this.savedMovies.push(movieData);
    return this.save();
  }
  return Promise.resolve(this);
};

// Instance method to remove movie
userSchema.methods.removeMovie = function (movieId) {
  this.savedMovies = this.savedMovies.filter(
    (movie) => movie.movieId !== movieId
  );
  return this.save();
};

export default mongoose.model("User", userSchema);
