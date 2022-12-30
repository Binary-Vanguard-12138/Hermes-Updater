import React from "react";
import styled from "@emotion/styled";
import { Helmet } from "react-helmet-async";

import { Paper, Typography } from "@mui/material";

import { ReactComponent as Logo } from "../../vendor/logo.svg";
import SignInComponent from "../../components/auth/SignIn";

const Brand = styled(Logo)`
  fill: ${(props) => props.theme.palette.primary.main};
  width: 64px;
  height: 64px;
  margin-bottom: 32px;
`;

const Wrapper = styled(Paper)`
  padding: ${(props) => props.theme.spacing(6)};

  ${(props) => props.theme.breakpoints.up("md")} {
    padding: ${(props) => props.theme.spacing(10)};
  }
`;

function SignIn() {
  return (
    <React.Fragment>
      <Brand />
      <Wrapper>
        <Helmet title="Sign In" />
        <Typography component="h2" variant="body1" align="center">
          Sign in to your account to continue
        </Typography>

        <SignInComponent />
      </Wrapper>
    </React.Fragment>
  );
}

export default SignIn;
