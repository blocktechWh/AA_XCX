const util = require('../../common/util.js')
const url = require('../../common/constant_url.js')

Page({
  data: {
    showModal: false,
    codeValue: ''
  },
  onLoad: function (options) {
  
  },
  toBillNew: function(){
    wx.navigateTo({ url: '/pages/BillNew/BillNew' })
  },
  showModel: function(){
    this.setData({ showModal: true })
  },
  preventTouchMove: function () { },
  hideModal: function(){
    this.setData({ showModal: false })
  },
  onCancel: function () {
    this.hideModal();
  },
  inputChange: function(e){
    this.setData({ codeValue:e.detail.value })
  },
  onConfirm: function () {
    this.hideModal();
    util.showLoading();
    util.http_post(url.JoinAction,{
      code: this.data.codeValue
    },res=>{
      if(res.success){
        util.hideLoading()
        util.showSuccess('加入成功！')
        setTimeout(function () {
          wx.navigateTo({ url: '/pages/Bill/Bill?id=' + res.data })
        }, 500)
      }else{
        if(res.msg)util.showModel('',res.msg)
      }
    })
  },
  scan: function(){
    wx.scanCode({
      success: function(res){
        console.log(res)
        if (res.result.indexOf('http://blocktechwh.com/api/shareQr.html')>-1){
          var link = decodeURIComponent(res.result);
          var paramArr = link.split('=');
          util.showLoading();
          util.http_get(url.JoinAction + '?id=' + paramArr[1], res => {
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
        }
      }
    })
  }
})