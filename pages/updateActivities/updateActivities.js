// pages/updateActivities/updateActivities.js
const util = require('../../utils/util.js');
const request=require('../../utils/request.js');

const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    actionId : "",
    itemId: "",
    amount: "",
    date: "",
    memo: "",
    payer:0,
    detailJoinerIdsJson:[],
    joiners:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.actionId = wx.getStorageSync("actionId");
    this.data.itemId = options.itemId;
    this.data.amount = options.cash;
    this.data.date = options.timer;
    this.data.memo = options.memo;
    this.data.payer = options.payer;
    this.data.detailJoinerIdsJson = JSON.parse(options.detailJoinerIdsJson);
    console.log("detailJoinerIdsJson=", this.data.detailJoinerIdsJson);

    //配置时间
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    //初始化账目明细
    this.setData({
      amount: options.cash,
      date: options.timer,
      memo: options.memo,
      earlierDate: year - 1 + "-" + month + "-" + day,
      laterDate: year + 50 + "-" + month + "-" + day
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var self = this;
    self.data.actionId = wx.getStorageSync("actionId");
    wx.showLoading({
      title: "加载中..."
    })
    //查询发起AA的人员列表
    request._get(app.host + "/getJoiners?actionId=" + wx.getStorageSync("actionId"), app.globalData.token, function (res) {
      console.log("发起AA的人员列表=", res);
      wx.hideLoading();
      var data = res.data.data;
      var joinersList = [];
      var payersWaitList=[];
      var index=0;
      var joiners=[];
      if (data.length > 0) {
        
        for (let i = 0; i < data.length; i++) {
          var joiner={};
          var payersWait = {};
          joiner = {
            //joinerName: decodeURIComponent(data[i].name).replace(/\+/g, ""),
            joinerName: data[i].name,
            index: i,
            mebId: data[i].mebId,
            isChecked: false,
            joinerImg: data[i].head,
            openId: data[i].openId
          }
          for (let j = 0; j < self.data.detailJoinerIdsJson.length;j++){
            if (self.data.detailJoinerIdsJson[j] === data[i].mebId){

              joiner = {
                //joinerName: decodeURIComponent(data[i].name).replace(/\+/g, ""),
                joinerName: data[i].name,
                index: i,
                mebId: data[i].mebId,
                isChecked: true,
                joinerImg: data[i].head,
                openId: data[i].openId
              }

              joiners.push(data[i].mebId);

              index++;
            }
          }

          //添加被选中的候选垫付人
          if (data[i].mebId == self.data.payer) {
            payersWait = {
              mebId: data[i].mebId,
              payerImg: data[i].head,
              payerName: data[i].name,
              index: index,
              isChecked: true
            }
          } else {
            payersWait = {
              mebId: data[i].mebId,
              payerImg: data[i].head,
              payerName: data[i].name,
              index: index,
              isChecked: false
            }
          }

          payersWaitList.push(payersWait);
          joinersList.push(joiner);
        
        }

        self.data.joiners = joiners;

        self.setData({
          joinersList: joinersList,
          payersWaitList: payersWaitList
        })
      }

    }, function (res) {
      console.log("发起AA的人员列表=", res);
    })
  },
  checkJoiner: function (e) {
    console.log(e);
    let index = e.currentTarget.dataset.index;
    let joinersList = this.data.joinersList;
    let joiners = this.data.joiners;
    let payersWaitList = this.data.payersWaitList;
    let payersWait = {};
    if (joinersList[index].isChecked) {

      //删除被选中的参与人
      joinersList[index].isChecked = false;
      for (let i = 0; i < joiners.length; i++) {
        if (joinersList[index].mebId === joiners[i]) {
          util.removeVal(joiners, joiners[i]);
        }
      }

      //删除被选中的候选垫付人
      for (let i = 0; i < payersWaitList.length; i++) {
        if (payersWaitList[i].mebId == joinersList[index].mebId) {
          payersWait = payersWaitList[i];
          util.removeObj(payersWaitList, payersWait);
        }

        if (this.data.payer == joinersList[index].mebId){
          this.data.payer=0;
        }
      }


    } else {
      //添加被选中的参与人
      joinersList[index].isChecked = true;
      joiners.push(joinersList[index].mebId);

      //添加被选中的候选垫付人
      payersWait = {
        mebId: joinersList[index].mebId,
        payerImg: joinersList[index].joinerImg,
        //payerName: decodeURIComponent(joinersList[index].joinerName),
        payerName: joinersList[index].joinerName,
        index: index,
        isChecked: false
      }
      payersWaitList.push(payersWait);
    }

    this.setData({
      joinersList: joinersList,
      joiners: joiners,
      payersWaitList: payersWaitList
    })

  },
  checkPayer: function (e) {
    let index = e.currentTarget.dataset.index;
    let payersWaitList = this.data.payersWaitList;
    let payer = this.data.payer;
    for (let i = 0; i < payersWaitList.length; i++) {
      if (payersWaitList[i].index === index) {
        payersWaitList[i].isChecked = true;
        payer = payersWaitList[i].mebId;
      } else {
        payersWaitList[i].isChecked = false;
      }
    }

    console.log("payer=", payer)
    this.setData({
      payer: payer,
      payersWaitList: payersWaitList
    })
  },
  amountInput: function (e) {

    this.data.amount = e.detail.value;
  },
  remarksInput: function (e) {
    this.data.remark = e.detail.value;

  },

  modifySure: function () {
    if (this.data.joiners.length <= 0) {
      wx.showModal({
        title: '提示',
        content: '还未选择参与人',
        showCancel: false
      })
      return;
    }
    if (this.data.payer == 0) {
      wx.showModal({
        title: '提示',
        content: '还未选择垫付人',
        showCancel: false
      })
      return;
    }
    if (!this.data.amount) {
      wx.showModal({
        title: '提示',
        content: '请输入垫付金额',
        showCancel: false
      })
      return;
    }
    var objRegExp = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;

    if (!objRegExp.test(this.data.amount)) {
      wx.showModal({
        title: '提示',
        content: '请输入正确的金额',
        showCancel: false
      })
      return;
    }

    let data = {
      actionId: this.data.actionId,
      payer: this.data.payer,
      joiners: this.data.joiners,
      amount: this.data.amount * 100,
      payTime: this.data.date,
      memo: this.data.remark,
      itemId: this.data.itemId
    }
    wx.showLoading({
      title: "加载中..."
    })
    //修改账目
    request._post_from(app.host + "/updateItem", data, app.globalData.token, function (res) {
      console.log("修改账目返回", res);
      wx.hideLoading();

      if (res.data.success) {

        wx.navigateBack({
          delta: 1,
          success:function(){
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 2000
            })
          }
        })

      } else {
        wx.showModal({
          title: '提示',
          content: res.data.msg,
          showCancel: false
        })
      }

    }, function (res) {
      console.log("修改账目返回", res);
    })
  }
})