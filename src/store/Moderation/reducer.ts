import { Reducer } from "redux";
import { ModerationState } from "./types";
import { ModerationActions } from "./actions";
import { ModerationActionsTypes } from "./types";
import { sessionStorageSetItem, sessionStorageGetItem } from "../../utils/storage";

const defaultState: ModerationState = {
    conferenceJoinLink: sessionStorageGetItem('conferenceJoinLink'),
    activeRequest: JSON.parse(sessionStorage.getItem('activeRequest') || '{}'),
    missingRequest: JSON.parse(sessionStorage.getItem('missingRequest') || '{}'),
    requestId: sessionStorageGetItem('requestId'),
    startDate: new Date(),
    endDate: new Date(),
    registerUserText: '',
};

export const authReducer: Reducer<ModerationState, ModerationActions> = (state = defaultState, action) => {

    switch (action.type) {
        case ModerationActionsTypes.REGISTER_USER_TEXT:
            return {
                ...state,
                registerUserText: action.registerUserText,
            };
        case ModerationActionsTypes.CONFERENCE_JOIN_LINK:
            sessionStorageSetItem('conferenceJoinLink', action.conferenceJoinLink);
            return {
                ...state,
                conferenceJoinLink: action.conferenceJoinLink,
            };
        case ModerationActionsTypes.ACTIVATE_REQUEST:
            sessionStorage.setItem('activeRequest', JSON.stringify(action.activeRequest));
            return {
                ...state,
                activeRequest: action.activeRequest,
            };
        case ModerationActionsTypes.MISSING_REQUEST:
            sessionStorage.setItem('missingRequest', JSON.stringify(action.missingRequest));
            return {
                ...state,
                missingRequest: action.missingRequest,
            };
        case ModerationActionsTypes.REQUEST_ID:
            sessionStorageSetItem('requestId', action.requestId.toString());
            return {
                ...state,
                requestId: action.requestId.toString(),
            };
        case ModerationActionsTypes.START_DATE:
            return {
                ...state,
                startDate: action.startDate,
            };
        case ModerationActionsTypes.END_DATE:
            return {
                ...state,
                endDate: action.endDate,
            };
        default:
            return state;
    }
};

export default authReducer;