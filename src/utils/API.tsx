import axios, { AxiosRequestConfig } from 'axios';
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

class APIUtil {
    static async logout(): Promise<any> {
        return new Promise((resolve, reject) => {
            var access = localStorage.getItem("access")
            var refresh = localStorage.getItem("refresh")
            var header: { [name: string]: any } = {}
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

            ).catch(error => {
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

            ).catch(error => {
                reject("unautheroized")
            })
        })
    }

    static async token_refresh(header: { [name: string]: any }): Promise<any> {
        return new Promise((resolve, reject) => {
            var refresh = localStorage.getItem("refresh")
            var access = localStorage.getItem("access")
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

    static async _request(url: string, method: Function, data: any = null): Promise<any> {
        return new Promise((resolve, reject) => {
            var header: { [name: string]: any } = {}
            var token = localStorage.getItem("access")
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
                            APIUtil.token_refresh(header).then(_ => {
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
                            APIUtil.token_refresh(header).then(_ => {
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

    static async post(url: string, data: any) {
        return APIUtil._request(url, axios.post, data)
    }
}
export default APIUtil