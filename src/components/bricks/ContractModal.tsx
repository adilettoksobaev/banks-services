import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../store';
import { Dialog, DialogContent, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { baseUrl } from '../../utils/baseUrl';

type Props = ReturnType<typeof mapStateToProps> & {
    contractOpen: boolean;
    contractClickClose: () => void;
    documentId: string
}

const ContractModal:React.FC<Props> = ({ contractOpen, contractClickClose, sessionId, documentId, settings }) => {
    return (
        <Dialog
            open={contractOpen}
            className="contractModal"
            fullWidth
            scroll="body">
                <IconButton className="modalClose" onClick={contractClickClose}>
                    <CloseIcon />
                </IconButton>
            <DialogContent>
                {sessionId && settings && 
                    <iframe className="documentIframe" src={`${baseUrl()}api/ClientDocuments/GetContract/${sessionId}/${documentId}/${settings.apiKey}`} title="description"></iframe>
                }
            </DialogContent>
        </Dialog>
    );
}


const mapStateToProps = (state: RootState) => ({
    sessionId: state.auth.sessionId,
    settings: state.admin.settings,
});

export default connect(mapStateToProps)(ContractModal);