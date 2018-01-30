const util = require('../../common/util.js')
const url = require('../../common/constant_url.js')

Page({
  data: {
    joiner:[]
  },
  onLoad: function (options) {
    this.setData({ actionId: options.id })
    util.http_get(url.ActionJoiners + '?actionId=' + options.id,res=>{
      if(res.success){
        this.setData({ joiner:res.data })
      }
    })
  },
  submit:function(){
    util.http_post(url.CreateItem,{
      actionId: this.data.actionId,
      payer: id,
      joiners: id,
      amount: id,
      payTime: id,//yyyy-MM-dd
    },res=>{

    })
  }
})