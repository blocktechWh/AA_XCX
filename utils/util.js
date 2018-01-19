const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const filters = {
  toFix: function (value) {
    return value.toFixed(2)//此处2为保留两位小数
  }
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//删除数组中的某个元素
const removeVal = function(arr,val){
  Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
      this.splice(index, 1);
    }
  };

  return arr.remove(val);
}

//删除数组中的某个对象
const removeObj = function (arr, objStr) {
  var arr=arr;
  var objStr = objStr;
  Array.prototype.remove = function (objStr) {
    let index=-1;
    for (let i = 0; i < arr.length;i++){
      if (this[i]==objStr){
        index=i;
      }
    }
  
    if (index > -1) {
      this.splice(index, 1);
    }
  };

  return arr.remove(objStr);
}


module.exports = {
  formatTime: formatTime,
  removeVal: removeVal,
  removeObj: removeObj,
  toFix: filters.toFix
}
