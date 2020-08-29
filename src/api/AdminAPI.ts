import { IEmployees } from '../store/Admin/types';
import { InstanceHead } from './InstanceHead';

export interface IDepartment {
    departmentId: number,
    departmentName: string,
    clientRegistration: boolean,
    colorId: number,
    iconId: number,
}

export class AdminAPI {
    public static async setEmployee(sessionId: string, employee: IEmployees) {
        return await InstanceHead.instance.post(`Admin/SetEmployee/${sessionId}`, employee).then(res => {
            return res.data;
        });
    }
    public static async getDepartments(sessionId: string) {
        return await InstanceHead.instance.get(`Admin/GetDepartments/${sessionId}`).then(res => {
            return res.data;
        });
    }
    public static async setDepartments(sessionId: string, department: IDepartment) {
        return await InstanceHead.instance.post(`Admin/SetDepartments/${sessionId}`, department).then(res => {
            return res.data;
        });
    }
    public static async searchEmployees(sessionId: string, maxShowRequest: number, skipRequest: number) {
        return await InstanceHead.instance.post(`Admin/SearchEmployees/${sessionId}`, {maxShowRequest, skipRequest}).then(res => {
            return res.data;
        });
    }
    public static async deleteDepartment(sessionId: string, departmentId: number) {
        return await InstanceHead.instance.post(`Admin/DeleteDepartment/${sessionId}/${departmentId}`).then(res => {
            return res.data;
        });
    }
    public static async deleteEmployee(sessionId: string, employeeId: number) {
        return await InstanceHead.instance.post(`Admin/DeleteEmployee/${sessionId}/${employeeId}`).then(res => {
            return res.data;
        });
    }
    public static async searchCustomers(sessionId: string, maxShowRequest: number, skipRequest: number) {
        return await InstanceHead.instance.post(`Admin/SearchCustomers/${sessionId}`, {maxShowRequest, skipRequest}).then(res => {
            return res.data;
        });
    }
}