import React from "react";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { Formik } from "formik";

import {
  Button,
  Grid,
  Checkbox,
  Typography,
  FormControlLabel,
} from "@mui/material";

import useAuth from "../../hooks/useAuth";
import { Alert, Divider, TextField } from "../common/styled";

function SignUp() {
  const { signUp } = useAuth();

  return (
    <Formik
      initialValues={{
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        acceptTerms: false,
        submit: false,
      }}
      validationSchema={Yup.object().shape({
        firstName: Yup.string().max(255).required("First Name is required"),
        lastName: Yup.string().max(255).required("Last Name is required"),
        email: Yup.string()
          .email("Must be a valid email")
          .max(255)
          .required("Email is required"),
        password: Yup.string()
          .min(8, "Must be at least 8 characters")
          .max(255)
          .required("Required"),
        confirmPassword: Yup.string().when("password", {
          is: (val) => (val && val.length > 0 ? true : false),
          then: Yup.string().oneOf(
            [Yup.ref("password")],
            "Both password need to be the same"
          ),
        }),
        acceptTerms: Yup.boolean().oneOf(
          [true],
          "The terms and conditions must be accepted."
        ),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          const response = await signUp(values);
          setErrors({ success: response.message });
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
          <Grid container>
            <Grid item xs={6} pr={2}>
              <TextField
                type="text"
                name="firstName"
                label="First Name"
                value={values.firstName}
                error={Boolean(touched.firstName && errors.firstName)}
                fullWidth
                helperText={touched.firstName && errors.firstName}
                onBlur={handleBlur}
                onChange={handleChange}
                my={3}
              />
            </Grid>
            <Grid item xs={6} pl={2}>
              <TextField
                type="text"
                name="lastName"
                label="Last Name"
                value={values.lastName}
                error={Boolean(touched.lastName && errors.lastName)}
                fullWidth
                helperText={touched.lastName && errors.lastName}
                onBlur={handleBlur}
                onChange={handleChange}
                my={3}
              />
            </Grid>
          </Grid>
          <TextField
            type="email"
            name="email"
            label="Email address"
            value={values.email}
            error={Boolean(touched.email && errors.email)}
            fullWidth
            helperText={touched.email && errors.email}
            onBlur={handleBlur}
            onChange={handleChange}
            my={3}
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
            my={3}
          />
          <TextField
            type="password"
            name="confirmPassword"
            label="Confirm password"
            value={values.confirmPassword}
            error={Boolean(touched.confirmPassword && errors.confirmPassword)}
            fullWidth
            helperText={touched.confirmPassword && errors.confirmPassword}
            onBlur={handleBlur}
            onChange={handleChange}
            my={3}
          />
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  name="acceptTerms"
                  checked={values.acceptTerms}
                  color="primary"
                />
              }
              label="Accept Terms"
              error={Boolean(touched.acceptTerms && errors.acceptTerms)}
              fullWidth
              helperText={touched.acceptTerms && errors.acceptTerms}
              onBlur={handleBlur}
              onChange={handleChange}
            />
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            Sign up
          </Button>
          <Divider my={6} />
          <Typography align="center">
            Do you have an account?
            <Button component={Link} to="/auth/sign-in" color="primary">
              Sign In
            </Button>
          </Typography>
        </form>
      )}
    </Formik>
  );
}

export default SignUp;
