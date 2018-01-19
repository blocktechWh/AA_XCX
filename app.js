
//var request = require('../../utils/request.js')

App({
  code:"",
  host:"http://111.231.146.57/api",
  //host: "https://blocktechwh.com/api",
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log("code=",res.code);
        this.code=res.code;
        //获取用户信息
        this.getUserInfo();
      }
    })
    
  },
  getUserInfo:function(){
    // 获取用户信息
    wx.getSetting({
      success: res => {
        
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log("用户信息=", res);
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
              let avatarUrl = res.userInfo.avatarUrl;
              let nickName = res.userInfo.nickName;
              this.login(this.code, nickName, avatarUrl);
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    token:""
  },
  login: function (code, nickName, avatarUrl) {
    var self=this;
    let userObject={
      openId:code,
      name: nickName,
      head: avatarUrl
    };
    let userInfo = JSON.stringify(userObject);

    wx.request({
      url: self.host+"/noauth/login",
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
        console.log("登录返回",res);
        
        self.globalData.token = res.data.data.Authorization;
        console.log("token1=", self.globalData.token);
        if (self.tokenReadyCallback) {
          self.tokenReadyCallback(res.data.data.Authorization)
        }

      },
      fail: function (res) {
        console.log(res);
      }
    });

  },
})