import { Toast } from "vant";
import { doctorToPatientSendMessageToMq } from "../api/fsend";
import myJsTools from "./myJsTools";
import { getSysPlatformConfigBykey } from "../api/login";

var eschatUnit = {};
var easeChat = api.require("easeChat");

function genID() {
  return Number(
    Math.random()
      .toString()
      .substr(3, 18) + Date.now()
  ).toString(36);
}


// sendText发送的消息, fromId登录的账号, toId接收者当前患者id, userId患者环信登录使用的id, extInfo扩展信息
eschatUnit.sendMsg = function(sendText, fromId, toId, userId, extInfo) {
  let s = genID();
  console.log("获取随机18位id" + s + " ---" + sendText + "---" + fromId + "-----" + toId + "----" + userId + "----");
  let data = {
    type: "send",
    messType: "text",
    content: sendText,
    to: toId ? toId.toLowerCase() : "", //将其变成小写
    userId: userId ? userId : "",
    from: fromId,
    mid: s,
    time: new Date().getTime(),
    status: userId ? "sending" : "failed"
  };
  //根据extInfo传参，向data中添加ext字段，ext为包含patientId的对象
  if (extInfo) {
    extInfo.patientId = toId ? toId.toLowerCase() : "";
    data.ext = extInfo;
  } else {
    let extInfo2 = {
      patientId: toId.toLowerCase()
    };
    data.ext = extInfo2;
  }
  // 向缓存添加聊天列表
  AppVue.$store.commit("setChatList", data);
  let result = false;
  // 如果没有患者登录的userId返回
  if (!userId) {
    return true;
  }
  //发送消息
  easeChat.sendText(
    {
      conversationId: "",// 要发送消息的会话的 id
      chatType: "chat", // chat：单聊会话 groupChat：群聊会话 chatRoom：聊天室会话
      text: sendText, // 发送的文本
      from: fromId, // 当前登录账号
      to: userId,// 患者登录id
      ext: data.ext // 扩展消息
    },
    async function(ret, err) {
      if (ret.status) {
        await eschatUnit.setData(ret, s, toId);
        result = true;
      } else {
        api.toast({ msg: JSON.stringify(err) });
      }
    }
  );
  return result;
};

