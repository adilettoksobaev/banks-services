import { InstanceHead } from './InstanceHead';

export class ClientDocumentsAPI {
    public static async getPaymentOrders(sessionId: string, clientAccountId: number) {
        return await InstanceHead.instance.get(`ClientDocuments/GetPaymentOrders/${sessionId}/${clientAccountId}`).then(res => {
            return res.data;
        })
    }
    public static async addPaymentOrder(sessionId: string, clientAccountId: number, paymentOrder: IAddPaymentOrder) {
        return await InstanceHead.instance.post(`ClientDocuments/AddPaymentOrder/${sessionId}/${clientAccountId}`, paymentOrder).then(res => {
            return res.data;
        })
    }
    public static async getContracts(sessionId: string, clientAccountId: number) {
        return await InstanceHead.instance.get(`ClientDocuments/GetContracts/${sessionId}/${clientAccountId}`).then(res => {
            return res.data;
        })
    }
    public static async sendClientContract(sessionId: string, clientAccountId: number) {
        return await InstanceHead.instance.post(`ClientDocuments/SendClientContract/${sessionId}/${clientAccountId}`).then(res => {
            return res.data;
        })
    }
    public static async getContract(sessionId: string, documentId: string, apiKey: string) {
        return await InstanceHead.instance.get(`ClientDocuments/GetContract/${sessionId}/${documentId}/${apiKey}`).then(res => {
            return res.data;
        })
    }
}

export interface IAddPaymentOrder {
    paymentOrderNumber: string,
    description: string,
    date: Date,
    payer: {
        accountOfBank: string,
        calculationScheme: string
    },
    paymentRecipient: {
        name: string,
        bank: string,
        bik: string,
        paymentAccount: string,
        target: string,
        paymentCode: string,
        amount: number,
        currency: string,
    }
}