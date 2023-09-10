import axios from "axios";
import {API_BASE_URL} from  "../config/route";


class ApiClient{
    static instance = null;
    /** @type {axios} */
    static axiosClient = null;
    static #token = "";

    /**
     * @returns {ApiClient}
     */
    static getInstance() {
        if(ApiClient.instance !== null) return ApiClient.instance;
        ApiClient.axiosClient = axios;
        ApiClient.instance = new ApiClient();
        return  ApiClient.instance;
    }

    fetchToken(){
        if(ApiClient.#token !== "") return;
        try {
            const token = localStorage.getItem("token");
            if(!token) throw new Error("Token not found");
            ApiClient.#token = "Bearer "+ token;
        } catch (error) {
            console.log("Failed to fetch bearer token");
        }
    }

    setToken(token){
        if(!token) return false;
        ApiClient.#token = token;
        return true;
    }

    // route will always start with / and dont ends with /
    async request(method, route, body={}){
        this.fetchToken();
        if(!["get", "put", "post", "delete", "patch"].includes(method.toLowerCase())) {
            return {
                success: false,
                message: "Invalid method",
                data: null
            }
        }
        const config = {
            method: method.toLowerCase(),
            url: `${API_BASE_URL}${route}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': ApiClient.#token === "" ? null : ApiClient.#token
            },
            data: JSON.stringify(body)
        }
        try{
            let res = await ApiClient.axiosClient(config);
            return {
                success: true,
                message: "Success",
                data: res.data
            }
        }catch (e) {
            return {
                success: false,
                message: e.message,
                data: null
            }
        }
    }

    // upload file
    async uploadFile(file){
        let data = new FormData();
        data.append('file', file);
        const config = {
            method: 'post',
            url: `${API_BASE_URL}/file/upload`,
            data : data
        }
        try{
            let res = await ApiClient.axiosClient(config);
            let fileLink = res.data;
            return {
                success: true,
                link: fileLink
            };
        }catch (e) {
            return {
                success: false,
                link: ""
            }
        }
    }

    getLinkFromFileName(fileName){
        return `${API_BASE_URL}/file/${fileName}`;
    }
}

module.exports =  ApiClient;