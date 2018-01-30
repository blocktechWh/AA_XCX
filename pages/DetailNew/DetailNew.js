const util = require('../../common/util.js')
const url = require('../../common/constant_url.js')

Page({
  data: {
    joiner:[],
    payer:null,
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
    const index = e.currentTarget.dataset.index
    if (joiner[index].mebId == this.data.payer){
      joiner[index].joined = false
      this.setData({ joiner, payer:null })
    }else{
      joiner[index].joined = !joiner[index].joined
      this.setData({ joiner })
    }
  },
  selectPayer: function(e){
    let joiner = this.data.joiner;
    const index = e.currentTarget.dataset.index
    this.setData({ payer: joiner[index].mebId })
  },
  submit:function(){
    let joiner = this.data.joiner;
    let joiners = []
    joiner.forEach(item=>{
      if (item.joined) joiners.push(item.mebId)
    })
    if (joiners.length <= 0) { util.showModel('', '请选择参与人！'); return; }
    if (!this.data.payer) { util.showModel('', '请选择垫付人！'); return; }
    if (!this.data.amountValue) { util.showModel('', '请输入账单金额！'); return; }
    if (!this.data.titleValue) { util.showModel('', '请输入账单项目！'); return; }
    util.http_post(url.CreateItem,{
      actionId: this.data.actionId,
      payer: this.data.payer,
      joiners: joiners,
      amount: this.data.amountValue,
      payTime: this.data.payTime,
      memo: this.data.titleValue,
    },res=>{

    })
  }
})