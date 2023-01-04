import React from "react";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Formik } from "formik";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
} from "@mui/material";

import useAuth from "../../hooks/useAuth";

import { Alert, Divider, TextField } from "../common/styled";

function SignIn() {
  const navigate = useNavigate();
  const { user, signIn } = useAuth();
  const [rememberFlag, setRememberFlag] = React.useState(
    window.localStorage.getItem("remember")
  );
  const email = window.localStorage.getItem("email");
  React.useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  return (
    <Formik
      initialValues={{
        email: email ? email : "",
        password: "",
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email("Must be a valid email")
          .max(255)
          .required("Email is required"),
        password: Yup.string().max(255).required("Password is required"),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          values.remember = rememberFlag;
          await signIn(values);
        } catch (error) {
          const message = error.message || "Something went wrong";
          setStatus({ success: false });
          setErrors({ submit: message });
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values,
      }) => (
        <form noValidate onSubmit={handleSubmit}>
          {errors.submit && (
            <Alert mt={2} mb={3} variant="outlined" severity="error">
              {errors.submit}
            </Alert>
          )}
          {errors.success && (
            <Alert mt={2} mb={3} variant="outlined" severity="info">
              {errors.success}
            </Alert>
          )}
          <TextField
            type="email"
            name="email"
            label="Email Address"
            value={values.email}
            error={Boolean(touched.email && errors.email)}
            fullWidth
            helperText={touched.email && errors.email}
            onBlur={handleBlur}
            onChange={handleChange}
            my={2}
          />
          <TextField
            type="password"
            name="password"
            label="Password"
            value={values.password}
            error={Boolean(touched.password && errors.password)}
            fullWidth
            helperText={touched.password && errors.password}
            onBlur={handleBlur}
            onChange={handleChange}
            my={2}
          />
          <Grid container justifyContent="center">
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="remember"
                    checked={rememberFlag}
                    onClick={() => setRememberFlag(!rememberFlag)}
                    color="primary"
                  />
                }
                label="Remember me"
              />
            </Grid>
            <Grid item xs={6} align="right">
              <Button
                component={Link}
                to="/auth/forgotpassword"
                color="primary"
                align="right"
              >
                Forgot password
              </Button>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            Sign In
          </Button>
          <Divider my={6} />
          <Typography align="center">
            Don't you have an account?
            <Button component={Link} to="/auth/sign-up" color="primary">
              Sign Up
            </Button>
          </Typography>
        </form>
      )}
    </Formik>
  );
}

export default SignIn;
