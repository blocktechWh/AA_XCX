Page({
  data: {
    showModal: false,
  },
  onLoad: function (options) {
  
  },
  toBillNew: function(){
    wx.navigateTo({ url: '/pages/BillNew/BillNew' })
  },
  showModel: function(){
    this.setData({ showModal: true })
  },
  preventTouchMove: function () { },
  hideModal: function(){
    this.setData({ showModal: false })
  },
  onCancel: function () {
    this.hideModal();
  },
  onConfirm: function () {
    this.hideModal();
  }
})