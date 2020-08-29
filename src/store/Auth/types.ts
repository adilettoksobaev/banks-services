export interface AuthState {
    sessionId: string | null;
    getUserInfo: GetUserInfo | null;
    isAuthorized: boolean;
    loading: boolean;
}

export enum AuthActionsTypes {
    EMPLOYEE_PIN_CONFIRM = 'EMPLOYEE_PIN_CONFIRM',
    GET_USER_INFO = 'GET_USER_INFO',
    SET_LOADER = 'SET_LOADER',
    LOGOUT = 'LOGOUT',
}

export interface GetUserInfo {
    fullName: string;
    inn: string;
    innOrganisation: string;
    roles: Roles;
}

export enum Roles {
    User = 'User',
    Moderator = 'Moderator',
    CompanyAdmin = 'CompanyAdmin',
    SuperAdmin = 'SuperAdmin',
}
  