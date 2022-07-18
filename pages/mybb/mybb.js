// pages/mybb/mybb.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: '',
    hasUserInfo: false,
    bbdata: '',
    page: 1,
    inputedPage: '',
    modelList: '',
    showPic: false,
    keyword: '',
    jing: false
  },
  onPullDownRefresh: function () {
    this.setData({
      bbdata: ''
    })
    var that = this
    this.getModelList()
    wx.request({
      url: 'https://wechat.gsdnxh.com/api/mybb.php', //接口地址
      data: {
        page: that.data.page,
        keyword: that.data.keyword,
        jing: false
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          bbdata: res.data,
          page: that.data.page,
          inputedPage: ''
        })
        wx.hideLoading()
        for (var i = 0; i < that.data.bbdata.length - 4; i++) {
          that.transTime(that.data.bbdata[i].timer, that.data.bbdata[i].id)
          that.getPage(that.data.bbdata[i].id)
          that.setThumbs(that.data.bbdata[i].id)
          that.getDeviceModel(that.data.bbdata[i].id, that.data.bbdata[i].useragent)
          that.getPic(that.data.bbdata[i].id)
        }
        wx.stopPullDownRefresh()
        wx.showToast({
          title: '刷新成功',
        })
      }
    })
  },
  setThumbs: function (id) {
    var that = this
    wx.login({
      success: res => {
        wx.request({
          url: 'https://wechat.gsdnxh.com/api/checkzan.php', //接口地址
          method: 'POST',
          data: {
            'opid': app.globalData.opid,
            'id': id
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success: function (res) {
            var obj
            for (var i = 0; i < that.data.bbdata.length - 4; i++) {
              if (that.data.bbdata[i].id == id) {
                obj = 'bbdata[' + i + '].isZan'
              }
            }
            if (res.data == 't') {
              that.setData({
                [obj]: true
              })
            }
          }
        })
      }
    })
  },
  thumbsUp: function (e) {
    var that = this
    wx.request({
      url: 'https://wechat.gsdnxh.com/api/zansubmit.php', //接口地址
      method: 'POST',
      data: {
        'opid': app.globalData.opid,
        'id': e.currentTarget.dataset.tid,
        'nick': that.data.userInfo.nickName
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        if (res.data == '点赞成功！') {
          that.refreshbb(that.data.page)
          wx.showToast({
            title: res.data,
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: res.data,
            icon: 'none'
          })
        }
      }
    })
  },
  sendSrc: function (e) {
    this.setData({
      showPic: true
    })
    this.picview.logSrc(e)
  },
  getPage: function (id) {//获取评论数
    var p = 0
    var that = this
    wx.request({
      url: 'https://wechat.gsdnxh.com/api/cmshow.php', //接口地址
      data: {
        id: id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
        p = res.data[res.data.length - 1]
        var obj = ''
        for (var i = 0; i < that.data.bbdata.length - 4; i++) {
          if (that.data.bbdata[i].id == id) {
            obj = 'bbdata[' + i + '].realpage'
          }
        }
        that.setData({
          [obj]: p
        })
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
        for (var i = 0; i < that.data.bbdata.length - 4; i++) {
          if (that.data.bbdata[i].id == id) {
            obj = 'bbdata[' + i + '].picLink'
          }
        }
        that.setData({
          [obj]: pic
        })
      }
    })
  },
  getDeviceModel: function (id, agent) {
    var currentDevice = ''
    var obj = ''
    for (var j = 0; j < this.data.modelList.length; j++) {
      if (agent.indexOf('NetType') > -1) {
        currentDevice = '网页版'
      } else if (agent.indexOf('Windows') > -1) {
        currentDevice = 'Windows'
      } else if (agent == this.data.modelList[j].agent) {
        currentDevice = this.data.modelList[j].model
        break;
      } else {
        currentDevice = agent
      }
    }
    for (var i = 0; i < this.data.bbdata.length - 4; i++) {
      if (this.data.bbdata[i].id == id) {
        obj = 'bbdata[' + i + '].realAgent'
      }
    }
    this.setData({
      [obj]: currentDevice
    })
  },
  transTime: function (t, id) {
    var date = new Date(t * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-'
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    var D = date.getDate() + ' '
    var h = date.getHours() + ':'
    var m = date.getMinutes() + ':'
    var s = date.getSeconds()
    var total = Y + M + D + h + m + s
    var obj = ''
    for (var i = 0; i < this.data.bbdata.length - 4; i++) {
      if (this.data.bbdata[i].id == id) {
        obj = 'bbdata[' + i + '].realtime'
      }
    }
    this.setData({
      [obj]: total
    })
  },
  intoComment: function (event) {
    let str0 = JSON.stringify(event.currentTarget.dataset.item);
    let str = str0.replace(/\?/g, '？')
    wx.navigateTo({
      url: '../comments/comments?item=' + str
    })
  },
  doPort: function () {
    wx.showToast({
      icon: 'none',
      title: '亲，这是你自己发布的内容，不能投诉哦！'
    })
  },
  inputPage: function (e) {
    this.setData({
      inputedPage: e.detail.value
    })
  },
  jumpPage: function () {
    if (this.data.inputedPage < 1 || this.data.inputedPage > this.data.bbdata[this.data.bbdata.length - 4]) {
      wx.showToast({
        title: '页数输入有误，请检查！',
        icon: 'none'
      })
    } else if (isNaN(parseInt(this.data.inputedPage))) {
      wx.showToast({
        title: '页数必须为数字，请检查！',
        icon: 'none'
      })
    } else {
      this.refreshbb(this.data.inputedPage)
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
      })
    }
  },
  nextPage: function () {
    if (this.data.page >= this.data.bbdata[this.data.bbdata.length - 4]) {
      wx.showToast({
        title: '已经是最后一页了！',
        icon: 'none'
      })
    } else {
      var newpage = this.data.page + 1
      this.refreshbb(newpage)
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
      })
    }
  },
  prePage: function () {
    if (this.data.page === 1) {
      wx.showToast({
        title: '已经是第一页了！',
        icon: 'none'
      })
    } else {
      var newpage = this.data.page - 1
      this.refreshbb(newpage)
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
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
  getModelList: function () {
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
  },
  refreshbb: function (page) {
    var that = this
    this.getModelList()
    wx.request({
      url: 'https://wechat.gsdnxh.com/api/mybb.php', //接口地址
      data: {
        page: page,
        keyword: that.data.keyword,
        jing: false
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          bbdata: res.data,
          page: parseInt(page),
          inputedPage: '',
        })
        for (var i = 0; i < that.data.bbdata.length - 4; i++) {
          that.transTime(that.data.bbdata[i].timer, that.data.bbdata[i].id)
          that.getPage(that.data.bbdata[i].id)
          that.getDeviceModel(that.data.bbdata[i].id, that.data.bbdata[i].useragent)
          that.getPic(that.data.bbdata[i].id)
          that.setThumbs(that.data.bbdata[i].id)
        }
      }
    })
  },
  onReady: function () {
    this.picview = this.selectComponent("#picview")
  },

  onLoad: function (options) {
    var that = this
    this.getModelList()
    this.getUin()
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://wechat.gsdnxh.com/api/mybb.php', //接口地址
      data: {
        page: 1,
        keyword: options.keyword,
        jing: false
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          bbdata: res.data,
          page: 1,
          inputedPage: '',
          keyword: options.keyword
        })
        wx.hideLoading()
        for (var i = 0; i < that.data.bbdata.length - 4; i++) {
          that.transTime(that.data.bbdata[i].timer, that.data.bbdata[i].id)
          that.getPage(that.data.bbdata[i].id)
          that.getDeviceModel(that.data.bbdata[i].id, that.data.bbdata[i].useragent)
          that.getPic(that.data.bbdata[i].id)
          that.setThumbs(that.data.bbdata[i].id)
        }
        that.refreshbb(that.data.page)
      }
    })
  },
  onShow: function () {
    this.getUin()
  },
})
