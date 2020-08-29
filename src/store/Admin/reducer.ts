import { Reducer } from "redux";
import { AdminState } from "./types";
import { AdminActions } from "./actions";
import { AdminActionsTypes } from "./types";

const defaultState: AdminState = {
    positionSuccess: false,
    employeeSuccess: false,
    settings: JSON.parse(sessionStorage.getItem("settings")  || '{}'),
    bankAccountSuccess: false,
    stepRegistration: "",
};

export const adminReducer: Reducer<AdminState, AdminActions> = (state = defaultState, action) => {

    switch (action.type) {
        case AdminActionsTypes.STEP_REGISTRATION:
            return {
                ...state,
                stepRegistration: action.stepRegistration
            };
        case AdminActionsTypes.BANK_ACCOUNT_SUCCESS:
            return {
                ...state,
                bankAccountSuccess: action.bankAccountSuccess
            };
        case AdminActionsTypes.SET_POSITION_SUCCESS:
            return {
                ...state,
                positionSuccess: action.positionSuccess
            };
        case AdminActionsTypes.SET_EMPLOYEE_SUCCESS:
            return {
                ...state,
                employeeSuccess: action.employeeSuccess
            };
        case AdminActionsTypes.GET_SETTINGS:
            sessionStorage.setItem("settings", JSON.stringify(action.settings));
            return {
                ...state,
                settings: action.settings
            };
        default:
            return state;
    }
};

export default adminReducer;