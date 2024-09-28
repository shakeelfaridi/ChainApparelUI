const initialState = {};
export const AuthUser = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_USER_ROLE":
      return { ...state, userRole: action.payload };
    case "SET_USER_TO_EDIT":
      return { ...state, editUser: action.payload };
    case "LOGOUT_USER":
      return (state = {});

    default:
      return state;
  }
};
