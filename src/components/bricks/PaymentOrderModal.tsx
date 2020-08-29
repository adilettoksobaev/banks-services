import React, { Dispatch, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState, actions } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, MenuItem, FormControl, Select, TextField, IconButton } from '@material-ui/core';
import { ClientDocumentsAPI, IAddPaymentOrder } from '../../api/ClientDocumentsAPI';
import SnackbarAlert from './SnackbarAlert';
import CloseIcon from '@material-ui/icons/Close';
import { ClientAPI, IBankAccounts } from '../../api/ClientAPI';
import Axios from 'axios';
import Autocomplete from '@material-ui/lab/Autocomplete';

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps> & {
    paymentOpen: boolean;
    paymentClickClose: () => void;
    customerAccountId: number;
}

interface IBank {
    bik: string;
    bank: string;
}

interface ICodeKind {
    id: string;
    name: string;
}

const PaymentOrderModal:React.FC<Props> = ({ paymentOpen, paymentClickClose, sessionId, customerAccountId, paymentOrderSuccessAction, paymentOrderSuccess }) => {

    const [paymentOrder, setPaymentOrder] = useState<IAddPaymentOrder>({
        paymentOrderNumber: '',
        description: '',
        date: new Date(),
        payer: {
            accountOfBank: '',
            calculationScheme: 'Клиринг',
        },
        paymentRecipient: {
            name: '',
            bank: '',
            bik: '',
            paymentAccount: '',
            target: '',
            paymentCode: '',
            amount: 0,
            currency: 'сом',
        }
    });
    const [bankAccounts, setBankAccounts] = useState<IBankAccounts[]>([]);
    const [notification, setNotification] = useState(false);
    const [errorMessage, setErrorMessage] = useState({
        error: false,
        message: '',
    });
    const [banks, setBanks] = useState<IBank[]>([]);
    const [codeKind, setCodeKind] = useState<ICodeKind[]>([]);

    const disabledButton = () => {
        if(paymentOrder.payer.accountOfBank !== '' && paymentOrder.payer.calculationScheme !== '' && paymentOrder.paymentRecipient.target !== '' 
            && paymentOrder.paymentRecipient.name !== '' && paymentOrder.paymentRecipient.bank !== '' && paymentOrder.paymentRecipient.bik !== '' 
            && paymentOrder.paymentRecipient.paymentAccount !== '' && paymentOrder.paymentRecipient.paymentCode && paymentOrder.paymentRecipient.amount !== 0
            && paymentOrder.paymentRecipient.currency !== '') {
            return false
        } else {
            return true
        }
    }

    const catchError = (message: string) => {
        setNotification(true);
        setErrorMessage({error: true, message});
    }

    const sandToClient = () => {
        if(sessionId) {
            ClientDocumentsAPI.addPaymentOrder(sessionId, customerAccountId, paymentOrder).then(data => {
                if(data.success === true) {
                    paymentOrderSuccessAction(!paymentOrderSuccess);
                    setNotification(true);
                    paymentClickClose();
                    setErrorMessage({error: false, message: 'Вы успешно отправили поручения!'});
                }
            }).catch(({response}) => catchError(response.data.message));
        }
    }

    useEffect(() => {
        const bankUrl = `/bank/bank.json`;
        console.log('bankUrl:', bankUrl);
        Axios.get(bankUrl).then(res => {
            setBanks(res.data);
        });
    }, [setBanks]);

    useEffect(() => {
        const codeKindUrl = `/bank/codeKind.json`;
        console.log('codeKindUrl:', codeKindUrl);
        Axios.get(codeKindUrl).then(res => {
            setCodeKind(res.data);
        });
    }, [setCodeKind]);

    useEffect(() => {
        if(sessionId) {
            ClientAPI.getBankAccounts(sessionId, customerAccountId).then(data => {
                setBankAccounts(data);
            }).catch(({response}) => alert(response.data.message));
        }
    }, [sessionId, customerAccountId]);
    
    return (
        <>
        <Dialog
            open={paymentOpen}
            className="paymentOrder"
            fullWidth>
                <IconButton className="modalClose" onClick={paymentClickClose}>
                    <CloseIcon />
                </IconButton>
            <DialogTitle>
                <span className="paymentOrder__title">Платежное поручение</span>
                {/* <span className="paymentOrder__subTitle">№ 23 от 12.01.2020</span> */}
            </DialogTitle>
            <DialogContent>
                <div className="paymentContent">
                    <div className="paymentContent__title">Плательщик</div>
                    <div className="paymentContent__item">
                        <p className="paymentContent__name">ФИО: Абдышева  Асия Нурлановна</p>
                    </div>
                    <div className="paymentContent__row">
                        <div className="paymentContent__formControl">
                            <p className="paymentContent__desc">Выберите счет</p>
                            <FormControl variant="outlined" size="small" className="paymentContent__score">
                                <Select
                                    value={paymentOrder.payer.accountOfBank}
                                    onChange={(event) => setPaymentOrder({...paymentOrder, payer: {
                                        ...paymentOrder.payer,
                                        accountOfBank: event.target.value as string,
                                    }})}
                                    placeholder="Выберите счет">
                                    {bankAccounts.map(bankAccount => (
                                        <MenuItem key={'accountOfBank-' + bankAccount.accountValue} value={bankAccount.accountValue}>
                                            {bankAccount.accountValue}
                                            <span className="accountType">{bankAccount.accountType}</span> 
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div className="paymentContent__formControl">
                            <p className="paymentContent__desc">Схема расчета</p>
                            <FormControl variant="outlined" size="small">
                                <Select
                                    value={paymentOrder.payer.calculationScheme}
                                    onChange={(event) => setPaymentOrder({...paymentOrder, payer: {
                                        ...paymentOrder.payer,
                                        calculationScheme: event.target.value as string,
                                    }})}
                                    placeholder="Схема расчета">
                                    <MenuItem value="Клиринг">Клиринг</MenuItem>
                                    <MenuItem value="Гросс">Гросс</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                </div>
                <div className="paymentContent paymentForm">
                    <div className="paymentForm__title">Получатель</div>
                    <div className="paymentForm__row">
                        <div className="paymentContent__formControl width">
                            <div className="paymentForm__desc">Назначение платежа</div>
                            <TextField
                                fullWidth
                                variant="outlined" 
                                size="small"
                                value={paymentOrder.paymentRecipient.target} 
                                onChange={(event) => setPaymentOrder({...paymentOrder, paymentRecipient: {
                                    ...paymentOrder.paymentRecipient,
                                    target: event.target.value,
                                }})} />
                        </div>
                        <div className="paymentContent__formControl width">
                            <div className="paymentForm__desc">Наименование клиента</div>
                            <TextField
                                fullWidth 
                                variant="outlined" 
                                size="small"
                                value={paymentOrder.paymentRecipient.name} 
                                onChange={(event) => setPaymentOrder({...paymentOrder, paymentRecipient: {
                                    ...paymentOrder.paymentRecipient,
                                    name: event.target.value,
                                }})} />
                        </div> 
                        <div className="paymentContent__formControl width">
                            <div className="paymentForm__desc">Банк</div>
                            <Autocomplete
                                options={banks}
                                getOptionLabel={(option: IBank) => option.bank}
                                fullWidth
                                size="small"
                                className="autocomplate"
                                value={paymentOrder.paymentRecipient}
                                onChange={(event: React.ChangeEvent<{}>, value: IBank | null) => value &&
                                    setPaymentOrder(
                                        {
                                            ...paymentOrder, 
                                            paymentRecipient: {
                                                ...paymentOrder.paymentRecipient,
                                                bank: value.bank,
                                                bik: value.bik,
                                            }
                                        }
                                    )
                                }
                                renderOption={(option: IBank) => (
                                    <span className="autocomplate__option bank__option">
                                        <span>{option.bank}</span>
                                        <span className="autocomplate__label">{option.bik}</span>
                                    </span>
                                )}
                                renderInput={(params) => 
                                    <TextField {...params} 
                                        variant="outlined"
                                        size="small" />
                                }
                            />
                        </div>
                        <div className="paymentContent__formControl width">
                            <div className="paymentForm__desc">Бик</div>
                            <Autocomplete
                                options={banks}
                                getOptionLabel={(option: IBank) => option.bik}
                                fullWidth
                                size="small"
                                className="autocomplate"
                                value={paymentOrder.paymentRecipient}
                                onChange={(event: React.ChangeEvent<{}>, value: IBank | null) => value &&
                                    setPaymentOrder(
                                        {
                                            ...paymentOrder, 
                                            paymentRecipient: {
                                                ...paymentOrder.paymentRecipient,
                                                bank: value.bank,
                                                bik: value.bik,
                                            }
                                        }
                                    )
                                }
                                renderOption={(option: IBank) => (
                                    <span className="autocomplate__option">
                                        <span>{option.bik}</span>
                                        <span className="autocomplate__label">{option.bank}</span>
                                    </span>
                                )}
                                renderInput={(params) => 
                                    <TextField {...params} 
                                        variant="outlined"
                                        size="small" />
                                }
                            />
                        </div>
                        <div className="paymentContent__formControl width paymentWidth">
                            <div className="paymentForm__desc">Расчетный счет</div>
                            <TextField
                                inputProps={{
                                    maxLength: 16
                                }}
                                fullWidth
                                variant="outlined" 
                                size="small"
                                value={paymentOrder.paymentRecipient.paymentAccount} 
                                onChange={(event) => setPaymentOrder({...paymentOrder, paymentRecipient: {
                                    ...paymentOrder.paymentRecipient,
                                    paymentAccount: event.target.value,
                                }})} />
                        </div>
                        <div className="paymentContent__formControl width">
                            <div className="paymentForm__desc">Код платежа</div>
                            <Autocomplete
                                options={codeKind}
                                getOptionLabel={(option: ICodeKind) => option.name}
                                fullWidth
                                size="small"
                                className="autocomplate"
                                onChange={(event: React.ChangeEvent<{}>, value: ICodeKind | null) => value &&
                                    setPaymentOrder(
                                        {
                                            ...paymentOrder, 
                                            paymentRecipient: {
                                                ...paymentOrder.paymentRecipient,
                                                paymentCode: value.name,
                                            }
                                        }
                                    )
                                }
                                renderInput={(params) => 
                                    <TextField {...params} 
                                        variant="outlined"
                                        size="small"/>
                                }
                            />
                        </div> 
                        <div className="paymentContent__group">
                            <div className="paymentContent__formControl width summaWidth">
                                <div className="paymentForm__desc">Сумма</div>
                                <TextField
                                    variant="outlined" 
                                    size="small"
                                    value={paymentOrder.paymentRecipient.amount} 
                                    onChange={(event) => setPaymentOrder({...paymentOrder, paymentRecipient: {
                                        ...paymentOrder.paymentRecipient,
                                        amount: parseInt(event.target.value),
                                    }})} />
                            </div>
                            <div className="paymentForm__currency">
                                <FormControl variant="outlined" size="small" fullWidth>
                                    <Select
                                        value={paymentOrder.paymentRecipient.currency}
                                        onChange={(event) => setPaymentOrder({...paymentOrder, paymentRecipient: {
                                            ...paymentOrder.paymentRecipient,
                                            currency: event.target.value as string,
                                        }})}
                                        placeholder="Валюта">
                                        <MenuItem value="сом">сом</MenuItem>
                                        <MenuItem value="долл">доллар</MenuItem>
                                        <MenuItem value="евро">евро</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>       
                        </div>  
                    </div>
                </div>
            </DialogContent>
            <DialogActions className="paymentOrder__actions">
                <Button onClick={paymentClickClose} color="primary">Отмена</Button>
                <Button onClick={sandToClient} variant="contained" color="primary" disableElevation disabled={disabledButton()}>Отправить клиенту</Button>
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
    paymentOrderSuccess: state.document.paymentOrderSuccess,
});

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
    paymentOrderSuccessAction: (paymentOrderSuccess: boolean) => dispatch(actions.document.paymentOrderSuccessAction(paymentOrderSuccess)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PaymentOrderModal);