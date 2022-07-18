// components/countdown/countdown.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    deadline: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    deadline: '',
    days: '',
    hours: '',
    minutes: '',
    seconds: '',
    expired: false,
    viewable: false,
    lday: '',
    lhour: '',
    lmin: '',
    lsec: '',
    title: '',
    tips: '',
    timer: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
   refreshcd: function(){
     var that = this
     wx.request({
       url: 'https://wechat.gsdnxh.com/api/countd.php', //接口地址
       data: {
         id: '0'
       },
       header: {
         'content-type': 'application/json' // 默认值
       },
       success: function (res) {
         if (res.data.viewable === '1') {
           that.setData({
             viewable: true
           })
         } else {
           that.setData({
             viewable: false
           })
         }
         that.setData({
           deadline: res.data.deadline,
           title: res.data.title,
           tips: res.data.tips
         })
       }
     })
   }
  },
  ready: function(){
    var that = this
    wx.request({
      url: 'https://wechat.gsdnxh.com/api/countd.php', //接口地址
      data: {
        id: '0'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.viewable === '1') {
          that.setData({
           viewable: true
          })
        } else {
          that.setData({
            viewable: false
          })
        }
        that.setData({
          deadline: res.data.deadline,
          title: res.data.title,
          tips: res.data.tips
        })
      }
    })
    that.data.timer = setInterval(() => {
      // Difference between the 2 dates
      var days = ''
      var hours = ''
      var minutes = ''
      var seconds = ''
      var countDownDate = new Date(that.data.deadline).getTime()
      var now = new Date().getTime()
      var diff = countDownDate - now
      // Time conversion to days, hours, minutes and seconds
      var tdays = Math.floor(diff / (1000 * 60 * 60 * 24))
      var thours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      var tminutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      var tseconds = Math.floor((diff % (1000 * 60)) / 1000)
      // Keep 2 digits
      days = tdays < 10 ? '0' + tdays : tdays
      hours = thours < 10 ? '0' + thours : thours
      minutes = tminutes < 10 ? '0' + tminutes : tminutes
      seconds = tseconds < 10 ? '0' + tseconds : tseconds
      // Check for time expiration
      if (diff < 0) {
        clearInterval(timer)
        that.setData({
          expired: true
        })
      }
      that.setData({
        lday: days,
        lhour: hours,
        lmin: minutes,
        lsec: seconds
      })
    }, 1000)
  }
})
