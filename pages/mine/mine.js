// pages/mine/mine.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: '',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showLogin: false,
    bbdata: ''
  },

  showAbout: function () {
    wx.navigateTo({
      url: '../about/about'
    })
  },

  showMybb: function () {
    wx.navigateTo({
      url: '../mybb/mybb?keyword='+app.globalData.opid
    })
  },
  intoRule: function () {
    wx.navigateTo({
      url: '../idsearch/idsearch?keyword=10103'
    })
  },
  showJing: function () {
    wx.navigateTo({
      url: '../search/search?keyword=1&jing=1'
    })
  },
  getUin: function () {
    var that = this
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo
        that.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          showLogin: false
        })
      },
      fail: err => {
        that.setData({
          showLogin: true
        })
      }
    })
  },
  refresh: function(){
    var that = this
    wx.request({
      url: 'https://wechat.gsdnxh.com/api/bbqshow.php', //接口地址
      data: {
        page: 1,
        nbtype: 'all'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          bbdata: res.data,
        })
      }
    })
  },
  hideLogin: function (e) {
    this.getUin()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    wx.request({
      url: 'https://wechat.gsdnxh.com/api/bbqshow.php', //接口地址
      data: {
        page: 1,
        nbtype: 'all'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          bbdata: res.data,
        })
        wx.hideLoading()
      }
    })
    this.getUin()
  },

    /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getUin()
    this.refresh()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
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