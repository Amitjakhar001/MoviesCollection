import axios from "axios";

const BASE_URL = "https://api.themoviedb.org/3";
const TMDB_TOKEN = import.meta.env.VITE_APP_TMDB_TOKEN;

const headers = {
  Authorization: "bearer " + TMDB_TOKEN,
};

export const fetchDataFromApi = async (url, params) => {
  try {
    const { data } = await axios.get(BASE_URL + url, {
      headers,
      params,
    });
    return data;
  } catch (err) {
    console.log(err);
    return err;
  }
};

// Create axios instance for our backend API
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  withCredentials: true,
});

// Request interceptor for debugging
apiClient.interceptors.request.use(
  (config) => {
    console.log("🔄 API Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error(
      "❌ API Error:",
      error.response?.status,
      error.response?.data
    );

    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.log("🔐 Unauthorized - clearing auth state");
      // We'll dispatch a logout action here
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  // Get current user
  getUser: () => apiClient.get("/auth/user"),

  // Logout
  logout: () => apiClient.post("/auth/logout"),

  // Google OAuth login (redirect)
  googleLogin: () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  },
};

// Movies API functions
export const moviesAPI = {
  // Get saved movies
  getSavedMovies: () => apiClient.get("/api/movies/saved"),

  // Save a movie
  saveMovie: (movieData) => apiClient.post("/api/movies/save", movieData),

  // Remove a movie
  removeMovie: (movieId) => apiClient.delete(`/api/movies/${movieId}`),

  // Toggle save/unsave
  toggleMovie: (movieData) => apiClient.post("/api/movies/toggle", movieData),
};



