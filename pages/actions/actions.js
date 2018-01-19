var QR = require("../../utils/qrcode.js");
var request = require('../../utils/request.js');
const app=getApp();
Page({
  data: {
    logs: [],
    qrcPhld:{
      actionId:'',
      roomCode:''
    },
    roomCode:[],
    title:"",
    id:""
  },
  size: {
    w: 0,
    h: 0
  },
  canvasId:"qrcCanvas",
  onLoad: function () {
    // this.setData({
    //   logs: (wx.getStorageSync('logs') || []).map(log => {
    //     return util.formatTime(new Date(log))
    //   })
    // })
    //发起AA
    this.createAction();
    this.size = this.setCanvasSize();//动态设置画布大小  
    
  },
  onUnload:function(){
    let data={
      actionId:this.data.id,
      title: this.data.title
    };
    //获取活动列表
    request._post_from(app.host +"/setActionTitle", data,app.globalData.token, function (res) {
      console.log("设置主题返回=", res);
    },
      function (res) {
        console.log("设置主题返回=", res);
      })
  },
  createAction:function(){
    var self=this;
    if (app.globalData.token) {
      //发起AA
      request._get(app.host +"/createAction", app.globalData.token, function (res) {
        console.log("发起AA返回=", res);
        if (res.data.success) {

          self.data.id = res.data.data.id;
          let id = res.data.data.id;
          self.setData({
            roomCode: res.data.data.code.split(""),
            title: res.data.data.title
          });
          self.data.qrcPhld.actionId = res.data.data.id;
          self.data.qrcPhld.roomCode = res.data.data.code;
          //let qrcPhld = JSON.stringify(self.data.qrcPhld.toString());
          //let qrcPhld = JSON.stringify(self.data.qrcPhld);
          let qrcPhld = "http://dingyeap.com/api/joinAction?id=" + id;
          console.log("qrcPhld=", qrcPhld);

          self.createQrCode(qrcPhld, self.canvasId, self.size.w, self.size.h);
        } else {

          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false
          })
        }

      },
        function (res) {
          console.log("发起AA返回=", res);
        })
    } else {

      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.tokenReadyCallback = res => {
      
        //发起AA
        request._get(app.host +"/getActions", res, function (res) {
          console.log("发起AA返回=", res);
          if (res.data.success) {

          } else {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false
            })
          }
        },
          function (res) {
            console.log("发起AA返回=", res);
          })
      }
    }

  },
  createQrCode: function (str, canvasId, cavW, cavH) {
    //调用插件中的draw方法，绘制二维码图片  
    QR.api.draw(str, canvasId, cavW, cavH);

  },
  //适配不同屏幕大小的canvas  
  setCanvasSize: function () {
    var size = {};
    try {
      var res = wx.getSystemInfoSync();
      var scale = 750 / 300;//不同屏幕下canvas的适配比例；设计稿是750宽  
      var width = res.windowWidth / scale;
      var height = width;//canvas画布为正方形  
      size.w = width;
      size.h = height;
    } catch (e) {
      // Do something when catch error  
      console.log("获取设备信息失败" + e);
    }
    return size;
  }, 
  titleInput:function(e){
    this.data.title = e.detail.value;
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '一起来AA吧',
      //path: 'http://dingyeap.com/api/joinAction?id=' + this.data.id,
      path: '/pages/detail2/detail2?shareActionId=' + this.data.id,
      success: function (res) {
        // 转发成功
        console.log("转发成功");

      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败");
      }
    }
  }
})
