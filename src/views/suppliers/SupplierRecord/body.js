import React from 'react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import {
  Box,
  Button,
  TextField,
  makeStyles
} from '@material-ui/core';
import axios from 'src/utils/axios';
import { API_BASE_URL } from 'src/config';

const useStyles = makeStyles(() => ({
  root: {}
}));

function RegisterForm({ className, onSubmitSuccess, ...rest }) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useSelector((state) => state.account);

  return (
    <Formik
      initialValues={{
        name: '',
        mobile: '',
        email: '',
        phone: '',
        country: '',
        state: '',
        city: '',
        postcode: '',
        address: '',
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string().max(255).required('Supplier Name is required'),
        mobile: Yup.string().max(255).required('Supplier Mobile is required'),
        email: Yup.string().max(255).required('Supplier Email is required'),
        phone: Yup.string().max(255).required('Supplier Phone is required'),
        country: Yup.string().max(255).required('Supplier Country is required'),
        state: Yup.string().max(255).required('Supplier State is required'),
        city: Yup.string().max(255).required('Supplier City is required'),
        postcode: Yup.string().max(255).required('Supplier Postcode is required'),
        address: Yup.string().max(255).required('Supplier Address is required'),
      })}
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting
      }) => {
        try {
          // Make API request
          const account_id = user._id;
          const { name, mobile, email, phone, country, state, city, postcode, address } = values;
          var data = '';

          await axios.post(API_BASE_URL + 'suppliers/create', { name, mobile, email, phone, country, state, city, postcode, address, account_id })
            .then((response) => {
              data = response.data;
            })
          if (data.success) {
            setStatus({ success: true });
            setSubmitting(false);
            enqueueSnackbar(data.message, {
              variant: 'success',
            });
          }
          else {
            enqueueSnackbar(data.message, {
              variant: 'error'
            });
          }
          onSubmitSuccess();
        }
        catch (error) {
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
            error={Boolean(touched.name && errors.name)}
            fullWidth
            helperText={touched.name && errors.name}
            label="Supplier Name"
            margin="normal"
            name="name"
            onBlur={handleBlur}
            onChange={handleChange}
            type="string"
            value={values.name}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.mobile && errors.mobile)}
            fullWidth
            helperText={touched.mobile && errors.mobile}
            label="Mobile"
            margin="normal"
            name="mobile"
            onBlur={handleBlur}
            onChange={handleChange}
            type="string"
            value={values.mobile}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.email && errors.email)}
            fullWidth
            helperText={touched.email && errors.email}
            label="Email"
            margin="normal"
            name="email"
            onBlur={handleBlur}
            onChange={handleChange}
            type="string"
            value={values.email}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.phone && errors.phone)}
            fullWidth
            helperText={touched.phone && errors.phone}
            label="Phone"
            margin="normal"
            name="phone"
            onBlur={handleBlur}
            onChange={handleChange}
            type="string"
            value={values.phone}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.address && errors.address)}
            fullWidth
            helperText={touched.address && errors.address}
            label="Address"
            margin="normal"
            name="address"
            onBlur={handleBlur}
            onChange={handleChange}
            type="string"
            value={values.address}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.city && errors.city)}
            fullWidth
            helperText={touched.city && errors.city}
            label="City"
            margin="normal"
            name="city"
            onBlur={handleBlur}
            onChange={handleChange}
            type="string"
            value={values.city}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.state && errors.state)}
            fullWidth
            helperText={touched.state && errors.state}
            label="State"
            margin="normal"
            name="state"
            onBlur={handleBlur}
            onChange={handleChange}
            type="string"
            value={values.state}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.postcode && errors.postcode)}
            fullWidth
            helperText={touched.postcode && errors.postcode}
            label="Postcode"
            margin="normal"
            name="postcode"
            onBlur={handleBlur}
            onChange={handleChange}
            type="string"
            value={values.postcode}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.country && errors.country)}
            fullWidth
            helperText={touched.country && errors.country}
            label="Country"
            margin="normal"
            name="country"
            onBlur={handleBlur}
            onChange={handleChange}
            type="string"
            value={values.country}
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
              Save
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
  onSubmitSuccess: () => { }
};

export default RegisterForm;
