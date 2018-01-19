//logs.js
const util = require('../../utils/util.js');
const request = require('../../utils/request.js');
const app = getApp();
Page({
  data: {
    value: "",
    actionId: "",
    logs: [],
    inputString: "",
    bindNumberArray: [],
    isFocus: false,
  },
  onLoad: function () {
    // this.setData({
    //   logs: (wx.getStorageSync('logs') || []).map(log => {
    //     return util.formatTime(new Date(log))
    //   })
    // })


  },
  roomCodeInputListener: function (e) {
    console.log(e);
    var self = this;
    self.data.value = e.detail.value;


    if (e.detail.cursor <= 4 && e.detail.cursor >= 0) {
      if (e.detail.value.length === 0) {
        self.data.bindNumberArray = [];
      } else {
        self.data.bindNumberArray = e.detail.value.split("");
      }

      console.log("this.data.bindNumberArray=" + self.data.bindNumberArray);
      self.setData({
        bindNumberArray: self.data.bindNumberArray
      })

      if (e.detail.cursor === 4) {
        var data = {
          code: e.detail.value
        }
        wx.showLoading({
          title: "加载中...",
          success: function () { }
        })

        //清空输入框
        self.setData({
          value: "",
          bindNumberArray: []
        })

        request._post_from(app.host + "/joinAction", data, app.globalData.token, function (res) {
          wx.hideLoading();
          console.log("加入AA返回=", res);
          if (res.data.success) {

            wx.navigateTo({
              url: '../../pages/detail2/detail2?actionId=' + res.data.data,
            })
          } else {

            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false
            })
          }
        },
          function (res) {
            console.log("加入AA返回=", res);
          })
      }
    }
  },
  set_Focus: function () {
    this.setData({
      isFocus: true,
    })
  },
  saomiao: function () {
    // 只允许从相机扫码
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log(res);
        //let result = JSON.parse(res.result);
        let result = res.result;
        console.log("result=", result)
        // console.log("roomCode=", result.roomCode);
        // console.log("actionId=", result.actionId);
        var actionId = result.actionId;
        var data = {
          code: result.roomCode
        }
        wx.showLoading({
          title: "加载中...",

        })
        request._get(result, app.globalData.token, function (res) {
          console.log("actionId=", res.data.data);
          wx.navigateTo({
            url: '../../pages/detail2/detail2?actionId=' + res.data.data,
          })

        }, function (res) {

        })

      }
    })
  }
})
