import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../store';
import { Dialog, DialogTitle, DialogContent, MenuItem, FormControl, Select, TextField, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Moment from 'react-moment';
import 'moment/locale/ru';
import { IPaymentOrders } from '../../store/Moderation/types';
import { ClientAPI, IBankAccounts } from '../../api/ClientAPI';

type Props = ReturnType<typeof mapStateToProps> & {
    paymentOpen: boolean;
    paymentClickClose: () => void;
    paymentOrder: IPaymentOrders;
    customerAccountId: number
}

const PaymentOrderView:React.FC<Props> = ({ paymentOpen, paymentClickClose, paymentOrder, getUserInfo, sessionId, customerAccountId }) => {
    console.log('paymentOrder', paymentOrder);
    const [bankAccounts, setBankAccounts] = useState<IBankAccounts[]>([]);

    useEffect(() => {
        if(sessionId) {
            ClientAPI.getBankAccounts(sessionId, customerAccountId).then(data => {
                setBankAccounts(data);
            }).catch(({response}) => alert(response.data.message));
        }
    }, [sessionId, customerAccountId]);
    
    return (
        <Dialog
            open={paymentOpen}
            className="paymentOrder"
            fullWidth>
                <IconButton className="modalClose" onClick={paymentClickClose}>
                    <CloseIcon />
                </IconButton>
            <DialogTitle>
                <span className="paymentOrder__title">Платежное поручение</span>
                <span className="paymentOrder__subTitle">от <Moment format="D MMMM YYYY">{paymentOrder.createdDate}</Moment></span>
            </DialogTitle>
            <DialogContent>
                <div className="paymentContent">
                    <div className="paymentContent__title">Плательщик</div>
                    <div className="paymentContent__item">
                        {getUserInfo &&
                            <p className="paymentContent__name">ФИО: {getUserInfo.fullName}</p>
                        }
                    </div>
                    <div className="paymentContent__row">
                        <div className="paymentContent__formControl">
                            <p className="paymentContent__desc">Выберите счет</p>
                            <FormControl variant="outlined" size="small" disabled>
                                <Select
                                    value={paymentOrder.document.payer.accountOfBank}
                                    placeholder="Выберите счет">
                                    {bankAccounts.map(bankAccount => (
                                        <MenuItem key={'accountOfBank-' + bankAccount.accountValue} value={bankAccount.accountValue}>{bankAccount.accountValue}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div className="paymentContent__formControl">
                            <p className="paymentContent__desc">Схема расчета</p>
                            <FormControl variant="outlined" size="small" disabled>
                                <Select
                                    value={paymentOrder.document.payer.calculationScheme}
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
                                disabled
                                fullWidth
                                variant="outlined" 
                                size="small"
                                value={paymentOrder.document.paymentRecipient.target}/>
                        </div>
                        <div className="paymentContent__formControl width">
                            <div className="paymentForm__desc">Наименование</div>
                            <TextField
                                disabled
                                fullWidth 
                                variant="outlined" 
                                size="small"
                                value={paymentOrder.document.paymentRecipient.name} />
                        </div> 
                        <div className="paymentContent__formControl width">
                            <div className="paymentForm__desc">Банк</div>
                            <TextField
                                disabled
                                fullWidth 
                                variant="outlined" 
                                size="small"
                                value={paymentOrder.document.paymentRecipient.bank} />
                        </div>
                        <div className="paymentContent__formControl width">
                            <div className="paymentForm__desc">Бик</div>
                            <TextField 
                                disabled
                                variant="outlined" 
                                size="small"
                                value={paymentOrder.document.paymentRecipient.bik} />
                        </div>
                        <div className="paymentContent__formControl width paymentWidth">
                            <div className="paymentForm__desc">Расчетный счет</div>
                            <TextField
                                disabled
                                fullWidth
                                variant="outlined" 
                                size="small"
                                value={paymentOrder.document.paymentRecipient.paymentAccount} />
                        </div>
                        <div className="paymentContent__formControl width">
                            <div className="paymentForm__desc">Выберите счет</div>
                            <FormControl variant="outlined" size="small" fullWidth disabled>
                                <Select
                                    value={paymentOrder.document.paymentRecipient.paymentCode}
                                    placeholder="Код платежа">
                                    <MenuItem value="Подоходный налог, уплачиваемый налоговым агентом">Подоходный налог, уплачиваемый налоговым агентом</MenuItem>
                                </Select>
                            </FormControl>
                        </div> 
                        <div className="paymentContent__formControl width summaWidth">
                            <div className="paymentForm__desc">Сумма</div>
                            <TextField
                                disabled
                                variant="outlined" 
                                size="small"
                                value={paymentOrder.document.paymentRecipient.amount} />
                                <div className="paymentForm__currency">{paymentOrder.document.paymentRecipient.currency}</div>
                        </div>   
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}


const mapStateToProps = (state: RootState) => ({
    sessionId: state.auth.sessionId,
    getUserInfo: state.auth.getUserInfo
});

export default connect(mapStateToProps)(PaymentOrderView);