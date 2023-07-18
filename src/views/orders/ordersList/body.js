/* eslint-disable max-len */
import React, { useState } from 'react';
import moment from 'moment';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Card,
  IconButton,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  colors,
  makeStyles
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { Visibility } from '@material-ui/icons';
import Label from 'src/components/Label';

const statusOptions = [
  {
    id: 'progress',
    name: 'progress'
  },
  {
    id: 'done',
    name: 'done'
  },
];


function getStatusLabel(inventoryType) {
  const map = {
    progress: {
      text: 'progress',
      color: 'success'
    },
    done: {
      text: 'done',
      color: 'warning'
    },
  };

  const text = inventoryType && map[inventoryType].text;
  const color = inventoryType && map[inventoryType].color;
  return (
    <Label color={color}>
      {text}
    </Label>
  );
}

function applyFilters(orders, filters) {
  return orders.filter((order) => {
    let matches = true;

    if (filters.status && order.status !== filters.status) {
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
  queryField: {
    width: 500
  },
  statusField: {
    flexBasis: 200
  },

  avatar: {
    backgroundColor: colors.red[500],
    color: colors.common.white
  }
}));

function Results({ className, orders, deleteOrder, ...rest }) {
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

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  // Usually query is done on backend with indexing solutions
  const filteredOrders = applyFilters(orders, filters);
  const paginatedOrders = applyPagination(filteredOrders, page, limit);

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Box p={2}>
        <Box
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
            value={filters.status || 'progress'}
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
          <Box flexGrow={1} />
        </Box>
      </Box>
      <PerfectScrollbar>
        <Box >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Order ID
                </TableCell>
                <TableCell>
                  Order Date
                </TableCell>
                <TableCell>
                  Order created by
                </TableCell>
                <TableCell>
                  Supplier Name
                </TableCell>
                <TableCell>
                  Status
                </TableCell>
                <TableCell align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { paginatedOrders.map((order) => {
                return (
                  <TableRow
                    hover
                    key={order._id}
                  >
                    <TableCell>
                      {order.number}
                    </TableCell>
                    <TableCell>
                      {moment(order.updatedAt).format('DD/MM/YYYY')}
                    </TableCell>
                    <TableCell>
                      {order.account}
                    </TableCell>
                    <TableCell>
                      {order.supplier}
                    </TableCell>
                    <TableCell>
                      {getStatusLabel(order.status)}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        component={RouterLink}
                        to={"/app/orders/orderedItemsList/?Id=" + order._id + "&status=" + order.status + "&supplier=" + order.supplier_id + "&date=" + order.updatedAt}
                      >
                        <SvgIcon fontSize="small">
                          <Visibility />
                        </SvgIcon>
                      </IconButton>
                      <IconButton
                        onClick={(event) => { if (window.confirm('Are you really want to delete?')) { deleteOrder(order._id); event.stopPropagation(); } }}
                        component={RouterLink}
                        to={"/app/orders/ordersList"}
                      >
                        <SvgIcon fontSize="small">
                          <DeleteIcon />
                        </SvgIcon>
                      </IconButton>
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
        count={100}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
}

Results.propTypes = {
  className: PropTypes.string,
  orders: PropTypes.array
};

Results.defaultProps = {
  orders: []
};

export default Results;
