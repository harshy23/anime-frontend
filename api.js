import axios from 'axios'

import{jwtDecode} from "jwt-decode"

export const BASEURL = "https://animerecoo-api.onrender.com/"

const api = axios.create({
    baseURL:BASEURL
})

api.interceptors.request.use((config)=>{
    const token = window.localStorage.getItem("access");
    if(token){
        const decode =jwtDecode(token);
        const expirytime = decode.exp;
        const presenttime = Date.now() / 1000;
        if(expirytime>presenttime){
            config.headers.Authorization =`Bearer ${token}`;
        }
    }
    return config;
},
(error)=>{
    return Promise.reject(error);
})

export default api