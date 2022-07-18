// pages/comments/comments.js
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
    state: ''
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options.item)
    this.setData({
      item: JSON.parse(options.item)
    })
    this.getTucao(this.data.item.id)
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
    let str = JSON.stringify(this.data.item)
    var stype = ''
    if (this.data.item.btype === 'nbb') {
      stype = '表白'
    } else if (this.data.item.btype === 'tc') {
      stype = '吐槽'
    } else if (this.data.item.btype === 'sz') {
      stype = '晒照'
    } else if (this.data.item.btype === 'xy') {
      stype = '心愿'
    } else if (this.data.item.btype === 'ot') {
      stype = '其它'
    } else {
      stype = '表白'
    }
    var that = this
    return {
      title: that.data.item.fromname+'发布了一条'+stype,
      path: 'pages/comments/comments?item='+str
    }
  }
})