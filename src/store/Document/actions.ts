import { ActionCreator, Action } from 'redux';
import { DocumentActionsTypes } from './types';

export interface IPaymentOrderSuccess extends Action<DocumentActionsTypes.PAYMENT_ORDER_SUCCESS> {
    paymentOrderSuccess: boolean;
}

export interface IContractSuccessSuccess extends Action<DocumentActionsTypes.CONTRACT_SUCCESS> {
    contractSuccess: boolean;
}


export type DocumentActions =
    | IPaymentOrderSuccess
    | IContractSuccessSuccess;

export const contractSuccessAction: ActionCreator<IContractSuccessSuccess> = (contractSuccess: boolean) => {
    return {
        type: DocumentActionsTypes.CONTRACT_SUCCESS,
        contractSuccess
    }
}

export const paymentOrderSuccessAction: ActionCreator<IPaymentOrderSuccess> = (paymentOrderSuccess: boolean) => {
    return {
        type: DocumentActionsTypes.PAYMENT_ORDER_SUCCESS,
        paymentOrderSuccess
    }
}