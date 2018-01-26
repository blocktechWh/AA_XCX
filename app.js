const util = require('/common/util.js')
const url = require('/common/constant_url.js')

App({
  onLaunch: function () {
    let token = wx.getStorageSync('token') || ''
    
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              const userInfo = res.userInfo
              wx.login({
                success: res => {
                  let data = {
                    code: res.code,
                    head: userInfo.avatarUrl,
                    name: userInfo.nickName
                  }
                  util.http_post(url.WxLogin,data,res=>{
                    if(!res.success)return
                    this.globalData.userInfo = userInfo
                    if (this.userInfoReadyCallback)this.userInfoReadyCallback()
                  })
                }
              })
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})