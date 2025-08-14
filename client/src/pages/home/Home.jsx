import React from "react";
import "./style.scss";

import HeroBanner from "./heroBanner/HeroBanner.jsx";
import Trending from "./trending/Trending.jsx";
import Popular from "./popular/Popular.jsx";
import TopRated from "./topRated/TopRated.jsx";

const Home = () => {
  return (
    <div className="homePage">
      <HeroBanner />
      <Trending />
      <Popular />
      <TopRated />
    </div>
  );
};

export default Home;
