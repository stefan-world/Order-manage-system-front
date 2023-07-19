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

function applyPagination(users, page, limit) {
  return users.slice(page * limit, page * limit + limit);
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

function applySort(users, sort) {
  const [orderBy, order] = sort.split('|');
  const comparator = getComparator(order, orderBy);
  const stabilizedThis = users.map((el, index) => [el, index]);

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

function applySupplyFilters(items, filters) {
  return items.filter((item) => {
    let matches = true;

    if (filters.status && item.account_id !== filters.status) {
      matches = false;
    }

    return matches;
  });
}

function Results({ className, users, accounts, deletUser, ...rest }) {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState(sortOptions[0].value);
  const [filter_sup, setFilter_sup] = useState({ status: null });

  const accountsOptions = accounts
    .map((el) => {
      if (el.status === "active") {
        return { id: el._id, name: el.account_name };
      }
      return null;
    })
    .filter((option) => option !== null);
  accountsOptions.unshift({ id: "all", name: "All" })

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

  const handleAccountChange = (event) => {
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
  const FilteredUsers = applySupplyFilters(users, filter_sup);
  const sortedUsers = applySort(FilteredUsers, sort);
  const paginatedUsers = applyPagination(sortedUsers, page, limit);

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
          label="Accounts"
          name="account"
          onChange={handleAccountChange}
          select
          SelectProps={{ native: true }}
          value={filter_sup.status || 'all'}
          variant="outlined"
        >
          {accountsOptions.map((option) => (
            <option
              key={option.id}
              value={option.id}
            >
              {option.name}
            </option>
          ))}
        </TextField>
        <Box flexGrow={1} />
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
                  No
                </TableCell>
                <TableCell>
                  User Name
                </TableCell>
                <TableCell>
                  Account
                </TableCell>
                <TableCell>
                  Email
                </TableCell>
                <TableCell>
                  Phone
                </TableCell>
                <TableCell>
                  Address
                </TableCell>
                <TableCell>
                  Role
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
              {paginatedUsers.map((user, key) => {

                return (
                  <TableRow
                    hover
                    key={user._id}
                  >
                    <TableCell>
                      {user.number}
                    </TableCell>
                    <TableCell>
                      <Box
                        display="flex"
                        alignItems="center"
                      >
                        <Avatar
                          className={classes.avatar}
                          src={user.avatar}
                        >
                        </Avatar>
                        <div>
                          <Link
                            color="inherit"
                            variant="h6"
                          >
                            {user.username}
                          </Link>
                        </div>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {user.role == "super_admin" ? "Sueper Admin"
                      : accounts.filter(account => account._id === user.account_id)[0].account_name 
                      }
                    </TableCell>
                    <TableCell>
                      {user.email}
                    </TableCell>
                    <TableCell>
                      {user.phone}
                    </TableCell>
                    <TableCell>
                      {user.address}
                    </TableCell>
                    <TableCell>
                      {user.role}
                    </TableCell>
                    <TableCell>
                      {getStatusLabel(user.status)}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        component={RouterLink}
                        to={"/app/users/edit/" + user._id}
                      >
                        <SvgIcon fontSize="small">
                          <EditIcon />
                        </SvgIcon>
                      </IconButton>
                      {(user.role == 'user') &&
                        <IconButton
                          onClick={() => { if (window.confirm('Are you really want to delete?')) deletUser(user._id) }}
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
        count={users.length}
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
  users: PropTypes.array
};

Results.defaultProps = {
  users: []
};

export default Results;
