import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../store';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { AdminAPI } from '../../api/AdminAPI';
import { ICustomers } from '../../store/Admin/types';
import Pagination from '@material-ui/lab/Pagination';

type Props = ReturnType<typeof mapStateToProps>;

const ClientsTable:React.FC<Props> = ({ sessionId }) => {
    let history = useHistory();
    const [customers, setCustomers] = useState<ICustomers[]>([]);
    const [foundCustomers, setFoundCustomers] = useState(0);
    const [page, setPage] = React.useState(1);
    const limit = 10;
    const min = (page -1) * limit;
    
    useEffect(() => {
        if(sessionId) {
            AdminAPI.searchCustomers(sessionId, limit, min).then(data => {
                setFoundCustomers(data.foundCustomers);
                setCustomers(data.customers);
            }).catch(({response}) => alert(response.data.message));
        }
    }, [sessionId, min, setFoundCustomers, setCustomers]);

    const paginationChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    let currentCount = (foundCustomers - (foundCustomers % limit)) / limit;
    if (foundCustomers % limit > 0) {
        currentCount = currentCount + 1;
    }

    const customerClick = (customerId: number) => {
        return history.push(`/clients/${customerId}`);
    }

    return (
        <>
        <TableContainer className="tableContainer">
            <Table className="table">
                <TableHead className="tableHead">
                    <TableRow>
                        <TableCell style={{width: 16}}>№</TableCell>
                        <TableCell align="left">Наименование</TableCell>
                        <TableCell align="center">Телефон</TableCell>
                        <TableCell align="center">Действие</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {customers.map((customer, i) => (
                        <TableRow key={customer.customerId}>
                            <TableCell>{i + 1}</TableCell>
                            <TableCell component="th" scope="row">{customer.customerName}</TableCell>
                            <TableCell align="center">{customer.customerPhone}</TableCell>
                            <TableCell align="center">
                                <Button className="tableLinkBlue" onClick={() => customerClick(customer.customerId)}>Просмотр</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        <div className="justify-center">
            {foundCustomers > 9 && 
                <Pagination count={currentCount} page={page} onChange={paginationChange} shape="rounded" className="paginations" />
            }
        </div>
        </>
    );
}

const mapStateToProps = (state: RootState) => ({
    sessionId: state.auth.sessionId,
});

export default connect(mapStateToProps)(ClientsTable);