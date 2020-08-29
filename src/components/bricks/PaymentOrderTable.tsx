import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../store';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@material-ui/core';
import { ClientDocumentsAPI } from '../../api/ClientDocumentsAPI';
import Moment from 'react-moment';
import 'moment/locale/ru';
import { IPaymentOrders } from '../../store/Moderation/types';
import PaymentOrderView from '../bricks/PaymentOrderView';

type Props = ReturnType<typeof mapStateToProps> & {
    customerAccountId?: number
}

const PaymentOrderTable:React.FC<Props> = ({ sessionId, customerAccountId, paymentOrderSuccess }) => {
    const [paymentOrders, setPaymentOrders] = useState<IPaymentOrders[]>([]);
    const [paymentOrder, setPaymentOrder] = useState<IPaymentOrders | null>(null);
    const [paymentOpen, setPaymentOpen] = useState(false);
    
    const paymentClickOpen = (paymentOrder: IPaymentOrders) => {
        setPaymentOpen(true);
        setPaymentOrder(paymentOrder)
    }

    const paymentClickClose = () => {
        setPaymentOpen(false);
    }

    useEffect(() => {
        if(sessionId && customerAccountId) {
            ClientDocumentsAPI.getPaymentOrders(sessionId, customerAccountId).then(data => {
                setPaymentOrders(data);
            }).catch(({response}) => console.log(response.data.message));
        }   
    }, [sessionId, customerAccountId, paymentOrderSuccess])

    return (
        <>
        <TableContainer className="tableContainer clientsTable">
            <Table className="table">
                <TableHead className="tableHead">
                    <TableRow>
                        <TableCell style={{width: 16}}>№</TableCell>
                        <TableCell align="left">Дата</TableCell>
                        <TableCell align="left">Назначение платежа</TableCell>
                        <TableCell align="right">Сумма</TableCell>
                        <TableCell align="center">Действие</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {paymentOrders.map((paymentOrder, i) => (
                        <TableRow key={i}>
                            <TableCell>{i + 1}</TableCell>
                            <TableCell align="left"><Moment format="D MMMM YYYY">{paymentOrder.createdDate}</Moment></TableCell>
                            <TableCell component="th" scope="row">{paymentOrder.document.paymentRecipient.target}</TableCell>
                            <TableCell align="right">{paymentOrder.document.paymentRecipient.amount}</TableCell>
                            <TableCell align="center">
                                <Button color="primary" className="tableButton" onClick={() => paymentClickOpen(paymentOrder)}>Просмотр</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        {paymentOrder && customerAccountId &&
            <PaymentOrderView paymentOpen={paymentOpen} paymentClickClose={paymentClickClose}  paymentOrder={paymentOrder} customerAccountId={customerAccountId}  />
        }
        </>
    );
}

const mapStateToProps = (state: RootState) => ({
    sessionId: state.auth.sessionId,
    paymentOrderSuccess: state.document.paymentOrderSuccess,
    getUserInfo: state.auth.getUserInfo
});

export default connect(mapStateToProps)(PaymentOrderTable);