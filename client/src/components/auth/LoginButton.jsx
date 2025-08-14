import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaGoogle } from "react-icons/fa";
import { googleLogin } from "../../store/slices/authSlice.js";
import "./style.scss";

const LoginButton = () => {
  const dispatch = useDispatch();
  const { loginLoading } = useSelector((state) => state.auth);

  const handleLogin = () => {
    dispatch(googleLogin());
  };

  return (
    <button
      className={`loginButton ${loginLoading ? "loading" : ""}`}
      onClick={handleLogin}
      disabled={loginLoading}
    >
      <FaGoogle />
      <span>{loginLoading ? "Signing in..." : "Login with Google"}</span>
    </button>
  );
};

export default LoginButton;
