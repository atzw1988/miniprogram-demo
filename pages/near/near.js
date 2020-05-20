// pages/near/near.js
const { get, remove } = require('../../utils/storage.js')
const { getDis } = require('../../utils/jutils.js')
const { eT } = require('../../utils/base.js')
const router = require('../../router/index.js')
const api = require('../../utils/api.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        maxheight: 0,
        imgList: [
            {
                name: '路边停车',
                src: '/img/road.png',
                srcActive: '/img/roadActive.png'
            },
            {
                name: '车库停车',
                src: '/img/parking.png',
                srcActive: '/img/parkingActive.png'
            },
            {
                name: '充电桩',
                src: '/img/charging.png',
                srcActive: '/img/chargingActive.png'
            }
        ],
        activeNo: 0,
        menuHeight: 50,
        showMenu: false,
        mapHeight: 'calc(100% - 200rpx)',
        parkHeight: 200,
        lng: '',
        lat: '',
        scale: 14,
        traffic: false,
        markers: [],
        parkList: [],
        more: false,
        scroll: false,
        currentPage: 1,
        selPark: {},
        allLoading: false,
        moreLoading: false,
        pages: 1,
        des: ''
    },

    // 视野变化
    bindregionchange (e) {
        console.log(e)
        console.log(this.data.scale)
    },
    // 地图渲染完成
    bindupdated (e) {
        console.log(e)
    },
    // 获取停车场位置
    getList (currentPage) {
        const data = {
            currentPage: currentPage,
            pageSize: 20,
            lat: this.data.lat,
            lng: this.data.lng
        }
        api.getParking(data).then(res => {
            console.log(res)
            if (res.code === 1) {
                this.setData({
                    loading: false
                })
                this.data.pages = res.data.pages
                const list = res.data.records
                const lat = this.data.lat
                const lng = this.data.lng
                list.forEach((item,index) => {
                    item.id = index
                    item.latitude = item.roadLat
                    item.longitude = item.roadLng
                    item.iconPath = '/img/park.png'
                    item.width = 30
                    item.height = 30
                    item.distance = getDis(lat, lng, item.roadLat, item.roadLng)
                })
                list.sort((a, b) => {
                    return a.distance - b.distance
                })
                const newList = list.filter(item => {
                    return item.distance < 2
                })
                if (newList.length > 0) {
                    if (this.data.des) {
                        newList.push(this.data.des)
                    }
                    if (this.data.currentPage === 1) {
                        this.setData({
                            markers: newList,
                            parkList: list.slice(0, 1)
                        })
                    } else {
                        this.setData({
                            markers: this.data.markers.concat(list),
                            parkList: list.slice(0, 1)
                        })
                    }
                    if (this.data.pages > this.data.currentPage) {
                        this.setData({
                            allLoading: true
                        })
                        this.data.currentPage++
                    } else {
                        this.setData({
                            allLoading: false
                        })
                    }
                } else {
                    eT('附近没有停车场，您可搜索其他区域！')
                    this.setData({
                        parkList: []
                    })
                }
            } else {
                eT('停车场列表获取失败，请重新进入本页面')
                this.setData({
                    loading: false,
                    parkList: []
                })
            }
        }).catch(error => {
            this.setData({
                loading: false
            })
        })
    },
    // 上拉加载
    searchScrollLower () {
        if (this.data.allLoading) {
            this.setData({
                moreLoading: true
            })
            this.getLogList(this.data.currentPage)
        } else {
            return
        }
    },
    // 点击重新定位
    controltap () {
        this.mapCtx.moveToLocation()
        this.setData({
            lng: get('lng'),
            lat: get('lat'),
            scale: 14
        })
    },
    // 展示右侧菜单栏
    showMenu () {
        if (this.data.showMenu) {
            this.setData({
                menuHeight: 50
            })
        } else {
            this.setData({
                menuHeight: 340
            })
        }
        this.data.showMenu = !this.data.showMenu
    },
    // 地图右侧菜单栏
    checkMenu ({currentTarget:{id}}) {
        this.setData({
           activeNo: id,
           menuHeight: 340
        })
    },
    // 点击停车场标记点
    markertap ({markerId}) {
        if (markerId != '999999') {
            let selPark = {}
            this.data.markers.forEach(item => {
                if (item.id === markerId) {
                    item.iconPath = '/img/parkActive.png'
                    item.width = 45
                    item.height = 45
                    selPark = item
                } else {
                    item.iconPath = '/img/park.png'
                    item.width = 30
                    item.height = 30
                }
            })
            this.data.selPark = selPark
            this.setData({
                markers: this.data.markers,
                lng: selPark.longitude,
                lat: selPark.latitude,
                parkList: [selPark]
            })
        } else {
            return
        }
    },
    // 获取更多停车场
    getMore () {
        if (!this.data.more) {
            this.setData({
                mapHeight: 'calc(100% - 600rpx)',
                parkHeight: 600,
                more: !this.data.more,
                parkList: this.data.markers.filter(item => {
                    if (item.roadId) {
                        return item
                    }
                }),
                scroll: true
            })
        } else {
            this.setData({
                mapHeight: 'calc(100% - 200rpx)',
                parkHeight: 200,
                more: !this.data.more,
                scroll: false
            })
            if (this.data.selPark.roadName) {
                this.setData({
                    parkList: [this.data.selPark]
                })
            } else {
                this.setData({
                    parkList: this.data.markers.slice(0, 1)
                })
            }
        }
    },
    // 跳转停车场详情
    toParkDetail ({currentTarget:{id}}) {
        const park = this.data.markers[id]
        console.log(park)
        this.setData({
            mapHeight: 'calc(100% - 200rpx)',
            parkHeight: 200,
            more: !this.data.more,
            scroll: false
        })
        router.push({
            name: 'parkingdetail',
            data: {
                park: park
            }
        })
    },
    // 导航
    goNavigation ({currentTarget:{id}}) {
        const toPark = this.data.markers[id]
        wx.openLocation({
            latitude: toPark.latitude,
            longitude: toPark.longitude,
            name: toPark.parkName,
            address: toPark.roadName,
            scale: 14
        })
    },
    // 搜索框输入
    toSearch () {
        this.setData({
            mapHeight: 'calc(100% - 200rpx)',
            parkHeight: 200,
            more: !this.data.more,
            scroll: false
        })
        router.push({
            name: 'search'
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // console.log(wx.getSystemInfoSync().windowHeight)
        // this.data.maxHeight = wx.getSystemInfoSync().windowHeight
        // this.setData({
        //     mapHeight: this.data.maxHeight - 100
        // })
        // const park = router.extract(options).park
        // console.log(park)
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.mapCtx = wx.createMapContext('map')
        this.animation = wx.createAnimation({
            duration: 300,
            timingFunction: 'linear'
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.setData({
            loading: true
        })
        const des = get('des')
        if (des) {
            this.setData({
                lat: des.latitude,
                lng: des.longitude,
                des: des
            })
        } else {
            this.setData({
                lat: get('lat') ? get('lat') : 22.623102,
                lng: get('lng') ? get('lng') : 113.864998
                // lat: 22.623102,
                // lng: 113.864998
            })
        }
        this.getList(this.data.currentPage)
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        remove('des')
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        remove('des')
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})