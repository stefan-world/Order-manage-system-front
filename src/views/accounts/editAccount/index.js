import React, {
  useState,
  useEffect,
  useCallback
} from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { useHistory } from 'react-router';
import axios from 'src/utils/axios';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Link,
  Typography,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import EditForm from './body';
import Header from './header';
import { API_BASE_URL } from 'src/config';

const useStyles = makeStyles((theme) => ({
  root: {
    justifyContent: 'center',
    backgroundColor: theme.palette.background.dark,
    display: 'flex',
    flexDirection: 'column'
  }
}));

function RegisterView() {
  const classes = useStyles();
  const history = useHistory();
  const isMountedRef = useIsMountedRef();
  const [account, setAccount] = useState(null);
  const params = useParams();
  const id = params.accountId;
  const getAccounts = useCallback(() => {
    axios
      .post(API_BASE_URL +'/accounts/edit/' + id)
      .then((response) => {
        if (isMountedRef.current) {
          setAccount(response.data.account);
        }
      });
  }, [isMountedRef, id]);

  useEffect(() => {
    getAccounts();
  }, [getAccounts]);

  if (!account) {
    return null;
  }

  const handleSubmitSuccess = () => {
    history.push('/app/accounts/list');
  };

  return (
    <Page
      className={classes.root}
      title="Account edit"
    > 
       <Header />
      <Container maxWidth="sm">
        <Card>
          <CardContent>
            <Typography
              align='center'
              variant="h2"
              color="textPrimary"
            >
              Account editing page
            </Typography>
            <Box mt={3}>
              <EditForm account={account} onSubmitSuccess={handleSubmitSuccess} />
            </Box>
            <Box my={2}>
              <Divider />
            </Box>
            <Link
              component={RouterLink}
              to="/app/accounts/list"
              variant="body2"
              color="textSecondary"
            >
              go to accounts list
            </Link>
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
}

export default RegisterView;
