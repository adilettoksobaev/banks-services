import React from 'react';
import Pagination from '@material-ui/lab/Pagination';
import './Paginations.scss'

const Paginations = () =>  {
  return (
    <Pagination count={10} shape="rounded" className="paginations" />
  );
}

export default Paginations