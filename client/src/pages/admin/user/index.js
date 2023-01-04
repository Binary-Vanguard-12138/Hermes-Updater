import React from "react";
import { Helmet } from "react-helmet-async";
import { Grid, Typography } from "@mui/material";

import CachedIcon from "@mui/icons-material/Cached";

import UserList from "../../../components/pages/admin/user/T_User";

import useUser from "../../../hooks/admin/useUser";
import useAuth from "../../../hooks/useAuth";

import {
  CollapseAlert,
  Divider,
  IconButton,
} from "../../../components/common/styled";

function SAUser() {
  const { setErr, errMsg, getUsers, rows_per_page } = useUser();
  const { isAuthenticated } = useAuth();
  const [errOpen, setErrOpen] = React.useState(false);
  const refresh = () => {
    getUsers(rows_per_page, 0);
  };
  React.useEffect(() => {
    if (isAuthenticated) getUsers(rows_per_page, 0);
    return () => setErr(null);
  }, [isAuthenticated, rows_per_page, getUsers, setErr]);
  React.useEffect(() => {
    if (errMsg) setErrOpen(true);
  }, [errMsg]);

  return (
    <React.Fragment>
      <Helmet title="SA User" />
      <Grid container sx={{ display: "flex", alignItems: "center" }}>
        <Grid item>
          <Typography variant="h3" gutterBottom display="inline">
            User Management
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

      <UserList />
    </React.Fragment>
  );
}
export default SAUser;
