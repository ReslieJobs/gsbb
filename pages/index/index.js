//index.js
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
    showLogin: false,
    keyword: '',
    opnid: '',
    array: ['全部', '表白', '晒照', '吐槽', '心愿', '其它'],
    objectArray: [
      {
        id: 0,
        name: '全部',
        type: 'all'
      },
      {
        id: 1,
        name: '表白',
        type: 'nbb'
      },
      {
        id: 2,
        name: '晒照',
        type: 'sz'
      },
      {
        id: 3,
        name: '吐槽',
        type: 'tc'
      },
      {
        id: 4,
        name: '心愿',
        type: 'xy'
      },
      {
        id: 5,
        name: '其它',
        type: 'ot'
      }
    ],
    index: 0,
    btype: 'all',
    appId: "wx8abaf00ee8c3202e",
    extraData: {
      id: "46320",
      customData: {
        clientInfo: `miniprogram`,
      }
    }
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value,
      btype: this.data.objectArray[e.detail.value].type
    })
    this.refreshbb(this.data.page)
  },
  onPullDownRefresh: function () {
    this.setData({
      bbdata: ''
    })
    var that = this
    this.getModelList()
    this.selectComponent('#countdown').refreshcd()
    wx.request({
      url: 'https://wechat.gsdnxh.com/api/bbqshow.php', //接口地址
      data: {
        page: that.data.page,
        nbtype: that.data.btype
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          bbdata: res.data,
          page: that.data.page,
          inputedPage: '',
          keyword: ''
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
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
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
      if (agent.indexOf('NetType') > -1){
        currentDevice = '网页版'
      } else if (agent.indexOf('Windows') > -1) {
        currentDevice = 'Windows'
      } else if (this.data.modelList[j].agent == agent) {
        currentDevice = this.data.modelList[j].model
        break;
      } else {
        currentDevice = agent.replace(/\(.*?\)/g, '').replace(/\<.*?\>/g, '')
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
    let str = JSON.stringify(event.currentTarget.dataset.item);
    wx.navigateTo({
      url: '../comments/comments?item=' + str
    })
  },
  doSearch: function () {
    if (this.data.keyword == '' || this.data.keyword.replace(/ /g, '') == '') {
      wx.showToast({
        icon: 'none',
        title: '关键词不能为空！'
      })
    } else {
      var that = this
      wx.navigateTo({
        url: '../search/search?keyword=' + that.data.keyword
      })
    }
  },
  doIdSearch: function () {
    if (this.data.keyword == '' || this.data.keyword.replace(/ /g, '') == '') {
      wx.showToast({
        icon: 'none',
        title: 'id不能为空！'
      })
    } else {
      var that = this
      wx.navigateTo({
        url: '../idsearch/idsearch?keyword=' + that.data.keyword
      })
    }
  },
  doPort: function (event) {
    wx.setClipboardData({
      data: event.currentTarget.dataset.id,
      success(res) {
        wx.hideToast();
      }
    })
  },
  inputkey: function (e) {
    this.setData({
      keyword: e.detail.value
    })
  },
  inputPage: function (e) {
    this.setData({
      inputedPage: e.detail.value
    })
  },
  jumpPage: function () {
    if (this.data.inputedPage < 1 || this.data.inputedPage > this.data.bbdata[this.data.bbdata.length - 1]) {
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
    if (this.data.page >= this.data.bbdata[this.data.bbdata.length - 1]) {
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
      url: 'https://wechat.gsdnxh.com/api/bbqshow.php', //接口地址
      data: {
        page: page,
        nbtype: that.data.btype
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          bbdata: res.data,
          page: parseInt(page),
          inputedPage: ''
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

  onLoad: function () {
    var that = this
    this.getModelList()
    this.getUin()
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    wx.request({
      url: 'https://wechat.gsdnxh.com/api/bbqshow.php', //接口地址
      data: {
        page: 1,
        nbtype: that.data.btype
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          bbdata: res.data,
          page: 1,
          inputedPage: ''
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
    this.refreshbb(this.data.page)
    this.selectComponent('#countdown').refreshcd()
  },
})
