const util = require('../../utils/util.js')
var QR = require("../../utils/qrcode.js");

Page({
  data: {
    logs: [],
    qrcPhld:"1",

  },
  size: {
    w: 0,
    h: 0
  },
  canvasId:"qrcCanvas",
  onLoad: function () {
    // this.setData({
    //   logs: (wx.getStorageSync('logs') || []).map(log => {
    //     return util.formatTime(new Date(log))
    //   })
    // })
    this.size = this.setCanvasSize();//动态设置画布大小  
    this.createQrCode(this.data.qrcPhld, this.canvasId, this.size.w, this.size.h);
  },
  createQrCode: function (str, canvasId, cavW, cavH) {
    //调用插件中的draw方法，绘制二维码图片  
    QR.api.draw(str, canvasId, cavW, cavH);

  },
  //适配不同屏幕大小的canvas  
  setCanvasSize: function () {
    var size = {};
    try {
      var res = wx.getSystemInfoSync();
      var scale = 750 / 300;//不同屏幕下canvas的适配比例；设计稿是750宽  
      var width = res.windowWidth / scale;
      var height = width;//canvas画布为正方形  
      size.w = width;
      size.h = height;
    } catch (e) {
      // Do something when catch error  
      console.log("获取设备信息失败" + e);
    }
    return size;
  }, 
})
