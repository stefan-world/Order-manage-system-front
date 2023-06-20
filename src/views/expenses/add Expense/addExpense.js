import React from 'react';
import clsx from 'clsx';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import {
  Box,
  Button,
  Card,
  TextField,
  makeStyles
} from '@material-ui/core';
import { API_BASE_URL } from 'src/config';
import axios from 'src/utils/axios';

const useStyles = makeStyles(() => ({
  root: {padding:'10px'}
}));

function RegisterForm({ className, onSubmitSuccess, ...rest }) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  return (
    <Card className={clsx(classes.root, className)}>
    <Formik
      initialValues={{
        name: '',
        total:'',
        payment:''

      }}
      validationSchema={Yup.object().shape({
        name: Yup.string().max(255).required('Expanses name is required'),
        total: Yup.number().required('total amount is required'),
        payment: Yup.number().required('payment amount is required'),

      })}
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting
      }) => {
        try {
          const {name, total, payment} =values;
          var data ='';

          await axios.post(API_BASE_URL+'expenses/add', {name, total, payment})
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
          
          onSubmit={handleSubmit}
          {...rest}
        >
          <TextField
            error={Boolean(touched.name && errors.name)}
            fullWidth
            helperText={touched.name && errors.name}
            label="Expanses Name"
            margin="normal"
            name="name"
            onBlur={handleBlur}
            onChange={handleChange}
            type="string"
            value={values.name}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.total && errors.total)}
            fullWidth
            helperText={touched.total && errors.total}
            label="Total amount(need)"
            margin="normal"
            name="total"
            onBlur={handleBlur}
            onChange={handleChange}
            type="number"
            value={values.total}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.payment && errors.payment)}
            fullWidth
            helperText={touched.payment && errors.payment}
            label="Real Payment"
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
              Add
            </Button>
          </Box>
        </form>
      )}
    </Formik>
    </Card>
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
