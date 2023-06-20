import React, {
  useState,
  useEffect,
  useCallback
} from 'react';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  colors,
  makeStyles
} from '@material-ui/core';
import axios from 'src/utils/axios';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import CircularProgress from './CircularProgress';
import { API_BASE_URL } from 'src/config';

const useStyles = makeStyles((theme) => ({
  root: {},
  image: {
    flexShrink: 0,
    height: 56,
    width: 56
  },
  subscriptions: {
    fontWeight: theme.typography.fontWeightMedium
  },
  value: {
    color: colors.green[600],
    fontWeight: theme.typography.fontWeightMedium
  },
  navigateNextIcon: {
    marginLeft: theme.spacing(1)
  }
}));

function MostProfitableProducts({ className, ...rest }) {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [partners, setPartners] = useState(null);

  const getProducts = useCallback(() => {
    axios
      .get(API_BASE_URL +'reports/partnerlist')
      .then((response) => {
        if (isMountedRef.current) {
          setPartners(response.data.partners);
        }
      });
  }, [isMountedRef]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  if (!partners) {
    return null;
  }

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardHeader
        title="Partners amount"
      />
      <Divider />
      <PerfectScrollbar>
        <Box >
          <Table>
            <TableBody>
              {partners.map((partner) => (
                <TableRow
                  hover
                  key={partner._id}
                >
                  <TableCell>
                    <Box
                      display="flex"
                      alignItems="center"
                    >
                       <Avatar
                          className={classes.image}
                          src={partner.avatar}
                        />
                      <Box ml={2}>
                        <Typography
                          variant="h6"
                          color="textPrimary"
                        >
                          {partner.username}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                        >
                          <span className={classes.subscriptions}>
                          </span>
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="h6"
                      color="textPrimary"
                    >
                      amount
                    </Typography>
                    <Typography
                      noWrap
                      variant="body2"
                      color="textSecondary"
                    >
                      <span className={classes.value}>
                        {partner.currency}
                        {partner.amount}
                      </span>
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="flex-end"
                    >
                      <Box mr={2}>
                        <Typography
                          align="right"
                          variant="h6"
                          color="textPrimary"
                        >
                          {partner.percentage}
                          %
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                        >
                          amount percentage
                        </Typography>
                      </Box>
                      <CircularProgress value={partner.percentage} />
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <Box
        p={2}
        display="flex"
        justifyContent="flex-end"
      >
      </Box>
    </Card>
  );
}

MostProfitableProducts.propTypes = {
  className: PropTypes.string
};

export default MostProfitableProducts;
