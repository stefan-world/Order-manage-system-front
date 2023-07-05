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
        username: account.username,
        email: account.email,
        password: "",
        phone: account.phone,
        role: account.role,
        address: account.address
      }}
      validationSchema={Yup.object().shape({
        username: Yup.string().max(255).required('user name is required'),
        address: Yup.string().max(255).required('address is required'),
        email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
        phone: Yup.string().required('Phone number is required'),
      })}
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting
      }) => {
        try {
          const { username, email, password, phone, role, address } = values;
          var data = '';

          await axios.post(API_BASE_URL + '/accounts/update', { id, username, email, password, phone, role, address })
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
            error={Boolean(touched.username && errors.username)}
            fullWidth
            helperText={touched.username && errors.username}
            label="User's Name"
            margin="normal"
            name="username"
            onBlur={handleBlur}
            onChange={handleChange}
            type="username"
            value={values.username}
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
            error={Boolean(touched.phone && errors.phone)}
            fullWidth
            helperText={touched.phone && errors.phone}
            label="Phone Number"
            margin="normal"
            name="phone"
            onBlur={handleBlur}
            onChange={handleChange}
            type="phone"
            value={values.phone}
            variant="outlined"
          />
          <TextField
            select
            fullWidth
            margin="normal"
            name="role"
            label="Select Role"
            value={values.role}
            onBlur={handleBlur}
            onChange={handleChange}
            variant="outlined"
          >
            <MenuItem value={"user"}>User</MenuItem>
            <MenuItem value={"admin"}>Admin</MenuItem>
          </TextField>
            <TextField
              error={Boolean(touched.address && errors.address)}
              fullWidth
              helperText={touched.address && errors.address}
              label="User Address"
              margin="normal"
              name="address"
              onBlur={handleBlur}
              onChange={handleChange}
              type="address"
              value={values.address}
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
