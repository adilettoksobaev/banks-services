import React, { Dispatch } from 'react';
import { connect } from 'react-redux';
import { RootState, actions } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import { ModerationApi } from '../../api/ModerationApi';
import { useHistory } from 'react-router-dom';

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps> & {
    openConfirm: boolean;
    confirmClickClose: () => void;
    text: string;
    buttonText: string;
    cinfirm: boolean;
}

const ConfirmModal:React.FC<Props> = (props) => {
    let history = useHistory();
    const { openConfirm, confirmClickClose, text, buttonText, cinfirm, sessionId, registerUserTextAction, requestId } = props;
    
    const registerUserClick = () => {
        if(sessionId && requestId) {
            ModerationApi.registerUser(sessionId, parseInt(requestId)).then(data => {
                if(data.success) {
                    return history.push('/applications');
                }
            }).catch(({response}) => alert(response.data.message));
        }
    };

    const refuseUserRegistrationClick = () => {
        if(sessionId && requestId) {
            ModerationApi.refuseUserRegistration(sessionId, parseInt(requestId)).then(data => {
                if(data.success) {
                    registerUserTextAction('Вы отклонили регистрацию');
                    confirmClickClose();
                }
            }).catch(({response}) => alert(response.data.message));
        }
    }

    return (
        <Dialog
            open={openConfirm}
            className="modal confirm"
        >
            <DialogTitle>Заявка</DialogTitle>
            <DialogContent>
            <p className="modal__text">{text}</p>
            </DialogContent>
            <DialogActions className="modal__actions">
                <Button onClick={confirmClickClose} color="primary">Отмена</Button>
                <Button 
                    variant="contained" 
                    color={cinfirm ? "primary" : "secondary"} 
                    disableElevation
                    onClick={cinfirm ? registerUserClick : refuseUserRegistrationClick}>{buttonText}</Button>
            </DialogActions>
        </Dialog>
    );
}

const mapStateToProps = (state: RootState) => ({
    sessionId: state.auth.sessionId,
    activeRequest: state.moderation.activeRequest,
    requestId: state.moderation.requestId,
});

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
    registerUserTextAction: (registerUserText: string) => dispatch(actions.moderation.registerUserTextAction(registerUserText)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmModal);