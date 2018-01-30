const app = getApp()

Page({
  data: {
  
  },
  onLoad: function (options) {
    const logined = app.globalData.logined
    if (logined) {
      this.setData({ userInfo: app.globalData.userInfo })
    }else{
      app.userInfoReadyCallbacks.push(this.refreshUserInfo)
    }
  },
  refreshUserInfo: function(){
    this.setData({ userInfo: app.globalData.userInfo })
  },
  login: function(){
    app.login()
  },
  toFeedback: function () {
    wx.navigateTo({ url: '/pages/feedback/feedback' })
  },
  toRecord: function () {
    wx.navigateTo({ url: '/pages/record/record' })
  }
})