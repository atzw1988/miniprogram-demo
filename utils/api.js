const { get, remove } = require('./storage.js')
const { eT } = require('./base.js')
const router = require('../router/index.js')
const orgId = '40c7055f203749f7a5f6a5f96f43a36e'
// const orgId = '9af05671ae024729833ad32fdef9e0c4'  // 温州演示
// const url = 's://newpark.huatent.cn' // 嵊州
// const url = 's://www.lcgxlm.com' // 嵊州
// const url = 's://park.huatent.cn'  // 腾讯
// const url = 's://qqparking.tencent.com'  // 腾讯
// const url = 's://parking.tencent.com'  // 腾讯
// const url = '://192.168.0.162:18080'  // 李
const url = '://192.168.0.187:18080'  // 聂
// const url = '://192.168.0.155'  // 吴
const _socketUrl = `ws${url}/socket/park/websocket/`
// const API_BASE_URL = `http${url}/api`
const API_BASE_URL = `http${url}`

const request = (url, data, method) => {
  let _url = API_BASE_URL + url;
  return new Promise((resolve, reject) => {
    wx.request({
      url: _url,
      method: method,
      data: data,
      header: {
        'Content-Type': 'application/json'
      },
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300 || res.statusCode === 304) {
          resolve(res.data)
        } else {
          eT('网络出错,请稍后刷新重试')
        }
      },
      fail(error) {
        reject(error)
        eT('网络出错,请稍后刷新重试')
      }
    })
  })
}
const requestJsonToken = (url, data, method) => {
  let _url = API_BASE_URL + url
  return new Promise((resolve, reject) => {
    wx.request({
      url: _url,
      method: method, 
      data: data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': get('token')
      },
      success: (res) => {
        const app = getApp()
        if (res.statusCode >= 200 && res.statusCode < 300 || res.statusCode === 304) {
          resolve(res.data)
        } else if (res.statusCode === 401) {
          app.globalData.overdue++
          app.globalData.isLogin = false
          remove('token')
          if (app.globalData.overdue == 1) {
            eT('登陆过期，请重新登陆')
            setTimeout(() => {
              router.push({
                name: 'login'
              })
            }, 2000)
          }
        } else {
          eT('网络出错,请稍后刷新重试')
        }
      },
      fail: (error) => {
        reject(error)
        eT('网络出错,请稍后刷新重试')
      }
    })
  })
}
const requestFormToken = (url, data, method) => {
  let _url = API_BASE_URL + url
  return new Promise((resolve, reject) => {
    wx.request({
      url: _url,
      method: method,
      data: data,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': get('token')
      },
      success: (res) => {
        const app = getApp()
        if (res.statusCode >= 200 && res.statusCode < 300 || res.statusCode === 304) {
          resolve(res.data)
        } else if (res.statusCode === 401) {
          app.globalData.overdue++
          app.globalData.isLogin = false
          remove('token')
          if (app.globalData.overdue == 1) {
            eT('登陆过期，请重新登陆')
            setTimeout(() => {
              router.push({
                name: 'login'
              })
            }, 2000)
          }
        } else {
          eT('网络出错,请稍后刷新重试')
        }
      },
      fail(error) {
        console.log(error)
        reject(error)
        eT('网络出错,请稍后刷新重试')
      }
    })
  })
}
const requestCheck = (url, data, method) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      method: method,
      data: data,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        const app = getApp()
        if (res.statusCode >= 200 && res.statusCode < 300 || res.statusCode === 304) {
          resolve(res.data)
        } else if (res.statusCode === 401) {
          app.globalData.overdue++
          app.globalData.isLogin = false
          remove('token')
          if (app.globalData.overdue == 1) {
            eT('登陆过期，请重新登陆')
            setTimeout(() => {
              router.push({
                name: 'login'
              })
            }, 2000)
          }
        } else {
          eT('网络出错,请稍后刷新重试')
        }
      },
      fail: (error) => {
        reject(error)
        eT('网络出错,请稍后刷新重试')
      }
    })
  })
}
module.exports = {
  // 登陆接口
  login: (data) => {
    // console.log(app.globalData.orgId)
    data.orgId = orgId
    return request('/park/sys/login/wechatLogin', data, 'POST')
  }
}
