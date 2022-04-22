
function ack(message) {
  var bodyId = message.id; // 需要发送已读回执的消息id
  var msg = new WebIM.message("read", WebIM.conn.getUniqueId());
  msg.set({
    id: bodyId,
    to: message.from
  });
  WebIM.conn.send(msg.body);
}

// 初始化IM SDK
let WebIM = websdk = window.WebIM || {};
WebIM.config = config;
WebIM.conn = new websdk.default.connection({
  appKey: WebIM.config.appkey,
  isHttpDNS: WebIM.config.isHttpDNS,
  isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
  https: WebIM.config.https,
  url: WebIM.config.xmppURL,
  apiUrl: WebIM.config.apiURL,
  isAutoLogin: true,
  heartBeatWait: WebIM.config.heartBeatWait,
  autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
  autoReconnectInterval: WebIM.config.autoReconnectInterval,
  isStropheLog: WebIM.config.isStropheLog,
  delivery: WebIM.config.delivery
});
if (!WebIM.conn.apiUrl) {
  WebIM.conn.apiUrl = WebIM.config.apiURL;
}

WebIM.Emoji = {
  path: "../../assets/img/emotion/",
  obj: {
    "[):]": "ee_1.png",
    "[:D]": "ee_2.png",
    "[;)]": "ee_3.png",
    "[:-o]": "ee_4.png",
    "[:p]": "ee_5.png",
    "[(H)]": "ee_6.png",
    "[:@]": "ee_7.png",
    "[:s]": "ee_8.png",
    "[:$]": "ee_9.png",
    "[:(]": "ee_10.png",
    "[:'(]": "ee_11.png",
    "[<o)]": "ee_12.png",
    "[(a)]": "ee_13.png",
    "[8o|]": "ee_14.png",
    "[8-|]": "ee_15.png",
    "[+o(]": "ee_16.png",
    "[|-)]": "ee_17.png",
    "[:|]": "ee_18.png",
    "[*-)]": "ee_19.png",
    "[:-#]": "ee_20.png",
    "[^o)]": "ee_21.png",
    "[:-*]": "ee_22.png",
    "[8-)]": "ee_23.png",
    "[del]": "btn_del.png",
    "[(|)]": "ee_24.png",
    "[(u)]": "ee_25.png",
    "[(S)]": "ee_26.png",
    "[(*)]": "ee_27.png",
    "[(#)]": "ee_28.png",
    "[(R)]": "ee_29.png",
    "[({)]": "ee_30.png",
    "[(})]": "ee_31.png",
    "[(k)]": "ee_32.png",
    "[(F)]": "ee_33.png",
    "[(W)]": "ee_34.png",
    "[(D)]": "ee_35.png"
  }
};

