import React from 'react';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormHelperText,
  Grid,
  TextField,
  makeStyles
} from '@material-ui/core';
import FilesDropzone from 'src/components/FilesDropzone';
import axios from 'src/utils/axios';
import { API_BASE_URL } from 'src/config';

const useStyles = makeStyles(() => ({
  root: {
  },
  editor: {
    '& .ql-editor': {
      height: 400
    }
  }
}));

function ProductCreateForm({ className, ...rest }) {
  const classes = useStyles();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  return (
    <Formik
      initialValues={{
        images: "",
        name: '',
        amount:'',
        price: '',
        salePrice: ''
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string().max(255).required('name is required'),
        images:Yup.string().nullable().required('Image must be required'),
        amount: Yup.string().max(255).required('amount is required'),
        price: Yup.number().min(0).required('price is required'),
        salePrice: Yup.number().min(0).required('salePrice is required'),
      })}
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting
      }) => {
        try {        

          var formData = new FormData();

        formData.append('image', values.images);

       await axios.post(API_BASE_URL + 'product/create', formData, {
          headers: {
             'name':values.name,
             'amount':values.amount,
             'price':values.price,
             'saleprice':values.salePrice
          }
        }).then(res => {

            setStatus({ success: true });
            setSubmitting(false);
            enqueueSnackbar(res.data.message, {
              variant: 'success'
            });
            history.push('/app/stores/productList');

        })

        } catch (err) {
          setErrors({ submit: err.message });
          setStatus({ success: false });
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
        setFieldValue,
        touched,
        values
      }) => (
        <form
          onSubmit={handleSubmit}
          className={clsx(classes.root, className)}
          {...rest}
        >

              <Card>
              <CardHeader title="Name and Amout" />
              <Divider />
                <CardContent>
                  <TextField
                  style={{marginBottom:'20px'}}
                    error={Boolean(touched.name && errors.name)}
                    fullWidth
                    helperText={touched.name && errors.name}
                    label="Product Name"
                    name="name"
                    type="string"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
                    variant="outlined"
                  />
                   <TextField
                    error={Boolean(touched.amount && errors.amount)}
                    fullWidth
                    helperText={touched.amount && errors.amount}
                    label="Products Amount"
                    name="amount"
                    type="string"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.amount}
                    variant="outlined"
                  />
                </CardContent>
              </Card>
              <Box mt={3}>
                <Card>
                  <CardHeader title="Upload Images" />
                  <Divider />
                  <CardContent>
                    <FilesDropzone 
                    name="images" value={(images)=>{setFieldValue('images', images)}} avatar={""}/>
                  {(touched.images && errors.images) && (
                    <Box mt={2}>
                      <FormHelperText error>
                        {errors.images}
                      </FormHelperText>
                    </Box>
                  )}
                  </CardContent>
                </Card>
              </Box>
              <Box mt={3}>
                <Card>
                  <CardHeader title="Prices" />
                  <Divider />
                  <CardContent>
                    <Grid
                      container
                      spacing={3}
                    >
                      <Grid item xs={12} md={6}>
                        <TextField
                          error={Boolean(touched.price && errors.price)}
                          fullWidth
                          helperText={(touched.price && errors.price)}
                          label="Price($)"
                          name="price"
                          type="number"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.price}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          error={Boolean(touched.salePrice && errors.salePrice)}
                          fullWidth
                          helperText={touched.salePrice && errors.salePrice}
                          label="Sale price($)"
                          name="salePrice"
                          type="number"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.salePrice}
                          variant="outlined"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Box>
          {errors.submit && (
            <Box mt={3}>
              <FormHelperText error>
                {errors.submit}
              </FormHelperText>
            </Box>
          )}
          <Box mt={2}>
            <Button
              color="secondary"
              variant="contained"
              type="submit"
              disabled={isSubmitting}
            >
              Create product
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
}

ProductCreateForm.propTypes = {
  className: PropTypes.string
};

export default ProductCreateForm;
