import React, {
  useState,
  useEffect,
  useCallback
} from 'react';
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
  makeStyles,
  MenuItem
} from '@material-ui/core';
import FilesDropzone from 'src/components/FilesDropzone';
import axios from 'src/utils/axios';
import { useSelector } from 'react-redux';
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

  const { user } = useSelector((state) => state.account);
  const [suppliers, setSuppliers] = useState([]);

  const getSuppliers = useCallback(() => {
    axios.get(API_BASE_URL + 'suppliers/list/' + user._id)
      .then((response) => {
        setSuppliers(response.data.suppliers);
      });
  }, [user._id]);

  useEffect(() => {
    getSuppliers();
  }, [getSuppliers]);

  return (
    <Formik
      initialValues={{
        images: "",
        name: '',
        description: '',
        price: '',
        barcode: '',
        status: 'active',
        supplier: '',
        quantity: '',
        brand: '',
        category: '',
        subcategory: '',
        purchase: '',
        available: '',
        tax: '',
        weighable: '',
        showInOnline: '',
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string().max(255).required('name is required'),
        status: Yup.string().required('Status is required'),
        supplier: Yup.string().required('Supplier is required'),
      })}
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting
      }) => {
        try {
          if (values.images.length !== 0) {
            var formData = new FormData();

            formData.append('image', values.images);

            await axios.post(API_BASE_URL + 'product/create', formData, {
              headers: {
                'name': values.name,
                'description': values.description,
                'price': values.price,
                'barcode': values.barcode,
                'quantity': values.quantity,
                'status': values.status,
                'supplier': values.supplier,
                'brand': values.brand,
                'category': values.category,
                'subcategory': values.subcategory,
                'available': values.available,
                'tax': values.tax,
                'weighable': values.weighable,
                'showInOnline': values.showInOnline,
              }
            }).then(res => {

              setStatus({ success: true });
              setSubmitting(false);
              enqueueSnackbar(res.data.message, {
                variant: 'success'
              });
              history.push('/app/products/productList');

            })
          } else {
            await axios.post(API_BASE_URL + 'product/create/noimage', {
              'name': values.name,
              'description': values.description,
              'price': values.price,
              'barcode': values.barcode,
              'status': values.status,
              'quantity': values.quantity,
              'supplier': values.supplier,
              'brand': values.brand,
              'category': values.category,
              'subcategory': values.subcategory,
              'available': values.available,
              'tax': values.tax,
              'weighable': values.weighable,
              'showInOnline': values.showInOnline,
            }).then(res => {

              setStatus({ success: true });
              setSubmitting(false);
              enqueueSnackbar(res.data.message, {
                variant: 'success'
              });
              history.push('/app/products/productList');

            })
          }

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
            <CardHeader title="New Product" />
            <Divider />
            <CardContent>
              <Grid
                container
                spacing={3}
              >
                <Grid item xs={12} md={6}>
                  <TextField
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
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    error={Boolean(touched.brand && errors.brand)}
                    fullWidth
                    helperText={touched.brand && errors.brand}
                    label="Brand"
                    name="brand"
                    type="string"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.brand}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
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
                    error={Boolean(touched.purchase && errors.purchase)}
                    fullWidth
                    helperText={(touched.purchase && errors.purchase)}
                    label="Purchase($)"
                    name="purchase"
                    type="number"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.purchase}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
              <Grid
                container
                spacing={3}
              >
                <Grid item xs={12} md={6}>
                  <TextField
                    error={Boolean(touched.category && errors.category)}
                    fullWidth
                    helperText={touched.category && errors.category}
                    label="Category"
                    name="category"
                    type="string"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.category}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    error={Boolean(touched.subcategory && errors.subcategory)}
                    fullWidth
                    helperText={(touched.subcategory && errors.subcategory)}
                    label="Subcategory"
                    name="subcategory"
                    type="string"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.subcategory}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
              <Grid
                container
                spacing={3}
              >
                <Grid item xs={12} md={6}>
                  <TextField
                    error={Boolean(touched.available && errors.available)}
                    fullWidth
                    helperText={touched.available && errors.available}
                    label="Available"
                    name="available"
                    type="string"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.available}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    error={Boolean(touched.tax && errors.tax)}
                    fullWidth
                    helperText={(touched.tax && errors.tax)}
                    label="Tax"
                    name="tax"
                    type="string"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.tax}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
              <Grid
                container
                spacing={3}
              >
                <Grid item xs={12} md={6}>
                  <TextField
                    error={Boolean(touched.weighable && errors.weighable)}
                    fullWidth
                    helperText={touched.weighable && errors.weighable}
                    label="Weighable"
                    name="weighable"
                    type="string"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.weighable}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="ShowInOnline"
                    name="showInOnline"
                    type="string"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.showInOnline}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
              <Grid
                container
                spacing={3}
              >
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    name="status"
                    label="Select Status"
                    value={values.status}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    variant="outlined"
                  >
                    <MenuItem value={"active"}>Active</MenuItem>
                    <MenuItem value={"deactive"}>Deactive</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    error={Boolean(touched.supplier && errors.supplier)}
                    helperText={(touched.supplier && errors.supplier)}
                    select
                    fullWidth
                    name="supplier"
                    label="Select Supplier"
                    value={values.supplier}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    variant="outlined"
                  >
                    {suppliers.map((option) => (
                      <MenuItem key={option._id} value={option._id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
              <Grid
                container
                spacing={3}
              >
                <Grid item xs={12} md={6}>
                  <TextField
                    error={Boolean(touched.quantity && errors.quantity)}
                    fullWidth
                    helperText={(touched.quantity && errors.quantity)}
                    label="Quantity Per Box"
                    name="quantity"
                    type="string"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.quantity}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    error={Boolean(touched.barcode && errors.barcode)}
                    fullWidth
                    helperText={touched.barcode && errors.barcode}
                    label="Enter Barcode"
                    name="barcode"
                    type="number"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.barcode}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
              <TextField
                error={Boolean(touched.description && errors.description)}
                fullWidth
                margin="normal"
                helperText={touched.description && errors.description}
                label="Product's brief description"
                name="description"
                type="string"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description}
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
                  name="images" value={(images) => { setFieldValue('images', images) }} avatar={""} />
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
