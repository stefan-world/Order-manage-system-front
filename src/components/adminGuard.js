import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

function AdminGuard({ children }) {
  const account = useSelector((state) => state.account);

  if (account.user.role !== "admin") {
    return <Redirect to="/home" />;
  }

  return children;
}

AdminGuard.propTypes = {
  children: PropTypes.any
};

export default AdminGuard;
