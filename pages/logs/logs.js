//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: [],
    inputString:"",
    bindNumberArray:[],
    isFocus:false,
  },
  onLoad: function () {
    // this.setData({
    //   logs: (wx.getStorageSync('logs') || []).map(log => {
    //     return util.formatTime(new Date(log))
    //   })
    // })
  },
  roomCodeInputListener:function(e){
    console.log(e);
    if (e.detail.cursor <= 4 && e.detail.cursor >= 0){
      if (e.detail.value.length === 0){
        this.data.bindNumberArray = [];
      }else{
        this.data.bindNumberArray = e.detail.value.split("");
      }
      
      console.log("this.data.bindNumberArray=" + this.data.bindNumberArray);
      this.setData({
        bindNumberArray: this.data.bindNumberArray
      })
    }
  },
  set_Focus:function(){
    this.setData({
      isFocus: true,
    })
  },
  saomiao:function(){
    // 只允许从相机扫码
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log(res)
      }
    })
  }
})
