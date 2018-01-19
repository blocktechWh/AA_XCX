//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  login:function(){
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log("code=", res.code);
        this.code = res.code;
        
        // 获取用户信息
        wx.getSetting({
          success: res => {
            // 可以将 res 发送给后台解码出 unionId
            app.globalData.userInfo = res.userInfo
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              wx.getUserInfo({
                success: res => {
                  console.log("用户信息=", res);
                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                  if (this.userInfoReadyCallback) {
                    this.userInfoReadyCallback(res)
                  }
                  let avatarUrl = res.userInfo.avatarUrl;
                  let nickName = res.userInfo.nickName;
                  this.login1(this.code, nickName, avatarUrl);
                }
              })
            }
          }
        })
      }
    })
  },
  login1: function (code, nickName, avatarUrl) {
    var self = this;
    let userObject = {
      openId: code,
      name: nickName,
      head: avatarUrl
    };
    let userInfo = JSON.stringify(userObject);

    wx.request({
      url: "http://111.231.146.57/api/noauth/login",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
      data: {
        code: code,
        name: nickName,
        head: avatarUrl
      },
      success: function (res) {
        console.log("登录返回", res);
        app.globalData.token = res.data.data.Authorization;
        if (self.tokenReadyCallback) {
          self.tokenReadyCallback(res.data.data.Authorization)
        }

      },
      fail: function (res) {
        console.log(res);
      }
    });

  }
})
