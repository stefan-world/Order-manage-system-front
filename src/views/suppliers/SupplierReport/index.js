import React, {
  useState,
  useEffect,
  useCallback
} from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import axios from 'src/utils/axios';
import Page from 'src/components/Page';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import Header from './Header';
import Results from './Results';
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
  const isMountedRef = useIsMountedRef();
  const [suppliers, setSuppliers] = useState(null);

  const getSuppliers = useCallback(() => {
    axios
      .get(API_BASE_URL + 'suppliers/list')
      .then((response) => {
        if (isMountedRef.current) {
          setSuppliers(response.data.suppliers);
        }
      });
  }, [isMountedRef]);

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
        setSuppliers(response.data.suppliers);
      });
  }
  return (
    <Page
      className={classes.root}
      title="Invoice List"
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
