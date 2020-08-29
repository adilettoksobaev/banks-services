import { Reducer } from "redux";
import { AuthState } from "./types";
import { AuthActions } from "./actions";
import { AuthActionsTypes } from "./types";
import { sessionStorageSetItem, sessionStorageGetItem, sessionStorageRemoveItem } from "../../utils/storage";

const defaultState: AuthState = {
    sessionId: sessionStorageGetItem('sessionId'),
    getUserInfo: null,
    isAuthorized: false,
    loading: false,
};

export const authReducer: Reducer<AuthState, AuthActions> = (state = defaultState, action) => {

    switch (action.type) {
        case AuthActionsTypes.EMPLOYEE_PIN_CONFIRM:
            sessionStorageSetItem('sessionId', action.sessionId);
            return {
                ...state,
                sessionId: action.sessionId,
                isAuthorized: action.isAuthorized
            };
        case AuthActionsTypes.GET_USER_INFO:
            return {
                ...state,
                getUserInfo: action.getUserInfo,
                isAuthorized: action.isAuthorized
            };
        case AuthActionsTypes.SET_LOADER:
            return {
                ...state,
                loading: action.loading
            };
        case AuthActionsTypes.LOGOUT:
            sessionStorageRemoveItem('sessionId');
            return {
                ...state,
                getUserInfo: null,
                isAuthorized: false,
            };
        default:
            return state;
    }
};

export default authReducer;