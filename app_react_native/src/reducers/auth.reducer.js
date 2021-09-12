import { userActionTypes } from "../constant";

const reducer = (state = {}, action) => {
  switch (action.type) {
    case userActionTypes.LOGOUT:
      return {};
    case userActionTypes.LOGIN_REQUEST:
      return { loading: true };
    case userActionTypes.LOGIN_SUCCESS:
      return { user: action.user, loggedIn: true };
    case userActionTypes.LOGIN_FAILURE:
      alert(action.error);
      return {};
    default:
      return state;
  }
};

export default reducer;
