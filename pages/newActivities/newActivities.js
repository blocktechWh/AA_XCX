const util = require('../../utils/util.js');
const request = require('../../utils/request.js');
const app = getApp();
Page({
  data: {
    itemId:"",
    cash:"",
    timer:"",
    memo:"",
    earlierDate:"",
    laterDate:"",
    amount: "",
    amountValue:"",
    remark: "花钱了",
    showTopTips: false,
    joiners: [],
    payer:0,
    payersWaitList: [],
    joinersList: [],
    radioItems: [
      { name: 'cell standard', value: '0' },
      { name: 'cell standard', value: '1', checked: true }
    ],
    checkboxItems: [
      { name: 'standard is dealt for u.', value: '0', checked: true },
      { name: 'standard is dealicient for u.', value: '1' }
    ],

    date: "",
    time: "12:01",

    countryCodes: ["+86", "+80", "+84", "+87"],
    countryCodeIndex: 0,

    countries: ["中国", "美国", "英国"],
    countryIndex: 0,

    accounts: ["微信号", "QQ", "Email"],
    accountIndex: 0,

    isAgree: false
  },
  onLoad: function (options) {

    this.data.actionId = wx.getStorageSync("actionId");
    console.log("actionId=", options.actionId);
    //配置默认时间
    let date=new Date();
    let year = date.getFullYear();
    let month = date.getMonth()+1;
    let day = date.getDate();


    this.setData({
      date: year + "-" + month + "-" + day,
      earlierDate: year-1 + "-" + month + "-" + day,
      laterDate: year + 50 + "-" + month + "-" + day
    })
    
  },
  onShow: function () {
    var self=this;
    self.data.actionId = wx.getStorageSync("actionId");
    wx.showLoading({
      title: "加载中..."
    })
    //查询发起AA的人员列表
    request._get(app.host +"/getJoiners?actionId=" + wx.getStorageSync("actionId"), app.globalData.token, function (res) {
      console.log("发起AA的人员列表=", res);
      wx.hideLoading();
      var data = res.data.data;
      if (data.length>0){
        let joinersList = [];
        for (let i = 0; i < data.length; i++) {
          let joiner = {
            //joinerName: decodeURIComponent(data[i].name).replace(/\+/g, ""),
            joinerName: data[i].name,
            index: i,
            mebId: data[i].mebId,
            isChecked: false,
            joinerImg: data[i].head,
            openId: data[i].openId
          }
          joinersList.push(joiner);

        }

        self.setData({
          joinersList: joinersList
        })
      }

    }, function (res) {
      console.log("发起AA的人员列表=", res);
    })
  },

  showTopTips: function () {
    var that = this;
    this.setData({
      showTopTips: true
    });
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 3000);
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);

    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }

    this.setData({
      radioItems: radioItems
    });
  },
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);

    var checkboxItems = this.data.checkboxItems, values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].value == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    }

    this.setData({
      checkboxItems: checkboxItems
    });
  },
  bindDateChange: function (e) {
    console.log(e);
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
  bindCountryCodeChange: function (e) {
    console.log('picker country code 发生选择改变，携带值为', e.detail.value);

    this.setData({
      countryCodeIndex: e.detail.value
    })
  },
  bindCountryChange: function (e) {
    console.log('picker country 发生选择改变，携带值为', e.detail.value);

    this.setData({
      countryIndex: e.detail.value
    })
  },
  bindAccountChange: function (e) {
    console.log('picker account 发生选择改变，携带值为', e.detail.value);

    this.setData({
      accountIndex: e.detail.value
    })
  },
  bindAgreeChange: function (e) {
    this.setData({
      isAgree: !!e.detail.value.length
    });
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
        if (payersWaitList[i].mebId === joinersList[index].mebId) {
          payersWait = payersWaitList[i];
          util.removeObj(payersWaitList, payersWait);
        }

        if (this.data.payer == joinersList[index].mebId) {
          this.data.payer = 0;
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
        index:index,
        isChecked: false
      }
      payersWaitList.push(payersWait);
    }

    this.setData({
      joinersList: joinersList,
      joiners: joiners,
      payersWaitList: payersWaitList
    })
    // console.log("333", joiners);
    // console.log("444", payersWaitList);

  },
  checkPayer:function(e){
    let index = e.currentTarget.dataset.index;
    let payersWaitList = this.data.payersWaitList;
    let payer=0;
    for (let i = 0; i < payersWaitList.length;i++){
      if (payersWaitList[i].index===index){
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
    
    // if (e.detail.value*10-Math.floor(e.detail.value*10)!=0){
    //   this.setData({
    //     amountValue: e.detail.value.toFixed(2)
    //   })
    //   this.data.amount = e.detail.value.toFixed(2);
    // }else{
    //   this.data.amount = e.detail.value;
    // }
    this.data.amount = e.detail.value;

  },
  remarksInput: function (e) {
    this.data.remark = e.detail.value;
    
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e);

    if (this.data.joiners.length <= 0) {
      wx.showModal({
        title: '提示',
        content: '还未选择参与人',
        showCancel: false
      })
      return;
    }
    if (this.data.payer === 0) {
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
      formId: e.detail.formId
    }
    wx.showLoading({
      title: "加载中..."
    })
    request._post_from(app.host + "/createItem", data, app.globalData.token, function (res) {
      console.log("新建明细返回", res);
      wx.hideLoading();

      if (res.data.success) {
        wx.navigateBack({
          delta: 1
        })
      } else {
        wx.showModal({
          title: '提示',
          content: res.data.msg,
          showCancel: false
        })
      }

    }, function (res) {
      console.log("新建明细返回", res);
    })
  },
  creatSure: function () {

  }
});