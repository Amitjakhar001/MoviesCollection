import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "../store/slices/authSlice.js";

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (loading && !user) {
      dispatch(checkAuth());
    }
  }, [dispatch, loading, user]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
  };
};

export default useAuth;
