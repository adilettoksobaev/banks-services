import React, { Dispatch, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState, actions } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Select, MenuItem, InputLabel, InputAdornment } from '@material-ui/core';
import { AdminAPI } from '../../api/AdminAPI';
import { Roles } from '../../store/Auth/types';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import PositionsModal from '../PositionsModal/PositionsModal';
import { IDepartment } from '../../api/AdminAPI';
import SnackbarAlert from './SnackbarAlert';
import { AuthAPI } from '../../api/AuthAPI';
import { IEmployees } from '../../store/Admin/types';

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps> & {
    openStaff: boolean;
    staffClickClose: () => void;
}

const AddStaff:React.FC<Props> = ({ openStaff, staffClickClose, sessionId, positionSuccess, employeeSuccessAction, employeeSuccess }) => {

    const [employeeState, setEmployeeState] = useState<IEmployees>({
        departmentId: null,
        employeeId: 0,
        employeeInn: '',
        employeeName: '',
        role: Roles.Moderator,
        departmentName: '',
        pin: ''
    });
    const [department, setDepartment] = useState<IDepartment[]>([]);
    const [positionOpen, setPositionOpen] = useState(false);
    const [notification, setNotification] = useState(false);
    const [errorMessage, setErrorMessage] = useState({
        error: false,
        message: '',
    })

    const positionToggle = () => {
        setPositionOpen(!positionOpen);
    }

    const catchError = (message: string) => {
        setNotification(true);
        setErrorMessage({error: true, message});
    }

    const addEmployee = () => {
        if(sessionId) {
            AdminAPI.setEmployee(sessionId, employeeState).then(data => {
                employeeSuccessAction(!employeeSuccess);
                setNotification(true);
                staffClickClose();
                setErrorMessage({error: false, message: 'Вы успешно добавили сотрудника!'});
                setEmployeeState({
                    departmentId: null,
                    employeeId: 0,
                    employeeInn: '',
                    employeeName: '',
                    role: Roles.Moderator,
                    departmentName: '',
                    pin: ''
                });
            }).catch(({response}) => alert(response.data.message));
        }
    }

    useEffect(() => {
        if(employeeState.employeeInn.length === 14) {
            AuthAPI.getNameByInn(employeeState.employeeInn).then(res => {
                setEmployeeState(prevState => {
                    return {...prevState, employeeName: res.data.name};
                });
            }).catch(({response}) => catchError(response.data.message));
        } else {
            setEmployeeState(prevState => {
                return {...prevState, employeeName: ''};
            });
        }
    }, [employeeState.employeeInn]);

    useEffect(() => {
        if(sessionId) {
            AdminAPI.getDepartments(sessionId).then(data => {
                setDepartment(data)
            })
        }
    }, [sessionId, positionSuccess]);
    
    return (
        <>
        <Dialog
            open={openStaff}
            className="modal"
        >
            <DialogTitle>Добавление нового сотрудника</DialogTitle>
            <DialogContent>
                <form noValidate autoComplete="off">
                    <TextField 
                        fullWidth
                        inputProps={{
                            maxLength: 14,
                        }}
                        required 
                        label="ИНН сотрудника"
                        value={employeeState.employeeInn} 
                        onChange={(event) => setEmployeeState({...employeeState, employeeInn: event.target.value})} 
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end"><span className="count">{employeeState.employeeInn.length}/14</span></InputAdornment>
                            ),
                        }} />
                    <TextField 
                        fullWidth
                        inputProps={{
                            maxLength: 4,
                        }}
                        required 
                        label="ПИН"
                        value={employeeState.pin} 
                        onChange={(event) => setEmployeeState({...employeeState, pin: event.target.value})} />
                    <TextField  
                        fullWidth
                        label="Ф.И.О."
                        value={employeeState.employeeName} 
                        onChange={(event) => setEmployeeState({...employeeState, employeeName: event.target.value})} />
                    <FormControl component="fieldset" className="radioControl">
                        <FormLabel>Роль</FormLabel>
                        <RadioGroup 
                            value={employeeState.role} 
                            onChange={(event) => setEmployeeState({...employeeState, role: (event.target as HTMLInputElement).value as Roles})} >
                            <FormControlLabel value="Moderator" control={<Radio color="primary" />} label="Модератор" />
                            <FormControlLabel value="CompanyAdmin" control={<Radio color="primary" />} label="Администратор" />
                        </RadioGroup>
                    </FormControl>
                    {employeeState.role === 'Moderator' && 
                        <FormControl size="small" fullWidth className="selectControl" >
                            <InputLabel shrink>Отдел - Пункт меню в клиентском web-приложении</InputLabel>
                            <Select
                                value={employeeState.departmentId}
                                onChange={(event) => setEmployeeState({...employeeState, departmentId: event.target.value as any})}
                                placeholder="Выберите счет"
                                >
                                <MenuItem value="" className="addNewPosition">
                                    <Button 
                                        color="primary"
                                        startIcon={<AddCircleOutlineIcon />}
                                        className="addStaffModalLink"
                                        onClick={positionToggle}>Добавить новый отдел</Button>
                                </MenuItem>
                                {department.map(item => (
                                    <MenuItem key={'select' + item.departmentId} value={item.departmentId}>{item.departmentName}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    }
                </form>
            </DialogContent>
            <DialogActions className="modal__actions">
                <Button onClick={staffClickClose} color="primary">Отмена</Button>
                <Button 
                    onClick={addEmployee} variant="contained" 
                    color="primary" disableElevation
                    disabled={employeeState.employeeInn.length === 14 ? false : true}>Добавить</Button>
            </DialogActions>
        </Dialog>
        <PositionsModal 
            positionOpen={positionOpen}
            positionToggle={positionToggle} />
        <SnackbarAlert 
            notification={notification}
            setNotification={setNotification} 
            message={errorMessage.message}
            severity={errorMessage.error ? "error" : "success"}
            vertical="top" 
            horizontal="center" />
        </>
    );
}

const mapStateToProps = (state: RootState) => ({
    sessionId: state.auth.sessionId,
    positionSuccess: state.admin.positionSuccess,
    employeeSuccess: state.admin.employeeSuccess,
});

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
    employeeSuccessAction: (employeeSuccess: boolean) => dispatch(actions.admin.employeeSuccessAction(employeeSuccess)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddStaff);