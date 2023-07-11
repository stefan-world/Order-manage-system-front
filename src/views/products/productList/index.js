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
import Header from './header';
import Results from './body';
import { API_BASE_URL } from 'src/config';
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  }
}));

function ProductsListView() {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [products, setProducts] = useState(null);
  const { user } = useSelector((state) => state.account);

  const getCustomers = useCallback(() => {
    axios
      .get(API_BASE_URL + 'product/list/'+user._id)
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
      .get(API_BASE_URL + 'product/delete/' + Id)
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

export default ProductsListView;
