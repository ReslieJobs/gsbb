// components/picview/picview.js
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
   piclink:'',
   isShow: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    logSrc(e){
      this.setData({
        piclink: e.currentTarget.dataset.currentpic,
        isShow: true
      })
    },

    closePic(){
      this.setData({
        isShow: false,
      })
    }
  }
})
