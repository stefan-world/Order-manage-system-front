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
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

function UsersListView() {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [users, setUsers] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const { user } = useSelector((state) => state.account);

  const getUsers = useCallback(() => {
    axios
      .post(API_BASE_URL + 'users/list', {user_id: user._id})
      .then((response) => {
        if (isMountedRef.current) {
          setUsers(response.data.users);
        }
      });
    axios.post(API_BASE_URL + 'accounts/list')
      .then((response) => {
        setAccounts(response.data.accounts);
      });
  }, [isMountedRef]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const deletUser = (userId) => {

    axios
      .post(API_BASE_URL + 'users/delete/' + userId)
      .then((response) => {
        setUsers(response.data.users);
      });
  }

  return (
    <Page
      className={classes.root}
      title="Users List"
    >
      <Container maxWidth={false}>
        <Header />
        {users && (
          <Box mt={10} >
            <Results deletUser={deletUser} users={users} accounts={accounts}/>
          </Box>
        )}
      </Container>
    </Page>
  );
}

export default UsersListView;
