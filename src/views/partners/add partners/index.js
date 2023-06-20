import React from 'react';
import { Link as RouterLink} from 'react-router-dom';
import { useHistory } from 'react-router';
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


  const handleSubmitSuccess = () => {
    history.push('/app/partners/list');
  };

  return (
    <Page
      className={classes.root}
      title="Partner creating"
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
              Partner creating page
            </Typography>
            <Box mt={3}>
              <RegisterForm onSubmitSuccess={handleSubmitSuccess} />
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
