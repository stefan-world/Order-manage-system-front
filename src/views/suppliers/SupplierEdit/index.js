import React,{  useState, useEffect, useCallback} from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import axios from 'src/utils/axios';
import RegisterForm from './RegisterForm';
import Header from './Header';
import { useParams } from 'react-router-dom';
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
  const params = useParams();
  const id =params.Id;
  const isMountedRef = useIsMountedRef();
  const [supplier, setSupplier] = useState(null);

  const handleSubmitSuccess = () => {
    history.push('/app/suppliers/supplierReport');
  };

  const getSuppliers = useCallback(() => {
    axios
      .post(API_BASE_URL + 'suppliers/edit',{id})
      .then((response) => {
        if (isMountedRef.current) {
          setSupplier(response.data.supplier);
        }
      });
  }, [isMountedRef]);

  useEffect(() => {
    getSuppliers();
  }, [getSuppliers]);

  if (!supplier) {
    return null;
  } 

  return (
    <Page
      className={classes.root}
      title="Edit Supplier"
    > 
       <Header />
      <Container maxWidth="sm">
        <Card>
          <CardContent>
            <Typography
              gutterBottom
              variant="h2"
              color="textPrimary"
              align='center'
            >
              Supplier Edit page
            </Typography>
            <Box mt={3}>
              <RegisterForm supplier={supplier} onSubmitSuccess={handleSubmitSuccess} />
            </Box>
            <Box my={2}>
              <Divider />
            </Box>
            <Link
              component={RouterLink}
              to="/app/suppliers/supplierReport"
              variant="body2"
              color="textSecondary"
            >
              Go Suppliers list
            </Link>
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
}

export default RegisterView;
