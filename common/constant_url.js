// var host = "http://114.67.76.44/api"
var host = "https://blocktechwh.com/api"

module.exports = {
  WxLogin: host + "/noauth/login2",

  UserActions: host + "/getActions",
  ActionDetail: host + "/viewAction",
  ActionJoiners: host + "/getJoiners",
  CreateAction: host + "/createAction",
  JoinAction: host + "/joinAction",
  CreateItem: host + "/createItem",
  UpdateItem: host + "/updateItem",
  DeleteItem: host + "/deleteItem",
  SetActionTitle: host + "/setActionTitle",

  AddFeedback: host + "/addFeedback",
  Score: host + "/score",
}
