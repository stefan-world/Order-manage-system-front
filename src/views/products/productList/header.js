import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import axios from 'src/utils/axios';
import {
  Breadcrumbs,
  Button,
  Grid,
  Link,
  SvgIcon,
  Typography,
  makeStyles
} from '@material-ui/core';
import {
  PlusCircle as PlusCircleIcon
} from 'react-feather';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { useSelector, useDispatch } from 'react-redux';
import { selectOrder } from 'src/actions/checkboxAction';
import { useHistory } from 'react-router';
import { API_BASE_URL } from 'src/config';

const useStyles = makeStyles((theme) => ({
  root: {},
  action: {
    marginBottom: theme.spacing(1),
    '& + &': {
      marginLeft: theme.spacing(1)
    }
  },
  actionIcon: {
    marginRight: theme.spacing(1)
  }
}));


function Header({ className, ...rest }) {
  const classes = useStyles();
  const { user } = useSelector((state) => state.account);
  const dispatch = useDispatch();
  const { checkedRows } = useSelector((state) => state.selectedRows);
  const history = useHistory();
  let quantityFlag = false;

  const orderProducts = (id) => {
    const quantity = checkedRows.map((product_id) => {
      const productQT = document.getElementsByName(product_id + "-quantity")[0].value;
      if (productQT == '')
        quantityFlag = true;
      return productQT;
    })

    if (quantityFlag) {
      alert("Please Enther Order Quantity !");
    } else {
      dispatch(selectOrder([]));
      axios.post(API_BASE_URL + 'ordersList/create/', {
        'products_id': checkedRows,
        'products_quantity': quantity,
        'user_id': id,
      }).then(res => {
        history.push("/app/orders/orderedItemsList/?Id=" + res.data.order._id + "&status=" + res.data.order.status + "&supplier=" + res.data.order.supplier_id)
      })
    }

    quantityFlag = false;
  }

  return (
    <Grid
      container
      spacing={3}
      justifyContent="space-between"
      className={clsx(classes.root, className)}
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
          <Typography
            variant="body1"
            color="textPrimary"
          >
            Products
          </Typography>
          <Typography
            variant="body1"
            color="textPrimary"
          >
            Products List
          </Typography>
        </Breadcrumbs>
        <Typography
          variant="h3"
          color="textPrimary"
        >
          This is products list!
        </Typography>
      </Grid>
      <Grid item>
        <Button
          color="secondary"
          variant="contained"
          className={classes.action}
          onClick={() => orderProducts(user._id)}
        >
          <SvgIcon
            fontSize="small"
            className={classes.actionIcon}
          >
            <PlusCircleIcon />
          </SvgIcon>
          Order products
        </Button>
        <Button
          color="secondary"
          variant="contained"
          className={classes.action}
          component={RouterLink}
          to="/app/products/productCreate"
        >
          <SvgIcon
            fontSize="small"
            className={classes.actionIcon}
          >
            <PlusCircleIcon />
          </SvgIcon>
          Add New Product
        </Button>
      </Grid>
    </Grid>
  );
}

Header.propTypes = {
  className: PropTypes.string
};

export default Header;
