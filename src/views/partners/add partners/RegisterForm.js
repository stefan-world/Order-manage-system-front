import React from 'react';
import clsx from 'clsx';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import axios from 'src/utils/axios';
import {API_BASE_URL} from "../../../config"
import { useSnackbar } from 'notistack';
import {
  Box,
  Button,
  TextField,
  makeStyles
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {}
}));

function RegisterForm({ className, onSubmitSuccess, ...rest }) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  return (
    <Formik
      initialValues={{
        username: '',
        location:'',
        email: '',
        password: '',
        percentage:'',
        payment:''
      }}
      validationSchema={Yup.object().shape({
        username: Yup.string().max(255).required('partner name is required'),
        location: Yup.string().max(255).required('location is required'),
        email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
        password: Yup.string().min(5).max(255).required('Password is required'),
        percentage: Yup.number().required('percentage is required'),
        payment: Yup.number().required('payment is required'),
      })}
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting
      }) => {
        try {
          // Make API request     
          const {username, location, email, password, percentage, payment} =values;
          var data ='';

          await axios.post(API_BASE_URL+'signup', { username, location, email, password, percentage, payment})
            .then((response) => {
                data = response.data; 
            })
            if(data.success)
            {
              setStatus({ success: true });
              setSubmitting(false);   
              enqueueSnackbar(data.message, {
              variant: 'success',
            });    }
            else {
              enqueueSnackbar(data.message, {
                variant: 'error'
              }); 
            }
            onSubmitSuccess();
        } catch (error) {
          setStatus({ success: false });
          setErrors({ submit: error.message });
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
        values
      }) => (
        <form
          className={clsx(classes.root, className)}
          onSubmit={handleSubmit}
          {...rest}
        >
          <TextField
            error={Boolean(touched.username && errors.username)}
            fullWidth
            helperText={touched.username && errors.username}
            label="Partner Name"
            margin="normal"
            name="username"
            onBlur={handleBlur}
            onChange={handleChange}
            type="username"
            value={values.username}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.location && errors.location)}
            fullWidth
            helperText={touched.location && errors.location}
            label="Location(country or city)"
            margin="normal"
            name="location"
            onBlur={handleBlur}
            onChange={handleChange}
            type="location"
            value={values.location}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.email && errors.email)}
            fullWidth
            helperText={touched.email && errors.email}
            label="Email Address"
            margin="normal"
            name="email"
            onBlur={handleBlur}
            onChange={handleChange}
            type="email"
            value={values.email}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.password && errors.password)}
            fullWidth
            helperText={touched.password && errors.password}
            label="Password"
            margin="normal"
            name="password"
            onBlur={handleBlur}
            onChange={handleChange}
            type="password"
            value={values.password}
            variant="outlined"
          />

           <TextField
            error={Boolean(touched.percentage && errors.percentage)}
            fullWidth
            helperText={touched.percentage && errors.percentage}
            label="Percentage(%)"
            margin="normal"
            name="percentage"
            onBlur={handleBlur}
            onChange={handleChange}
            type="number"
            value={values.percentage}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.payment && errors.payment)}
            fullWidth
            helperText={touched.payment && errors.payment}
            label="Payment($)"
            margin="normal"
            name="payment"
            onBlur={handleBlur}
            onChange={handleChange}
            type="number"
            value={values.payment}
            variant="outlined"
          />

          <Box mt={2}>
            <Button
              color="secondary"
              disabled={isSubmitting}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
            >
              Create
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
}

RegisterForm.propTypes = {
  className: PropTypes.string,
  onSubmitSuccess: PropTypes.func
};

RegisterForm.default = {
  onSubmitSuccess: () => {}
};

export default RegisterForm;
