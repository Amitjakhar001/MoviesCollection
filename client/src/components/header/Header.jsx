import React, { useState, useEffect, useRef, useCallback } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { SlMenu } from "react-icons/sl";
import { VscChromeClose } from "react-icons/vsc";
import { useNavigate, useLocation } from "react-router-dom";

import "./style.scss";
import ContentWrapper from "../contentWrapper/ContentWrapper.jsx";
import logo from "../../assets/movix-logo.png";
import LoginButton from "../auth/LoginButton.jsx";
import UserMenu from "../auth/UserMenu.jsx";
import useAuth from "../../hooks/useAuth.js";

const Header = () => {
  const [show, setShow] = useState("top");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Refs for detecting outside clicks
  const searchBarRef = useRef(null);
  // const mobileMenuRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const controlNavbar = useCallback(() => {
    if (window.scrollY > 200) {
      if (window.scrollY > lastScrollY && !mobileMenu) {
        setShow("hide");
      } else {
        setShow("show");
      }
    } else {
      setShow("top");
    }
    setLastScrollY(window.scrollY);
  }, [lastScrollY, mobileMenu]);

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [controlNavbar]);

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close search bar if clicking outside
      if (
        showSearch &&
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target) &&
        !event.target.closest(".header .menuItem svg") // Don't close if clicking search icon
      ) {
        setShowSearch(false);
        setQuery("");
      }

      // Close mobile menu if clicking outside
      if (
        mobileMenu &&
        headerRef.current &&
        !headerRef.current.contains(event.target)
      ) {
        setMobileMenu(false);
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showSearch, mobileMenu]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        if (showSearch) {
          setShowSearch(false);
          setQuery("");
        }
        if (mobileMenu) {
          setMobileMenu(false);
        }
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showSearch, mobileMenu]);

  const searchQueryHandler = (event) => {
    if (event.key === "Enter" && query.length > 0) {
      navigate(`/search/${query}`);
      setTimeout(() => {
        setShowSearch(false);
        setQuery("");
      }, 1000);
    }
  };

  const openSearch = () => {
    setMobileMenu(false);
    setShowSearch(true);
  };

  const closeSearch = () => {
    setShowSearch(false);
    setQuery("");
  };

  const openMobileMenu = () => {
    setMobileMenu(true);
    setShowSearch(false);
  };

  const closeMobileMenu = () => {
    setMobileMenu(false);
  };

  const navigationHandler = (type) => {
    if (type === "movie") {
      navigate("/explore/movie");
    } else {
      navigate("/explore/tv");
    }
    setMobileMenu(false);
  };

  return (
    <header
      ref={headerRef}
      className={`header ${mobileMenu ? "mobileView" : ""} ${show}`}
    >
      <ContentWrapper>
        <div className="logo" onClick={() => navigate("/")}>
          <img src={logo} alt="" />
        </div>
        <ul className="menuItems">
          <li className="menuItem" onClick={() => navigationHandler("movie")}>
            Movies
          </li>
          <li className="menuItem" onClick={() => navigationHandler("tv")}>
            TV Shows
          </li>
          {isAuthenticated && (
            <li className="menuItem" onClick={() => navigate("/collection")}>
              My Collection
            </li>
          )}
          <li className="menuItem">
            <HiOutlineSearch onClick={openSearch} />
          </li>
          {/* Auth Section */}
          <li className="menuItem authSection">
            {isAuthenticated ? <UserMenu /> : <LoginButton />}
          </li>
        </ul>

        <div className="mobileMenuItems">
          <HiOutlineSearch onClick={openSearch} />
          {isAuthenticated ? <UserMenu /> : <LoginButton />}
          {mobileMenu ? (
            <VscChromeClose onClick={closeMobileMenu} />
          ) : (
            <SlMenu onClick={openMobileMenu} />
          )}
        </div>
      </ContentWrapper>

      {showSearch && (
        <div ref={searchBarRef} className="searchBar">
          <ContentWrapper>
            <div className="searchInput">
              <input
                type="text"
                placeholder="Search for a movie or tv show...."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyUp={searchQueryHandler}
                autoFocus
              />
              <VscChromeClose
                onClick={closeSearch}
                className="closeSearchBtn"
              />
            </div>
          </ContentWrapper>
        </div>
      )}
    </header>
  );
};

export default Header;
