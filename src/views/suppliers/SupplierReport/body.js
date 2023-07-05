/* eslint-disable max-len */
import React, { useState } from 'react';
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
import { Edit as EditIcon } from 'react-feather';
import DeleteIcon from '@material-ui/icons/Delete';
import Label from 'src/components/Label';

const statusOptions = [
  {
    id: 'all',
    name: 'All'
  },
  {
    id: 'active',
    name: 'Active'
  },
  {
    id: 'deactive',
    name: 'Deactive'
  },
];


function getStatusLabel(inventoryType) {
  const map = {
    active: {
      text: 'Active',
      color: 'success'
    },
    deactive: {
      text: 'Deactive',
      color: 'warning'
    },
  };

  const { text, color } = map[inventoryType];

  return (
    <Label color={color}>
      {text}
    </Label>
  );
}

function applyFilters(suppliers, filters) {
  return suppliers.filter((supplier) => {
    let matches = true;

    if (filters.status && supplier.status !== filters.status) {
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

function Results({ className, suppliers, deleteSupplier, ...rest }) {
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
  const filteredSuppliers = applyFilters(suppliers, filters);
  const paginatedSuppliers = applyPagination(filteredSuppliers, page, limit);

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
          <Box flexGrow={1} />
        </Box>
      </Box>
      <PerfectScrollbar>
        <Box >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Supplier ID
                </TableCell>
                <TableCell>
                  Name
                </TableCell>
                <TableCell>
                  Mobile
                </TableCell>
                <TableCell>
                  Email
                </TableCell>
                <TableCell>
                  Phone
                </TableCell>
                <TableCell>
                  Country
                </TableCell>
                <TableCell>
                  State
                </TableCell>
                <TableCell>
                  City
                </TableCell>
                <TableCell>
                  Postcode
                </TableCell>
                <TableCell>
                  Address
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
              {paginatedSuppliers.map((supplier) => {

                return (
                  <TableRow
                    hover
                    key={supplier._id}
                  >
                    <TableCell>
                      {supplier.number}
                    </TableCell>
                    <TableCell>
                      {supplier.name}
                    </TableCell>
                    <TableCell>
                      {supplier.mobile}
                    </TableCell>
                    <TableCell>
                      {supplier.email}
                    </TableCell>
                    <TableCell>
                      {supplier.phone}
                    </TableCell>
                    <TableCell>
                      {supplier.country}
                    </TableCell>
                    <TableCell>
                      {supplier.state}
                    </TableCell>
                    <TableCell>
                      {supplier.city}
                    </TableCell>
                    <TableCell>
                      {supplier.postcode}
                    </TableCell>
                    <TableCell>
                      {supplier.address}
                    </TableCell>
                    <TableCell>
                      {getStatusLabel(supplier.status)}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        component={RouterLink}
                        to={"/app/suppliers/supplierEdit/" + supplier._id}
                      >
                        <SvgIcon fontSize="small">
                          <EditIcon />
                        </SvgIcon>
                      </IconButton>
                      <IconButton
                        onClick={() => { if (window.confirm('Are you really want to delete?')) deleteSupplier(supplier._id) }}
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
  suppliers: PropTypes.array
};

Results.defaultProps = {
  suppliers: []
};

export default Results;
