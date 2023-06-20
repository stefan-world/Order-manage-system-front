import React, {
  useState,
  useEffect,
  useCallback
} from 'react';
import {
  Grid,
  Container,
  makeStyles
} from '@material-ui/core';
import axios from 'src/utils/axios';
import Page from 'src/components/Page';
import { useHistory } from 'react-router';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import Header from './Header';
import Results from './Results';
import AddExpense from './add Expense/addExpense';
import { API_BASE_URL } from 'src/config';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    paddingTop: theme.spacing(3),
  }
}));

function InvoiceListView() {
  const classes = useStyles();
  const history = useHistory();
  const isMountedRef = useIsMountedRef();
  const [invoices, setInvoices] = useState(null);

  const getInvoices = useCallback(() => {
    axios
      .get(API_BASE_URL + 'expenses/list')
      .then((response) => {
        if (isMountedRef.current) {
          setInvoices(response.data.expenses);
        }
      });
  }, [isMountedRef]);

  useEffect(() => {
    getInvoices();

  }, [getInvoices]);

  if (!invoices) {
    return null;
  }

  
  const handleSubmitSuccess = () => {
    history.push('/');
    history.push('/app/expenses');
  };

  const ondelete =(id)=>{
    axios
    .get(API_BASE_URL + 'expenses/delete/' + id)
    .then((response) => {
        setInvoices(response.data.expenses);
    });
  }
  const onedit = async(name, total, payment, id) =>{

    await axios.post(API_BASE_URL+'expenses/update', { id, name, total, payment})
      .then((response) => {
        setInvoices(response.data.expenses); 
      })
  }

  return (
    <Page
      className={classes.root}
      title="Invoice List"
    >
      <Container maxWidth={false} style={{width:'100%'}}>
        <Header />
        <Grid container spacing={2}>
          <Grid item mt={3} lg={8}>
            <Results deleteExpense={ondelete} expenses={invoices} editExpense={onedit}/>
          </Grid>
          <Grid item mt={3} lg={4}>
            <AddExpense onSubmitSuccess={handleSubmitSuccess}/>
          </Grid>
         </Grid>
      </Container>
    </Page>
  );
}

export default InvoiceListView;
