import { BASE_URL, TIMEOUT } from './config'
const ui = require('./ui');
class MYRequest {
    request(url,method,data){
        //返回Promise对象
        return new Promise((resolve, reject)=> {
            wx.request({
                url: BASE_URL + url,
                timeout: TIMEOUT,
                method: method,
                data: data,
                success: (res) => {
                    resolve(res);
                },
                fail: (res) => {
                   wx.showToast({
                             title: '网络错误！',
                             icon: 'none',
                             duration: 2000
                           })
                },
            })
        })
    }
    get(url, params){
        return this.request(url, "GET", params);
    }
    post(url, data){
        return this.request(url, "POST", data);
    }
}

const $http = new MYRequest;
export default $http;
