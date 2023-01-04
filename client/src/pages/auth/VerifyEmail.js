import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "@emotion/styled";
import { Helmet } from "react-helmet-async";
import { Paper, Typography, CircularProgress, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { ReactComponent as Logo } from "../../vendor/logo.svg";
// import axios from "../../utils/axios/v1/adminAxios";
import useAuth from "../../hooks/useAuth";
const Brand = styled(Logo)`
  fill: ${(props) => props.theme.palette.primary.contrastText};
  width: 264px;
  height: 64px;
  margin-bottom: 32px;
`;
const Root = styled.div`
  justify-content: center;
  align-items: center;
  display: flex;
  min-height: 100%;
`;
const Wrapper = styled(Paper)`
  background: ${(props) => props.theme.sidebar.header.background};
  color: ${(props) => props.theme.sidebar.header.color};
`;

function VerifyEmail() {
  const { token } = useParams();
  const { verifyEmail } = useAuth();
  const [success, setSuccess] = React.useState(false);
  const [message, setMessage] = React.useState();

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await verifyEmail(token);
        setSuccess(true);
        setMessage(response.message);
      } catch (error) {
        setSuccess(true);
        setMessage(error.message);
      }
    };
    if (!success) {
      verify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <React.Fragment>
      <Brand />
      <Wrapper align="center">
        <Helmet title="Verify Email" />
        {!success ? (
          <>
            <Typography component="h1" variant="h4" align="center" gutterBottom>
              Email Verifying ...
            </Typography>
            <Root>
              <CircularProgress color="secondary" />
            </Root>
          </>
        ) : (
          <>
            <Typography component="h1" variant="h4" align="center" gutterBottom>
              {message}
            </Typography>
            <Button
              component={Link}
              to="/auth/sign-in"
              color="secondary"
              sx={{ paddingTop: "20px" }}
            >
              Sign In
            </Button>
          </>
        )}
      </Wrapper>
    </React.Fragment>
  );
}

export default VerifyEmail;
