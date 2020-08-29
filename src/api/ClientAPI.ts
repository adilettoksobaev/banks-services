import { InstanceHead } from './InstanceHead';

export class ClientAPI {
    public static async getVideoCallStatus(sessionId: string, requestId: number) {
        return await InstanceHead.instance.get(`Client/GetVideoCallStatus/${sessionId}/${requestId}`).then(res => {
            return res.data;
        })
    }
    public static async getDepartments(sessionId: string) {
        return await InstanceHead.instance.get(`Client/GetDepartments/${sessionId}`).then(res => {
            return res.data;
        })
    }
    public static async getBankAccounts(sessionId: string, clientAccountId: number) {
        return await InstanceHead.instance.post(`Client/GetBankAccounts/${sessionId}/${clientAccountId}`).then(res => {
            return res.data;
        })
    }
    public static async setBankAccounts(sessionId: string, clientAccountId: number, bankAccounts: IBankAccounts[]) {
        return await InstanceHead.instance.post(`Client/SetBankAccounts/${sessionId}/${clientAccountId}`, bankAccounts).then(res => {
            return res.data;
        })
    }
    public static async getPassportInfo(sessionId: string, clientAccountId: number) {
        return await InstanceHead.instance.get(`Client/GetPassportInfo/${sessionId}/${clientAccountId}`).then(res => {
            return res.data;
        })
    }
}

export interface IBankAccounts {
    accountType: string,
    accountValue: string,
}