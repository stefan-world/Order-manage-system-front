
import React, { useState, useCallback, useEffect, useRef } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
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
  MenuItem,
  Button,
  SvgIcon,
} from '@material-ui/core';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'src/utils/axios';
import { API_BASE_URL } from 'src/config';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

function applyPagination(itemsList, page, limit) {
  return itemsList.slice(page * limit, page * limit + limit);
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

function Results({ className, ...rest }) {

  const location = useLocation();
  const tableRef = useRef(null);
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState(sortOptions[0].value);
  const [itemslit, setItemslist] = useState(null);
  const [status, setStatus] = useState();
  const { user } = useSelector((state) => state.account);
  const [supplier, setSupplier] = useState(null);
  const searchParams = new URLSearchParams(location.search);

  useEffect(() => {
    let id = searchParams.get('Id');
    let account
    let supplier_id = searchParams.get('supplier');
    axios
    .get(API_BASE_URL + 'order/list/' + id)
    .then((response) => {
      setItemslist(response.data.itemsList);
    });
    setStatus(searchParams.get('status'));
  axios
    .post(API_BASE_URL + 'suppliers/edit', { id: supplier_id })
    .then((response) => {
      setSupplier(response.data.supplier);
    });
  }, []);

  if (!itemslit) {
    return null;
  }

  function handleExport() {
    document.getElementById("pdfComponant").style.display = "block";
    const input = tableRef.current;
    html2canvas(input, {
      scale: 1,
      useCORS: true,
      scrollX: -window.scrollX,
      scrollY: -window.scrollY
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
        pdf.save('table.pdf');
      });
    document.getElementById("pdfComponant").style.display = "none";
  }

  const handleSortChange = (event) => {
    event.persist();
    setSort(event.target.value);
  };

  const handleSelectChange = (event) => {
    setStatus(event.target.value);
  }

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const sortedProducts = applySort(itemslit, sort);
  const paginatedProducts = applyPagination(sortedProducts, page, limit);

  const pdfComponant = (<div ref={tableRef} id="pdfComponant" style={{ width: '793px', height: '1122px', display: 'none', fontFamily: 'helvetica', fontSize: '12pt', color: 'black', padding: '20px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <h2 style={{ margin: '10px' }}>{user.username}</h2>
        <h4 style={{ margin: '10px' }}>{user.address}</h4>
      </div>
      <div>
        <h1>PURCHASE ORDER</h1>
        <h4 style={{ margin: '20px', float: 'right' }}>{'PO: #' + itemslit[0].number}</h4>
        <h4 style={{ margin: '20px', float: 'right' }}>{moment(itemslit[0].updatedAt).format('DD/MM/YYYY')}</h4>
      </div>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ width: '350px' }}>
        <h4 style={{ backgroundColor: '#19194d', padding: '5px 30px', color: 'white' }}>VENDOR</h4>
        <h4 style={{ padding: '5px 30px' }}>{supplier.name}</h4>
        <h4 style={{ padding: '5px 30px' }}>{supplier.email}</h4>
        <h4 style={{ padding: '5px 30px' }}>{supplier.address}</h4>
        <h4 style={{ padding: '5px 30px' }}>{supplier.city+", "+supplier.postcode}</h4>
        <h4 style={{ padding: '5px 30px' }}>{supplier.phone}</h4>
      </div>
      <div style={{ width: '350px' }}>
        <h4 style={{ backgroundColor: '#19194d', padding: '5px 30px', color: 'white' }}>SHIP TO</h4>
        {/* <h4 style={{ padding: '5px 30px' }}>Name</h4> */}
        <h4 style={{ padding: '5px 30px' }}>{user.username}</h4>
        <h4 style={{ padding: '5px 30px' }}>{user.address}</h4>
        {/* <h4 style={{ padding: '5px 30px' }}>City, Zip</h4> */}
        <h4 style={{ padding: '5px 30px' }}>{user.phone}</h4>
      </div>
    </div>
    <table style={{ width: '100%', border: '1px solid black', borderCollapse: 'collapse', marginTop: '20px' }}>
      <thead style={{ backgroundColor: '#19194d', color: 'white' }}>
        <tr>
          <th style={{ border: '1px solid white', padding: '8px' }}>ID</th>
          <th style={{ border: '1px solid white', padding: '8px' }}>Name</th>
          <th style={{ border: '1px solid white', padding: '8px' }}>Quantity</th>
          <th style={{ border: '1px solid white', padding: '8px' }}>Price</th>
          <th style={{ border: '1px solid white', padding: '8px' }}>Description</th>
          <th style={{ border: '1px solid white', padding: '8px' }}>Order Date</th>
        </tr>
      </thead>
      <tbody>
        {paginatedProducts.map((product) => {
          return (
            <tr key={product._id}>
              <td style={{ border: '1px solid #19264d', padding: '8px' }}>
                {product.number}
              </td>
              <td style={{ border: '1px solid #19264d', padding: '8px' }}>
                {product.name}
              </td>
              <td style={{ border: '1px solid #19264d', padding: '8px' }}>
                {product.quantity}
              </td>
              <td style={{ border: '1px solid #19264d', padding: '8px' }}>
                {product.currency}
                {product.price}
              </td>
              <td style={{ border: '1px solid #19264d', padding: '8px' }}>
                {product.description}
              </td>
              <td style={{ border: '1px solid #19264d', padding: '8px' }}>
                {moment(product.updatedAt).format('DD/MM/YYYY')}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>)

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
        spacing={3}
      >
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
        <TextField
          select
          margin="normal"
          name="status"
          style={{ width: '150px' }}
          label="Select Status"
          value={status}
          onChange={handleSelectChange}
          variant="outlined"
        >
          <MenuItem value={"progress"}>Progress</MenuItem>
          <MenuItem value={"done"}>Done</MenuItem>
        </TextField>
        <Box flexGrow={10} />
        <Button
          color="secondary"
          variant="contained"
          className={classes.action}
          onClick={handleExport}
        >
          <SvgIcon
            fontSize="small"
            className={classes.actionIcon}
          >
          </SvgIcon>
          Export to PDF
        </Button>
      </Box>
      <PerfectScrollbar>
        <Box minWidth={700}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Product ID
                </TableCell>
                <TableCell>
                  Product Name
                </TableCell>
                <TableCell>
                  Quantity
                </TableCell>
                <TableCell>
                  Price
                </TableCell>
                <TableCell>
                  Description
                </TableCell>
                <TableCell>
                  Ordered Date
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedProducts.map((product) => {
                return (
                  <TableRow
                    key={product._id}
                    hover
                  >
                    <TableCell>
                      {product.number}
                    </TableCell>
                    <TableCell>
                      {product.name}
                    </TableCell>
                    <TableCell>
                      {product.quantity}
                    </TableCell>
                    <TableCell>
                      {product.currency}
                      {product.price}
                    </TableCell>
                    <TableCell>
                      {product.description}
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
        count={itemslit.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
      {pdfComponant}
    </Card>
  );
}

Results.propTypes = {
  className: PropTypes.string,
  itemslit: PropTypes.array
};

Results.defaultProps = {
  itemslit: []
};

export default Results;