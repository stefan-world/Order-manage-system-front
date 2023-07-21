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
  const [suppliers, setSupplier] = useState([]);

  const getSuppliers = useCallback(() => {
    axios.get(API_BASE_URL + 'suppliers/list/' + user._id)
    .then((response) => {
      setSupplier(response.data.suppliers);
    });
  }, [user._id]);

  useEffect(() => {
    getSuppliers();
  }, [getSuppliers]);

  if (!suppliers) {
    return null;
  }

  const ondelete =(supplierId) =>{
      axios
      .get(API_BASE_URL + 'suppliers/delete/'+supplierId)
      .then((response) => {
        setSupplier(response.data.suppliers);
      });
  }

  return (
    <Page
      className={classes.root}
      title="Supplier List"
    >
      <Container maxWidth={false}>
        <Header />
          <Box mt={15}>
            <Results suppliers={suppliers} deleteSupplier={ondelete}/>
          </Box>
      </Container>
    </Page>
  );
}

export default InvoiceListView;
