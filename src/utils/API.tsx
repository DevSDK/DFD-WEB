import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import setCookie from './Cookie'
import configs from '../config.json';
import 'babel-polyfill';

function ressetAuth(): void {
    setCookie("access", "")
    setCookie("refresh", "")
    localStorage.setItem("refresh", "")
    localStorage.setItem("refresh", "")
    APIUtil.logout()
}

type axios_request_method<R = AxiosResponse> = (url: string, data?: AxiosRequestConfig, config?: AxiosRequestConfig) => Promise<R>

class APIUtil {
    static async logout(): Promise<string> {
        return new Promise((resolve, reject) => {
            const access = localStorage.getItem("access")
            const refresh = localStorage.getItem("refresh")
            const header: { [name: string]: string | null } = {}
            header['Authorization'] = access
            header['X-Dfd-Refresh'] = refresh

            axios.get(configs.authApiBase + "/logout", { headers: header }).then(response => {
                if (response.data === undefined) {
                    reject("error")
                    return
                }
                resolve(response.data)
                localStorage.setItem("access", "")
                localStorage.setItem("refresh", "")
            }

            ).catch(() => {
                reject("unautheroized")
                localStorage.setItem("access", "")
                localStorage.setItem("refresh", "")
            })
        })
    }

    static async get_token(): Promise<any> {
        return new Promise((resolve, reject) => {
            axios.defaults.withCredentials = true
            axios.get(configs.authApiBase + "/token", { withCredentials: true }).then(response => {
                if (response.data === undefined) {
                    reject("error")
                    return
                }
                resolve(response.data)
            }

            ).catch(() => {
                reject("unautheroized")
            })
        })
    }

    static async token_refresh(header: { [name: string]: string | null }): Promise<AxiosResponse> {
        return new Promise((resolve, reject) => {
            const refresh = localStorage.getItem("refresh")
            const access = localStorage.getItem("access")
            if (access === "" || refresh === "") {
                reject({ "reason": "Token invalid" })
                return
            }
            header["X-Dfd-Refresh"] = refresh
            axios.get(configs.authApiBase + "/refresh", { headers: header }).then(RefreshResponse => {
                header['Authorization'] = RefreshResponse.data["access"]
                localStorage.setItem("access", RefreshResponse.data["access"])
                resolve(RefreshResponse)
            }).catch(error => {
                reject(error.response)
            })
        })
    }

    static async _request(url: string, method: axios_request_method, data: any = null): Promise<any> {
        return new Promise((resolve, reject) => {
            const header: { [name: string]: string | null } = {}
            const token = localStorage.getItem("access")
            if (token !== "") {
                header['Authorization'] = token;
            }
            if (data == null)
                (method(url, { headers: header }) as Promise<any>).then(response => {
                    resolve(response.data)
                }).catch(error => {
                    if (error.response === undefined) {
                        reject("Internal Error :" + error)
                        return
                    }
                    if (error.response.data["status"] != 401) {
                        reject("Server Response :" + error.response.data["status"])
                        return
                    }

                    if (error.response.data["status"] == 401) {
                        if (error.response.data["token_expired"]) {
                            APIUtil.token_refresh(header).then(() => {
                                (method(url, { headers: header }) as Promise<any>).then(response => {
                                    resolve(response.data)
                                })
                            }).catch(error => {
                                ressetAuth()
                                reject(error)
                            })
                        } else {
                            reject(error)
                        }
                    }

                })
            else {
                (method(url, data, { headers: header }) as Promise<any>).then(response => {
                    resolve(response.data)
                }).catch(error => {
                    if (error.response === undefined) {
                        reject("Internal Error :" + error)
                        return
                    }
                    if (error.response.data["status"] != 401) {
                        reject("Server Response :" + error.response.data["status"])
                        return
                    }
                    if (error.response.data["status"] == 401) {
                        if (error.response.data["token_expired"]) {
                            APIUtil.token_refresh(header).then(() => {
                                (method(url, data, { headers: header }) as Promise<any>).then(response => {
                                    resolve(response.data)
                                })
                            }).catch(error => {
                                ressetAuth()
                                reject(error)
                            })
                        } else {
                            reject(error)
                        }
                    }

                })
            }
        })
    }

    static async get(url: string): Promise<any> {
        return APIUtil._request(url, axios.get)
    }

    static async patch(url: string, data: any): Promise<any> {
        return APIUtil._request(url, axios.patch, data)
    }

    static async post(url: string, data: any) : Promise<any> {
        return APIUtil._request(url, axios.post, data)
    }
}
export default APIUtil