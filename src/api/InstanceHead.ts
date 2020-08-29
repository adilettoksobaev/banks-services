import axios, { AxiosInstance } from 'axios';
import { baseUrl } from '../utils/baseUrl';

export class InstanceHead {
    public static instance: AxiosInstance
    public static init(apiKey: string) {
        InstanceHead.instance = axios.create({
            baseURL: `${baseUrl()}api/`,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "apiKey" : apiKey
            }
        })
    }
}