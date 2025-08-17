import { fetchDataFromApi } from "../../utils/api.js";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper.jsx";
import MovieCard from "../../components/movieCard/MovieCard.jsx";
import Spinner from "../../components/spinner/Spinner.jsx";
import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

import "./style.scss";

const SearchResult = () => {
  const [data, setData] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(false);
  const { query } = useParams();

  const fetchInitialData = useCallback(() => {
    setLoading(true);
    fetchDataFromApi(`/search/multi?query=${query}&page=1`).then((res) => {
      setData(res);
      setPageNum(2); // Set to 2 since we just fetched page 1
      setLoading(false);
    });
  }, [query]);

  const fetchNextPageData = useCallback(() => {
    fetchDataFromApi(`/search/multi?query=${query}&page=${pageNum}`).then(
      (res) => {
        if (data?.results) {
          setData({
            ...data,
            results: [...(data.results || []), ...(res.results || [])],
          });
        } else {
          setData(res);
        }
        setPageNum((prev) => prev + 1);
      }
    );
  }, [query, pageNum, data]);

  useEffect(() => {
    setPageNum(1);
    fetchInitialData();
  }, [fetchInitialData]);

  return (
    <div className="searchResultsPage">
      {loading && <Spinner initial={true} />}
      {!loading && (
        <ContentWrapper>
          {data?.results?.length > 0 ? (
            <>
              <div className="pageTitle">
                {`Search ${
                  (data?.total_results || 0) > 1 ? "results" : "result"
                } of '${query}'`}
              </div>
              <InfiniteScroll
                className="content"
                dataLength={data?.results?.length || 0}
                next={fetchNextPageData}
                hasMore={pageNum <= (data?.total_pages || 0)}
                loader={<Spinner />}
              >
                {data?.results?.map((item, index) => {
                  if (item.media_type === "person") return null;
                  return (
                    <MovieCard key={index} data={item} fromSearch={true} />
                  );
                })}
              </InfiniteScroll>
            </>
          ) : (
            <span className="resultNotFound">Sorry, Results not found!</span>
          )}
        </ContentWrapper>
      )}
    </div>
  );
};

export default SearchResult;
