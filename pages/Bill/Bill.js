const util = require('../../common/util.js')
const url = require('../../common/constant_url.js')
const app = getApp()

Page({
  data: {
    loaded:false,
    items: [],
    currentIndex:1,
  },
  onLoad: function (options) {
    this.setData({ actionId: options.id })
    util.http_get(url.ActionDetail + '?actionId=' + options.id,res=>{
      this.setData({ loaded:true })
      if(res.success){
        this.setData({ items: res.data.items, result: res.data.result })
      }
    },err=>{

    })
  },
  switchIndex: function(){
    this.setData({ currentIndex: this.data.currentIndex+1 })
  },
  toDetailNew: function(){
    wx.navigateTo({ url: '/pages/DetailNew/DetailNew?id=' + this.data.actionId })
  }
})