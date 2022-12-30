import React from "react";
import styled from "@emotion/styled";
import * as Yup from "yup";
import { Helmet } from "react-helmet-async";
import { useTheme } from "@mui/material/styles";
import { Formik } from "formik";
// import { useNavigate } from "react-router-dom";
import {
  Grid,
  Typography,
  TextField,
  useMediaQuery,
  Button,
  CircularProgress,
} from "@mui/material";

import { Edit as EditIcon } from "@mui/icons-material";

import useAuth from "../../../hooks/useAuth";

import { Alert, Divider } from "../../../components/common/styled";

const Root = styled.div`
  justify-content: center;
  align-items: center;
  display: flex;
  min-height: 100%;
`;

function PersonalProfile() {
  // const navigate = useNavigate();
  const { user, updateProfile } = useAuth();

  const theme = useTheme();
  const isMD = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <React.Fragment>
      <Helmet title="My Profile" />
      <Typography variant="h3" gutterBottom display="inline">
        My Profile
      </Typography>
      <Divider my={4} />
      {user === null ? (
        <>
          <Root>
            <CircularProgress color="primary" />
          </Root>
        </>
      ) : (
        <>
          <Grid container spacing={6}>
            <Grid item xs={12} xl={4} md={6}>
              <Grid container spacing={3}>
                <Grid
                  item
                  xs={12}
                  md={5}
                  pr={4}
                  pb={4}
                  sx={{
                    textAlign: isMD ? "right" : "left",
                  }}
                >
                  <Typography variant="h6">Email</Typography>
                </Grid>
                <Grid item xs={12} md={7} pb={4}>
                  <Typography variant="h6">{user?.email}</Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={5}
                  pr={4}
                  pb={4}
                  sx={{
                    textAlign: isMD ? "right" : "left",
                  }}
                >
                  <Typography variant="h6">Name</Typography>
                </Grid>
                <Grid item xs={12} md={7} pb={4}>
                  <Typography variant="h6">
                    {user?.firstName + " " + user?.lastName}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Formik
            enableReinitialize={true}
            initialValues={{
              firstName: user?.firstName,
              lastName: user?.lastName,
            }}
            validationSchema={Yup.object().shape({
              firstName: Yup.string()
                .max(255)
                .required("First Name is required"),
              lastName: Yup.string().max(255).required("Last Name is required"),
            })}
            onSubmit={async (
              values,
              { resetForm, setErrors, setStatus, setSubmitting, setValue }
            ) => {
              try {
                const response = await updateProfile(values);
                if (response) {
                  resetForm();
                  setErrors({
                    success: "User name has been changed successfully.",
                  });
                }
                // navigate("/account/profile");
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
                <Grid container spacing={6}>
                  <Grid item xs={12} xl={4} md={6}>
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
                      <Grid
                        item
                        xs={12}
                        md={5}
                        pr={4}
                        pb={4}
                        sx={{
                          margin: "auto",
                          textAlign: isMD ? "right" : "left",
                        }}
                      >
                        <Typography variant="h6">First Name</Typography>
                      </Grid>
                      <Grid item xs={12} md={7} pb={4}>
                        <TextField
                          name="firstName"
                          value={values.firstName}
                          error={Boolean(touched.firstName && errors.firstName)}
                          fullWidth
                          helperText={touched.firstName && errors.firstName}
                          onBlur={handleBlur}
                          onChange={handleChange}
                        ></TextField>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={5}
                        pr={4}
                        pb={4}
                        sx={{
                          margin: "auto",
                          textAlign: isMD ? "right" : "left",
                        }}
                      >
                        <Typography variant="h6">Last Name</Typography>
                      </Grid>
                      <Grid item xs={12} md={7} pb={4}>
                        <TextField
                          name="lastName"
                          value={values.lastName}
                          error={Boolean(touched.lastName && errors.lastName)}
                          fullWidth
                          helperText={touched.lastName && errors.lastName}
                          onBlur={handleBlur}
                          onChange={handleChange}
                        ></TextField>
                      </Grid>
                      <Grid item xs={12} textAlign="right" pb={4}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          disabled={isSubmitting}
                          sx={{
                            backgroundColor: "#369F33",
                          }}
                        >
                          <EditIcon
                            sx={{
                              marginRight: "4px",
                            }}
                          />
                          Change User Name
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </form>
            )}
          </Formik>
          <Formik
            initialValues={{
              oldPassword: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={Yup.object().shape({
              oldPassword: Yup.string().max(255).required("Required"),
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
            })}
            onSubmit={async (
              values,
              { resetForm, setErrors, setStatus, setSubmitting, setValue }
            ) => {
              try {
                const response = await updateProfile(values);
                if (response) {
                  resetForm();
                  setErrors({
                    success: "Password has been changed successfully.",
                  });
                }
                // navigate("/account/profile");
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
                <Grid container spacing={6}>
                  <Grid item xs={12} xl={4} md={6}>
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
                      <Grid
                        item
                        xs={12}
                        md={5}
                        pr={4}
                        pb={4}
                        sx={{
                          margin: "auto",
                          textAlign: isMD ? "right" : "left",
                        }}
                      >
                        <Typography variant="h6">Current Password</Typography>
                      </Grid>
                      <Grid item xs={12} md={7} pb={4}>
                        <TextField
                          type="password"
                          name="oldPassword"
                          value={values.oldPassword}
                          error={Boolean(
                            touched.oldPassword && errors.oldPassword
                          )}
                          fullWidth
                          helperText={touched.oldPassword && errors.oldPassword}
                          onBlur={handleBlur}
                          onChange={handleChange}
                        ></TextField>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={5}
                        pr={4}
                        pb={4}
                        sx={{
                          margin: "auto",
                          textAlign: isMD ? "right" : "left",
                        }}
                      >
                        <Typography variant="h6">New Password</Typography>
                      </Grid>
                      <Grid item xs={12} md={7} pb={4}>
                        <TextField
                          type="password"
                          name="password"
                          value={values.password}
                          error={Boolean(touched.password && errors.password)}
                          fullWidth
                          helperText={touched.password && errors.password}
                          onBlur={handleBlur}
                          onChange={handleChange}
                        ></TextField>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={5}
                        pr={4}
                        pb={4}
                        sx={{
                          margin: "auto",
                          textAlign: isMD ? "right" : "left",
                        }}
                      >
                        <Typography variant="h6">Password Confirm</Typography>
                      </Grid>
                      <Grid item xs={12} md={7} pb={4}>
                        <TextField
                          type="password"
                          name="confirmPassword"
                          value={values.confirmPassword}
                          error={Boolean(
                            touched.confirmPassword && errors.confirmPassword
                          )}
                          fullWidth
                          helperText={
                            touched.confirmPassword && errors.confirmPassword
                          }
                          onBlur={handleBlur}
                          onChange={handleChange}
                        ></TextField>
                      </Grid>
                      <Grid item xs={12} textAlign="right" pb={4}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          disabled={isSubmitting}
                          sx={{
                            backgroundColor: "#369F33",
                          }}
                        >
                          <EditIcon
                            sx={{
                              marginRight: "4px",
                            }}
                          />
                          Change Password
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </form>
            )}
          </Formik>
        </>
      )}
    </React.Fragment>
  );
}
export default PersonalProfile;
