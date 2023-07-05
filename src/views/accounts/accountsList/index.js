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
import{API_BASE_URL} from 'src/config';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

function AccountsListView() {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [accounts, setAccounts] = useState(null);

  const getAccounts = useCallback(() => {
    axios
      .post(API_BASE_URL + 'accounts/list')
      .then((response) => {
        if (isMountedRef.current) {
          setAccounts(response.data.accounts);
        }
      });
  }, [isMountedRef]);

  useEffect(() => {
    getAccounts();
  }, [getAccounts]);

  const deletAccount = (accountId) =>{
   
    axios
    .post(API_BASE_URL + 'accounts/delete/'+accountId)
    .then((response) => {
        setAccounts(response.data.accounts);
    });
  }

  return (
    <Page
      className={classes.root}
      title="Accounts List"
    >
      <Container maxWidth={false}>
        <Header />
        {accounts && (
          <Box mt={10} >
            <Results deletAccount={deletAccount} accounts={accounts} />
          </Box>
        )}
      </Container>
    </Page>
  );
}

export default AccountsListView;
