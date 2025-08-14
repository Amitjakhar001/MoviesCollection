import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/slices/authSlice.js";
import { FaUser, FaSignOutAlt, FaBookmark } from "react-icons/fa";
import "./style.scss";

const UserMenu = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { savedMovies } = useSelector((state) => state.movies);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      setShowMenu(false);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleCollectionClick = () => {
    navigate("/collection");
    setShowMenu(false);
  };

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMenu && !event.target.closest(".userMenu")) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  return (
    <div className="userMenu">
      <div className="userAvatar" onClick={() => setShowMenu(!showMenu)}>
        <img src={user?.avatar} alt={user?.name} />
      </div>

      {showMenu && (
        <div className="userDropdown">
          <div className="userInfo">
            <img src={user?.avatar} alt={user?.name} />
            <div>
              <div className="userName">{user?.name}</div>
              <div className="userEmail">{user?.email}</div>
            </div>
          </div>

          <div className="menuItems">
            <button className="menuItem" onClick={handleCollectionClick}>
              <FaBookmark />
              <span>My Collection ({savedMovies.length})</span>
            </button>

            <button className="menuItem logoutBtn" onClick={handleLogout}>
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
