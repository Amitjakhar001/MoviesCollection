import React, { useRef } from "react";
import {
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill,
} from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import dayjs from "dayjs";
import toast from "react-hot-toast";

import ContentWrapper from "../contentWrapper/ContentWrapper.jsx";
import Img from "../lazyLoadImage/Img.jsx";
import PosterFallback from "../../assets/no-poster.png";
import CircleRating from "../circleRating/CircleRating.jsx";
import Genres from "../genres/Genres.jsx";
import { saveMovie, removeMovie } from "../../store/slices/moviesSlice.js";
import useAuth from "../../hooks/useAuth.js";

import "./style.scss";

const Carousel = ({ data, loading, endpoint, title }) => {
  const carouselContainer = useRef();
  const { url } = useSelector((state) => state.home);
  const { savedMovies } = useSelector((state) => state.movies);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const navigation = (dir) => {
    const container = carouselContainer.current;

    const scrollAmount =
      dir === "left"
        ? container.scrollLeft - (container.offsetWidth + 20)
        : container.scrollLeft + (container.offsetWidth + 20);

    container.scrollTo({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  const handleSaveToggle = async (e, item) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please login to save movies");
      return;
    }

    const isSaved = savedMovies.some((movie) => movie.movieId === item.id);

    try {
      if (isSaved) {
        await dispatch(removeMovie(item.id)).unwrap();
        toast.success("Movie removed from collection");
      } else {
        const movieData = {
          movieId: item.id,
          title: item.title || item.name,
          poster_path: item.poster_path,
          release_date: item.release_date || item.first_air_date,
          vote_average: item.vote_average,
          media_type: item.media_type || endpoint,
        };
        await dispatch(saveMovie(movieData)).unwrap();
        toast.success("Movie saved to collection");
      }
    } catch (error) {
      toast.error(error || "Something went wrong");
    }
  };

  const skItem = () => {
    return (
      <div className="skeletonItem">
        <div className="posterBlock skeleton"></div>
        <div className="textBlock">
          <div className="title skeleton"></div>
          <div className="date skeleton"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="carousel">
      <ContentWrapper>
        {title && <div className="carouselTitle">{title}</div>}
        <BsFillArrowLeftCircleFill
          className="carouselLeftNav arrow"
          onClick={() => navigation("left")}
        />
        <BsFillArrowRightCircleFill
          className="carouselRighttNav arrow"
          onClick={() => navigation("right")}
        />
        {!loading ? (
          <div className="carouselItems" ref={carouselContainer}>
            {data?.map((item) => {
              const posterUrl = item.poster_path
                ? url.poster + item.poster_path
                : PosterFallback;

              const isSaved = savedMovies.some(
                (movie) => movie.movieId === item.id
              );

              return (
                <div
                  key={item.id}
                  className="carouselItem"
                  onClick={() =>
                    navigate(`/${item.media_type || endpoint}/${item.id}`)
                  }
                >
                  <div className="posterBlock">
                    <Img src={posterUrl} />
                    <CircleRating rating={item.vote_average.toFixed(1)} />
                    <Genres data={item.genre_ids.slice(0, 2)} />

                    {/* Save Button */}
                    <button
                      className={`saveButton ${isSaved ? "saved" : ""}`}
                      onClick={(e) => handleSaveToggle(e, item)}
                      title={
                        isSaved
                          ? "Remove from collection"
                          : "Save to collection"
                      }
                    >
                      {isSaved ? <FaBookmark /> : <FaRegBookmark />}
                    </button>
                  </div>
                  <div className="textBlock">
                    <span className="title">{item.title || item.name}</span>
                    <span className="date">
                      {dayjs(item.release_date || item.first_air_date).format(
                        "MMM D, YYYY"
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="loadingSkeleton">
            {skItem()}
            {skItem()}
            {skItem()}
            {skItem()}
            {skItem()}
          </div>
        )}
      </ContentWrapper>
    </div>
  );
};

export default Carousel;
