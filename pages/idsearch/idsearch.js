// pages/idsearch/idsearch.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: '',
    comments: '',
    tucao: '',
    who: '',
    modelList: ''
  },
  getDeviceModel: function (agent) {
    var currentDevice = ''
    for (var j = 0; j < this.data.modelList.length; j++) {
      if (agent.indexOf('NetType') > -1) {
        currentDevice = false
      } else if (this.data.modelList[j].agent == agent) {
        currentDevice = this.data.modelList[j].model
      } else {
        currentDevice = agent
      }
    }
    this.setData({
      'item.realAgent': currentDevice
    })
  },
  transTime: function (t) {
    var date = new Date(t * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-'
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    var D = date.getDate() + ' '
    var h = date.getHours() + ':'
    var m = date.getMinutes() + ':'
    var s = date.getSeconds()
    var total = Y + M + D + h + m + s
    this.setData({
      'item.realtime': total
    })
  },
  getTucao: function (id) {
    var that = this
    wx.request({
      url: 'https://wechat.gsdnxh.com/api/cmshow.php', //接口地址
      data: {
        id: id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          comments: res.data
        })
      }
    })
  },
  sendSrc: function (e) {
    this.picview.logSrc(e)
  },
  inputWho: function (e) {
    this.setData({
      who: e.detail.value
    })
  },
  inputWhat: function (e) {
    this.setData({
      tucao: e.detail.value
    })
  },
  postTucao: function () {
    var that = this
    wx.request({
      url: 'https://wechat.gsdnxh.com/api/tcsubx.php', //接口地址
      method: 'POST',
      data: {
        'opid': app.globalData.opid,
        'tucao': that.data.tucao,
        'id': that.data.item.id,
        'from': that.data.who
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        if (res.data == '发布成功！' || res.data == '图片上传成功发布成功！') {
          wx.showToast({
            title: '发表成功！',
          })
          that.getTucao(that.data.item.id)
        } else {
          wx.showToast({
            title: res.data,
            icon: 'none'
          })
        }
      }
    })
  },
  getPic: function (id) {
    var that = this
    var pic = ''
    var obj = ''
    wx.request({
      url: 'https://wechat.gsdnxh.com/api/picshow.php', //接口地址
      data: {
        id: id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.pic) {
          pic = res.data.pic
        } else {
          pic = false
        }
        that.setData({
          'item.picLink': pic
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.request({
      url: 'https://wechat.gsdnxh.com/api/model.php', //接口地址
      data: {
        page: 0
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          modelList: res.data
        })
      }
    })
    wx.request({
      url: 'https://wechat.gsdnxh.com/api/ids.php', //接口地址
      data: {
        id: options.keyword
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data =="表白内容已被删除或未审核通过！"){
          that.setData({
            'item.status': res.data
          })
        } else {
          that.setData({
            item: res.data
          })
          that.getDeviceModel(that.data.item.useragent)
          that.transTime(that.data.item.timer)
          that.getPic(options.keyword)
        }
      }
    })
    this.getTucao(options.keyword)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.picview = this.selectComponent("#picview")
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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