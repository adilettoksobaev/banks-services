import React, { Dispatch, useState, useEffect, useReducer } from 'react';
import { connect } from 'react-redux';
import { RootState, actions } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import { TextField, Button, InputAdornment, IconButton, Tooltip } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { ClientAPI, IBankAccounts } from '../../api/ClientAPI';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import AddIcon from '@material-ui/icons/Add';
import AddBankAccount from './AddBankAccount';
import DeleteIcon from '@material-ui/icons/Delete';
import SnackbarAlert from './SnackbarAlert';

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps> & {
    customerAccountId: number
}

const BankAccounts:React.FC<Props> = (props) => {
    const { sessionId, customerAccountId, bankAccountSuccess, bankAccountSuccessAction } = props;
    const [edit, setEdit] = useState(false);
    const [bankAccounts, setBankAccounts] = useState<IBankAccounts[]>([]);
    const [bankAccountOpen, setBankAccountOpen] = useState(false);
    const [notification, setNotification] = useState(false);
    const [errorMessage, setErrorMessage] = useState({
        error: false,
        message: '',
    });
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const catchError = (message: string) => {
        setNotification(true);
        setErrorMessage({error: true, message});
    }

    const bankAccountClickOpen = () => {
        setBankAccountOpen(true);
    }
    const bankAccountClickClose = () => {
        setBankAccountOpen(false);
    }

    useEffect(() => {
        if(sessionId) {
            ClientAPI.getBankAccounts(sessionId, customerAccountId).then(data => {
                setBankAccounts(data);
            }).catch(({response}) => alert(response.data.message));
        }
    }, [sessionId, customerAccountId]);

    const bankAccountChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, bankAccount: IBankAccounts) => {
        const idx = bankAccounts.findIndex((item) => item.accountValue === bankAccount.accountValue);
        const oldItem = bankAccounts[idx];
        const newItem = {...oldItem, accountValue: event.target.value};
        const newBankAccounts = [
            ...bankAccounts.slice(0, idx),
            newItem,
            ...bankAccounts.slice(idx + 1)
        ];
        setBankAccounts(newBankAccounts);
    }

    const clearClick = (accountValue: string) => {
        const idx = bankAccounts.findIndex((item) => item.accountValue === accountValue);
        const oldItem = bankAccounts[idx];
        const newItem = {...oldItem, accountValue: ""};
        const newBankAccounts = [
            ...bankAccounts.slice(0, idx),
            newItem,
            ...bankAccounts.slice(idx + 1)
        ];
        setBankAccounts(newBankAccounts);
    }

    const deleteClick = (accountValue: string) => {
        const idx = bankAccounts.findIndex((item) => item.accountValue === accountValue);
        const newBankAccounts = [
            ...bankAccounts.slice(0, idx),
            ...bankAccounts.slice(idx + 1)
        ];
        setBankAccounts(newBankAccounts);
    }

    const cencelClick = () => {
        forceUpdate();
        setEdit(false);
    }

    const bankAccountSave = () => {
        if(sessionId) {
            ClientAPI.setBankAccounts(sessionId, customerAccountId, bankAccounts).then(data => {
                if(data.success === true) {
                    bankAccountSuccessAction(!bankAccountSuccess);
                    setNotification(true);
                    bankAccountClickClose();
                    setErrorMessage({error: false, message: 'Вы успешно отредактировали банковский счет!'});
                }
            }).catch(({response}) => catchError(response.data.message));
        }
    }

    return (
        <div className="bankData">
            {bankAccounts.map(bankAccount => (
                <TextField 
                    key={'textField' + bankAccount.accountValue}
                    disabled={!edit}
                    label={bankAccount.accountType}
                    value={bankAccount.accountValue}
                    onChange={(event) => bankAccountChange(event, bankAccount)}
                    fullWidth 
                    InputProps={{
                        endAdornment: 
                        <InputAdornment position="start">
                            {edit && 
                                <>
                                    <Tooltip title="Очистить" placement="top">
                                        <IconButton onClick={() => clearClick(bankAccount.accountValue)}><CloseIcon /></IconButton>
                                    </Tooltip>
                                    <Tooltip title="Удалить" placement="top">
                                        <IconButton onClick={() => deleteClick(bankAccount.accountValue)}><DeleteIcon /></IconButton>
                                    </Tooltip>
                                </>
                            }
                        </InputAdornment>
                    }}/>
            ))}
            <div className="bankData__row">
                {edit ? 
                    <>
                        <Button onClick={cencelClick} color="primary">Отмена</Button>
                        <Button 
                            variant="contained" 
                            color="primary" disableElevation
                            startIcon={<DoneIcon />}
                            onClick={bankAccountSave}>
                            Сохранить
                        </Button>
                    </> :
                    <>
                        <Button 
                            variant="contained" 
                            color="primary" disableElevation
                            startIcon={<AddIcon />}
                            onClick={bankAccountClickOpen}
                            className="bankData__add">
                            Добавить</Button>
                        <Button 
                            variant="contained" 
                            color="primary" disableElevation
                            startIcon={<EditIcon />}
                            onClick={() => setEdit(true)}>
                            Редактировать</Button>
                    </>
                }
            </div>
            <AddBankAccount
                bankAccountOpen={bankAccountOpen} 
                bankAccountClickClose={bankAccountClickClose} 
                customerAccountId={customerAccountId}
                bankAccounts={bankAccounts} />
            <SnackbarAlert 
                notification={notification}
                setNotification={setNotification} 
                message={errorMessage.message}
                severity={errorMessage.error ? "error" : "success"}
                vertical="top" 
                horizontal="center" />
        </div>
    );
}

const mapStateToProps = (state: RootState) => ({
    sessionId: state.auth.sessionId,
    bankAccountSuccess: state.admin.bankAccountSuccess,
});

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
    setLoaderAction: (loading: boolean) => dispatch(actions.auth.setLoaderAction(loading)),
    bankAccountSuccessAction: (bankAccountSuccess: boolean) => dispatch(actions.admin.bankAccountSuccessAction(bankAccountSuccess)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BankAccounts);