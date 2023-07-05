import React from 'react';
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
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { API_BASE_URL } from 'src/config';
import { useLocation } from 'react-router-dom';
import UpdateIcon from '@material-ui/icons/Update'
import { Edit as EditIcon } from 'react-feather';

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
  const location = useLocation();
  const classes = useStyles();
  const { user } = useSelector((state)=>state.account);
  const history = useHistory();

  const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('Id');

  const orderProducts = () => {
    const status = document.getElementsByName('status')[0].value;
    axios.post(API_BASE_URL + 'ordersList/updateState/', {
       'id': id,
       'status': status,
     }).then(res => {
      history.push('/app/orders/ordersList')
     })
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
            Ordered Items List
          </Typography>
        </Breadcrumbs>
        <Typography
          variant="h3"
          color="textPrimary"
        >
          This is Ordered Items List!
        </Typography>
      </Grid>
      <Grid item>
        <Button
          color="secondary"
          variant="contained"
          className={classes.action}
          onClick={ () => orderProducts(user._id) }
        >
          <SvgIcon
            fontSize="small"
            className={classes.actionIcon}
          >
            <UpdateIcon />
          </SvgIcon>
          Update Status
        </Button>
        <Button
          color="secondary"
          variant="contained"
          className={classes.action}
          to={"/app/orders/editOrder/"+id}
          component={RouterLink}
        >
          <SvgIcon
            fontSize="small"
            className={classes.actionIcon}
          >
            <EditIcon />
          </SvgIcon>
          Edit Order
        </Button>
      </Grid>
    </Grid>
  );
}

Header.propTypes = {
  className: PropTypes.string
};

export default Header;
