// components/transdate/transdate.js
Component({
  options: {
    // multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    date:{
      type:String,
      value:''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    time:''
  },

  /**
   * 组件的方法列表
   */
  attached: function(){
    var date = new Date(this.data.date * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-'
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    var D = date.getDate() + ' '
    var h = date.getHours() + ':'
    var m = date.getMinutes() + ':'
    var s = date.getSeconds()
    this.setData({
      time: Y + M + D + h + m + s
    })
  },
  methods: {
  }
})
