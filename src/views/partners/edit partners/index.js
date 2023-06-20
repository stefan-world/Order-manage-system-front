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
import RegisterForm from './RegisterForm';
import Header from './Header';
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
  const [partners, setPartners] = useState(null);
  const params = useParams();
  const id = params.partnerId;

  const getPartners = useCallback(() => {
    axios
      .get(API_BASE_URL +'partners/edit/' + id)
      .then((response) => {
        if (isMountedRef.current) {
          setPartners(response.data.partner);
        }
      });
  }, [isMountedRef]);

  useEffect(() => {
    getPartners();
  }, [getPartners]);

  if (!partners) {
    return null;
  }


  const handleSubmitSuccess = () => {
    history.push('/app/partners/list');
  };

  return (
    <Page
      className={classes.root}
      title="Partner edit"
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
              Partner editing page
            </Typography>
            <Box mt={3}>
              <RegisterForm partner={partners} onSubmitSuccess={handleSubmitSuccess} />
            </Box>
            <Box my={2}>
              <Divider />
            </Box>
            <Link
              component={RouterLink}
              to="/app/partners/list"
              variant="body2"
              color="textSecondary"
            >
              go to partners list
            </Link>
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
}

export default RegisterView;
