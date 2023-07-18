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
  IconButton,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  makeStyles,
  Checkbox,
  Button,
  LinearProgress,
  Typography
} from '@material-ui/core';
import { Edit as EditIcon } from 'react-feather';
import Label from 'src/components/Label';
import { useSelector, useDispatch } from 'react-redux';
import { API_BASE_URL } from 'src/config';
import { selectOrder } from 'src/actions/checkboxAction';
import { saveQuantity } from 'src/actions/quantityAction';
import DeleteIcon from '@material-ui/icons/Delete';
import CSVReader from 'react-csv-reader';
import { useSnackbar } from 'notistack';

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

function applySupplyFilters(invoices, filters) {
  return invoices.filter((invoice) => {
    let matches = true;

    if (filters.status && invoice.supplier_id !== filters.status) {
      matches = false;
    }

    return matches;
  });
}

function applyCheckFilters(items, rows, isChecked) {
  return items.filter(item => {
    if(!isChecked)
      return item
    if (rows?.indexOf(item._id) !== -1)
      return item._id; 
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

function Results({ className, products, deleteProduct, ...rest }) {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState(sortOptions[0].value);
  const [filters, setFilters] = useState({ status: null });
  const [filter_sup, setFilter_sup] = useState({ status: null });
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.account);
  const [suppliers, setSupplier] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [quantity, setQuantity] = useState([]);
  const [progress, setProgress] = useState(0);
  const { enqueueSnackbar } = useSnackbar();
  const [batchCount, setBatchCount] = useState(0);
  const [total, setTotal] = useState();
  const [checked_filter, setChecked_filter] = useState(false);  
  const checkedRows = useSelector((state) => state.selectedRows);
  const [selectedRows, setSelectedRows] = useState(checkedRows.checkedRows);

  const getProducts = useCallback(() => {
    axios.get(API_BASE_URL + 'suppliers/list/' + user._id)
      .then((response) => {
        setSupplier(response.data.suppliers);
      });
  }, [user._id]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  useEffect(() => {
    if (batchCount === total) {
      enqueueSnackbar('Imported CSV successfully!', {
        variant: 'success',
      });
    }
  }, [batchCount, total]);

  const supplierOptions = suppliers
    .map((el) => {
      if (el.status === "active") {
        return { id: el._id, name: el.name };
      }
      return null;
    })
    .filter((option) => option !== null);
  supplierOptions.unshift({ id: "all", name: "All" })

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

  const handleSupplierChange = (event) => {
    event.persist();

    let value = null;

    if (event.target.value !== 'all') {
      value = event.target.value;
    }
    setFilter_sup((prevFilters) => ({
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

  const filteredProducts = applyFilters(products, filters); console.log("rows: ", selectedRows)
  const supplierFilteredProducts = applySupplyFilters(filteredProducts, filter_sup);
  const checkedProducts = applyCheckFilters(supplierFilteredProducts, selectedRows, checked_filter);
  const searchedProducts = checkedProducts.filter(item =>
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

  const handleQuantityChan = (e, id) => {
    const index = quantity.findIndex(item => item[id] !== undefined);

    if (index === -1) {
      setQuantity([...quantity, { [id]: e.target.value }]);
    } else {
      const updatedQuantity = quantity.map(item => {
        if (item[id] !== undefined) {
          return { [id]: e.target.value };
        } else {
          return item;
        }
      });
      setQuantity(updatedQuantity);
    }

  }

  dispatch(saveQuantity(quantity));

  function handleFile(data, fileInfo) {
    const batchSize = 100; // Maximum batch size
    const productsList = data.slice(1); // Remove header row
    let index = 0;
    if (filter_sup.status == null) {
      alert("Please select supplier");
      return;
    }
    const totalBatches = Math.ceil(productsList.length / batchSize);
    setTotal(totalBatches);

    while (index < productsList.length) {
      const batch = productsList.slice(index, index + batchSize);
      axios.post(API_BASE_URL + 'product/importcsv', {
        id: user._id,
        supplier_id: filter_sup.status,
        products_list: batch
      }, {
        // onUploadProgress: (progressEvent) => {
        //   const progress = Math.round((index ) / productsList.length * 100);
        //   console.log(progress, progressEvent)
        //   setProgress(progress);
        // }
      })
        .then((response) => {
          console.log(`Batch ${index / batchSize + 1} sent successfully!`);
          setBatchCount(prevCount => prevCount + 1);
        })
        .catch((error) => {
          console.error(`Error sending batch ${index / batchSize + 1}:`, error);
          enqueueSnackbar(error.message, {
            variant: 'error'
          });
        });

      index += batchSize;
    }
  }

  function change_filter(){
    setChecked_filter(!checked_filter);
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
          label="Supplier"
          name="supplier"
          onChange={handleSupplierChange}
          select
          SelectProps={{ native: true }}
          value={filter_sup.status || 'all'}
          variant="outlined"
        >
          {supplierOptions.map((statusOption) => (
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
        <Box flexGrow={1} />
        <CSVReader
          onFileLoaded={handleFile}
          inputId="csv-input"
          inputStyle={{ display: 'none' }}
        >
          
        </CSVReader>
        <LinearProgress variant="determinate" value={progress} />
        <Button
          color="secondary"
          variant="contained"
          className={classes.action}
          component={RouterLink}
          to='/app/products/productList'
          onClick={() => document.getElementById('csv-input').click()}
        >
          Import Products
        </Button>
      </Box>
      <PerfectScrollbar>
        <Box minWidth={700}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox checked={checked_filter} onClick={change_filter}/>
                </TableCell>
                <TableCell>
                  ID
                </TableCell>
                <TableCell>
                  Name
                </TableCell>
                {/* <TableCell>
                  Image
                </TableCell> */}
                <TableCell>
                  Brand
                </TableCell>
                <TableCell>
                  Category
                </TableCell>
                <TableCell>
                  Subcategory
                </TableCell>
                <TableCell>
                  Bar Code
                </TableCell>
                <TableCell>
                  Purchase
                </TableCell>
                <TableCell>
                  Order Quantity
                </TableCell>
                <TableCell>
                  Sales Price
                </TableCell>
                <TableCell>
                  Available
                </TableCell>
                <TableCell>
                  Tax
                </TableCell>
                <TableCell>
                  Weighable
                </TableCell>
                <TableCell>
                  Show In Online
                </TableCell>
                <TableCell>
                  Status
                </TableCell>
                <TableCell>
                  Description
                </TableCell>
                <TableCell>
                  Date
                </TableCell>
                <TableCell align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedProducts.map((product) => {
                const isRowSelected = selectedRows.indexOf(product._id) !== -1;
                const isRowDisabled = product.status;
                const value = quantity.find(item => item[product._id] !== undefined);
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
                    {/* <TableCell>
                      <Avatar
                        className={classes.avatar}
                        src={product.avatar}
                      >
                      </Avatar>
                    </TableCell> */}
                    <TableCell>
                      {product.brand}
                    </TableCell>
                    <TableCell>
                      {product.category}
                    </TableCell>
                    <TableCell>
                      {product.subcategory}
                    </TableCell>
                    <TableCell>
                      {product.barcode}
                    </TableCell>
                    <TableCell>
                      {product.purchase}
                    </TableCell>
                    <TableCell style={{ width: '150px', alignItems: 'center' }}>
                      <TextField
                        onClick={handleEnterQuantity}
                        name={product._id + "-quantity"}
                        type="number"
                        value={
                          quantity.find(item => item[product._id] !== undefined) ? quantity.find(item => item[product._id] !== undefined)[product._id] : ''
                        }
                        onChange={(e) => handleQuantityChan(e, product._id)}
                        disabled={isRowSelected === false}
                      />
                    </TableCell>
                    <TableCell>
                      {product.currency}
                      {product.price}
                    </TableCell>
                    <TableCell>
                      {product.available}
                    </TableCell>
                    <TableCell>
                      {product.tax}
                    </TableCell>

                    <TableCell>
                      {product.weighable}
                    </TableCell>
                    <TableCell>
                      {product.showInOnline}
                    </TableCell>

                    <TableCell>
                      {getStatusLabel(product.status)}
                    </TableCell>
                    <TableCell>
                      {product.description}
                    </TableCell>
                    <TableCell>
                      {moment(product.updatedAt).format('DD/MM/YYYY')}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        component={RouterLink}
                        to={"/app/products/productEdit/" + product._id}
                      >
                        <SvgIcon fontSize="small">
                          <EditIcon />
                        </SvgIcon>
                      </IconButton>
                      <IconButton
                        onClick={() => { if (window.confirm('Are you really want to delete?')) deleteProduct(product._id) }}
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