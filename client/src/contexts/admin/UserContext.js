import { createContext, useCallback, useReducer } from "react";

import axios from "../../utils/axios/v1/adminAxios";

const GET_USER = "GET_USER";
const SET_CURRENT_STATUS = "SET_CURRENT_STATUS";
const SET_TOTAL_USER_COUNT = "SET_TOTAL_USER_COUNT";
const SET_ERROR = "SET_ERROR";

const initialState = {
  users: null,
  total_user_count: 0,
  from: 0,
  rows_per_page: 5,
  errMsg: null,
};

const UserReducer = (state, action) => {
  switch (action.type) {
    case GET_USER:
      return {
        ...state,
        users: action.payload.users,
      };
    case SET_CURRENT_STATUS:
      return {
        ...state,
        rows_per_page: action.payload.rows_per_page,
        from: action.payload.from,
      };
    case SET_TOTAL_USER_COUNT:
      return {
        ...state,
        total_user_count: action.payload.total_user_count,
      };
    case SET_ERROR:
      return {
        ...state,
        errMsg: action.payload.errMsg,
      };
    default:
      return state;
  }
};

const UserContext = createContext(null);

function UserProvider({ children }) {
  const [state, dispatch] = useReducer(UserReducer, initialState);

  const setErr = useCallback((msg) => {
    dispatch({
      type: SET_ERROR,
      payload: {
        errMsg: msg,
      },
    });
  }, []);
  const getUsers = useCallback(
    async (rows_per_page, from, init = true) => {
      if (init) {
        dispatch({
          type: SET_TOTAL_USER_COUNT,
          payload: {
            total_user_count: 0,
          },
        });
      }
      dispatch({
        type: GET_USER,
        payload: {
          users: null,
        },
      });
      dispatch({
        type: SET_CURRENT_STATUS,
        payload: {
          rows_per_page,
          from,
        },
      });
      try {
        const response = await axios.get("user", {
          params: {
            from: from,
            size: rows_per_page,
          },
        });
        dispatch({
          type: GET_USER,
          payload: {
            users: response.data.data,
          },
        });
        dispatch({
          type: SET_TOTAL_USER_COUNT,
          payload: {
            total_user_count: response.data.total,
          },
        });
      } catch (err) {
        setErr(err.message);
        dispatch({
          type: GET_USER,
          payload: {
            users: [],
          },
        });
        dispatch({
          type: SET_TOTAL_USER_COUNT,
          payload: {
            total_user_count: 0,
          },
        });
      }
    },
    [setErr]
  );

  const viewUser = useCallback(
    async (uid) => {
      try {
        const response = await axios.get(`user/${uid}`);
        return response.data;
      } catch (err) {
        setErr(err.message);
        return false;
      }
    },
    [setErr]
  );

  /*
  const createUser = useCallback(
    async (values) => {
      try {
        await axios.put("user", values);
        getUsers(state.rows_per_page, 0);
      } catch (err) {
        setErr(err.message);
      }
    },
    [getUsers, setErr, state.rows_per_page]
  );

  const updateUser = useCallback(
    async (uid, value) => {
      try {
        await axios.post("user", {
          uid,
          title: value.title,
        });
        getUsers(state.rows_per_page, 0);
      } catch (err) {
        setErr(err.message);
      }
    },
    [getUsers, setErr, state.rows_per_page]
  );

  const deleteUser = useCallback(
    async (uid, remove) => {
      try {
        await axios.delete("user", {
          data: { uid, remove },
        });
        getUsers(state.rows_per_page, 0);
      } catch (err) {
        setErr(err.message);
      }
    },
    [getUsers, setErr, state.rows_per_page]
  );
  const restoreUser = useCallback(
    async (uid) => {
      try {
        await axios.patch("user", { uid });
        getUsers(state.rows_per_page, 0);
      } catch (err) {
        setErr(err.message);
      }
    },
    [getUsers, setErr, state.rows_per_page]
  );
  */
  return (
    <UserContext.Provider
      value={{
        ...state,
        setErr,
        getUsers,
        viewUser,
        /*
        createUser,
        updateUser,
        deleteUser,
        restoreUser,
        */
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export { UserContext, UserProvider };
