import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaBookmark, FaRegBookmark, FaPlay } from "react-icons/fa";
import dayjs from "dayjs";
import toast from "react-hot-toast";

import "./style.scss";

import ContentWrapper from "../../../components/contentWrapper/ContentWrapper.jsx";
import useFetch from "../../../hooks/useFetch.js";
import useAuth from "../../../hooks/useAuth.js";
import Genres from "../../../components/genres/Genres.jsx";
import CircleRating from "../../../components/circleRating/CircleRating.jsx";
import Img from "../../../components/lazyLoadImage/Img.jsx";
import PosterFallback from "../../../assets/no-poster.png";
import { PlayIcon } from "../Playbtn.jsx";
import VideoPopup from "../../../components/videoPopup/VideoPopup.jsx";
import { saveMovie, removeMovie } from "../../../store/slices/moviesSlice.js";

const DetailsBanner = ({ video, crew }) => {
  const [show, setShow] = useState(false);
  const [videoId, setVideoId] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);

  const { mediaType, id } = useParams();
  const { data, loading } = useFetch(`/${mediaType}/${id}`);
  const { url } = useSelector((state) => state.home);
  const { savedMovies } = useSelector((state) => state.movies);
  const { isAuthenticated } = useAuth();
  const dispatch = useDispatch();

  const _genres = data?.genres?.map((g) => g.id);

  const director = crew?.filter((f) => f.job === "Director");
  const writer = crew?.filter(
    (f) => f.job === "Screenplay" || f.job === "Story" || f.job === "Writer"
  );

  const toHoursAndMinutes = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`;
  };

  // Check if movie is saved
  const isSaved = savedMovies.some((movie) => movie.movieId === parseInt(id));

  const handleSaveToggle = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to save movies");
      return;
    }

    setSaveLoading(true);

    try {
      if (isSaved) {
        await dispatch(removeMovie(parseInt(id))).unwrap();
        toast.success("Movie removed from collection");
      } else {
        const movieData = {
          movieId: parseInt(id),
          title: data.name || data.title,
          poster_path: data.poster_path,
          release_date: data.release_date || data.first_air_date,
          vote_average: data.vote_average,
          media_type: mediaType,
        };
        await dispatch(saveMovie(movieData)).unwrap();
        toast.success("Movie saved to collection");
      }
    } catch (error) {
      toast.error(error || "Something went wrong");
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="detailsBanner">
      {!loading ? (
        <>
          {!!data && (
            <React.Fragment>
              <div className="backdrop-img">
                <Img src={url.backdrop + data.backdrop_path} />
              </div>
              <div className="opacity-layer"></div>
              <ContentWrapper>
                <div className="content">
                  <div className="left">
                    {data.poster_path ? (
                      <Img
                        className="posterImg"
                        src={url.backdrop + data.poster_path}
                      />
                    ) : (
                      <Img className="posterImg" src={PosterFallback} />
                    )}
                  </div>
                  <div className="right">
                    <div className="title">
                      {`${data.name || data.title} (${dayjs(
                        data?.release_date
                      ).format("YYYY")})`}
                    </div>
                    <div className="subtitle">{data.tagline}</div>

                    <Genres data={_genres} />

                    <div className="row">
                      <CircleRating rating={data.vote_average.toFixed(1)} />
                      {video && (
                        // In DetailsBanner.jsx
                        <div
                          className="playbtn"
                          onClick={() => {
                            console.log(
                              "Play button clicked, videoId:",
                              video?.key
                            );
                            setShow(true);
                            setVideoId(video.key);
                          }}
                        >
                          <PlayIcon />
                          <span className="text">Watch Trailer</span>
                        </div>
                      )}

                      {/* Save Button */}
                      <button
                        className={`detailsSaveBtn ${isSaved ? "saved" : ""} ${
                          saveLoading ? "loading" : ""
                        }`}
                        onClick={handleSaveToggle}
                        disabled={saveLoading}
                        title={
                          isSaved
                            ? "Remove from collection"
                            : "Save to collection"
                        }
                      >
                        {saveLoading ? (
                          <div className="spinner"></div>
                        ) : (
                          <>
                            {isSaved ? <FaBookmark /> : <FaRegBookmark />}
                            <span>{isSaved ? "Saved" : "Save"}</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="overview">
                      <div className="heading">Overview</div>
                      <div className="description">{data.overview}</div>
                    </div>

                    <div className="info">
                      {data.status && (
                        <div className="infoItem">
                          <span className="text bold">Status: </span>
                          <span className="text">{data.status}</span>
                        </div>
                      )}
                      {data.release_date && (
                        <div className="infoItem">
                          <span className="text bold">Release Date: </span>
                          <span className="text">
                            {dayjs(data.release_date).format("MMM D, YYYY")}
                          </span>
                        </div>
                      )}
                      {data.runtime && (
                        <div className="infoItem">
                          <span className="text bold">Runtime: </span>
                          <span className="text">
                            {toHoursAndMinutes(data.runtime)}
                          </span>
                        </div>
                      )}
                    </div>

                    {director?.length > 0 && (
                      <div className="info">
                        <span className="text bold">Director: </span>
                        <span className="text">
                          {director?.map((d, i) => (
                            <span key={i}>
                              {d.name}
                              {director.length - 1 !== i && ", "}
                            </span>
                          ))}
                        </span>
                      </div>
                    )}

                    {writer?.length > 0 && (
                      <div className="info">
                        <span className="text bold">Writer: </span>
                        <span className="text">
                          {writer?.map((d, i) => (
                            <span key={i}>
                              {d.name}
                              {writer.length - 1 !== i && ", "}
                            </span>
                          ))}
                        </span>
                      </div>
                    )}

                    {data?.created_by?.length > 0 && (
                      <div className="info">
                        <span className="text bold">Creator: </span>
                        <span className="text">
                          {data?.created_by?.map((d, i) => (
                            <span key={i}>
                              {d.name}
                              {data?.created_by.length - 1 !== i && ", "}
                            </span>
                          ))}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <VideoPopup
                  show={show}
                  setShow={setShow}
                  videoId={videoId}
                  setVideoId={setVideoId}
                />
              </ContentWrapper>
            </React.Fragment>
          )}
        </>
      ) : (
        <div className="detailsBannerSkeleton">
          <ContentWrapper>
            <div className="left skeleton"></div>
            <div className="right">
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
            </div>
          </ContentWrapper>
        </div>
      )}
    </div>
  );
};

export default DetailsBanner;
