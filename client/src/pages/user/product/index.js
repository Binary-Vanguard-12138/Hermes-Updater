import React from "react";
import { Helmet } from "react-helmet-async";
import { Divider, Typography } from "../../../components/common/styled";

function ProductPage() {
  return (
    <React.Fragment>
      <Helmet title="My Profile" />
      <Typography variant="h3" gutterBottom display="inline">
        Product Updates
      </Typography>
      <Divider my={4} />
    </React.Fragment>
  );
}

export default ProductPage;
