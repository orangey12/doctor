import {followupQueryPlanImplementationDetails} from "../api/followUp";
import myJsTools from "./myJsTools";
import {deleteJPAliases} from "../api/chat";

const ajPushTools = {};
var jpushVip;
if (process.env.NODE_ENV != "development") {
  if (process.env.jpushVip == "1") {
    jpushVip = api.require("jpushVip");
  } else {
    jpushVip = api.require("ajpush");
  }
}

ajPushTools.ajInit = function () {
  // 极光推送初始化
  jpushVip.init(function (ret) {
    if (ret && ret.status) {
      if (ret.status == 1) {
        //获取唯一标识
        jpushVip.getRegistrationId(function (res) {
          var registrationId = res.id;
          console.log(registrationId + "..........");
          setTimeout(() => {
            ajPushTools.bindDoc(myJsTools.getItem("token_info").docId);
          }, 2000);
        });
      }
    }
  });
  // 极光推送数据监听
  jpushVip.setListener(function (ret) {
  });

  // 应用退到后台
  jpushVip.resumePush(function (ret) {
    if (ret && ret.status) {
      //success
    }
  });

  jpushVip.setBadge({
    badge: 0
  });

  api.setAppIconBadge({
    badge: 0
  });
};

ajPushTools.addEventInitKeep = function (me) {
  // 极光推送ios 和安卓点击事件区分
  //设置角标为0
  jpushVip.setBadge({
    badge: 0
  });
  api.setAppIconBadge({
    badge: 0
  });

  if (api.systemType == "ios") {
    api.addEventListener(
      {
        name: "noticeclicked"
      },
      function (ret, err) {
        if (ret && ret.value) {
          var jpushVip = ret.value;
          var content = jpushVip.content;
          var extra = jpushVip.extra;
        }
      }
    );
  } else {
    api.addEventListener(
      {
        name: "appintent"
      },
      function (ret, err) {
        if (ret && (ret.appParam || ret.data)) {
          var jpushVip;
          if (ret.appParam && ret.appParam.JMessageExtra) {
            jpushVip = ret.appParam.JMessageExtra;
          } else if (ret.data) {
            jpushVip = ret.data;
          }
          var extra = JSON.parse(jpushVip).n_extras;
          if (extra.plsId) {
            followupQueryPlanImplementationDetails({
              id: extra.plsId
            }).then(res => {
              if (res.data.sendStatus == "1") {
                me.$router.push({
                  name: "hascarriedPlan",
                  query: {
                    plsId: extra.plsId,
                    id: extra.planId
                  }
                });
              } else {
                me.$router.push({
                  name: "hisPlanDetail",
                  query: {
                    id: extra.planId,
                    plsId: extra.plsId
                  }
                });
              }
            });
          }
          if (extra.type == "YS_WZ_HZGH") {
            // 咨询 复诊
            me.$router.push({
              name: "appYy",
              query: {
                type: "1",
                regId: extra.regId,
                sponsorDocName: extra.sponsorDocName
              }
            });
          }
          if (extra.type == "YS_XT_QF") {
            let str = "c30b5b8a6a9d11eb83630242ac120009";
            if (extra.title == str) {
              myJsTools.uploadErrFile();
              return;
            } else {
              me.$router.push({
                name: "fsendLook",
                query: {
                  sendId: extra.sendId,
                  type: "look" //只查看
                }
              });
            }
          }

          if (extra.type == "YS_WZ_CFZF") {
            me.$router.push({
              name: "payPre",
              query: {
                businessId: extra.businessId
              }
            });
          }

          if (extra.type == "YS_XT_YSZCSH") {
            // AppVue.$store.commit("setDocShStatus", extra.docAuditStatus);
            if (AppVue.$store.getters.getDocShStatus == "1") {
              AppVue.$router.push({
                name: "authentication",
                query: {
                  pageType: "edit"
                }
              });
            }
            AppVue.$store.commit("UPDATE_KEEP_ALIVE", {
              keepAlive: "authentication",
              type: 1
            });
            AppVue.$store.commit("UPDATE_KEEP_ALIVE", {
              keepAlive: "docAuthImg",
              type: 1
            });
          }
          if (extra.type == "chat") {
            console.log("888888888888888", extra);
            myJsTools.setItem("patientInfo", extra);
            me.$router.push({
              name: "chatIndex", //prescription chatIndex
              query: {
                name: extra.patientName,
                id: extra.patientId,
                userId: extra.userId
              }
            });
          }
          if (extra.type == "endWz") {
            me.$router.push({
              name: "mainIndex" //prescription mainIndex
            });
          }
          if (extra.type == "YS_WZ_SF") {
            let title;
            if (extra.status == "1") {
              title = "已通过";
              me.$router.push({
                name: "waitPassPerSetail",
                query: {
                  businessId: extra.businessId,
                  title: title
                }
              });
            } else if (extra.status == "0") {
              title = "未通过";
              me.$router.push({
                name: "prescDetail",
                query: {
                  status: title,
                  businessId: extra.businessId
                }
              });
            }
          }
        }
      }
    );
  }
};

