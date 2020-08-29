import axios, { AxiosInstance } from 'axios';
import { baseUrl } from '../utils/baseUrl';

export class SessionAPI {
    private static instance: AxiosInstance
    public static init(apiKey: string) {
        SessionAPI.instance = axios.create({
            baseURL: `${baseUrl()}api/Session/`,
            headers: {
                "apiKey" : '142CF319-BD63-4B4C-A4E3-28F2430E477B'
            }
        })
    }
    public static async getUserInfo(sessionId: string) {
        return await SessionAPI.instance.get(`GetUserInfo/${sessionId}`).then(res => {
            return res.data;
        })
    }
    public static async closeSession(sessionId: string) {
        return await SessionAPI.instance.post(`CloseSession/${sessionId}`).then(res => {
            return res.data;
        })
    }
}