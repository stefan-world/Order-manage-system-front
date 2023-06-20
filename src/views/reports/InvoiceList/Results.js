/* eslint-disable max-len */
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import moment from 'moment';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Avatar,
  Box,
  Card,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  colors,
  makeStyles
} from '@material-ui/core';
import Label from 'src/components/Label';
import getInitials from 'src/utils/getInitials';

const statusOptions = [
  {
    id: 'all',
    name: 'All'
  },
  {
    id: 'partial',
    name: 'partial'
  },
  {
    id: 'unpaid',
    name: 'unpaid'
  }
];

function getStatusLabel(inventoryType) {
  const map = {
    partial: {
      text: 'partial',
      color: 'warning'
    },
    unpaid: {
      text: 'unpaid',
      color: 'error'
    }
  };

  const { text, color } = map[inventoryType];

  return (
    <Label color={color}>
      {text}
    </Label>
  );
}

function applyFilters(invoices, filters) {
  return invoices.filter((invoice) => {
    let matches = true;
    if (filters.status && invoice.status !== filters.status) {
      matches = false;
    }
    return matches;
  });
}

function applyPagination(customers, page, limit) {
  return customers.slice(page * limit, page * limit + limit);
}

const useStyles = makeStyles((theme) => ({
  root: {},
  statusField: {
    flexBasis: 200
  },
  avatar: {
    backgroundColor: colors.red[500],
    color: colors.common.white
  }
}));

function Results({ className, invoices, ...rest }) {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [filters, setFilters] = useState({
    status: null
  });

  const handleStatusChange = (event) => {
    event.persist();

    let value = null;

    if (event.target.value !== 'all') {
      value = event.target.value;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      status: value
    }));
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  // Usually query is done on backend with indexing solutions
  const filteredInvoices = applyFilters(invoices, filters);
  const paginatedInvoices = applyPagination(filteredInvoices, page, limit);

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Box p={2}>
        <Box
          mt={2}
          display="flex"
          alignItems="center"
        >
          <TextField
            className={classes.statusField}
            label="Status"
            name="status"
            onChange={handleStatusChange}
            select
            SelectProps={{ native: true }}
            value={filters.status || 'all'}
            variant="outlined"
          >
            {statusOptions.map((statusOption) => (
              <option
                key={statusOption.id}
                value={statusOption.id}
              >
                {statusOption.name}
              </option>
            ))}
          </TextField>
        </Box>
      </Box>
      <PerfectScrollbar>
        <Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Customer
                </TableCell>
                <TableCell>
                  Status
                </TableCell>
                <TableCell>
                  paid Amount
                </TableCell>
                <TableCell>
                  Unpaid Amount
                </TableCell>
                <TableCell align="right">
                  Date
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedInvoices.map((invoice) => {
                return (
                  <TableRow
                    hover
                    key={invoice._id}
                  >
                    <TableCell>
                      <Box
                        display="flex"
                        alignItems="center"
                      >
                        <Avatar className={classes.avatar}>
                          {getInitials(invoice.customerName)}
                        </Avatar>
                        <Box ml={2}>
                          <Link
                            variant="subtitle2"
                            color="textPrimary"
                            component={RouterLink}
                            underline="none"
                            to="#"
                          >
                            {invoice.customerName}
                          </Link>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                          >
                            {invoice.customerLocation}
                            {" , "}
                            {invoice.product}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {getStatusLabel(invoice.status)}
                    </TableCell>
                    <TableCell>
                      {invoice.currency}
                      {invoice.paid.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {invoice.currency}
                      {invoice.unpaid.toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      {moment(invoice.createdAt).format('DD/MM/YYYY')}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={filteredInvoices.length}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
}

Results.propTypes = {
  className: PropTypes.string,
  invoices: PropTypes.array
};

Results.defaultProps = {
  invoices: []
};

export default Results;
