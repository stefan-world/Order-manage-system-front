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
import{API_BASE_URL} from 'src/config';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

function CustomerListView() {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [customers, setCustomers] = useState(null);

  const getCustomers = useCallback(() => {
    axios
      .get(API_BASE_URL + 'partners/list')
      .then((response) => {
        if (isMountedRef.current) {
          setCustomers(response.data.partners);
        }
      });
  }, [isMountedRef]);

  useEffect(() => {
    getCustomers();
  }, [getCustomers]);

  const deletPartner = (partnerId) =>{
   
    axios
    .get(API_BASE_URL + 'partners/delete/'+partnerId)
    .then((response) => {
        setCustomers(response.data.partners);
    });
  }

  return (
    <Page
      className={classes.root}
      title="Partners List"
    >
      <Container maxWidth={false}>
        <Header />
        {customers && (
          <Box mt={10} >
            <Results deletPartner={deletPartner} customers={customers} />
          </Box>
        )}
      </Container>
    </Page>
  );
}

export default CustomerListView;
