import { InstanceHead } from './InstanceHead';

export class RegisteredUser {
    public static async getPassportInfo(sessionId: string, includePassportPhotos: boolean) {
        return await InstanceHead.instance.get(`RegisteredUser/GetPassportInfo/${sessionId}/${includePassportPhotos}`).then(res => {
            return res.data;
        })
    }
}