// pages/wybb/wybb.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasImg: false,
    imgPath: '',
    userInfo: '',
    hasUserInfo: false,
    model: '',
    fromn: '',
    ton: '',
    tsome: '',
    agent: '',
    showLogin: false,
    array: ['表白', '晒照', '吐槽', '心愿', '其它'],
    objectArray: [
      {
        id: 0,
        name: '表白',
        type: 'nbb'
      },
      {
        id: 1,
        name: '晒照',
        type: 'sz'
      },
      {
        id: 2,
        name: '吐槽',
        type: 'tc'
      },
      {
        id: 3,
        name: '心愿',
        type: 'xy'
      },
      {
        id: 4,
        name: '其它',
        type: 'ot'
      }
    ],
    index: 0,
    btype: 'nbb'
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value,
      btype: this.data.objectArray[e.detail.value].type
    })
  },
  chooseImg: function () {
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          hasImg: true,
          imgPath: res.tempFilePaths
        })
      }
    })
  },
  deleteImg: function () {
    this.setData({
      imgPath: '',
      hasImg: false
    })
  },
  inputToName: function (e) {
    this.setData({
      ton: e.detail.value
    })
  },
  inputFromName: function (e) {
    this.setData({
      fromn: e.detail.value
    })
  },
  inputToSome: function (e) {
    this.setData({
      tsome: e.detail.value
    })
  },
  uploadbb: function () {
    var that = this
    if (this.data.hasImg) {
      wx.uploadFile({
        url: 'https://wechat.gsdnxh.com/api/bbuploadx.php', 
        filePath: that.data.imgPath[0],
        name: 'file',
        formData: {
          'nick': that.data.userInfo.nickName,
          'opid': app.globalData.opid,
          'toname': that.data.ton,
          'tosome': that.data.tsome,
          'from': that.data.fromn,
          'agent': that.data.agent,
          'btype': that.data.btype
        },
        success: function (res) {
          if (res.data == '发布成功！' || res.data == '图片上传成功发布成功！') {
            wx.showToast({
              title: '发表成功！',
            })
            that.setData({
              imgPath: '',
              hasImg: false,
              ton: '',
              fromn: '',
              tsome: ''
            })
          } else {
            wx.showToast({
              title: res.data,
              icon: 'none'
            })
          }
          //do something
        }
      })
    } else {
      wx.request({
        url: 'https://wechat.gsdnxh.com/api/bbuploadx.php', //接口地址
        method: 'POST',
        data: {
          'nick': that.data.userInfo.nickName,
          'opid': app.globalData.opid,
          'toname': that.data.ton,
          'tosome': that.data.tsome,
          'from': that.data.fromn,
          'agent': that.data.agent,
          'btype': that.data.btype
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          if (res.data == '发布成功！' || res.data == '图片上传成功发布成功！') {
            wx.showToast({
              title: '发表成功！',
            })
            that.setData({
              ton: '',
              fromn: '',
              tsome: ''
            })
          } else {
            wx.showToast({
              title: res.data,
              icon: 'none'
            })
          }
        }
      })
    }
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

  hideLogin: function (e) {
    this.getUin()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    this.getUin()
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          agent: res.model
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    this.getUin()
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
  // onReachBottom: function () {

  // },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})