/* eslint-disable max-len */
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Avatar,
  Box,
  Card,
  Divider,
  IconButton,
  Link,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  makeStyles
} from '@material-ui/core';
import { Edit as EditIcon } from 'react-feather';
import DeleteIcon from '@material-ui/icons/Delete';
import Label from 'src/components/Label';

const sortOptions = [
  {
    value: 'updatedAt|asc',
    label: 'updated date (oldest first)'
  },
  {
    value: 'updatedAt|desc',
    label: 'updated date (newest first)'
  },
];

function applyPagination(accounts, page, limit) {
  return accounts.slice(page * limit, page * limit + limit);
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

function applySort(accounts, sort) {
  const [orderBy, order] = sort.split('|');
  const comparator = getComparator(order, orderBy);
  const stabilizedThis = accounts.map((el, index) => [el, index]);

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

function Results({ className, accounts, deletAccount, ...rest }) {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState(sortOptions[0].value);


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

  const sortedAccounts = applySort(accounts, sort);
  const paginatedAccounts = applyPagination(sortedAccounts, page, limit);

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
        <Box minWidth={700}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  ID
                </TableCell>
                <TableCell style={{minWidth: '150px'}}>
                  Account Name
                </TableCell>
                <TableCell style={{minWidth: '160px'}}>
                  Primary First Name
                </TableCell>
                <TableCell style={{minWidth: '160px'}}>
                  Primary Last Name
                </TableCell>
                <TableCell style={{minWidth: '150px'}}>
                  Primary mobile
                </TableCell>
                <TableCell style={{minWidth: '150px'}}>
                  Address Line 1
                </TableCell>
                <TableCell style={{minWidth: '150px'}}>
                  Address Line 2
                </TableCell>
                <TableCell>
                  City
                </TableCell>
                <TableCell>
                  State
                </TableCell>
                <TableCell>
                  State
                </TableCell>
                <TableCell>
                  Postcode
                </TableCell>
                <TableCell>
                  Country
                </TableCell>
                <TableCell>
                  Company Email
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
              {paginatedAccounts.map((account) => {

                return (
                  <TableRow
                    hover
                    key={account._id}
                  >
                    <TableCell>
                      {account.number}
                    </TableCell>
                    <TableCell>
                      {account.account_name}
                    </TableCell>
                    <TableCell>
                      {account.primary_contact_firstname}
                    </TableCell>
                    <TableCell>
                      {account.primary_contact_lastname}
                    </TableCell>
                    <TableCell>
                      {account.primary_contact_mobile}
                    </TableCell>
                    <TableCell>
                      {account.primary_contact_email}
                    </TableCell>
                    <TableCell>
                      {account.address_line1}
                    </TableCell>
                    <TableCell>
                      {account.address_line2}
                    </TableCell>
                    <TableCell>
                      {account.city}
                    </TableCell>
                    <TableCell>
                      {account.state}
                    </TableCell>
                    <TableCell>
                      {account.postcode}
                    </TableCell>
                    <TableCell>
                      {account.country}
                    </TableCell>
                    <TableCell>
                      {account.company_eamil}
                    </TableCell>
                    <TableCell>
                    {getStatusLabel(account.status)}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        component={RouterLink}
                        to={"/app/accounts/edit/" + account._id}
                      >
                        <SvgIcon fontSize="small">
                          <EditIcon />
                        </SvgIcon>
                      </IconButton>
                      {(account.role == 'user') &&
                        <IconButton
                          onClick={() => { if (window.confirm('Are you really want to delete?')) deletAccount(account._id) }}
                        >
                          <SvgIcon fontSize="small">
                            <DeleteIcon />
                          </SvgIcon>
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
        count={accounts.length}
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
  accounts: PropTypes.array
};

Results.defaultProps = {
  accounts: []
};

export default Results;
