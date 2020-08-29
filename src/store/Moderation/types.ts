export interface ModerationState {
    conferenceJoinLink: string | null;
    activeRequest: ActiveRequest | null,
    missingRequest: MissingRequest | null,
    requestId: string | null,
    startDate: Date,
    endDate: Date,
    registerUserText: string,
}

export enum ModerationActionsTypes {
    CONFERENCE_JOIN_LINK = 'CONFERENCE_JOIN_LINK',
    ACTIVATE_REQUEST = 'ACTIVATE_REQUEST',
    MISSING_REQUEST = 'MISSING_REQUEST',
    REQUEST_ID = 'REQUEST_ID',
    START_DATE = 'START_DATE',
    END_DATE = 'END_DATE',
    REGISTER_USER_TEXT = 'REGISTER_USER_TEXT',
}

export interface ActiveRequest {
    requestId: number,
    customerAccountId: number,
    userName: string,
    waitingTime: string,
    requestType: string,
}

export interface MissingRequest {
    requestId: number,
    userName: string,
    requestType: string,
    requestDate: string,
    phone: string,
}

export interface ISearchHistory {
    dateFrom: Date,
    dateTo: Date,
    maxShowRequest: number,
    skipRequest: number
}

export interface IHistoryResult {
    requestId: number,
    userName: string,
    requestDate: string,
    moderationResult: boolean,
}
export interface IPasswordInfo {
    authority: string
    dateBirth: string
    dateExpiry: string
    dateIssue: string
    name: string
    passportNumber: string
    patronymic: string
    surname: string
    userInn: string
    userName: string
    registrationAddress: string
}

export interface IPaymentOrders {
    documentId: string,
    createdDate: Date,
    userAccountId: number,
    document: {
        date: Date,
        payer: {
            accountOfBank: string,
            calculationScheme: string,
        },
        paymentRecipient: {
            name: string,
            bank: string,
            bik: string,
            paymentAccount: string,
            target: string,
            paymentCode: string,
            amount: number,
            currency: string,
        }
    }
}
  