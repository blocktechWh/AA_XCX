//index.js
//获取应用实例
var request = require('../../utils/request.js');
const app=getApp();
Page({
  data: {
    code:"",
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    actionList:[]
  },
  onLoad:function(){
    var self=this;
    wx.showLoading({
      title: "加载中..."
    })
    if (app.globalData.token){
      //获取活动列表
      request._get(app.host + "/getActions", app.globalData.token, function (res) {
        console.log("获取活动列表=", res);
        wx.hideLoading();
        var actionList = [];
        for (let i = 0; i < res.data.data.length; i++) {
          let action = {
            title: res.data.data[i].title,
            index: i,
            actionId: res.data.data[i].rid,
            code: res.data.data[i].code
          };
          actionList.push(action);

        };
        self.setData({
          actionList: actionList
        })
      },
        function (res) {
          console.log("获取活动列表=", res);
        })
    }else{
      app.tokenReadyCallback = res =>{
        let token=res;
        //获取活动列表
        request._get(app.host + "/getActions", token, function (res) {
          console.log("获取活动列表=", res);
          wx.hideLoading();
          var actionList = [];
          for (let i = 0; i < res.data.data.length; i++) {
            let action = {
              title: res.data.data[i].title,
              index: i,
              actionId: res.data.data[i].rid,
              code: res.data.data[i].code
            };
            actionList.push(action);

          };
          self.setData({
            actionList: actionList
          })
        })
      }
    }
    
  },
  onShow:function(){
    
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  
})
