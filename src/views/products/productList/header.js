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
import { useSnackbar } from 'notistack';

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
  const { quantity } = useSelector((state) => state.quantity);
  const dispatch = useDispatch(); 
  const { checkedRows } = useSelector((state) => state.selectedRows);
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  let quantityFlag = false;
  const orderProducts = (id) => {
    const check_quantity = checkedRows.map((product_id) => {
      const single_quantity = quantity.find(item => item[product_id] !== undefined);
      if (single_quantity === undefined)
        quantityFlag = true;
      else
        return single_quantity[product_id];
    })
  
    if (quantityFlag) {
      alert("Please Enther Order Quantity !");
    } else {
      dispatch(selectOrder([]));
      axios.post(API_BASE_URL + 'ordersList/create/', {
        'products_id': checkedRows,
        'products_quantity': check_quantity,
        'user_id': id,
      }).then(res => {
        history.push("/app/orders/orderedItemsList/?Id=" + res.data.order._id + "&status=" + res.data.order.status + "&supplier=" + res.data.order.supplier_id + "&supplier=" + res.data.order.supplier_id + "&date=" + res.data.order.updatedAt)
      }).catch((error) => {
        enqueueSnackbar(error.message, {
          variant: 'error'
        });
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
