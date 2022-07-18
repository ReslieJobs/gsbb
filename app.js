//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        var that = this
        wx.request({
          url: 'https://wechat.gsdnxh.com/api/getdt.php', //接口地址
          data: {
            code:res.code,
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res2) {
            // console.log(res2)
            that.globalData.opid = res2.data.openid
            wx.request({
              url: 'https://wechat.gsdnxh.com/api/visitx.php', //接口地址
              data: {
                opid: res2.data.openid,
                key: '48bcab72f99aec868bcc4277d89ec1a5'
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function (res3) {
                console.log(res3.data)
              }
            })
          }
        })
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: null,
    opid:''
  }
})