// components/getuserinfo/getuserinfo.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
  },
  ready: function () {

  },
  /**
   * 组件的方法列表
   */
  methods: {
    hideBtn(e){
      this.triggerEvent('hidelogin', {udata: e})
    }
  }
})
