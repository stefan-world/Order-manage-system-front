import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Breadcrumbs,
  Button,
  Grid,
  Link,
  Typography,
  makeStyles
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const useStyles = makeStyles(() => ({
  root: {marginLeft:'30px',
  width:'95%'}
}));

function Header({ className, ...rest }) {
  const classes = useStyles();

  return (
    <Grid
      className={clsx(classes.root, className)}
      container
      justifyContent="space-between"
      spacing={3}
      {...rest}
    >
      <Grid item>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          <Link
            variant="body1"
            color="inherit"
            to="/app"
            component={RouterLink}
          >
            Dashboard
          </Link>
          <Link
            variant="body1"
            color="inherit"
            to="/app/products/productList"
            component={RouterLink}
          >
            Products
          </Link>
          <Typography
            variant="body1"
            color="textPrimary"
          >
            Create Products
          </Typography>
        </Breadcrumbs>
        <Typography
          variant="h3"
          color="textPrimary"
        >
          Please Save a new product!
        </Typography>
      </Grid>
      <Grid item>
        <Button
          component={RouterLink}
          to="/app/products/productList"
        >
          Cancel
        </Button>
      </Grid>
    </Grid>
  );
}

Header.propTypes = {
  className: PropTypes.string
};

export default Header;
