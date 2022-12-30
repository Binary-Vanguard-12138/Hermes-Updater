import { createContext, useCallback, useEffect, useReducer } from "react";

import axios from "../utils/axios";
import { isValidToken, setSession } from "../utils/jwt";

const INITIALIZE = "INITIALIZE";
const SIGN_IN = "SIGN_IN";
const SIGN_OUT = "SIGN_OUT";
const SIGN_UP = "SIGN_UP";
const SET_USER = "SET_USER";

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const JWTReducer = (state, action) => {
  switch (action.type) {
    case INITIALIZE:
      return {
        isAuthenticated: action.payload.isAuthenticated,
        isInitialized: true,
        user: action.payload.user,
      };
    case SIGN_IN:
    case SET_USER:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };
    case SIGN_OUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };

    case SIGN_UP:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };

    default:
      return state;
  }
};

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(JWTReducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem("accessToken");

        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);

          const response = await axios.get("/api/auth");
          const { user } = response.data;

          dispatch({
            type: INITIALIZE,
            payload: {
              isAuthenticated: true,
              user,
            },
          });
        } else {
          dispatch({
            type: INITIALIZE,
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: INITIALIZE,
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
  }, []);

  const signIn = useCallback(async (values) => {
    const { email, password, remember } = values;
    if (remember) {
      localStorage.setItem("email", email);
      localStorage.setItem("remember", true);
    } else {
      localStorage.removeItem("email");
      localStorage.removeItem("remember");
    }

    const response = await axios.post("/auth/login", {
      email,
      password,
    });
    const user = response.data;

    setSession(user?.jwtToken);
    dispatch({
      type: SIGN_IN,
      payload: {
        user,
      },
    });
  }, []);

  const signOut = useCallback(async () => {
    setSession(null);
    dispatch({ type: SIGN_OUT });
  }, []);

  const signUp = useCallback(async (values) => {
    const response = await axios.post("/auth/register", values);
    return response.data;
  }, []);

  const resetPassword = (email) => console.log(email);

  const updateProfile = useCallback(async (values) => {
    const response = await axios.patch("/auth", values);
    const user = response.data;
    dispatch({
      type: SET_USER,
      payload: {
        user: user,
      },
    });
    if (response && response.data) {
      return true;
    } else {
      return false;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: "jwt",
        signIn,
        signOut,
        signUp,
        resetPassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
