import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
// hooks
import { AuthUser } from "src/redux/reducers/AuthReducer";

// routes
import { PATH_DASHBOARD } from "../routes/paths";
// ----------------------------------------------------------------------
GuestGuard.propTypes = {
  children: PropTypes.node,
};
export default function GuestGuard({ children }) {
  const user = useSelector((state) => state.AuthUser.user);
  if (!user) {
    return <>{children}</>;
  } else {
    return <Navigate to={PATH_DASHBOARD.root} />;
  }
}
