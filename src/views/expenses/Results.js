/* eslint-disable max-len */
import React, { useState, useRef } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
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
  Typography,
  makeStyles
} from '@material-ui/core';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
} from 'react-feather';

const sortOptions = [
  {
    value: 'createdAt|asc',
    label: 'Record date(old to new)'
  },
  {
    value: 'createdAt|desc',
    label: 'Record date(new to old)'
  },
  {
    value: 'total|desc',
    label: 'total amount (high to low)'
  },
  {
    value: 'total|asc',
    label: 'total amount (low to high)'
  }
];

function applyPagination(customers, page, limit) {
  return customers.slice(page * limit, page * limit + limit);
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

function applySort(customers, sort) {
  const [orderBy, order] = sort.split('|');
  const comparator = getComparator(order, orderBy);
  const stabilizedThis = customers.map((el, index) => [el, index]);

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
  },
  edit:{
    height:"30px",
    width:"120px", 
    fontSize:'15px',
    backgroundColor:'lightblue',
     borderRadius:'5px'
  }
}));

function Results({ className, expenses, deleteExpense,editExpense, ...rest }) {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState(sortOptions[0].value);
  const [editFlage, setEditFlag] = useState(null);

  const name = useRef(null);
  const total = useRef(null);
  const payment = useRef(null);

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

 // const filteredCustomers = applyFilters(customers, filters);
  const sortedCustomers = applySort(expenses, sort);
  const paginatedCustomers = applyPagination(sortedCustomers, page, limit);


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
        <Box >
          <Table>
            <TableHead>
              <TableRow>
              <TableCell>
                  No
                </TableCell>
                <TableCell>
                 Expense name
                </TableCell>
                <TableCell>
                  Total need amount ($)
                </TableCell>
                <TableCell>
                  Real Payment
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
              {paginatedCustomers.map((expense) => {

                return (
                  <TableRow
                    hover
                    key={expense._id}
                  > 
                     <TableCell>
                      {expense.number}
                    </TableCell>
                    <TableCell>
                    { (editFlage !== expense._id)&&
                      expense.name
                    }
                    { (editFlage === expense._id)&&
                      <input type='text' className={classes.edit} ref={name} defaultValue={expense.name} />
                    }                   
                    </TableCell>
                    <TableCell>                 
                      { (editFlage !== expense._id)&&
                        expense.total.toFixed(2)
                    }
                    { (editFlage === expense._id)&&
                      <input type='number' className={classes.edit} ref={total} defaultValue={expense.total} />
                    }
                    </TableCell>
                    <TableCell>
                      { (editFlage !== expense._id)&&
                        expense.payment.toFixed(2)
                      }
                    { (editFlage === expense._id)&&
                      <input type='number' className={classes.edit} ref={payment} defaultValue={expense.payment} />
                    }
                    </TableCell>
                    <TableCell>
                    {moment(expense.createdAt).format('DD/MM/YYYY')}
                    </TableCell>
                    <TableCell align="right">
                    { (editFlage !== expense._id)&&
                      <IconButton
                        onClick={()=>{setEditFlag(expense._id);}}
                      >
                        <SvgIcon fontSize="small">
                          <EditIcon />
                        </SvgIcon>
                      </IconButton>
                       }
                       { (editFlage !== expense._id)&&
                      <IconButton
                       onClick={() => {if(window.confirm('Are you really want to delete?') ) deleteExpense(expense._id)}}
                      >
                        <SvgIcon fontSize="small">
                          <DeleteIcon />
                        </SvgIcon>
                      </IconButton>
                     }
                      { (editFlage === expense._id)&&
                      <IconButton
                        onClick={()=>{editExpense(name.current.value, total.current.value, payment.current.value, expense._id); setEditFlag(null);}}
                      >
                        <SvgIcon fontSize="small">
                          <SaveIcon />
                        </SvgIcon>
                      </IconButton>
                       }
                        { (editFlage === expense._id)&&
                      <IconButton
                        onClick={()=>{setEditFlag(null);}}
                      >
                        <Typography
                        variant='h6'>
                          Cancel
                        </Typography>
                      </IconButton>
                       }
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
        count={expenses.length}
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
  customers: PropTypes.array
};

Results.defaultProps = {
  customers: []
};

export default Results;
