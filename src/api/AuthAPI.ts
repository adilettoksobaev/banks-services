import { InstanceHead } from './InstanceHead';

export class AuthAPI {
    public static async getNameByInn(inn: string) {
        return await InstanceHead.instance.post('Auth/GetNameByInn', {inn})
    }

    public static async employeeCheck(innOrganisation: string, innEmployee: string) {
        return await InstanceHead.instance.post('Auth/EmployeeCheck', {innOrganisation, innEmployee}).then(res => {
            return res.data;
        })
    }

    public static async employeePinConfirm(pin: string, innOrganisation: string, innEmployee: string) {
        return await InstanceHead.instance.post('Auth/EmployeePinConfirm', {pin, innOrganisation, innEmployee}).then(res => {
            return res.data;
        })
    }
}