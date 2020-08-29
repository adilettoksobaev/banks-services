import { Roles } from "../Auth/types";

export interface AdminState {
    positionSuccess: boolean,
    employeeSuccess: boolean,
    settings: ISettings | null,
    bankAccountSuccess: boolean,
    stepRegistration: StepRegistration | string,
}

export enum AdminActionsTypes {
    SET_POSITION_SUCCESS = 'SET_POSITION_SUCCESS',
    SET_EMPLOYEE_SUCCESS = 'SET_EMPLOYEE_SUCCESS',
    GET_SETTINGS = 'GET_SETTINGS',
    BANK_ACCOUNT_SUCCESS = 'BANK_ACCOUNT_SUCCESS',
    STEP_REGISTRATION = "STEP_REGISTRATION",
}

export interface IEmployees {
    departmentId: number | null
    employeeId: number
    employeeInn: string
    employeeName: string
    role: Roles
    departmentName: string
    pin: string
}

export interface ISettings {
    apiKey: string
    color: string
    colorSecond: string
    logo: string
    name: string
    gradientColor: string
    colorBox: string
    colorText: string
    organizationInn: string
}

export interface ICustomers {
    customerId: number,
    customerName: string,
    customerPhone: string
}

export enum StepRegistration {
    registration_StartRegistration = "registration_StartRegistration",
    registration_CheckSmsCode = "registration_CheckSmsCode",
    registration_UploadUserPhoto = "registration_UploadUserPhoto",
    registration_UploadPassportFront = "registration_UploadPassportFront",
    registration_UploadPassportBack = "registration_UploadPassportBack",
    registration_UploadUserPhotoWithPassport = "registration_UploadUserPhotoWithPassport",
    registration_ConfirmUserRegistrationInfo = "registration_ConfirmUserRegistrationInfo",
    registration_WaitModeration = "registration_WaitModeration",
}