import React from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './header';
import Results from './body';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  }
}));

function ProductsListView() {
  const classes = useStyles();

  return (
    <Page
      className={classes.root}
      title="Partners List"
    >
      <Container maxWidth={false}>
        <Header />
        (
        <Box mt={10} >
          <Results />
        </Box>
        )
      </Container>
    </Page>
  );
}

export default ProductsListView;
