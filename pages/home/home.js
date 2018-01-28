const util = require('../../common/util.js')
const url = require('../../common/constant_url.js')
const app = getApp()

Page({
  data: {
    loaded: false,
    list: []
  },
  onLoad: function (options) {
    const logined = app.globalData.logined
    if (logined) {
      this.setData({ userInfo: app.globalData.userInfo })
      this.getData()
    } else {
      app.userInfoReadyCallbacks.push(this.getData)
    }
  },
  getData: function(){
    util.http_get(url.UserActions, res=>{
      let list = res.data
      list.forEach(item=>{
        item.createTime = util.formatTime(new Date(item.createTime))
        item.color = ['blue', 'orange', 'green'][item.rid % 3]
      })
      this.setData({ list, loaded:true })
    })
  },
  toBill: function(e){
    wx.navigateTo({ url: '/pages/Bill/Bill?id=' + e.currentTarget.dataset.id})
  }
})