const util = require('../../common/util.js')
const url = require('../../common/constant_url.js')

Page({
  data: {
    joiner:[],
    payerIndex:null,
    payTime: util.formatTime(new Date(),'-')
  },
  onLoad: function (options) {
    this.setData({ actionId: options.id })
    util.http_get(url.ActionJoiners + '?actionId=' + options.id,res=>{
      if(res.success){
        let joiner = res.data
        joiner.forEach(item=>{
          item.joined = false
        })
        this.setData({ joiner })
      }
    })
  },
  titleInput: function (e) {
    this.setData({ titleValue: e.detail.value })
  },
  amountInput: function (e) {
    this.setData({ amountValue: e.detail.value })
  },
  onDateChange: function(e){
    this.setData({ payTime: e.detail.value })
  },
  toggleJoiner: function(e){
    let joiner = this.data.joiner;
    const index = e.currentTarget.dataset.idx
    if (index == this.data.payerIndex){
      joiner[index].joined = false
      this.setData({ joiner, payerIndex:null })
    }else{
      joiner[index].joined = !joiner[index].joined
      this.setData({ joiner })
    }
  },
  selectPayer: function(e){
    const index = e.currentTarget.dataset.idx
    this.setData({ payerIndex: index })
  },
  submit:function(){
    if (this.data.payerIndex == null) { util.showModel('', '请选择垫付人！'); return; }
    let joiner = this.data.joiner;
    let joiners = []
    joiner.forEach(item=>{
      if (item.joined) joiners.push(item.mebId)
    })
    joiners.push(joiner[this.data.payerIndex].mebId)
    if (joiners.length <= 0) { util.showModel('', '请选择参与人！'); return; }
    if (!this.data.amountValue) { util.showModel('', '请输入账单金额！'); return; }
    if (!this.data.titleValue) { util.showModel('', '请输入账单项目！'); return; }
    util.http_post(url.CreateItem,{
      actionId: this.data.actionId,
      payer: joiner[this.data.payerIndex].mebId,
      joiners: joiners,
      amount: this.data.amountValue,
      payTime: this.data.payTime,
      memo: this.data.titleValue,
    },res=>{
      if(res.success){
        util.showSuccess('添加成功！')
        setTimeout(function(){
          wx.navigateBack({ url:'/pages/Bill/Bill' })
        },500)
      }else{
        if(res.msg)util.showModel('',res.msg);
      }
    })
  }
})