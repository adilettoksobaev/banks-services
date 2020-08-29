import React, { Dispatch, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import { Grid, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Tooltip } from '@material-ui/core';
import AddStaff from '../bricks/AddStaff';
import EditStaff from '../bricks/EditStaff';
import { AdminAPI } from '../../api/AdminAPI';
import Pagination from '@material-ui/lab/Pagination';
import { IEmployees } from '../../store/Admin/types';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { Roles } from '../../store/Auth/types';
import DeleteEmployee from '../bricks/DeleteEmployee';

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>

const Personal:React.FC<Props> = ({ sessionId, employeeSuccess }) => {
    const [openStaff, setOpenStaff] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [foundEmployees, setFoundEmployees] = useState(0);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [employees, setEmployees] = useState<IEmployees[]>([]);
    const [employee, setEmployee] = useState<IEmployees>({
        departmentId: 0,
        employeeId: 0,
        employeeInn: '',
        employeeName: '',
        role: Roles.Moderator,
        departmentName: '',
        pin: '',
    });
    const [page, setPage] = React.useState(1);
    const limit = 10;
    const min = (page -1) * limit;
    const [employeeId, setEmployeeId] = useState(0);

    const deleteClickOpen = (employeeId: number) => {
        setEmployeeId(employeeId)
        setDeleteOpen(true)
    }

    const deleteClickClose = () => {
        setDeleteOpen(false)
    }

    useEffect(() => {
        if(sessionId) {
            AdminAPI.searchEmployees(sessionId, limit, min).then(data => {
                setFoundEmployees(data.foundEmployees);
                setEmployees(data.employees);
            }).catch(({response}) => alert(response.data.message));
        }
    }, [sessionId, min, setFoundEmployees, setEmployees, employeeSuccess]);

    const paginationChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    let currentCount = (foundEmployees - (foundEmployees % limit)) / limit;
    if (foundEmployees % limit > 0) {
        currentCount = currentCount + 1;
    }
    
    const staffClickOpen = () => {
        setOpenStaff(true);
    }

    const staffClickClose = () => {
        setOpenStaff(false);
    }

    const editClickClose = () => {
        setEditOpen(false);
    }

    const editClick = (employee: IEmployees) => {
        setEmployee(employee);
        setEditOpen(true);
    }

    return (
        <div className="mainContent">
            <div className="topRow">
                <Grid container spacing={3} justify="space-between" alignItems="center">
                    <Grid item>
                        <div className="title">Персонал</div>
                    </Grid>
                    <Grid item>
                        <Button onClick={staffClickOpen} variant="contained" color="primary" disableElevation>Новый сотрудник</Button>
                    </Grid>
                </Grid>
            </div>
            <TableContainer className="tableContainer">
                <Table className="table" size="small">
                    <TableHead className="tableHead">
                        <TableRow>
                            <TableCell style={{width: 16}}>№</TableCell>
                            <TableCell align="left">Фамилия Имя Отчество</TableCell>
                            <TableCell align="left">Отдел</TableCell>
                            <TableCell align="left">Роль</TableCell>
                            <TableCell align="right" style={{width: 16}}></TableCell>
                            <TableCell align="right" style={{width: 16}}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {employees.map((employee, i) => (
                            <TableRow key={i} hover>
                                <TableCell>{i + 1}</TableCell>
                                <TableCell component="th" scope="row">{employee.employeeName}</TableCell>
                                <TableCell align="left">{employee.departmentName}</TableCell>
                                {employee.role === 'CompanyAdmin' && <TableCell align="left">Администратор</TableCell>}
                                {employee.role === 'Moderator' && <TableCell align="left">Модератор</TableCell>}
                                <TableCell align="right">
                                    <Tooltip title="Редактировать" placement="top">
                                        <IconButton onClick={() => editClick(employee)}>
                                            <EditIcon className="editIcon" />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Удалить" placement="top">
                                        <IconButton onClick={() => deleteClickOpen(employee.employeeId)}>
                                            <DeleteIcon className="deleteIcon" />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div className="justify-center">
                {foundEmployees > 9 && 
                    <Pagination count={currentCount} page={page} onChange={paginationChange} shape="rounded" className="paginations" />
                }
            </div>
            <AddStaff 
                openStaff={openStaff}
                staffClickClose={staffClickClose} />
            <EditStaff 
                editOpen={editOpen}
                editClickClose={editClickClose} 
                employee={employee} />
            <DeleteEmployee 
                deleteOpen={deleteOpen}
                deleteClickClose={deleteClickClose} 
                title="Удаление сотрудника" 
                text="Вы уверены, что хотите удалить сотрудника?" 
                id={employeeId} />
        </div>
    );
}

const mapStateToProps = (state: RootState) => ({
    sessionId: state.auth.sessionId,
    employeeSuccess: state.admin.employeeSuccess,
});

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Personal);