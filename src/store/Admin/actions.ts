import { ActionCreator, Action } from 'redux';
import { AdminActionsTypes, ISettings, StepRegistration } from './types';

export interface IPositionSuccess extends Action<AdminActionsTypes.SET_POSITION_SUCCESS> {
    positionSuccess: boolean;
}

export interface IEmployeeSuccess extends Action<AdminActionsTypes.SET_EMPLOYEE_SUCCESS> {
    employeeSuccess: boolean;
}

export interface ISettingsAction extends Action<AdminActionsTypes.GET_SETTINGS> {
    settings: ISettings;
}

export interface IBankAccountSuccess extends Action<AdminActionsTypes.BANK_ACCOUNT_SUCCESS> {
    bankAccountSuccess: boolean;
}

export interface IStepRegistration extends Action<AdminActionsTypes.STEP_REGISTRATION> {
    stepRegistration: StepRegistration | string;
}

export type AdminActions =
    | IPositionSuccess
    | IEmployeeSuccess
    | ISettingsAction
    | IBankAccountSuccess
    | IStepRegistration;

export const stepRegistrationAction: ActionCreator<IStepRegistration> = (stepRegistration: StepRegistration | string) => {
    return {
        type: AdminActionsTypes.STEP_REGISTRATION,
        stepRegistration
    }
}

export const bankAccountSuccessAction: ActionCreator<IBankAccountSuccess> = (bankAccountSuccess: boolean) => {
    return {
        type: AdminActionsTypes.BANK_ACCOUNT_SUCCESS,
        bankAccountSuccess
    }
}

export const positionSuccessAction: ActionCreator<IPositionSuccess> = (positionSuccess: boolean) => {
    return {
        type: AdminActionsTypes.SET_POSITION_SUCCESS,
        positionSuccess
    }
}

export const employeeSuccessAction: ActionCreator<IEmployeeSuccess> = (employeeSuccess: boolean) => {
    return {
        type: AdminActionsTypes.SET_EMPLOYEE_SUCCESS,
        employeeSuccess
    }
}

export const settingsAction: ActionCreator<ISettingsAction> = (settings: ISettings) => {
    return {
        type: AdminActionsTypes.GET_SETTINGS,
        settings
    }
}