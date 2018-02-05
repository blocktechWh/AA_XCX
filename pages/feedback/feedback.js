const util = require('../../common/util.js')
const url = require('../../common/constant_url.js')

Page({
  data: {
  
  },
  onLoad: function (options) {
  
  },
  input: function(e){
    this.inputValue = e.detail.value
  },
  submit: function(){
    if (!this.inputValue){return}
    util.http_post(url.AddFeedback,{
      content: this.inputValue
    },res=>{
      if(res.success){
        util.showSuccess('感谢您的反馈！')
        setTimeout(function(){
          wx.switchTab({ url: '/pages/user/user' })
        },500)
      }
    })
    this.inputValue = ''
  }
})