// 注册监听回调
WebIM.conn.listen({
  onOpened: function(message) {
    // 连接成功回调
    console.log(message + "环信连接成功");
  },
  onClosed: function(message) {
    // 如果用户信息和环信key存在，则自动登录环信
    if (myJsTools.getItem("access_token") && myJsTools.getItem("token_info")) {
      var options = {
        apiUrl: WebIM.config.apiURL,
        user: myJsTools.getItem("token_info").docId,
        accessToken: myJsTools.getItem("access_token"),
        appKey: WebIM.config.appkey
      };
      WebIM.conn.open(options);
    }
    console.log(message + "连接断开");
  }, // 连接关闭回调
  onTextMessage: function(message) {
    console.log(message);
    AppVue.$store.commit("setChatList", {
      type: "receive",
      messType: "text",
      content: message.data,
      from: message.from,
      time: message.time,
      mid: message.ext.mid
    });
  }, // 收到文本消息
  onEmojiMessage: function(message) {
    console.log(JSON.stringify(message));
  }, // 收到表情消息
  onPictureMessage: function(message) {
    AppVue.$store.commit("setChatList", {
      type: "receive",
      messType: "image",
      content: message.url,
      from: message.from,
      time: message.time,
      mid: message.ext.mid
    });
    console.log(message);
  }, // 收到图片消息
  onCmdMessage: function(message) {
    console.log("onCmdMessage", message);
  }, // 收到命令消息
  onAudioMessage: function(message) {
    console.log(message);
    let options = {
      url: message.url,
      headers: { Accept: "audio/mp3" },
      onFileDownloadComplete: function(response) {
        let objectUrl = WebIM.utils.parseDownloadResponse.call(
          WebIM.conn,
          response
        );
        AppVue.$store.commit("setChatList", {
          type: "receive",
          content: objectUrl,
          messType: "voice",
          from: message.from,
          duration: message.length,
          mid: message.ext.mid
        });
      },
      onFileDownloadError: function() {
        console.log("音频下载失败");
      }
    };
    options.headers = {
      Accept: "audio/mp3"
    };
    WebIM.utils.download.call(WebIM.conn, options);
  }, // 收到音频消息
  onLocationMessage: function(message) {}, // 收到位置消息
  onFileMessage: function(message) {}, // 收到文件消息
  onVideoMessage: function(message) {
    console.log("onVideoMessage", message);
    const { from, to, type } = message;
    const chatId = type !== "chat" ? to : from;
    const typeMap = {
      chat: "contact",
      groupchat: "group",
      chatroom: "chatroom"
    };
    let options = {
      url: message.url,
      headers: {
        Accept: "audio/mp4"
      },
      onFileDownloadComplete: function(response) {
        let objectURL = WebIM.utils.parseDownloadResponse.call(
          WebIM.conn,
          response
        );
        AppVue.$store.commit("updateMsgList", {
          chatType: typeMap[message.type],
          chatId: chatId,
          msg: objectURL,
          bySelf: false,
          type: "video",
          filename: message.filename,
          file_length: message.file_length,
          from: message.from
        });
      },
      onFileDownloadError: function() {
        console.log("视频下载失败");
      }
    };
    WebIM.utils.download.call(WebIM.conn, options);
    type === "chat" && ack(message);
  }, // 收到视频消息
  onPresence: function(message) {
    if (message.type === "subscribe") {
      /*同意添加好友操作的实现方法*/
      WebIM.conn.subscribed({
        to: message.from,
        message: "[resp:true]"
      });
    }
    // console.log("onPresence", message);
  }, // 处理“广播”或“发布-订阅”消息，如联系人订阅请求、处理群组、聊天室被踢解散等消息
  onRoster: function(message) {
    // console.log("onRoster", message);
  }, // 处理好友申请
  onInviteMessage: function(message) {
    // console.log("onInviteMessage", message);
  }, // 处理群组邀请
  onOnline: function() {
    console.log("onOnline 网络已连接");
  }, // 本机网络连接成功
  onOffline: function() {
    console.log("onOffline 网络已断开");
  }, // 本机网络掉线
  onError: function(message) {
    if (message.type == 0) {
      console.log("请输入账号密码");
    } else if (message.type == 28) {
      console.log("未登陆");
    } else if (
      JSON.parse(message.data.data).error_description == "user not found"
    ) {
      // Message.error("用户名不存在！");
    } else if (
      JSON.parse(message.data.data).error_description == "invalid password"
    ) {
      // console.log("密码无效！");
    } else if (
      JSON.parse(message.data.data).error_description == "user not activated"
    ) {
      // Message.error("用户已被封禁！");
    } else if (message.type == "504") {
      // Message("消息撤回失败");
    }
    // 报错返回到登录页面
    window.localStorage.clear();

    router.push({
      name:"login"
    })
  }, // 失败回调
  onRecallMessage: function(message) {
    AppVue.$store.commit("setRecallMsg", message);
    // console.log("撤回消息回执", message);
  },
  onBlacklistUpdate: function(list) {
    // 黑名单变动
    // 查询黑名单，将好友拉黑，将好友从黑名单移除都会回调这个函数，list则是黑名单现有的所有好友信息
    // 更新好友黑名单
    console.log("黑名单变动", list);
  },
  onReceivedMessage: function(message) {
    console.log("onReceivedMessage", message);
  }, // 收到消息送达服务器回执

  onDeliveredMessage: function(message) {
    // console.log("onDeliveredMessage", message);
    // AppVue.$store.commit('updateMessageStatus', message)
  }, // 收到消息送达客户端回执

  onReadMessage: function(message) {
    console.log("onReadMessage", message);
  }, // 收到消息已读回执

  onCreateGroup: function(message) {
    console.log("onCreateGroup", message);
  }, // 创建群组成功回执（需调用createGroupNew）
  onMutedMessage: function(message) {
    console.log("onMutedMessage", message);
  } // 如果用户在A群组被禁言，在A群发消息会走这个回调并且消息不会传递给群其它成员
});

window.WebIM = WebIM;
