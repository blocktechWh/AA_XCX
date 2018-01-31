const util = require('../../common/util.js')
const url = require('../../common/constant_url.js')
const app = getApp()

Page({
  data: {
  
  },
  onLoad: function (options) {
    if (options.q){
      var link = decodeURIComponent(options.q);
      var paramArr = link.split('=');
      const id = paramArr[1]
      this.setData({ id })
    } else if (options.id){
      this.setData({ id: options.id })
    }

    const logined = app.globalData.logined
    if (logined) {
      this.getData()
    } else {
      app.userInfoReadyCallbacks.push(this.getData)
    }
  },
  getQueryString(str,name) { 
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
    var r = window.location.search.substr(1).match(reg); 
    if(r != null) return unescape(r[2]); 
    return null; 
  },
  getData: function () {
    util.showLoading();
    util.http_get(url.JoinAction + '?id=' + this.data.id, res => {
      if (res.success) {
        util.hideLoading()
        util.showSuccess('加入成功！')
        setTimeout(function () {
          wx.switchTab({ url: '/pages/home/home' })
        }, 500)
      } else {
        if (res.msg) util.showModel('', res.msg)
      }
    })
  },
})