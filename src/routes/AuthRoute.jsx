import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AuthRoute = ({ children, activate }) => {
  const auth = useSelector((state) => state.auth);
  return auth.isAuth ? (
    activate && auth.status === 0 ? (
      <Navigate to="/activate" />
    ) : (
      children
    )
  ) : (
    <Navigate to="/" />
  );
};

export default AuthRoute;