ajPushTools.addEventInit = function (me) {
  //设置角标为0
  jpushVip.setBadge({
    badge: 0
  });

  api.setAppIconBadge({
    badge: 0
  });
  if (api.systemType == "ios") {
    api.addEventListener(
      {
        name: "noticeclicked"
      },
      function (ret, err) {
        if (ret && ret.value) {
          var jpushVip = ret.value;
          var content = jpushVip.content;
          var extra = jpushVip.extra;
        }
      }
    );
  } else {
    api.addEventListener({
      name: 'resume'
    }, function (ret, err) {
      api.setAppIconBadge({
        badge: 0
      });
    });
    api.addEventListener({
      name: 'pause'
    }, function (ret, err) {
      api.setAppIconBadge({
        badge: 0
      });
    });
    api.addEventListener(
      {
        name: "appintent"
      },
      function (ret, err) {
        if (ret && ret.appParam.ajpush) {
          var ajpush = ret.appParam.ajpush;
          var id = ajpush.id;
          var title = ajpush.title;
          var content = ajpush.content;
          var extra = ajpush.extra;
          if (extra.plsId) {
            followupQueryPlanImplementationDetails({
              id: extra.plsId
            }).then(res => {
              if (res.data.sendStatus == "1") {
                me.$router.push({
                  name: "hascarriedPlan",
                  query: {
                    plsId: extra.plsId,
                    id: extra.planId
                  }
                });
              } else {
                me.$router.push({
                  name: "hisPlanDetail",
                  query: {
                    id: extra.planId,
                    plsId: extra.plsId
                  }
                });
              }
            });
          }
          if (extra.type == "YS_WZ_HZGH") {
            // 咨询 复诊
            me.$router.push({
              name: "appYy",
              query: {
                type: "1",
                regId: extra.regId,
                sponsorDocName: extra.sponsorDocName
              }
            });
          }
          if (extra.type == "YS_XT_YSZCSH") {
            if (AppVue.$store.getters.getDocShStatus == "1") {
              AppVue.$router.push({
                name: "authentication",
                query: {
                  pageType: "edit"
                }
              });
            }
            AppVue.$store.commit("UPDATE_KEEP_ALIVE", {
              keepAlive: "authentication",
              type: 1
            });
            AppVue.$store.commit("UPDATE_KEEP_ALIVE", {
              keepAlive: "docAuthImg",
              type: 1
            });
          }
          if (extra.type == "chat") {
            myJsTools.setItem("patientInfo", extra);
            me.$router.push({
              name: "chatIndex", //prescription chatIndex
              query: {
                name: extra.patientName,
                id: extra.patientId,
                userId: extra.userId
              }
            });
          }
          if (extra.type == "endWz") {
            me.$router.push({
              name: "mainIndex" //prescription mainIndex
            });
          }
          if (extra.type == "YS_WZ_SF") {
            let title;
            if (extra.status == "1") {
              title = "已通过";
              me.$router.push({
                name: "waitPassPerSetail",
                query: {
                  businessId: extra.businessId,
                  title: title
                }
              });
            } else if (extra.status == "0") {
              title = "未通过";
              me.$router.push({
                name: "prescDetail",
                query: {
                  status: title,
                  businessId: extra.businessId
                }
              });
            }
          }
        }
      }
    );
  }
};

let timeOut = null;

ajPushTools.bindDoc = async function (docId) {
  let deleteRulest = await ajPushTools.loginOut();
  console.log("极光绑定开始" + deleteRulest)
  if (deleteRulest) {
    var param = {alias: docId, sequence: 101,};
    jpushVip.setAlias(param, function (ret) {
      var statusCode = ret.statusCode;
      console.log("绑定alias成功" + JSON.stringify(ret));
      if (statusCode != 0) {
        timeOut = setTimeout(() => {
          ajPushTools.bindDoc(docId);
        }, 3000)
      } else {
        clearTimeout(timeOut)
        timeOut = null;
      }
    });
  }


  // var param2 = {sequence:100,tags:[docId]};
  // jpushVip.setTags(param2,function(ret) {
  //   var statusCode = ret.statusCode;
  //   console.log("极光设置tag 绑定成功" + JSON.stringify(ret))
  //   if(statusCode != 0){
  //     timeOut = setTimeout(()=>{
  //       ajPushTools.bindDoc(docId);
  //     },3000)
  //   }else{
  //     clearTimeout(timeOut)
  //     timeOut = null;
  //   }
  // });
};
ajPushTools.loginOut = function () {
  return new Promise(resolve => {
    deleteJPAliases({
      aliases: myJsTools.getItem("token_info").docId
    }).then(res => {
      console.log("删除成功");
      resolve(true);
    });
  });
};

export default ajPushTools;
