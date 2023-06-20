import React, {
  useState,
  useEffect,
  useCallback
} from 'react';
import {
  Card,
  makeStyles
} from '@material-ui/core';
import axios from 'src/utils/axios';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import Results from './Results';
import { API_BASE_URL } from 'src/config';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    marginTop:'50px',
    
  }
}));

function InvoiceListView() {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [invoices, setInvoices] = useState(null);

  const getInvoices = useCallback(() => {
    axios
      .get(API_BASE_URL + 'reports/unpaidList')
      .then((response) => {
        if (isMountedRef.current) {
          setInvoices(response.data.unpaid);
        }
      });
  }, [isMountedRef]);

  useEffect(() => {
    getInvoices();
  }, [getInvoices]);

  if (!invoices) {
    return null;
  }

  return (
          <Card className={classes.root} >
            <Results invoices={invoices} />
          </Card>
  );
}

export default InvoiceListView;
