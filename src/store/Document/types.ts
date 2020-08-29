export interface DocumentState {
    paymentOrderSuccess: boolean,
    contractSuccess: boolean,
}

export enum DocumentActionsTypes {
    PAYMENT_ORDER_SUCCESS = 'PAYMENT_ORDER_SUCCESS',
    CONTRACT_SUCCESS = 'CONTRACT_SUCCESS',
}

export interface IContract {
    documentId: string,
    documentType: DocumentTypes,
    createdDate: Date,
    userAccountId: 0,
    documentStatus: DocumentStatuses,
    documentDescription: string,
}

export enum DocumentTypes {
    PaymentOrder = "PaymentOrder",
    ClientContract = "ClientContract",
}

export enum DocumentStatuses {
    New = "New",
    Signed = "Signed",
    Refused = "Refused",
}