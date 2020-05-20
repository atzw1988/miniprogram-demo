//app.js
const api = require('./utils/api.js')
const { set, get, remove } = require('./utils/storage.js')
const { qqmapsdk } = require('./utils/util.js')
const { eT } = require('./utils/base.js')
const moment = require('./utils/moment.js')


App({
  onLaunch: function () {
    // 展示本地存储能力
    const updateManager = wx.getUpdateManager()
    console.log(updateManager)
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })
    updateManager.onUpdateReady(function () {
      // wx.showModal({
      //     title: '更新提示',
      //     content: '新版本已经准备好，请下载并重启应用？',
      //     showCancel: false,
      //     success: function (res) {
      //         if (res.confirm) {
      //             // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
      //             updateManager.applyUpdate()
      //         }
      //     }
      // })
      updateManager.applyUpdate()
    })

    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      wx.showModal({
        title: '更新提示',
        content: '新版本下载失败',
        showCancel: false
      })
    })
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     console.log(res)
    //     if (true) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           console.log(res)
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
    // 获取用户位置信息
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        console.log(res)
        this.globalData.hasSit = true
        set('lng', res.longitude)
        set('lat', res.latitude)
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: (res) => {
            const data = res.result.address_component
            this.globalData.region = [data.province, data.city, data.district]
            // api.getOrg(data).then(res => {
            //   if (res.code === 1) {
            //     console.log(res)
            //     set('areaCode', res.data.areaCode)
            //     console.log(get('areaCode'))
            //   }
            // })
          }
        })
      },
      fail: (error) => {
        console.log(error)
        eT('您拒绝了位置服务权限，将无法提供定位服务！')
        set('lng', 116.455078)
        set('lat', 39.943436)
        this.globalData.hasSit = false
        setTimeout(() => {
          wx.authorize({
            scope: 'scope.userLocation'
          })
        }, 2000)
      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: '华腾智能停车',
      path: '/pages/index/index',
    }
  },
  globalData: {
    userInfo: null,
    isLogin: false
  }
})