const util = require('../../common/util.js')
const url = require('../../common/constant_url.js')
const app = getApp()

Page({
  data: {
  
  },
  onLoad: function (options) {
    util.http_post(url.CreateAction, {}, res => {
      if(res.success){
        this.setData({
          code: res.data.code.split(''),
          id: res.data.id,
          title: res.data.title
        })
      }
    })
  },
})