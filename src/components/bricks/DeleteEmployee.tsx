import React, { Dispatch, useState } from 'react';
import { connect } from 'react-redux';
import { RootState, actions } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import { AdminAPI } from '../../api/AdminAPI';
import SnackbarAlert from './SnackbarAlert';

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps> & {
    deleteOpen: boolean;
    deleteClickClose: () => void;
    title: string;
    text: string;
    id: number;
}

const DeleteEmployee:React.FC<Props> = ({ deleteOpen, deleteClickClose, title, text, id, sessionId, employeeSuccessAction, employeeSuccess }) => {
    const [notification, setNotification] = useState(false);
    const [errorMessage, setErrorMessage] = useState({
        error: false,
        message: '',
    });

    const catchError = (message: string) => {
        setNotification(true);
        setErrorMessage({error: true, message});
    }
    
    const deleteEmployee = () => {
        if(sessionId) {
            AdminAPI.deleteEmployee(sessionId, id).then(data => {
                if(data.success === true) {
                    setNotification(true);
                    setErrorMessage({error: false, message: 'Вы успешно удалили сотрудника!'});
                    deleteClickClose();
                    employeeSuccessAction(!employeeSuccess);
                }
            }).catch(({response}) => catchError(response.data.message));
        }
    }

    return (
        <>
        <Dialog
            open={deleteOpen}
            className="modal confirm"
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <p className="modal__text">{text}</p>
            </DialogContent>
            <DialogActions className="modal__actions">
                <Button  
                    color="secondary" 
                    variant="outlined"
                    disableElevation
                    onClick={deleteEmployee}
                    >Удалить</Button>
                <Button onClick={deleteClickClose} disableElevation color="primary" variant="outlined">Отмена</Button>
            </DialogActions>
        </Dialog>
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
    employeeSuccess: state.admin.employeeSuccess,
});

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
    employeeSuccessAction: (employeeSuccess: boolean) => dispatch(actions.admin.employeeSuccessAction(employeeSuccess)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DeleteEmployee);