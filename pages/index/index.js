//index.js
//获取应用实例
const app = getApp()
const router = require('../../router/index.js')
const api = require('../../utils/api.js')
const { get, remove } = require('../../utils/storage.js')
const { payWayFilter } = require('../../utils/jutils.js')

Page({
  data: {
    indicatorDots: true,
    current: 0,
    autoplay: true,
    interval: 5000,
    duration: 500,
    activeColor: '',
    circular: true,
    imgUrls: [
      '/img/sy_banner.png',
      '/img/sy_banner.png',
      '/img/sy_banner.png'
    ],
    parktext: '',
    renewal: '',
    owetext: '',
    rechargetext: '',
    logtext: '',
    src: 'http://iph.href.lu/40x40?text=1',
    operList: [
      {
        title: '泊位停车',
        label: '您尚未登录',
        page: 'parking',
        src: '/img/sy_1.png'
      },
      {
        title: '停车待缴',
        label: '您尚未登录',
        page: 'oweorder',
        src: '/img/sy_2.png'
      },
      {
        title: '快速充值',
        label: '您尚未登录',
        page: 'wallet',
        src: '/img/sy_3.png'
      },
      {
        title: '开通会员卡',
        label: '您尚未登录',
        page: 'vipcard',
        src: '/img/sy_4.png'
      },
      {
        title: '停车记录',
        label: '您尚未登录',
        page: 'parkinglog',
        src: '/img/sy_5.png'
      }
    ],
    visible: false,
    actions: [
      {
        name: '取消'
      }, 
      {
        name: '确定',
        color: '#2d8cf0'
      }
    ],
    modleText: '',
    modleTo: '',
    isParking: false,
    isOwe: true,
    actionsRe: [
      {
        name: '取消'
      },
      {
        name: '前往查看',
        color: '#2d8cf0'
      }
    ],
    visibleRe: false
  },
  //事件处理函数
  bindViewTap (val) {
    console.log(val)
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.isLogin) {
    }
  },
  onShow: function () {
    this.getBulletin()
    if (app.globalData.isLogin) {
      payWayFilter()
      this.getUserBalance()
      this.checkParking()
      this.checkOwn()
      this.data.operList[0].label = '停车更智能'
      this.data.operList[3].label = '停车更优惠'
      this.data.operList[4].label = '历史一目了然'
      this.setData({
        operList: this.data.operList
      })
      console.log(get('isRegister'))
      if (get('isRegister')) {
        this.setData({
          visibleRe: true
        })
      }
    } else {
      this.data.operList.forEach(item => {
        item.label = '您尚未登录'
      })
      this.data.modleTo = 'login'
      this.setData({
        operList: this.data.operList,
        modleText: '您还没有登录，是否去登录'
      })
    }
  },
  // 获取广告列表
  getBulletin () {
    api.getBulletin().then(res => {
      console.log(res)
      if (res.code === 1) {
        if (res.data.length > 0) {
          const imgList = res.data.map(item => {
            return item.imageUrl
          })
          this.setData({
            current: 0,
            imgUrls: imgList
          })
        } else {
          this.setData({
            imgUrls: [
              '/img/sy_banner.png',
              '/img/sy_banner.png',
              '/img/sy_banner.png'
            ]
          })
        }
      }
    })
  },
  // 查询用户余额
  getUserBalance () {
    api.getBalance({
      mobile: get('phone')
    }).then(res => {
      console.log(res)
      if (res.code === 1) {
        this.data.operList[2].label = '余额' + parseFloat(res.data / 100) + '元'
        this.setData({
          operList: this.data.operList
        })
      }
    })
  },
  // 查询是否是否有欠费订单
  checkOwn () {
    const data = {
      currentPage: 1,
      pageSize: 1,
      payStatus: 0
    }
    api.getParkLog(data).then(res => {
      console.log(res)
      if (res.code === 1) {
        const list = res.data.records
        if (list.length > 0) {
          this.data.isOwe = true
          this.data.modleTo = 'oweorder'
          this.data.modleText = '您当前还有未结算订单，结算后才可再次停车，是否前往结算？'
          this.data.operList[1].label = '有待结算订单'
        } else {
          this.data.isOwe = false
          this.data.operList[1].label = ''
        }
        this.setData({
          operList: this.data.operList
        })
      }
    })
  },
  // 下拉刷新
  onPullDownRefresh() {
    console.log('1')
    this.onShow()
  },
  onShareAppMessage: function () {

  },
  // 查询是否有在停订单
  checkParking () {
    api.isParking().then(res => {
      console.log(res)
      if (res.code === 1) {
        if (res.data) {
          this.data.isParking = true
          this.data.modleTo = 'parkdetail'
          this.data.modleText = '您有在停订单，是否去查看'
        } else {
          this.data.isParking = false
        }
      }
    })
  },
  // 菜单跳转
  handleRouter ({currentTarget:{id}}) {
    if (app.globalData.isLogin) {
      if (id == 'parking' && this.data.isParking) {
        console.log('1')
        this.setData({
          visible: true,
          modleText: this.data.modleText
        })
      } else if (id == 'parking' && this.data.isOwe) {
        console.log('2')
        this.setData({
          visible: true,
          modleText: this.data.modleText
        })
      } else if (id == 'vipcard') {
        router.push({
          name: 'vipcard',
          data: {
            handleCard: true
          }
        })
      } else {
        router.push({
          name: id
        })
      }
    } else {
      this.setData({
        visible: true,
        modleText: this.data.modleText
      })
    }
  },
  // 弹出框选择
  handleModle ({detail:{index}}) {
    this.setData({
      visible: false
    })
    if (index === 1) {
      router.push({
        name: this.data.modleTo
      })
    }
  },
  // 优惠券弹出框选择
  handleCoupons ({detail:{index}}) {
    this.setData({
      visibleRe: false
    })
    remove('isRegister')
    if (index === 1) {
      wx.switchTab({
        url: '/pages/my/my'
      })
    }
  }
})
