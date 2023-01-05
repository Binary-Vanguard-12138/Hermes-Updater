import { useContext } from "react";

import { ProductContext } from "../../contexts/user/ProductContext";

const useProduct = () => {
  const context = useContext(ProductContext);
  return context;
};

export default useProduct;
