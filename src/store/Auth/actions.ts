import { ActionCreator, Action } from 'redux';
import { AuthActionsTypes, GetUserInfo } from './types';

export interface IEmployeePinConfirm extends Action<AuthActionsTypes.EMPLOYEE_PIN_CONFIRM> {
    sessionId: string;
    isAuthorized: boolean;
}

export interface IGetUserInfo extends Action<AuthActionsTypes.GET_USER_INFO> {
    getUserInfo: GetUserInfo;
    isAuthorized: boolean;
}

export interface ISetLoader extends Action<AuthActionsTypes.SET_LOADER>{
    loading: boolean
}

export interface ILogout extends Action<AuthActionsTypes.LOGOUT>{}

export type AuthActions =
    | IEmployeePinConfirm
    | IGetUserInfo
    | ISetLoader
    | ILogout;

export const employeePinConfirmAction: ActionCreator<IEmployeePinConfirm> = (sessionId: string, isAuthorized: boolean) => {
    return {
        type: AuthActionsTypes.EMPLOYEE_PIN_CONFIRM,
        sessionId,
        isAuthorized
    }
}

export const getUserInfoAction: ActionCreator<IGetUserInfo> = (getUserInfo: GetUserInfo, isAuthorized: boolean) => {
    return {
        type: AuthActionsTypes.GET_USER_INFO,
        getUserInfo,
        isAuthorized
    }
}

export const setLoaderAction: ActionCreator<ISetLoader> = (loading: boolean) => {
    return {
        type: AuthActionsTypes.SET_LOADER,
        loading
    }
}

export const logoutAction: ActionCreator<ILogout> = () => {
    return {
        type: AuthActionsTypes.LOGOUT
    }
}