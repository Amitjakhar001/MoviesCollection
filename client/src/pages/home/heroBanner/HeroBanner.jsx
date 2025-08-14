// Update imports in the copied HeroBanner.jsx
import useFetch from "../../../hooks/useFetch.js";
import Img from "../../../components/lazyLoadImage/Img.jsx";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper.jsx";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./style.scss";



const HeroBanner = () => {
    const [background, setBackground] = useState("");
    const [query, setQuery] = useState("");
    const navigate = useNavigate();
    const { url } = useSelector((state) => state.home);
    const { data, loading } = useFetch("/movie/upcoming");

    useEffect(() => {
        const bg =
            url.backdrop +
            data?.results?.[Math.floor(Math.random() * 20)]?.backdrop_path;
        setBackground(bg);
    }, [data]);

    const searchQueryHandler = () => {
        if (query.length > 0) {
            navigate(`/search/${query}`);
        }
    };

    const handleInputChange = (event) => {
        setQuery(event.target.value);
    };

    return (
        <div className="heroBanner">
            {!loading && (
                <div className="backdrop-img">
                    <Img src={background} />
                </div>
            )}

            <div className="opacity-layer"></div>
            <ContentWrapper>
                <div className="heroBannerContent">
                    <span className="title">Welcome.</span>
                    <span className="subTitle">
                        Explore your Movies and watch Trailers also find what's coming <span className="next-word">NEXT</span>
                    </span>
                    <div className="searchInput">
                        <input
                            type="text"
                            placeholder="Search for a movie or tv show...."
                            onChange={handleInputChange}
                            value={query}
                            onKeyUp={(e) => {
                                if (e.key === "Enter") {
                                    searchQueryHandler();
                                }
                            }}
                        />
                        <button
                            onClick={searchQueryHandler}
                            disabled={query.length === 0}
                        >
                            Search
                        </button>
                    </div>
                </div>
            </ContentWrapper>
        </div>
    );
};

export default HeroBanner;