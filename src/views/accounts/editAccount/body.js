import React from 'react';
import clsx from 'clsx';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import {
  Box,
  Button,
  TextField,
  makeStyles,
  MenuItem
} from '@material-ui/core';
import axios from 'src/utils/axios';
import { API_BASE_URL } from 'src/config';
import { useParams } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  root: {}
}));

function EditForm({ className, onSubmitSuccess, account, ...rest }) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams();
  const id = params.accountId;
  return (
    <Formik
      initialValues={{
        account_name: account.account_name,
        primary_contact_firstname: account.primary_contact_firstname,
        primary_contact_lastname: account.primary_contact_lastname,
        primary_contact_mobile: account.primary_contact_mobile,
        primary_contact_email: account.primary_contact_email,
        address_line1: account.address_line1,
        address_line2: account.address_line2,
        city: account.city,
        state: account.state,
        postcode: account.postcode,
        country: account.country,
        company_eamil: account.company_eamil,
        status: account.status
      }}
      validationSchema={Yup.object().shape({
        account_name: Yup.string().max(255).required('Account name is required'),
        primary_contact_firstname: Yup.string().max(255).required('Primary Contact First Name is required'),
        primary_contact_lastname: Yup.string().max(255).required('Primary Contact Last Name is required'),
        primary_contact_mobile: Yup.string().max(255).required('Primary Contact Mobile is required'),
        primary_contact_email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
        address_line1: Yup.string().max(255).required('Primary Contact First Name is required'),
        address_line2: Yup.string().max(255).required('Primary Contact Last Name is required'),
        city: Yup.string().max(255).required('Primary Contact Mobile is required'),
        state: Yup.string().max(255).required('Primary Contact Email is required'),
        postcode: Yup.string().max(255).required('Primary Contact First Name is required'),
        country: Yup.string().max(255).required('Primary Contact Last Name is required'),
        company_eamil: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
        status: Yup.string().max(255).required('Primary Contact Email is required'),
      })}
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting
      }) => {
        try {
          const {
            account_name, primary_contact_firstname, primary_contact_lastname, primary_contact_mobile, 
            primary_contact_email, address_line1, address_line2, city, state, postcode, country, company_eamil, status
          } = values;
          var data = '';

          await axios.post(API_BASE_URL + '/accounts/update', {
            id, account_name, primary_contact_firstname, primary_contact_lastname, primary_contact_mobile, 
            primary_contact_email, address_line1, address_line2, city, state, postcode, country, company_eamil, status
          })
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
            error={Boolean(touched.account_name && errors.account_name)}
            fullWidth
            helperText={touched.account_name && errors.account_name}
            label="Name"
            margin="normal"
            name="account_name"
            onBlur={handleBlur}
            onChange={handleChange}
            type="account_name"
            value={values.account_name}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.primary_contact_firstname && errors.primary_contact_firstname)}
            fullWidth
            helperText={touched.primary_contact_firstname && errors.primary_contact_firstname}
            label="Primary Contact First Name"
            margin="normal"
            name="primary_contact_firstname"
            onBlur={handleBlur}
            onChange={handleChange}
            type="primary_contact_firstname"
            value={values.primary_contact_firstname}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.primary_contact_lastname && errors.primary_contact_lastname)}
            fullWidth
            helperText={touched.primary_contact_lastname && errors.primary_contact_lastname}
            label="Primary Contact Last Name"
            margin="normal"
            name="primary_contact_lastname"
            onBlur={handleBlur}
            onChange={handleChange}
            type="primary_contact_lastname"
            value={values.primary_contact_lastname}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.primary_contact_mobile && errors.primary_contact_mobile)}
            fullWidth
            helperText={touched.primary_contact_mobile && errors.primary_contact_mobile}
            label="Primary Contact Mobile"
            margin="normal"
            name="primary_contact_mobile"
            onBlur={handleBlur}
            onChange={handleChange}
            type="primary_contact_mobile"
            value={values.primary_contact_mobile}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.primary_contact_email && errors.primary_contact_email)}
            fullWidth
            helperText={touched.primary_contact_email && errors.primary_contact_email}
            label="Primary Contact Email"
            margin="normal"
            name="primary_contact_email"
            onBlur={handleBlur}
            onChange={handleChange}
            type="primary_contact_email"
            value={values.primary_contact_email}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.address_line1 && errors.address_line1)}
            fullWidth
            helperText={touched.address_line1 && errors.address_line1}
            label="Address Line 1"
            margin="normal"
            name="address_line1"
            onBlur={handleBlur}
            onChange={handleChange}
            type="address_line1"
            value={values.address_line1}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.address_line2 && errors.address_line2)}
            fullWidth
            helperText={touched.address_line2 && errors.address_line2}
            label="Address Line 2"
            margin="normal"
            name="address_line2"
            onBlur={handleBlur}
            onChange={handleChange}
            type="address_line2"
            value={values.address_line2}
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
            type="city"
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
            type="state"
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
            type="postcode"
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
            type="country"
            value={values.country}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.company_eamil && errors.company_eamil)}
            fullWidth
            helperText={touched.company_eamil && errors.company_eamil}
            label="Company Email"
            margin="normal"
            name="company_eamil"
            onBlur={handleBlur}
            onChange={handleChange}
            type="company_eamil"
            value={values.company_eamil}
            variant="outlined"
          />
          <TextField
            select
            fullWidth
            margin="normal"
            name="status"
            label="Status"
            value={values.status}
            onBlur={handleBlur}
            onChange={handleChange}
            variant="outlined"
          >
            <MenuItem id={"active"} value={"active"}>Active</MenuItem>
            <MenuItem id={"deactive"} value={"deactive"}>Deactive</MenuItem>
          </TextField>
          <Box mt={2}>
            <Button
              color="secondary"
              disabled={isSubmitting}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
            >
              Update
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
}

EditForm.propTypes = {
  className: PropTypes.string,
  onSubmitSuccess: PropTypes.func
};

EditForm.default = {
  onSubmitSuccess: () => { }
};

export default EditForm;
