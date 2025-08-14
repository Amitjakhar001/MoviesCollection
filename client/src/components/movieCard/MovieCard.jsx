import React, { useState } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { toast } from "react-hot-toast"; // We'll install this

import "./style.scss";
import Img from "../lazyLoadImage/Img.jsx";
import CircleRating from "../circleRating/CircleRating.jsx";
import Genres from "../genres/Genres.jsx";
import PosterFallback from "../../assets/no-poster.png";
import { toggleSaveMovie } from "../../store/slices/moviesSlice.js";
import useAuth from "../../hooks/useAuth.js";

const MovieCard = ({ data, fromSearch, mediaType }) => {
  const { url } = useSelector((state) => state.home);
  const { savedMovies } = useSelector((state) => state.movies);
  const { isAuthenticated } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [saveLoading, setSaveLoading] = useState(false);

  const posterUrl = data.poster_path
    ? url.poster + data.poster_path
    : PosterFallback;

  // Check if movie is saved
  const isSaved = savedMovies.some((movie) => movie.movieId === data.id);

  const handleSaveToggle = async (e) => {
    e.stopPropagation(); // Prevent navigation when clicking save button

    if (!isAuthenticated) {
      toast.error("Please login to save movies");
      return;
    }

    setSaveLoading(true);

    try {
      const movieData = {
        movieId: data.id,
        title: data.title || data.name,
        poster_path: data.poster_path,
        release_date: data.release_date || data.first_air_date,
        vote_average: data.vote_average,
        media_type: data.media_type || mediaType,
      };

      await dispatch(toggleSaveMovie(movieData)).unwrap();

      if (isSaved) {
        toast.success("Movie removed from collection");
      } else {
        toast.success("Movie saved to collection");
      }
    } catch (error) {
      toast.error(error || "Something went wrong");
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div
      className="movieCard"
      onClick={() => navigate(`/${data.media_type || mediaType}/${data.id}`)}
    >
      <div className="posterBlock">
        <Img className="posterImg" src={posterUrl} />
        {!fromSearch && (
          <React.Fragment>
            <CircleRating rating={data.vote_average?.toFixed(1)} />
            <Genres data={data.genre_ids?.slice(0, 2)} />
          </React.Fragment>
        )}

        {/* Save Button - Show for all users but only functional for authenticated */}
        <button
          className={`saveButton ${isSaved ? "saved" : ""} ${
            saveLoading ? "loading" : ""
          }`}
          onClick={handleSaveToggle}
          disabled={saveLoading}
          title={
            isAuthenticated
              ? isSaved
                ? "Remove from collection"
                : "Save to collection"
              : "Login to save movies"
          }
        >
          {saveLoading ? (
            <div className="spinner"></div>
          ) : isSaved ? (
            <FaBookmark />
          ) : (
            <FaRegBookmark />
          )}
        </button>
      </div>
      <div className="textBlock">
        <span className="title">{data.title || data.name}</span>
        <span className="date">
          {dayjs(data.release_date || data.first_air_date).format(
            "MMM D, YYYY"
          )}
        </span>
      </div>
    </div>
  );
};

export default MovieCard;
