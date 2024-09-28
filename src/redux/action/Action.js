function setUser(user) {
  return {
    type: "SET_USER",
    payload: user,
  };
}
function EditManufacturer(item) {
  return {
    type: "SET_USER_TO_EDIT",
    payload: item,
  };
}
function setUserRole(data) {
  return {
    type: "SET_USER_ROLE",
    payload: data,
  };
}
function logoutUser() {
  return {
    type: "LOGOUT_USER",
  };
}

export { setUser, setUserRole, logoutUser, EditManufacturer };
