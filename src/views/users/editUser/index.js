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
  const [user, setUser] = useState(null);
  const params = useParams();
  const id = params.userId;
  const getUsers = useCallback(() => {
    axios
      .get(API_BASE_URL +'users/edit/' + id)
      .then((response) => {
        if (isMountedRef.current) {
          setUser(response.data.user);
        }
      });
  }, [isMountedRef, id]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (!user) {
    return null;
  }

  const handleSubmitSuccess = () => {
    history.push('/app/users/list');
  };

  return (
    <Page
      className={classes.root}
      title="User edit"
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
              User editing page
            </Typography>
            <Box mt={3}>
              <EditForm user={user} onSubmitSuccess={handleSubmitSuccess} />
            </Box>
            <Box my={2}>
              <Divider />
            </Box>
            <Link
              component={RouterLink}
              to="/app/users/list"
              variant="body2"
              color="textSecondary"
            >
              go to users list
            </Link>
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
}

export default RegisterView;
