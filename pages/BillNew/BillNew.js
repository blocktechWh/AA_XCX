const util = require('../../common/util.js')
const url = require('../../common/constant_url.js')
const QR = require('../../common/qrcode.js')

Page({
  data: {
    
  },
  onLoad: function (options) {
    
    util.http_post(url.CreateAction, {}, res => {
      if(res.success){
        this.setData({
          code: res.data.code.split(''),
          id: res.data.id,
          title: res.data.title
        })
        this.drawQr()
      }
    })
  },
  drawQr: function(){
    var size = this.setCanvasSize()
    const qrdata = this.data.id
    this.createQrCode(qrdata, "mycanvas", size.w, size.h)
  },
  setCanvasSize: function () {
    var size = {};
    try {
      var res = wx.getSystemInfoSync();
      var scale = 750 / 200;
      var width = res.windowWidth / scale;
      var height = width;
      size.w = width;
      size.h = height;
    } catch (e) {
      console.log("获取设备信息失败" + e);
    }
    return size;
  },
  createQrCode: function (url, canvasId, cavW, cavH) {
    QR.api.draw(url, canvasId, cavW, cavH);
  },
})