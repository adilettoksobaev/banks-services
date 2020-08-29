import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../store';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import { IDepartment } from '../../api/AdminAPI';
import { ModerationApi } from '../../api/ModerationApi';
import { useHistory } from 'react-router-dom';

type Props = ReturnType<typeof mapStateToProps> & {
    callOpen: boolean;
    callClickClose: () => void;
    department: IDepartment;

}

const CallTransferDialog:React.FC<Props> = ({ sessionId, activeRequest, callOpen, callClickClose, department }) => {
    let history = useHistory();
    
    const redirectCall = () => {
        if(sessionId && activeRequest) {
            ModerationApi.redirectVideoCall(sessionId, activeRequest.requestId, department.departmentId).then(data => {
                if(data.success === true) {
                    history.push('/applications');
                }
            }).catch(({response}) => alert(response.data.message));
        }
    }

    return (
        <Dialog
            open={callOpen}
            className="modal confirm"
        >
            <DialogTitle>Перевести звонок?</DialogTitle>
            <DialogContent>
            <p className="modal__text">Вы уверены, что хотите перевести звонок в отдел <br /> <strong>“{department.departmentName}”?</strong></p>
            </DialogContent>
            <DialogActions className="modal__actions">
                <Button onClick={callClickClose} color="primary">Отмена</Button>
                <Button onClick={redirectCall} variant="contained" color="primary" disableElevation>Перевести</Button>
            </DialogActions>
        </Dialog>
    );
}

const mapStateToProps = (state: RootState) => ({
    sessionId: state.auth.sessionId,
    activeRequest: state.moderation.activeRequest,
});

export default connect(mapStateToProps)(CallTransferDialog);