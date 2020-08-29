import { ISearchHistory, IPasswordInfo } from '../store/Moderation/types';
import { InstanceHead } from './InstanceHead';

export class ModerationApi {
    public static async getActiveRequests(sessionId: string) {
        return await InstanceHead.instance.get(`Moderation/GetActiveRequests/${sessionId}`).then(res => {
            return res.data;
        })
    }
    public static async getMissingRequests(sessionId: string) {
        return await InstanceHead.instance.get(`Moderation/GetMissingRequests/${sessionId}`).then(res => {
            return res.data;
        })
    }
    public static async startVideoCall(sessionId: string, requestId: number) {
        return await InstanceHead.instance.post(`Moderation/StartVideoCall/${sessionId}/${requestId}`).then(res => {
            return res.data;
        })
    }
    public static async getPassportInfo(sessionId: string, requestId: number) {
        return await InstanceHead.instance.get(`Moderation/GetPassportInfo/${sessionId}/${requestId}`).then(res => {
            return res.data;
        })
    }
    public static async registerUser(sessionId: string, requestId: number) {
        return await InstanceHead.instance.post(`Moderation/RegisterUser/${sessionId}/${requestId}`).then(res => {
            return res.data;
        });
    }
    public static async refuseUserRegistration(sessionId: string, requestId: number) {
        return await InstanceHead.instance.post(`Moderation/RefuseUserRegistration/${sessionId}/${requestId}`).then(res => {
            return res.data;
        });
    }
    public static async searchHistory(sessionId: string, history: ISearchHistory) {
        return await InstanceHead.instance.post(`Moderation/SearchHistory/${sessionId}`, history).then(res => {
            return res.data;
        });
    }
    public static async changePassportInfo(sessionId: string, requestId: number, passwordInfo: IPasswordInfo) {
        return await InstanceHead.instance.post(`Moderation/ChangePassportInfo/${sessionId}/${requestId}`, passwordInfo).then(res => {
            return res.data;
        });
    }
    public static async redirectVideoCall(sessionId: string, requestId: number, departmentId: number) {
        return await InstanceHead.instance.post(`Moderation/RedirectVideoCall/${sessionId}/${requestId}/${departmentId}`).then(res => {
            return res.data;
        });
    }
    public static async requestRegistrationForGuest(sessionId: string, requestId: number) {
        return await InstanceHead.instance.post(`Moderation/RequestRegistrationForGuest/${sessionId}/${requestId}`).then(res => {
            return res.data;
        });
    }
}