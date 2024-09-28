import React from "react";
import { useSelector } from "react-redux";
import { AuthUser } from "src/redux/reducers/AuthReducer";

export default function useLoggedUser() {
  const user = useSelector((state) => state.AuthUser.userRole);
  return user;
}
