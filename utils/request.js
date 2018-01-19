import util from 'util.js';
/**
 * url 请求地址
 * success 成功的回调
 * fail 失败的回调
 */
function _get(url,token,success, fail) {

  console.log("------start---_get----");
  console.log(url);
  wx.request({
    url: url,
    header: {
      'Authorization': token,
      // 'Content-Type': 'application/json'
    },
    success: function (res) {
      success(res);
    },
    fail: function (res) {
      fail(res);
      
    }
  });

  console.log("----end-----_get----");
}

/**
 * url 请求地址
 * success 成功的回调
 * fail 失败的回调
 */
function _post_from(url, data,token ,success, fail) {
  console.log("----_post--start-------");
  console.log(url);
  wx.request({
    url: url,
    header: {
      'Authorization': token,
      'content-type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
    data: data,
    success: function (res) {
      success(res);
    },
    fail: function (res) {
      fail(res);
    }
  });
  console.log("----end-----_get----");
}

/**
* url 请求地址
* success 成功的回调
* fail 失败的回调
*/
function _post_json(url, data, token, success, fail) {
  console.log("----_post--start-------");
  console.log(url);
  wx.request({
    url: url,
    header: {
      'Authorization': token,
      'content-type': 'application/json',
    },
    method: 'POST',
    data: data,
    success: function (res) {
      success(res);
    },
    fail: function (res) {
      fail(res);
    }
  });

  console.log("----end----_post-----");
}
module.exports = {
  _get: _get,
  _post_from: _post_from,
  _post_json: _post_json
}