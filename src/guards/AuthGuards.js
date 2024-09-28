import PropTypes from "prop-types";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
// pages
import SignIn from "../pages/login/SignIn";
// components
import LoadingScreen from "../components/LoadingScreen";
import { AuthUser } from "src/redux/reducers/AuthReducer";
// firebase auth

// ----------------------------------------------------------------------
AuthGuard.propTypes = {
  children: PropTypes.node,
};
export default function AuthGuard({ children }) {
  const isUserLogin = useSelector((state) => state.AuthUser.user);

  const { pathname } = useLocation();
  const [requestedLocation, setRequestedLocation] = useState(null);

  if (!isUserLogin?.uid) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }
    return <SignIn />;
  }
  // Backup Plan

  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }
  return <>{children}</>;
}
