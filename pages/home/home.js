const util = require('../../common/util.js')
const url = require('../../common/constant_url.js')
const QR = require('../../common/qrcode.js')
const app = getApp()

Page({
  data: {
    loaded: false,
    list: []
  },
  onLoad: function (options) {
    const logined = app.globalData.logined
    if (logined) {
      this.getData()
    } else {
      app.userInfoReadyCallbacks.push(this.getData)
    }
  },
  onShow: function(){
    const logined = app.globalData.logined
    if (logined) {
      this.getData()
    }
  },
  loading: false,
  getData: function(){
    this.loading = true
    util.http_get(url.UserActions, res=>{
      if(res.success){
        let list = res.data
        list.forEach((item, index) => {
          item.createTime = util.formatTime(new Date(item.createTime.replace(/\s/, 'T')))
          item.color = ['blue', 'orange', 'green'][item.rid % 3]
          if (item.paySum != 0) {
            const paySumString = item.paySum.toString()
            item.paySum = paySumString.substring(0, paySumString.length - 2) + '.' + paySumString.substring(paySumString.length - 2, paySumString.length)
          }
          item.showQrCode = false
          this.drawQr('http://blocktechwh.com/api/shareQr.html?id=' + item.rid, "code" + index)
        })
        this.setData({ list, loaded: true })
      }
      this.loading = false
    },err=>{
      this.loading = false
    })
  },
  toBill: function(e){
    wx.navigateTo({ url: '/pages/Bill/Bill?id=' + e.currentTarget.dataset.id})
  },
  drawQr: function (qrdata,canvasId) {
    var size = this.size ? this.size:this.setCanvasSize()
    this.createQrCode(qrdata, canvasId, size.w, size.h)
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
    this.size = size;
    return size;
  },
  createQrCode: function (url, canvasId, cavW, cavH) {
    QR.api.draw(url, canvasId, cavW, cavH);
  },
  toggleQr: function(e){
    const index = e.currentTarget.dataset.idx
    let list = this.data.list
    list[index].showQrCode = !list[index].showQrCode
    this.setData({ list })
  },
  share: function(){
    wx.showShareMenu()
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      return{
        title: '加入AA吧',
        path: '/pages/Join/Join?id=' + res.target.dataset.id,
      }
    }else{
      return {
        title: 'AA一起',
        path: '/pages/home/home',
      }
    }
  }
  // todo: 长按操作菜单 出浮动层 删除或者改名
})