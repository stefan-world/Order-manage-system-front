import React, {
  useState,
  useEffect,
  useCallback
} from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import axios from 'src/utils/axios';
import Page from 'src/components/Page';
import Header from './header';
import Results from './body';
import { API_BASE_URL } from 'src/config';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: 100
  }
}));

function InvoiceListView() {
  const classes = useStyles();
  const { user } = useSelector((state) => state.account);
  const [orders, setOrders] = useState([]);

  const getOrders = useCallback(() => {
    axios.get(API_BASE_URL + 'ordersList/list/' + user._id)
    .then((response) => {
      setOrders(response.data.orders);
    });
  }, [user._id]);

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  if (!orders) {
    return null;
  }

  const ondelete =(orderId) =>{
      axios
      .get(API_BASE_URL + 'ordersList/delete/'+orderId)
      .then((response) => {
        setOrders(response.data.orders);
      });
  }

  return (
    <Page
      className={classes.root}
      title="Orders List"
    >
      <Container maxWidth={false}>
        <Header />
          <Box mt={15}>
            <Results orders={orders} deleteOrder={ondelete}/>
          </Box>
      </Container>
    </Page>
  );
}

export default InvoiceListView;
