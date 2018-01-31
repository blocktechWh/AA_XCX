const util = require('../../common/util.js')
const url = require('../../common/constant_url.js')

Page({
  data: {
    loaded: false,
    items: [],
    result: [],
    currentIndex: 0,
  },
  onLoad: function (options) {
    this.setData({ actionId: options.id })
  },
  onShow: function(){
    util.http_get(url.ActionDetail + '?actionId=' + this.data.actionId, res => {
      if (res.success) {
        let items = res.data.items
        items.forEach(item=>{
          item.createTime = util.formatTime(new Date(item.createTime))
          for (var i = 0; i < item.joiners.length; i++ ){
            if (item.joiners[i].mebId == item.payer) {
              item.joiners.splice(i,1)
              break;
            }
          }
          item.color = ['blue', 'orange', 'green'][item.rid % 3]
        })
        this.setData({ items, result: res.data.result })
      }
      this.setData({ loaded: true })
    }, err => {

    })
  },
  switchIndex: function(){
    this.setData({ currentIndex: this.data.currentIndex+1 })
  },
  toDetailNew: function(){
    wx.navigateTo({ url: '/pages/DetailNew/DetailNew?id=' + this.data.actionId })
  },
  touchstartX: 0,
  touchstart: function (e) {
    this.touchstartX = e.touches[0].clientX
  },
  touchend: function (e) {
    const offsetX = e.changedTouches[0].clientX - this.touchstartX
    if (offsetX > 50){
      this.prev()
    } else if (offsetX < -50){
      this.next()
    }
    this.touchstartX = 0;
  },
  prev: function () {
    if (this.data.currentIndex == 0) {
      return
    } else {
      this.setData({ currentIndex: this.data.currentIndex - 1 })
    }
  },
  next: function () {
    if (this.data.currentIndex >= this.data.items.length-1) {
      return
    } else {
      this.setData({ currentIndex: this.data.currentIndex + 1 })
    }
  }
})