eschatUnit.setData = async function(
  ret,
  s,
  toId,
  type,
  userId,
  regId,
  conferenceId
) {
  let status, message;
  console.log(JSON.stringify(ret) + "----------------------");
  if (ret.message.status == "pending") {
    status = "unread";
  }
  if (ret.message.status == "successed") {
    status = "unread";
  } else if (ret.message.status == "failed") {
    status = "failed";
  }

  if (ret.message.body.type == "image") {
    let url;
    api.imageCache(
      {
        url: ret.message.body.remotePath,
        thumbnail: false
      },
      async function(res, err) {
        if (res) {
          url = res.url;
          console.log("url------缓存环信图片---fasong--------" + url);
          message = {
            mid: ret.message.messageId,
            id: s,
            status: status,
            from: ret.message.from,
            toId: toId.toLowerCase(),
            content: url || "",
            conversationId: ret.message.conversationId
          };
          console.log(
            JSON.stringify(message) + "-----缓存环信图片----fasong---msg"
          );
          AppVue.$store.commit("updateMessageStatus", message);
        }
      }
    );
  } else {
    message = {
      mid: ret.message.messageId,
      id: s,
      status: status,
      from: ret.message.from,
      toId: toId.toLowerCase(),
      conversationId: ret.message.conversationId
    };
    if (api.systemType && ret.message.body.type == "voice") {
      message.mid = s;
    }
    if (ret.message.body.type == "video") {
      api.download(
        {
          url: ret.message.body.remotePath,
          savePath: "fs://" + ret.message.messageId + ".mp4",
          report: false,
          cache: true,
          allowResume: false
        },
        function(ret, err) {
          if (ret.state == 1) {
            console.log(
              JSON.stringify(ret) + "----------------------下载视频地址"
            );
            message.content = ret.savePath;
            AppVue.$store.commit("updateMessageStatus", message);
          } else {
            Toast("APICloud环信DEMO：" + JSON.stringify(ret));
          }
        }
      );
    } else {
      AppVue.$store.commit("updateMessageStatus", message);
    }
  }
  console.log("坎坎坷坷 已发送的消息" + JSON.stringify(ret.message));
  if (
    ret.message.ext.type == "jyd" ||
    ret.message.ext.type == "jcd" ||
    ret.message.ext.type == "cf"
  ) {
    return;
  }
  setTimeout(() => {
    let chatList = AppVue.$store.getters.getChatList;
    var name =
      message.toId.toLowerCase() + "," + ret.message.from.toLowerCase();
    if (type == "video") {
      let visitTypeCode =
        myJsTools.getItem("visitTypeCode") == "4" ? "视频通话" : "语音通话";
      sendTs(
        myJsTools.getItem("token_info").docName +
          "医生正在邀请您进行" +
          visitTypeCode +
          "，请点击接听",
        type,
        userId,
        regId,
        conferenceId
      );
    } else {
      chatList.map((item, index) => {
        if (item.id == name) {
          let list = item.chatRecordList;
          list.map((msg, i) => {
            // console.log(JSON.stringify(msg) + "msg------------------")
            if (msg.mid == message.mid) {
              if (msg.status != "recall") {
                if (msg.status != "read") {
                  let contentText = "";
                  if (msg.messType == "voice") {
                    contentText =
                      myJsTools.getItem("token_info").docName +
                      "医生给你发送了一条语音";
                  } else if (msg.messType == "image") {
                    contentText =
                      myJsTools.getItem("token_info").docName +
                      "医生给你发送了一张图片";
                  } else if (msg.messType == "text") {
                    contentText = msg.content;
                  } else if (msg.messType == "video") {
                    contentText =
                      myJsTools.getItem("token_info").docName +
                      "医生给你发送了一个视频";
                  }
                  sendTs(contentText, type, msg.userId);
                }
              }
            }
          });
        }
      });
    }
  }, 2000);
};

function sendTs(contentText, type, userId, regId, conferenceId) {
  let baseurl = process.env.baseURL + "cloud/cloudHosPatient/index.html";
  let appid = process.env.appid;
  var action, url;
  if (type == "video") {
    action = "videoCall";

    let isVideo = myJsTools.getItem("visitTypeCode") == "4" ? "1" : "0";
    if (conferenceId == "") {
      console.log("我");
      url = encodeURIComponent(
        baseurl +
          "?appid=" +
          appid +
          "&action=videoAgora" +
          "&regId=" +
          regId +
          "&hosId=" +
          myJsTools.getItem("docUserInfo").hosId +
          "&docId=" +
          myJsTools.getItem("docUserInfo").docId +
          "&deptId=" +
          myJsTools.getItem("docUserInfo").deptId +
          "&isVideo=" +
          isVideo
      );
    } else {
      url = encodeURIComponent(
        baseurl +
          "?appid=" +
          appid +
          "&action=" +
          action +
          "&regId=" +
          regId +
          "&conferenceId=" +
          conferenceId +
          "&hosId=" +
          myJsTools.getItem("docUserInfo").hosId +
          "&docId=" +
          myJsTools.getItem("docUserInfo").docId +
          "&deptId=" +
          myJsTools.getItem("docUserInfo").deptId +
          "&isVideo=" +
          isVideo
      );
    }
  } else {
    console.log("- type", type);
    action = "chatList";

    url = encodeURIComponent(baseurl + "?appid=" + appid + "&action=" + action);
  }

  console.log(url);
  var rootUrl =
    "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
    appid +
    "&redirect_uri=" +
    url +
    "&response_type=code&scope=snsapi_userinfo&state=1233456#wechat_redirect";
  doctorToPatientSendMessageToMq({
    receiverIdArray: [userId],
    wxContent: contentText,
    wxPage: rootUrl,
    wxTitle: "聊天信息--" + myJsTools.getItem("token_info").docName,
    appid: appid
  }).then(res => {
    if (res.code == 20000) {
      console.log("发送成功");
    }
  });
}

