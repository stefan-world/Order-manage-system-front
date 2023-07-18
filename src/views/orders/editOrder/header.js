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
import UpdateIcon from '@material-ui/icons/Update'
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { useSelector, useDispatch } from 'react-redux';
import { selectOrder } from 'src/actions/checkboxAction';
import { useHistory } from 'react-router';
import { API_BASE_URL } from 'src/config';
import { useLocation } from 'react-router-dom';

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
  const location = useLocation()
  const classes = useStyles();
  const { user } = useSelector((state) => state.account);
  const dispatch = useDispatch();
  const { checkedRows } = useSelector((state) => state.selectedRows);
  const { quantity } = useSelector((state) => state.quantity);
  const history = useHistory();
  let quantityFlag = false;
  const searchParams = new URLSearchParams(location.search);

  const updateProducts = () => {
    let id = searchParams.get('Id');
    let status = searchParams.get('status');
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
      axios.post(API_BASE_URL + 'ordersList/update', {
        'order_id': id,
        'products_id': checkedRows,
        'products_quantity': check_quantity,
        'account_id': user.account_id,
      }).then(res => {
        history.push("/app/orders/orderedItemsList/?Id=" + res.data.order._id + "&status=" + res.data.order.status + "&supplier=" + res.data.order.supplier_id + "&date=" + res.data.order.updatedAt)
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
          <Link
            variant="body1"
            color="inherit"
            to="/app/orders/ordersList"
            component={RouterLink}
          >
            Orders
          </Link>
          <Typography
            variant="body1"
            color="textPrimary"
          >
            Edit Order
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
          onClick={() => updateProducts()}
        >
          <SvgIcon
            fontSize="small"
            className={classes.actionIcon}
          >
            <UpdateIcon />
          </SvgIcon>
          Update Order
        </Button>
      </Grid>
    </Grid>
  );
}

Header.propTypes = {
  className: PropTypes.string
};

export default Header;
