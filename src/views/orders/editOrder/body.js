/* eslint-disable max-len */
// import React, { useState } from 'react';
import React, {
  useState,
  useEffect,
  useCallback
} from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import axios from 'src/utils/axios';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Avatar,
  Box,
  Card,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  makeStyles,
  Checkbox
} from '@material-ui/core';
import Label from 'src/components/Label';
import { useDispatch } from 'react-redux';
import { API_BASE_URL } from 'src/config';
import { selectOrder } from 'src/actions/checkboxAction';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import { useParams } from 'react-router-dom';

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
  }
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

const sortOptions = [
  {
    value: 'updatedAt|asc',
    label: 'Added Date (oldest first)'
  },
  {
    value: 'updatedAt|desc',
    label: 'Added Date (newest first)'
  },

  {
    value: 'price|desc',
    label: 'Price (high to low)'
  },
  {
    value: 'price|asc',
    label: 'Price (low to high)'
  }
];

function applyFilters(invoices, filters) {
  return invoices.filter((invoice) => {
    let matches = true;

    if (filters.status && invoice.status !== filters.status) {
      matches = false;
    }

    return matches;
  });
}

function applySupplyFilters(items, filters) {
  return items.filter((item) => {
    let matches = true;

    if (filters.status && item.supplier_id !== filters.status) {
      matches = false;
    }
    return matches;
  });
}

function applyPagination(products, page, limit) {
  return products.slice(page * limit, page * limit + limit);
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }

  if (b[orderBy] > a[orderBy]) {
    return 1;
  }

  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySort(products, sort) {
  const [orderBy, order] = sort.split('|');
  const comparator = getComparator(order, orderBy);
  const stabilizedThis = products.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    // eslint-disable-next-line no-shadow
    const order = comparator(a[0], b[0]);

    if (order !== 0) return order;

    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0]);
}

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    height: 42,
    width: 42,
    marginRight: theme.spacing(1)
  }
}));

function Results({ className, products, ...rest }) {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const params = useParams();
  const [sort, setSort] = useState(sortOptions[0].value);
  const [filters, setFilters] = useState({ status: null });
  const [filter_sup, setFilter_sup] = useState({ status: null });
  const [searchTerm, setSearchTerm] = useState('');
  const isMountedRef = useIsMountedRef();
  const [selectedRows, setSelectedRows] = useState([]);
  const [quantity, setQuantity] = useState([]);
  const dispatch = useDispatch();

  const getProducts = useCallback(() => {
    let id = params.Id;
    axios
      .get(API_BASE_URL + 'order/list/' + id)
      .then((response) => {
        if (isMountedRef.current) {
          console.log(response.data.itemsList)
          setSelectedRows(response.data.itemsList.map(item=>item._id));
          setQuantity(response.data.itemsList.map(item=>item.quantity))
        }
        setFilter_sup((prevFilters) => ({
          ...prevFilters,
          status: response.data.itemsList[0].supplier
        }));
      });

  }, [isMountedRef]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

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

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event) => {
    event.persist();
    setSort(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const filteredProducts = applyFilters(products, filters);
  const supplierFilteredProducts = applySupplyFilters(filteredProducts, filter_sup);
  const searchedProducts = supplierFilteredProducts.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const sortedProducts = applySort(searchedProducts, sort);
  const paginatedProducts = applyPagination(sortedProducts, page, limit);

  const handleRowSelection = (event, rowId) => {
    const selectedIndex = selectedRows.indexOf(rowId);
    let newSelectedRows = [];

    if (selectedIndex === -1) {
      newSelectedRows = newSelectedRows.concat(selectedRows, rowId);
    } else if (selectedIndex === 0) {
      newSelectedRows = newSelectedRows.concat(selectedRows.slice(1));
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelectedRows = newSelectedRows.concat(selectedRows.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedRows = newSelectedRows.concat(
        selectedRows.slice(0, selectedIndex),
        selectedRows.slice(selectedIndex + 1),
      );
    }

    setSelectedRows(newSelectedRows);
    dispatch(selectOrder(newSelectedRows));
  };

  const handleEnterQuantity = (event) => {
    event.stopPropagation();
  }

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Divider />
      <Box
        p={2}
        minHeight={56}
        display="flex"
        alignItems="center"
      >
        <TextField
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
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchTermChange}
        />
        <Box flexGrow={5} />
        <TextField
          label="Sort By"
          name="sort"
          onChange={handleSortChange}
          select
          SelectProps={{ native: true }}
          value={sort}
          variant="outlined"
        >
          {sortOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </TextField>
      </Box>
      <PerfectScrollbar>
        <Box minWidth={700}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell>
                <TableCell>
                  ID
                </TableCell>
                <TableCell>
                  Name
                </TableCell>
                <TableCell>
                  Image
                </TableCell>
                <TableCell style={{ width: '400px' }}>
                  Description
                </TableCell>
                <TableCell>
                  Price
                </TableCell>
                <TableCell>
                  barcode
                </TableCell>
                <TableCell>
                  Quantity/Box
                </TableCell>
                <TableCell>
                  Ordere Quantity
                </TableCell>
                <TableCell>
                  status
                </TableCell>
                <TableCell>
                  Added Date
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedProducts.map((product) => {
                const isRowSelected = selectedRows.indexOf(product._id) !== -1;
                console.log(quantity[selectedRows.indexOf(product._id)]);
                const isRowDisabled = product.status;
                return (
                  <TableRow
                    key={product._id}
                    hover
                    onClick={isRowDisabled === "deactive" ? null : (event) => handleRowSelection(event, product._id)}
                    role="checkbox"
                    aria-checked={isRowSelected}
                    selected={isRowSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox checked={isRowSelected} disabled={isRowDisabled === "deactive"} />
                    </TableCell>
                    <TableCell>
                      {product.number}
                    </TableCell>
                    <TableCell>
                      {product.name}
                    </TableCell>
                    <TableCell>
                      <Avatar
                        className={classes.avatar}
                        src={product.avatar}
                      >
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      {product.description}
                    </TableCell>
                    <TableCell>
                      {product.currency}
                      {product.price}
                    </TableCell>
                    <TableCell>
                      {product.barcode}
                    </TableCell>
                    <TableCell>
                      {product.quantity}
                    </TableCell>
                    <TableCell style={{ width: '150px', alignItems: 'center' }}>
                      <TextField
                        onClick={handleEnterQuantity}
                        type="number"
                        name={product._id + "-quantity"}
                        value={quantity[selectedRows.indexOf(product._id)]}
                        disabled={isRowSelected === false} />
                    </TableCell>
                    <TableCell>
                      {getStatusLabel(product.status)}
                    </TableCell>
                    <TableCell>
                      {moment(product.updatedAt).format('DD/MM/YYYY')}
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
        count={products.length}
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
  products: PropTypes.array
};

Results.defaultProps = {
  products: []
};

export default Results;