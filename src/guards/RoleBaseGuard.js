import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
// Auth And Role

import { useSelector } from "react-redux";
import { AuthUser } from "src/redux/reducers/AuthReducer";

// ----------------------------------------------------------------------

RoleBasedGuard.propTypes = {
  accessibleRoles: PropTypes.array, // Example ['admin', 'leader']
  children: PropTypes.node,
};

export default function RoleBasedGuard({ accessibleRoles, children }) {
  const userRole = useSelector((state) => state.AuthUser.userRole.role);
  let navigate = useNavigate();

  useEffect(() => {
    if (!accessibleRoles.includes(userRole)) {
      navigate(-1);
    }
  });

  return <>{children}</>;

  // ;
}
