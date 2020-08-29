import React, { Dispatch, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import { IconButton, DialogContent, Dialog, FormControl, Input, InputAdornment, Box, Button, Tooltip } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import './PositionsModal.scss'
import { AdminAPI, IDepartment } from '../../api/AdminAPI';
import NewDepartment from '../bricks/NewDepartment';
import DeleteDepartment from '../bricks/DeleteDepartment';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import EditDepartment from '../bricks/EditDepartment';

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps> & {
    positionOpen: boolean;
    positionToggle: () => void;
}

const PositionsModal: React.FC<Props> = ({ positionOpen, positionToggle, sessionId, positionSuccess }) => {
    const [newDepartmentOpen, setNewDepartmentOpen] = useState(false);
    const [departments, setDepartments] = useState<IDepartment[]>([]);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [departmentId, setDepartmentId] = useState(0);
    const [editDepartmentOpen, setEditDepartmentOpen] = useState(false);
    const [department, setDepartment] = useState({
        departmentId: 0,
        departmentName: '',
        clientRegistration: false,
        colorId: 0,
        iconId: 0,
    });

    const editDepartmentClickOpen = (department: IDepartment) => {
        setDepartment(department);
        setEditDepartmentOpen(true);
    }

    const editDepartmentClickClose = () => {
        setEditDepartmentOpen(false);
    }

    const deleteClickOpen = (departmentId: number) => {
        setDepartmentId(departmentId)
        setDeleteOpen(true)
    }

    const deleteClickClose = () => {
        setDeleteOpen(false)
    }

    const newDepartmentToggle = () => {
        setNewDepartmentOpen(!newDepartmentOpen);
    }

    useEffect(() => {
        if(sessionId) {
            AdminAPI.getDepartments(sessionId).then(data => {
                setDepartments(data)
            })
        }
    }, [sessionId, positionSuccess]);
    
    return (
        <>
        <Dialog open={positionOpen} onClose={positionToggle} className="positionModal" fullWidth>
            <IconButton className="modalClose" onClick={positionToggle}>
                <CloseIcon />
            </IconButton>
            <DialogContent className="positionModal__content">
                <div className="positionModal__title">Должности</div>
                <form className="boxForm" noValidate autoComplete="off">
                    {departments.map(item => (
                        <FormControl fullWidth key={item.departmentId}>
                            <Input
                                placeholder="Наименование должности"
                                value={item.departmentName}
                                endAdornment={
                                    <InputAdornment position="end" className="delete">
                                        <Tooltip title="Редактировать" placement="top">
                                            <IconButton onClick={() => editDepartmentClickOpen(item)}>
                                                <EditIcon className="editIcon" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Удалить" placement="top">
                                            <IconButton onClick={() => deleteClickOpen(item.departmentId)}>
                                                <DeleteIcon className="deleteIcon" />
                                            </IconButton>
                                        </Tooltip>
                                    </InputAdornment>
                                } />
                        </FormControl>
                    ))}
                    <Button 
                        color="primary"
                        startIcon={<AddCircleOutlineIcon />}
                        className="positionModalLink"
                        onClick={newDepartmentToggle}>Добавить новый отдел</Button>
                    <Box className="modalButtonGroup">
                        <Button variant="outlined" color="primary" onClick={positionToggle}>Закрыть</Button>
                    </Box>
                </form>
            </DialogContent>
        </Dialog>
        <NewDepartment 
            newDepartmentOpen={newDepartmentOpen} 
            newDepartmentToggle={newDepartmentToggle} />
        <DeleteDepartment 
            deleteOpen={deleteOpen}
            deleteClickClose={deleteClickClose} 
            title="Удаление отдела" 
            text="Вы уверены, что хотите удалить отдел?" 
            id={departmentId} />
        <EditDepartment 
            editDepartmentOpen={editDepartmentOpen}
            editDepartmentClickClose={editDepartmentClickClose} 
            department={department} />
        </>
    )
}

const mapStateToProps = (state: RootState) => ({
    sessionId: state.auth.sessionId,
    positionSuccess: state.admin.positionSuccess,
});

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(PositionsModal);