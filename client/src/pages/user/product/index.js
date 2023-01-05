import React from "react";
import { Helmet } from "react-helmet-async";
import { Grid, Typography } from "@mui/material";

import CachedIcon from "@mui/icons-material/Cached";

import ProductList from "../../../components/pages/user/product/T_Product";

import useProduct from "../../../hooks/user/useProduct";
import useAuth from "../../../hooks/useAuth";

import {
  CollapseAlert,
  Divider,
  IconButton,
} from "../../../components/common/styled";

function Product() {
  const { setErr, errMsg, getProducts, rows_per_page } = useProduct();
  const { isAuthenticated } = useAuth();
  const [errOpen, setErrOpen] = React.useState(false);
  const refresh = () => {
    getProducts(rows_per_page, 0);
  };
  React.useEffect(() => {
    if (isAuthenticated) getProducts(rows_per_page, 0);
    return () => setErr(null);
  }, [isAuthenticated, rows_per_page, getProducts, setErr]);
  React.useEffect(() => {
    if (errMsg) setErrOpen(true);
  }, [errMsg]);

  return (
    <React.Fragment>
      <Helmet title="SA Product" />
      <Grid container sx={{ display: "flex", alignItems: "center" }}>
        <Grid item>
          <Typography variant="h3" gutterBottom display="inline">
            Product List
          </Typography>
        </Grid>
        <Grid item xs></Grid>
        <Grid item display="flex" alignItems="center">
          <IconButton
            ml={4}
            onClick={refresh}
            size="large"
            sx={{ margin: "0px 0px 0px 16px" }}
          >
            <CachedIcon />
          </IconButton>
        </Grid>
      </Grid>
      <Divider my={4} />
      <CollapseAlert
        errOpen={errOpen}
        setErrOpen={setErrOpen}
        setErr={setErr}
        errMsg={errMsg}
      />

      <ProductList />
    </React.Fragment>
  );
}
export default Product;
