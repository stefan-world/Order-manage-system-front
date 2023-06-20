import React,{
  useState,
  useEffect,
  useCallback
} from 'react';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import axios from 'src/utils/axios';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import Revenue from './revenue';
import TotalAmount from './TotalAmount';
import PartnersRate from './partnersRate';
import SaleToday from './saleToday';
import InvoiceList from './InvoiceList';
import{API_BASE_URL} from 'src/config';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  container: {
    [theme.breakpoints.up('lg')]: {
      paddingLeft: 64,
      paddingRight: 64
    }
  },
  rate:{
    marginTop:'50px'
  }
}));

function DashboardView() {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [total, setTotal] = useState(null);
  const [todaySale, setTodaySale] = useState(null);
  const [todayrevenue, setTodayrevenue] = useState(null);
  
    const getCustomers = useCallback(() => {
      axios
        .get(API_BASE_URL + 'reports/list')
        .then((response) => {
          if (isMountedRef.current) {
            setTotal(response.data.total);
            setTodaySale(response.data.todaySale);
            setTodayrevenue(response.data.todayrevenue);
          }
        });
    }, [isMountedRef]);
  
    useEffect(() => {
      getCustomers();
    }, [getCustomers]);

  return (
    <Page
      className={classes.root}
      title="Dashboard"
    >
      <Container
        maxWidth={false}
        className={classes.container}
      >
        <Header />
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            lg={4}
            sm={6}
            xs={12}
          >
            <TotalAmount total = {total} />
          </Grid>
          <Grid
            item
            lg={4}
            sm={6}
            xs={12}
          >
            <Revenue todayrevenue={todayrevenue} />
          </Grid>
          <Grid
            item
            lg={4}
            sm={6}
            xs={12}
          >
            <SaleToday todaySale={todaySale}/>
          </Grid>
        </Grid>
        <Grid 
        container
        spacing={3}
         >
          <Grid
          item
          lg={6}
          sm={12}
          >
        <PartnersRate className={classes.rate} />
        </Grid>
        <Grid
          item
          lg={6}
          sm={12}
          >
        <InvoiceList />
        </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

export default DashboardView;
