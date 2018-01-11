const util = require('../../utils/util.js')

Page({
  data: {
    list: [
      {
        id: 'form',
        name: '刘洋',
        open: false,
        count:'5',
        cash:'2000',
        activity:'聚餐',
        timer:'2018-09-09',
        pages: ['button', 'list', 'input', 'slider', 'uploader']
      }
    ]
  },
  kindToggle: function (e) {
    var id = e.currentTarget.id, list = this.data.list;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list: list
    });
  }
});
