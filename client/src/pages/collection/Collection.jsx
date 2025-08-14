import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import "./style.scss";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper.jsx";
import MovieCard from "../../components/movieCard/MovieCard.jsx";
import Spinner from "../../components/spinner/Spinner.jsx";
import { fetchSavedMovies } from "../../store/slices/moviesSlice.js";
import useAuth from "../../hooks/useAuth.js";

const Collection = () => {
  const { isAuthenticated, user } = useAuth();
  const { savedMovies, loading } = useSelector((state) => state.movies);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchSavedMovies());
    }
  }, [isAuthenticated, dispatch]);

  if (!isAuthenticated) {
    return (
      <div className="collectionPage">
        <ContentWrapper>
          <div className="notAuthenticated">
            <h1>Please login to view your collection</h1>
            <p>Save your favorite movies and TV shows to access them here</p>
            <button onClick={() => navigate("/")} className="homeButton">
              Go to Home
            </button>
          </div>
        </ContentWrapper>
      </div>
    );
  }

  if (loading) {
    return <Spinner initial={true} />;
  }

  return (
    <div className="collectionPage">
      <ContentWrapper>
        <div className="pageHeader">
          <h1>My Collection</h1>
          <p>Welcome back, {user?.name}!</p>
          <div className="stats">
            <span>
              {savedMovies.length} saved{" "}
              {savedMovies.length === 1 ? "item" : "items"}
            </span>
          </div>
        </div>

        {savedMovies.length > 0 ? (
          <div className="content">
            {savedMovies.map((item, index) => (
              <MovieCard
                key={`${item.movieId}-${index}`}
                data={{
                  id: item.movieId,
                  title: item.title,
                  name: item.title,
                  poster_path: item.poster_path,
                  release_date: item.release_date,
                  first_air_date: item.release_date,
                  vote_average: item.vote_average,
                  media_type: item.media_type,
                }}
                mediaType={item.media_type}
                fromSearch={false}
              />
            ))}
          </div>
        ) : (
          <div className="emptyCollection">
            <h2>Your collection is empty</h2>
            <p>Start exploring movies and TV shows to build your collection!</p>
            <button onClick={() => navigate("/")} className="exploreButton">
              Explore Movies
            </button>
          </div>
        )}
      </ContentWrapper>
    </div>
  );
};

export default Collection;
