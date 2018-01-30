var host = "http://111.231.146.57/api"

module.exports = {
  WxLogin: host + "/noauth/login2",

  UserActions: host + "/getActions",
  ActionDetail: host + "/viewAction",
  ActionJoiners: host + "/getJoiners",
  CreateAction: host + "/createAction",
  CreateItem: host + "/createItem",
  UpdateItem: host + "/updateItem",
  DeleteItem: host + "/deleteItem",
  SetActionTitle: host + "/setActionTitle",

  AddFeedback: host + "/addFeedback",
  Score: host + "/score",
}
