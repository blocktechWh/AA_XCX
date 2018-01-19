const util = require('../../utils/util.js');
const request = require('../../utils/request.js');
const app = getApp();
Page({
  data: {
    actionId: 0,
    nowTime: '',
    delBtnWidth: 375,//删除按钮宽度单位（rpx）
    resultList: [],
    detailJoinerList: [],
    list: []
  },
  onLoad: function (options) {
    var self = this;
    if (options.q) {
      console.log("q=", decodeURIComponent(options.q));
      request._get(decodeURIComponent(options.q), app.globalData.token, function (res) {
        console.log("actionId11=", res.data);

        self.data.actionId = res.data.data;

        wx.setStorageSync("actionId", res.data.data);

        self.setData({
          actionId: res.data.data
        })

        if (self.actionIdReadyCallback) {
          self.actionIdReadyCallback(res.data.data)
        }


      }, function (res) {

      })
    } else if (options.actionId) {
      self.data.actionId = options.actionId;

      wx.setStorageSync("actionId", options.actionId);

      self.setData({
        actionId: options.actionId
      })
    } else if (options.shareActionId){
      console.log("shareActionId=", options.shareActionId);
      request._get(app.host+"/joinAction?id="+options.shareActionId, app.globalData.token, function (res) {
        console.log("actionId11=", res.data);

        self.data.actionId = res.data.data;

        wx.setStorageSync("actionId", res.data.data);

        self.setData({
          actionId: res.data.data
        })

        if (self.actionIdReadyCallback) {
          self.actionIdReadyCallback(res.data.data)
        }


      }, function (res) {

      })
    }




  },
  onShow: function () {
    let self = this;
    wx.showLoading({
      title: "加载中..."
    })

    if (self.actionId != 0) {
      
        //查询活动详情
        request._get(app.host + "/viewAction?actionId=" + wx.getStorageSync("actionId"), app.globalData.token, function (res) {
          console.log("获取活动详情=", res);
          wx.hideLoading();
          if (res.data.success) {
            self.operateItems(res);
            self.operateResult(res);
          } else {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false
            })
          }

        }, function (res) {
          console.log("获取活动详情=", res);
        })
      
    } else {
      self.actionIdReadyCallback = res => {
        //查询活动详情
        request._get(app.host + "/viewAction?actionId=" + res, app.globalData.token, function (res) {
          console.log("获取活动详情=", res);
          wx.hideLoading();
          if (res.data.success) {
            self.operateItems(res);
            self.operateResult(res);
          } else {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false
            })
          }

        }, function (res) {
          console.log("获取活动详情=", res);
        })
      }
    }

  },
  getUserInfo: function () {
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
  login: function (code, nickName, avatarUrl) {
    var self = this;
    let userObject = {
      openId: code,
      name: nickName,
      head: avatarUrl
    };
    let userInfo = JSON.stringify(userObject);

    wx.request({
      url: self.host + "/noauth/login",
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
  operateItems: function (res) {

    let items = res.data.data.items;
    if (items.length > 0) {
      let list = [];
      for (let i = 0; i < items.length; i++) {
        let item = {
          id: 'form',
          rid: items[i].rid,
          index: i,
          name: decodeURIComponent(items[i].payerName).replace(/\+/g, ""),
          open: false,
          count: items[i].joinCount,
          payer: items[i].payer,
          cash: items[i].amount / 100,
          aaAvgAmount: items[i].aaAvgAmount / 100,
          activity: items[i].memo,
          timer: items[i].payTime.substring(0, 10),
          openMenu: false,
          txtStyle: "",
          pages: ['button', 'list', 'input', 'slider', 'uploader'],
          detailJoinerList: []
        }
        list.push(item);
      }

      this.setData({
        list: list
      })
    }

  },
  operateResult: function (res) {
    let results = res.data.data.result;
    let resultList = [];
    for (let i = 0; i < results.length; i++) {
      let result = {
        fromMebId: results[i].fromMebId,
        //fromName: decodeURIComponent(results[i].fromName).replace(/\+/g, ""),
        fromName: results[i].fromName,
        fromHead: results[i].fromHead,
        toMebId: results[i].toMebId,
        //toName: decodeURIComponent(results[i].toName).replace(/\+/g, ""),
        toName: results[i].toName,
        toHead: results[i].toHead,
        amount: results[i].amount / 100,
        index: i
      };
      resultList.push(result);

    }
    this.setData({
      resultList: resultList
    })
  },
  openMenu: function (e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.list;
    if (list[index].openMenu) {
      list[index].openMenu = false;
    } else {
      list[index].openMenu = true;
    }


    this.setData({
      list: list
    })
  },
  kindToggle: function (e) {
    console.log(e);
    var self = this;
    var id = e.currentTarget.id, list = self.data.list;
    var index = e.currentTarget.dataset.index;

    var actionId = self.data.actionId;

    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].index === index) {
        list[i].open = !list[i].open;
        var itemId = list[i].rid;
        //查询明细参与人员
        request._get(app.host + "/viewItem?actionId=" + actionId + "&&itemId=" + itemId, app.globalData.token, function (res) {
          console.log("明细参与人员=", res);
          if (res.data.success) {
            var detailJoinerList = [];
            var detailJoinerIds=[];
            console.log("res.data.length=", res.data.data.length);
            for (let j = 0; j < res.data.data.length; j++) {
              let detailJoiner = {
                //detailJoinerName: decodeURIComponent(res.data.data[j].name).replace(/\+/g, ""),//解码，将“+”改为“”
                detailJoinerName: res.data.data[j].name,
                detailJoinerId: res.data.data[j].mebId,
                detailJoinerImg: res.data.data[j].head,
                openId: res.data.data[j].openId
              }
              
              detailJoinerList.push(detailJoiner);
              detailJoinerIds.push(res.data.data[j].mebId);
            }
            console.log("detailJoinerIds111=", detailJoinerIds);
            self.data.detailJoinerIds = detailJoinerIds;
            self.setData({
              list: list,
              detailJoinerList: detailJoinerList
            });
          } else {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false
            })
          }


        }, function (res) {
          console.log("明细参与人员=", res);
        })
      } else {
        list[i].open = false
      }
    }


  },
  touchS: function (e) {


    if (e.touches.length == 1) {

      this.setData({

        //设置触摸起始点水平方向位置

        startX: e.touches[0].clientX

      });

    }

  },

  touchM: function (e) {
    if (e.touches.length == 1) {

      //手指移动时水平方向位置

      var moveX = e.touches[0].clientX;

      //手指起始点位置与移动期间的差值

      var disX = this.data.startX - moveX;

      var delBtnWidth = this.data.delBtnWidth;

      var txtStyle = "";

      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变

        txtStyle = "left:0px";

      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离

        txtStyle = "left:-" + disX + "px";

        if (disX >= delBtnWidth) {

          //控制手指移动距离最大值为删除按钮的宽度

          txtStyle = "left:-" + delBtnWidth + "px";

        }

      }

      //获取手指触摸的是哪一项

      let index = e.currentTarget.dataset.index;


      let list = this.data.list;

      list[index].txtStyle = txtStyle;

      //更新列表的状态

      this.setData({

        list: list

      });

    }

  },



  touchE: function (e) {

    if (e.changedTouches.length == 1) {

      //手指移动结束后水平位置

      var endX = e.changedTouches[0].clientX;

      //触摸开始与结束，手指移动的距离

      var disX = this.data.startX - endX;

      var delBtnWidth = this.data.delBtnWidth;

      //如果距离小于删除按钮的1/2，不显示删除按钮

      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";

      //获取手指触摸的是哪一项

      var index = e.currentTarget.dataset.index;

      var list = this.data.list;

      list[index].txtStyle = txtStyle;

      //更新列表的状态

      this.setData({

        list: list

      });

    }

  },
  //获取元素自适应后的实际宽度

  getEleWidth: function (w) {

    var real = 0;

    try {

      var res = wx.getSystemInfoSync().windowWidth;

      var scale = (750 / 2) / (w / 2);//以宽度750px设计稿做宽度的自适应

      // console.log(scale);

      real = Math.floor(res / scale);

      return real;

    } catch (e) {

      return false;

      // Do something when catch error

    }

  },

  initEleWidth: function () {

    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);

    this.setData({

      delBtnWidth: delBtnWidth

    });

  },

  //点击删除按钮事件

  delItem: function (e) {

    //获取列表中要删除项的下标

    var index = e.target.dataset.index;

    var list = this.data.list;

    //移除列表中下标为index的项

    list.splice(index, 1);

    //更新列表的状态

    this.setData({

      list: list

    });

  },
  getUserInfo: function () {

    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log("用户信息=", res);

        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        wx.getUserInfo({
          success: res => {
            // 可以将 res 发送给后台解码出 unionId
            app.globalData.userInfo = res.userInfo
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
    })
  },
  login: function (code, nickName, avatarUrl) {
    var self = this;
    let userObject = {
      openId: code,
      name: nickName,
      head: avatarUrl
    };
    let userInfo = JSON.stringify(userObject);

    wx.request({
      url: app.host + "/noauth/login",
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
        app.isLogin = true;
        app.globalData.token = res.data.data.Authorization;
        console.log("token1=", app.globalData.token);

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

      },
      fail: function (res) {
        console.log(res);
      }
    });

  },
  //编辑明细
  updateItem:function(e){
    var self = this;
    let index = e.currentTarget.dataset.index;

    let actionId = self.data.actionId;
    let itemId = self.data.list[index].rid;
    let cash = self.data.list[index].cash;
    let timer = self.data.list[index].timer;
    let memo = self.data.list[index].activity;

    var list = self.data.list;

    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].index === index) {
        itemId = list[i].rid;
        var payer = list[i].payer;

        //查询明细参与人员
        request._get(app.host + "/viewItem?actionId=" + actionId + "&&itemId=" + itemId, app.globalData.token, function (res) {
          console.log("明细参与人员=", res);
          if (res.data.success) {

            let detailJoinerIds = [];
            for (let j = 0; j < res.data.data.length; j++) {          
              detailJoinerIds.push(res.data.data[j].mebId);
            }
            
            let detailJoinerIdsJson = JSON.stringify(detailJoinerIds);
            console.log("detailJoinerIdsJson=", detailJoinerIdsJson);
            wx.navigateTo({
              url: '../../pages/updateActivities/updateActivities?actionId=' + actionId + '&&itemId=' + itemId + '&&cash=' + cash + '&&timer=' + timer + '&&memo=' + memo + '&&detailJoinerIdsJson=' + detailJoinerIdsJson + '&&payer=' + payer,
            })

          } else {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false
            })
          }


        }, function (res) {
          console.log("明细参与人员=", res);
        })
      } else {
        list[i].open = false
      }
    }

  },
  //删除条目
  deleteItem:function(e){
    var self=this;
    let index=e.currentTarget.dataset.index;
    let data = {
      itemId: this.data.list[index].rid,
      actionId: this.data.actionId
    }
    //删除账目
    request._post_from(app.host + "/deleteItem", data, app.globalData.token, function (res) {
      console.log("删除账目返回", res);
      wx.hideLoading();

      if (res.data.success) {
        self.onShow();

      } else {
        wx.showModal({
          title: '提示',
          content: res.data.msg,
          showCancel: false
        })
      }

    }, function (res) {
      console.log("删除账目返回", res);
    })
  }
});
