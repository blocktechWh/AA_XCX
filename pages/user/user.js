const app = getApp()

Page({
  data: {
  
  },
  onLoad: function (options) {
    const userInfo = app.globalData.userInfo
    if (userInfo){
      this.setData({ userInfo })
    }else{
      app.userInfoReadyCallbacks.push(this.refreshUserInfo)
    }
  },
  refreshUserInfo: function(){
    const userInfo = app.globalData.userInfo
    this.setData({ userInfo })
  },
  login: function(){
    app.login()
  }
})