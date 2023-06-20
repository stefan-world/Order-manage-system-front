import React,{  useState, useEffect, useCallback} from 'react';
import { Container, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import ProductCreateForm from './ProductCreateForm';
import { useParams } from 'react-router-dom';
import { API_BASE_URL } from 'src/config';
import axios from 'src/utils/axios';
import useIsMountedRef from 'src/hooks/useIsMountedRef';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    justifyContent:'center',
    paddingTop: theme.spacing(3),
    paddingBottom: 100
  }
}));

function ProductCreateView() {
  const classes = useStyles();
  const params = useParams();
  const id =params.Id;
  const isMountedRef = useIsMountedRef();
  const [product, setProduct] = useState(null);

  const getInvoices = useCallback(() => {
    axios
      .post(API_BASE_URL + 'product/edit',{id})
      .then((response) => {
        if (isMountedRef.current) {
          setProduct(response.data.product);
        }
      });
  }, [isMountedRef]);

  useEffect(() => {
    getInvoices();
  }, [getInvoices]);

  if (!product) {
    return null;
  }


  return (
    <Page
      className={classes.root}
      title="Product Edit"
    >
       <Header />
      <Container maxWidth='md' style={{marginTop:'50px'}}>
        <ProductCreateForm product={product} />
      </Container>
    </Page>
  );
}

export default ProductCreateView;
