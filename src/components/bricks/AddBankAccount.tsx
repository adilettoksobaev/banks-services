import React, { Dispatch, useState } from 'react';
import { connect } from 'react-redux';
import { RootState, actions } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import { ClientAPI, IBankAccounts } from '../../api/ClientAPI';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import SnackbarAlert from './SnackbarAlert';

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps> & {
    bankAccountOpen: boolean;
    bankAccountClickClose: () => void;
    customerAccountId: number;
    bankAccounts: IBankAccounts[];
}

const AddBankAccount:React.FC<Props> = ({ sessionId, bankAccountOpen, bankAccountClickClose, customerAccountId, bankAccounts, bankAccountSuccessAction, bankAccountSuccess }) => {

    const [bankAccount, setBankAccount] = useState<IBankAccounts>({
        accountType: "",
        accountValue: "",
    });
    const [notification, setNotification] = useState(false);
    const [errorMessage, setErrorMessage] = useState({
        error: false,
        message: '',
    });

    const catchError = (message: string) => {
        setNotification(true);
        setErrorMessage({error: true, message});
    }

    const newBankAccounts = bankAccounts.concat(bankAccount);

    const addBankAccount = () => {
        if(sessionId) {
            ClientAPI.setBankAccounts(sessionId, customerAccountId, newBankAccounts).then(data => {
                if(data.success === true) {
                    bankAccountSuccessAction(!bankAccountSuccess);
                    setNotification(true);
                    bankAccountClickClose();
                    setErrorMessage({error: false, message: 'Вы успешно добавили банковский счет!'});
                }
            }).catch(({response}) => catchError(response.data.message));
        }
    }

    return (
        <>
        <Dialog
            open={bankAccountOpen}
            className="modal">
            <DialogTitle>Добавить</DialogTitle>
            <DialogContent>
                <TextField
                    label="Наименование счета"
                    value={bankAccount.accountType}
                    onChange={(event) => setBankAccount({...bankAccount, accountType: event.target.value})}
                    fullWidth /> 
                <TextField
                    label="Значение"
                    value={bankAccount.accountValue}
                    onChange={(event) => setBankAccount({...bankAccount, accountValue: event.target.value})}
                    fullWidth /> 
            </DialogContent>
            <DialogActions className="modal__actions">
                <Button onClick={bankAccountClickClose} color="primary">Отмена</Button>
                <Button 
                    onClick={addBankAccount} variant="contained" 
                    color="primary" disableElevation startIcon={<AddIcon />}>Добавить</Button>
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
    bankAccountSuccess: state.admin.bankAccountSuccess,
});

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
    bankAccountSuccessAction: (bankAccountSuccess: boolean) => dispatch(actions.admin.bankAccountSuccessAction(bankAccountSuccess)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddBankAccount);