import React, { useEffect, useCallback } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Toaster } from "react-hot-toast";
import { fetchDataFromApi } from "./utils/api.js";
import { getApiConfiguration, getGenres } from "./store/slices/homeSlice.js";
import { checkAuth } from "./store/slices/authSlice.js";
import { fetchSavedMovies } from "./store/slices/moviesSlice.js";
import useAuth from "./hooks/useAuth.js";

// Components
import Header from "./components/header/Header.jsx";
import Footer from "./components/footer/Footer.jsx";
import Spinner from "./components/spinner/Spinner.jsx";

// Pages
import Home from "./pages/home/Home.jsx";
import Details from "./pages/details/Details.jsx";
import SearchResult from "./pages/searchResult/SearchResult.jsx";
import Explore from "./pages/explore/Explore.jsx";
import Collection from "./pages/collection/Collection.jsx";
import PageNotFound from "./pages/404/PageNotFound.jsx";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const fetchApiConfig = useCallback(() => {
    fetchDataFromApi("/configuration").then((res) => {
      const url = {
        backdrop: res.images.secure_base_url + "original",
        poster: res.images.secure_base_url + "original",
        profile: res.images.secure_base_url + "original",
      };
      dispatch(getApiConfiguration(url));
    });
  }, [dispatch]);

  const genresCall = useCallback(async () => {
    let promises = [];
    let endPoints = ["tv", "movie"];
    let allGenres = {};

    endPoints.forEach((url) => {
      promises.push(fetchDataFromApi(`/genre/${url}/list`));
    });

    const data = await Promise.all(promises);
    data.map(({ genres }) => {
      return genres.map((item) => (allGenres[item.id] = item));
    });

    dispatch(getGenres(allGenres));
  }, [dispatch]);

  useEffect(() => {
    fetchApiConfig();
    genresCall();

    // Check authentication status on app load
    dispatch(checkAuth());
  }, [dispatch, fetchApiConfig, genresCall]);

  // Fetch saved movies when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchSavedMovies());
    }
  }, [isAuthenticated, dispatch]);

  // Show loading spinner while checking authentication
  if (authLoading) {
    return <Spinner initial={true} />;
  }

  return (
    <>
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "var(--black3)",
            color: "white",
            border: "1px solid var(--pink)",
          },
          success: {
            iconTheme: {
              primary: "var(--pink)",
              secondary: "white",
            },
          },
          error: {
            iconTheme: {
              primary: "#ff4444",
              secondary: "white",
            },
          },
        }}
      />

      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:mediaType/:id" element={<Details />} />
        <Route path="/search/:query" element={<SearchResult />} />
        <Route path="/explore/:mediaType" element={<Explore />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
