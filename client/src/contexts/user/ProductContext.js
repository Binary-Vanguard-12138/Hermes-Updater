import { createContext, useCallback, useReducer } from "react";

import axios from "../../utils/axios/v1/userAxios";

const GET_PRODUCT = "GET_PRODUCT";
const SET_CURRENT_STATUS = "SET_CURRENT_STATUS";
const SET_TOTAL_PRODUCT_COUNT = "SET_TOTAL_PRODUCT_COUNT";
const SET_ERROR = "SET_ERROR";

const initialState = {
  products: null,
  total_product_count: 0,
  from: 0,
  rows_per_page: 5,
  errMsg: null,
};

const ProductReducer = (state, action) => {
  switch (action.type) {
    case GET_PRODUCT:
      return {
        ...state,
        products: action.payload.products,
      };
    case SET_CURRENT_STATUS:
      return {
        ...state,
        rows_per_page: action.payload.rows_per_page,
        from: action.payload.from,
      };
    case SET_TOTAL_PRODUCT_COUNT:
      return {
        ...state,
        total_product_count: action.payload.total_product_count,
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

const ProductContext = createContext(null);

function ProductProvider({ children }) {
  const [state, dispatch] = useReducer(ProductReducer, initialState);

  const setErr = useCallback((msg) => {
    dispatch({
      type: SET_ERROR,
      payload: {
        errMsg: msg,
      },
    });
  }, []);
  const getProducts = useCallback(
    async (rows_per_page, from, init = true) => {
      if (init) {
        dispatch({
          type: SET_TOTAL_PRODUCT_COUNT,
          payload: {
            total_product_count: 0,
          },
        });
      }
      dispatch({
        type: GET_PRODUCT,
        payload: {
          products: null,
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
        const response = await axios.get("product", {
          params: {
            from: from,
            size: rows_per_page,
          },
        });
        dispatch({
          type: GET_PRODUCT,
          payload: {
            products: response.data.data,
          },
        });
        dispatch({
          type: SET_TOTAL_PRODUCT_COUNT,
          payload: {
            total_product_count: response.data.total,
          },
        });
      } catch (err) {
        setErr(err.message);
        dispatch({
          type: GET_PRODUCT,
          payload: {
            products: [],
          },
        });
        dispatch({
          type: SET_TOTAL_PRODUCT_COUNT,
          payload: {
            total_product_count: 0,
          },
        });
      }
    },
    [setErr]
  );

  return (
    <ProductContext.Provider
      value={{
        ...state,
        setErr,
        getProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export { ProductContext, ProductProvider };
