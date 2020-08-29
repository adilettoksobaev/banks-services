import React, { useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../store';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import { ModerationApi } from '../../api/ModerationApi';
import ProcessDialog from './ProcessDialog';

type Props = ReturnType<typeof mapStateToProps> & {
    clientRegOpen: boolean;
    clientRegClickClose: () => void;
}

const ClientRegistration:React.FC<Props> = ({ sessionId, activeRequest, clientRegOpen, clientRegClickClose }) => {
    const [processOpen, setProcessOpen] = useState(false);

    const processClickOpen = () => {
        setProcessOpen(true)
    }

    const processClickClose = () => {
        setProcessOpen(false)
    }

    const clientRegistration = () => {
        if(sessionId && activeRequest) {
            ModerationApi.requestRegistrationForGuest(sessionId, activeRequest.requestId).then(data => {
                if(data.success === true) {
                    clientRegClickClose();
                    processClickOpen();
                }
            }).catch(({response}) => alert(response.data.message));
        }
    }

    return (
        <>
            <Dialog
                open={clientRegOpen}
                className="modal confirm"
            >
                <DialogTitle>Регистрация клиента</DialogTitle>
                <DialogContent>
                    <p className="modal__text">Отправить клиенту форму регистрации</p>
                </DialogContent>
                <DialogActions className="modal__actions">
                    <Button onClick={clientRegClickClose} color="primary">Отмена</Button>
                    <Button onClick={clientRegistration} variant="contained" color="primary" disableElevation>Отправить</Button>
                </DialogActions>
            </Dialog>
            <ProcessDialog 
                processOpen={processOpen}
                processClickClose={processClickClose} />
        </>
    );
}

const mapStateToProps = (state: RootState) => ({
    sessionId: state.auth.sessionId,
    activeRequest: state.moderation.activeRequest,
});

export default connect(mapStateToProps)(ClientRegistration);