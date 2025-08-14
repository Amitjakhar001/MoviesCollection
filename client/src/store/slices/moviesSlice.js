import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { moviesAPI } from "../../utils/api.js";

// Async thunk for fetching saved movies
export const fetchSavedMovies = createAsyncThunk(
  "movies/fetchSavedMovies",
  async (_, { rejectWithValue }) => {
    try {
      const response = await moviesAPI.getSavedMovies();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch saved movies"
      );
    }
  }
);

// Async thunk for saving a movie
export const saveMovie = createAsyncThunk(
  "movies/saveMovie",
  async (movieData, { rejectWithValue }) => {
    try {
      const response = await moviesAPI.saveMovie(movieData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to save movie"
      );
    }
  }
);

// Async thunk for removing a movie
export const removeMovie = createAsyncThunk(
  "movies/removeMovie",
  async (movieId, { rejectWithValue }) => {
    try {
      await moviesAPI.removeMovie(movieId);
      return movieId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove movie"
      );
    }
  }
);

// Async thunk for toggling save/unsave
export const toggleSaveMovie = createAsyncThunk(
  "movies/toggleSaveMovie",
  async (movieData, { rejectWithValue, getState }) => {
    try {
      const { movies } = getState();
      const isAlreadySaved = movies.savedMovies.some(
        (movie) => movie.movieId === movieData.movieId
      );

      if (isAlreadySaved) {
        await moviesAPI.removeMovie(movieData.movieId);
        return { action: "removed", movieId: movieData.movieId };
      } else {
        const response = await moviesAPI.saveMovie(movieData);
        return { action: "added", data: response.data.data };
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to toggle movie"
      );
    }
  }
);

const moviesSlice = createSlice({
  name: "movies",
  initialState: {
    savedMovies: [],
    loading: false,
    error: null,
    saveLoading: {},
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSaveLoading: (state, action) => {
      const { movieId, loading } = action.payload;
      state.saveLoading[movieId] = loading;
    },
    clearMovies: (state) => {
      state.savedMovies = [];
      state.saveLoading = {};
      state.error = null;
    },
    // Optimistic update for better UX
    optimisticSaveMovie: (state, action) => {
      const movieData = action.payload;
      const isAlreadySaved = state.savedMovies.some(
        (movie) => movie.movieId === movieData.movieId
      );

      if (!isAlreadySaved) {
        state.savedMovies.push(movieData);
      }
    },
    optimisticRemoveMovie: (state, action) => {
      const movieId = action.payload;
      state.savedMovies = state.savedMovies.filter(
        (movie) => movie.movieId !== movieId
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch saved movies
      .addCase(fetchSavedMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSavedMovies.fulfilled, (state, action) => {
        state.savedMovies = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchSavedMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Save movie
      .addCase(saveMovie.fulfilled, (state, action) => {
        const newMovie = action.payload;
        const isAlreadySaved = state.savedMovies.some(
          (movie) => movie.movieId === newMovie.movieId
        );
        if (!isAlreadySaved) {
          state.savedMovies.push(newMovie);
        }
        state.error = null;
      })
      .addCase(saveMovie.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Remove movie
      .addCase(removeMovie.fulfilled, (state, action) => {
        state.savedMovies = state.savedMovies.filter(
          (movie) => movie.movieId !== action.payload
        );
        state.error = null;
      })
      .addCase(removeMovie.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Toggle save movie
      .addCase(toggleSaveMovie.fulfilled, (state, action) => {
        const { action: actionType, movieId, data } = action.payload;

        if (actionType === "removed") {
          state.savedMovies = state.savedMovies.filter(
            (movie) => movie.movieId !== movieId
          );
        } else if (actionType === "added") {
          const isAlreadySaved = state.savedMovies.some(
            (movie) => movie.movieId === data.movieId
          );
          if (!isAlreadySaved) {
            state.savedMovies.push(data);
          }
        }
        state.error = null;
      })
      .addCase(toggleSaveMovie.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  setSaveLoading,
  clearMovies,
  optimisticSaveMovie,
  optimisticRemoveMovie,
} = moviesSlice.actions;
export default moviesSlice.reducer;
