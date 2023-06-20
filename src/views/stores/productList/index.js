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
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

function CustomerListView() {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [products, setProducts] = useState(null);

  const getCustomers = useCallback(() => {
    axios
      .get(API_BASE_URL + 'products/list')
      .then((response) => {
        if (isMountedRef.current) {
          setProducts(response.data.products);
        }
      });
  }, [isMountedRef]);

  useEffect(() => {
    getCustomers();
  }, [getCustomers]);

  if (!products) {
    return null;
  }

  const onDelete = (Id) => {
    axios
      .get(API_BASE_URL + 'products/delete/' + Id)
      .then((response) => {
        if (isMountedRef.current) {
          setProducts(response.data.products);
        }
      });
  }

  return (
    <Page
      className={classes.root}
      title="Partners List"
    >
      <Container maxWidth={false}>
        <Header />
        {products && (
          <Box mt={10} >
            <Results products={products} deleteProduct={onDelete} />
          </Box>
        )}
      </Container>
    </Page>
  );
}

export default CustomerListView;
