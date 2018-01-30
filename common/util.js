const validate = (formatType, value) => {
  switch (formatType) {
    case 'email':
      return /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(value)
    case 'acc':
      return true
    case 'pwd':
      return true
    default:
      return false
  }
}

const diffDate = (date1, date2) => {
  let yearDiff = Math.abs(date1.getFullYear() - date2.getFullYear())
  if (yearDiff >= 1) {
    return yearDiff + 'year'
  }
  let monthDiff = Math.abs(date1.getMonth() - date2.getMonth())
  if (monthDiff >= 1) {
    return monthDiff + 'month'
  }
  var datediff = Math.abs(date1.getTime() - date2.getTime())
  var days = Math.floor(datediff / (24 * 3600 * 1000))
  var leave1 = datediff % (24 * 3600 * 1000)
  var hours = Math.floor(leave1 / (3600 * 1000))
  var leave2 = leave1 % (3600 * 1000)
  var minutes = Math.floor(leave2 / (60 * 1000))
  var leave3 = leave2 % (60 * 1000)
  var seconds = Math.round(leave3 / 1000)
  
  return days ? days + ' days' : hours ? hours + ' hours' : minutes ? minutes + ' minutes' : seconds +' seconds'
}

const formatTime = (date,joinString='.') => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join(joinString)
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const getTimeString = date =>{
  const monthString = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()
  return monthString[month] + " " + day+','+year
}

var basicHttp = (method, requestUrl, data, successCallback, failCallback) => {
  let header = {
    'Accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
  }
  var token = getApp().globalData.token;
  if (token && token !== '') {
    header.Authorization = token;
  }
  var smartGateSession = getApp().globalData.smartGateSession;
  if (smartGateSession){
    header.wxappkey = smartGateSession.key;
  }
  wx.request({
    url: requestUrl,
    data: data,
    method: method,
    header: header,
    success: function (res) {
      wx.hideToast();
      if(res.statusCode == 200){
        if (successCallback) {
          successCallback(res.data);
        }
      } else if (parseInt(res.statusCode/100) == 5){
        if (failCallback) failCallback({ errMsg:'服务器内部错误！' });
      }
    },
    fail: function (err) {
      console.log(err)
      if (failCallback) failCallback(err);
    }
  })
};

module.exports = {
  http_get: (requestUrl, successCallback, failCallback) => {
    basicHttp('GET', requestUrl, {}, successCallback, failCallback);
  },
  http_post: (requestUrl, data, successCallback, failCallback) => {
    basicHttp('POST', requestUrl, data, successCallback, failCallback);
  },
  http_put: (requestUrl, data, successCallback, failCallback) => {
    basicHttp('PUT', requestUrl, data, successCallback, failCallback);
  },
  http_delete: (requestUrl, successCallback, failCallback) => {
    basicHttp('DELETE', requestUrl, {}, successCallback, failCallback);
  },
  validate: validate,
  showSuccess: text => wx.showToast({
    title: text,
    icon: 'success'
  }),
  showLoading: () => {
    wx.showToast({
      title: 'Loading',
      icon: 'loading',
      mask: true,
      duration: 60000
    })
  },
  hideLoading: () => {
    wx.hideToast();
  },
  showModel: (title, content, confirm)=>{
    wx.hideToast();
    wx.showModal({
      title,
      content: typeof (content) === "string" ? content : JSON.stringify(content),
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          if (confirm) confirm()
        }
      }
    })
  },
  formatTime, diffDate, getTimeString
}