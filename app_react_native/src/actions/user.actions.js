import { userActionTypes } from "../constant";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../../config";

export const userActions = {
  login,
  logout,
};

function login(email, password) {
  return (dispatch) => {
    dispatch(request());
    if (email == "" || password == "") {
      dispatch(failure("All fields are required"));
    } else {
      const requestOptions = {
        method: "Post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      };
      fetch(`${config.API}/hospital/login`, requestOptions)
        .then(handleResponse)
        .then(async (res) => {
          dispatch(success(res.data));
        })
        .catch((err) => {
          if (err == "Invalide token")
            dispatch(logout())
          else
            dispatch(failure(err));
        });
    }
  };
  function request() {
    return { type: userActionTypes.LOGIN_REQUEST };
  }
  function success(user) {
    return { type: userActionTypes.LOGIN_SUCCESS, user };
  }
  function failure(error) {
    return { type: userActionTypes.LOGIN_FAILURE, error };
  }
}

function logout() {
  return async (dispatch) => {
    await AsyncStorage.removeItem("user").then(() => {
      dispatch(success());
    });
  }
  function success() {
    return { type: userActionTypes.LOGOUT };
  }
};



export function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }
    return data;
  });
}
