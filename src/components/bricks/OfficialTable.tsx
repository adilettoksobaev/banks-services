import React from 'react';
import {TableContainer, Table, TableBody, TableRow, TableCell, } from '@material-ui/core';
import { NavLink } from 'react-router-dom';

function createData(name: string, position: string) {
    return { name, position };
}
  
const rows = [
    createData('Абассов Башар Махмудович', 'Заместитель генерального директора'),
    createData('Иванова Алла Борисовна', 'Главный бухгалтер'),
];

const OfficialTable = () => {
    return (
        <TableContainer className="tableContainer">
            <Table className="table">
                <TableBody>
                    {rows.map((row, i) => (
                        <TableRow key={i}>
                            <TableCell align="left">{row.name}</TableCell>
                            <TableCell component="th" scope="row">{row.position}</TableCell>
                            <TableCell align="right">
                                <NavLink className="tableLink tableLinkBlue" to="#">Просмотр</NavLink>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default OfficialTable;