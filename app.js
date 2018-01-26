const util = require('/common/util.js')
const url = require('/common/constant_url.js')

App({
  onLaunch: function () {
    let token = wx.getStorageSync('token') || ''
    this.login()
  },
  login:function(){
    const that = this
    wx.getUserInfo({
      success: function (res) {
        that.login_action(res.userInfo)
      },
      fail: function () {
        wx.showModal({
          title: '注意',
          content: '你拒绝过微信授权,请重新授权！',
          cancelText: '取消',
          confirmText: '确认',
          success: function (res) {
            if (res.confirm) {
              wx.openSetting({
                success: function (res) {
                  if (!res.authSetting["scope.userInfo"] || !res.authSetting["scope.userLocation"]) {
                    wx.getUserInfo({
                      success: function (res) {
                        that.login_action(res.userInfo)
                      }
                    })
                  }
                }
              })
            }
          }
        })
      }
    })
  },
  login_action: function (userInfo){
    util.showLoading()
    wx.login({
      success: res => {
        let data = {
          code: res.code,
          head: userInfo.avatarUrl,
          name: userInfo.nickName
        }
        util.http_post(url.WxLogin, data, res => {
          if (!res.success) return
          this.globalData.userInfo = userInfo
          this.userInfoReadyCallback()
        })
      }
    })
  },
  userInfoReadyCallback: function(){
    this.userInfoReadyCallbacks.forEach(cb=>{
      cb()
    })
    util.hideLoading()
  },
  userInfoReadyCallbacks:[],
  globalData: {
    userInfo: null
  }
})