eschatUnit.sendImg = function(path, fromId, toId, userId) {
  let s = genID();

  console.log("获取随机18位id" + s);
  console.log(
    "获取随机18位id" +
      s +
      " ---" +
      path +
      "---" +
      fromId +
      "-----" +
      toId +
      "----" +
      userId +
      "----"
  );
  AppVue.$store.commit("setChatList", {
    type: "send",
    messType: "image",
    content: path,
    to: toId ? toId.toLowerCase() : "",
    from: fromId,
    userId: userId ? userId : "",
    mid: s,
    ext: {
      patientId: toId ? toId.toLowerCase() : ""
    },
    time: new Date().getTime(),
    status: userId ? "sending" : "failed"
  });
  if (!userId) {
    return true;
  }
  easeChat.sendImage(
    {
      conversationId: "",
      chatType: "chat",
      path: path,
      displayName: "cloud",
      from: fromId,
      to: userId,
      ext: {
        patientId: toId.toLowerCase()
      }
    },
    function(ret, err) {
      console.log(JSON.stringify(ret));
      console.log(JSON.stringify(err));
      if (ret.status) {
        if (ret.status) {
          eschatUnit.setData(ret, s, toId);
        }
      } else api.alert({ msg: JSON.stringify(err) });
    }
  );
};

eschatUnit.sendAudio = function(path, fromId, toId, length, userId) {
  let s = genID();
  AppVue.$store.commit("setChatList", {
    type: "send",
    messType: "voice",
    content: path,
    to: toId ? toId.toLowerCase() : "",
    from: fromId,
    mid: s,
    duration: length,
    userId: userId ? userId : "",
    ext: {
      patientId: toId ? toId.toLowerCase() : ""
    },
    time: new Date().getTime(),
    status: userId ? "sending" : "failed"
  });
  let mid;
  if (api.systemType == "ios") {
    mid = "";
  } else {
    mid = s;
  }
  if (!userId) {
    return true;
  }
  easeChat.sendVoice(
    {
      conversationId: "",
      chatType: "chat",
      path: path,
      displayName: "cloud",
      from: fromId,
      to: userId,
      length: length,
      ext: {
        patientId: toId.toLowerCase(),
        mid: mid
      }
    },
    function(ret, err) {
      if (ret.status) {
        eschatUnit.setData(ret, s, toId);
      } else api.alert({ msg: JSON.stringify(err) });
    }
  );
};

eschatUnit.sendVideo = function(path, fromId, toId, userId) {
  let s = genID(),
    filePic = "";
  console.log( userId + "ddddsssssssssss")
  var zySmallVideo = api.require("zySmallVideo");
  zySmallVideo.getThumbnail(
    {
      fileUrl: path,
      fileName: ""
    },
    function (ret, err) {
      console.log(JSON.stringify(ret));
      if (ret.result == "success") {
        filePic = ret.filePic;
        AppVue.$store.commit("setChatList", {
          type: "send",
          messType: "video",
          content: path,
          to: toId ? toId.toLowerCase() : "",
          from: fromId,
          mid: s,
          userId: userId ? userId : "",
          ext: {
            patientId: toId ? toId.toLowerCase() : ""
          },
          time: new Date().getTime(),
          thumbnailLocalPath: filePic,
          status: userId ? "sending" : "failed"
        });
        if (!userId) {
          return true;
        }
        console.log("ssssss-fromId" + fromId)
        easeChat.sendVideo(
          {
            conversationId: "",
            path: path,
            from:fromId,
            to: userId,
            thumbPath:filePic,
            ext: {
              patientId: toId.toLowerCase()
            }
          },
          function (ret, err) {
            if (ret.status) {
              console.log('384732',JSON.stringify(ret));
              eschatUnit.setData(ret, s, toId);
            } else api.alert({msg: JSON.stringify(err)});
          }
        );
      }
    }
  );
};

export default eschatUnit;
