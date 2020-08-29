import { ActionCreator, Action } from 'redux';
import { ModerationActionsTypes, ActiveRequest, MissingRequest } from './types';

export interface IConferenceJoinLink extends Action<ModerationActionsTypes.CONFERENCE_JOIN_LINK> {
    conferenceJoinLink: string;
}

export interface IActiveRequest extends Action<ModerationActionsTypes.ACTIVATE_REQUEST> {
    activeRequest: ActiveRequest | null;
}

export interface IMissingRequest extends Action<ModerationActionsTypes.MISSING_REQUEST> {
    missingRequest: MissingRequest | null;
}

export interface IStartDate extends Action<ModerationActionsTypes.START_DATE> {
    startDate: Date;
}

export interface IEndDate extends Action<ModerationActionsTypes.END_DATE> {
    endDate: Date;
}

export interface IRegisterUserText extends Action<ModerationActionsTypes.REGISTER_USER_TEXT> {
    registerUserText: string;
}
export interface IRequestId extends Action<ModerationActionsTypes.REQUEST_ID> {
    requestId: number;
}

export type ModerationActions =
    | IConferenceJoinLink
    | IActiveRequest
    | IStartDate
    | IEndDate
    | IRegisterUserText
    | IMissingRequest
    | IRequestId;

export const registerUserTextAction: ActionCreator<IRegisterUserText> = (registerUserText: string) => {
    return {
        type: ModerationActionsTypes.REGISTER_USER_TEXT,
        registerUserText,
    }
}

export const conferenceJoinLinkAction: ActionCreator<IConferenceJoinLink> = (conferenceJoinLink: string) => {
    return {
        type: ModerationActionsTypes.CONFERENCE_JOIN_LINK,
        conferenceJoinLink,
    }
}

export const activeRequestAction: ActionCreator<IActiveRequest> = (activeRequest: ActiveRequest | null) => {
    return {
        type: ModerationActionsTypes.ACTIVATE_REQUEST,
        activeRequest,
    }
}

export const missingRequestAction: ActionCreator<IMissingRequest> = (missingRequest: MissingRequest | null) => {
    return {
        type: ModerationActionsTypes.MISSING_REQUEST,
        missingRequest,
    }
}

export const requestIdAction: ActionCreator<IRequestId> = (requestId: number) => {
    return {
        type: ModerationActionsTypes.REQUEST_ID,
        requestId: requestId,
    }
}

export const startDateAction: ActionCreator<IStartDate> = (startDate: Date) => {
    return {
        type: ModerationActionsTypes.START_DATE,
        startDate,
    }
}

export const endDateAction: ActionCreator<IEndDate> = (endDate: Date) => {
    return {
        type: ModerationActionsTypes.END_DATE,
        endDate,
    }
}