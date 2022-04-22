<template>
  <div id="app">
    <!--    :style="{ 'padding-top': headerHeight }"-->
    <van-popup
      v-model="show"
      :overlay-style="{ background: 'rgba(0, 0, 0, 0)' }"
      class="loadingPopup"
      :close-on-click-overlay="false"
    >
    </van-popup>
    <van-popup v-model="showNotAuthentication" class="popup setPassPopup">
      <img src="./assets/img/login/login.png" class="loginIcon"/>
      <div class="tipsInfo">
        <li class="title">暂未认证</li>
        <p>点击立即认证，开启我的线上</p>
        <p>诊室，解锁更多功能</p>
        <button class="btn publicBtn" @click="openAuthPage">立即认证</button>
        <button class="cancel" @click="showNotAuthentication = false">
          以后再说
        </button>
      </div>
    </van-popup>
    <van-popup v-model="showWaitAuthentication" class="popup setPassPopup">
      <img src="./assets/img/login/login.png" class="loginIcon"/>
      <div class="tipsInfo">
        <li class="title">审核中</li>
        <p>您的申请正在审核中，请耐心等待</p>
        <p>或者联系管理员询问审核进度</p>
        <button class="btn publicBtn" @click="showWaitAuthentication = false">
          确定
        </button>
      </div>
    </van-popup>
    <van-popup
      v-model="showUpdate"
      class="popup setPassPopup"
      :close-on-click-overlay="false"
      overlay
    >
      <img src="./assets/img/login/login.png" class="loginIcon"/>
      <div class="tipsInfo">
        <li class="title">版本更新</li>
        <p>为保证您的良好体验，请点击</p>
        <p>下载最新版本</p>
        <button class="btn publicBtn" @click="goDownload">下载升级</button>
      </div>
    </van-popup>
    <van-popup v-model="showRefundAuthentication" class="popup setPassPopup">
      <img src="./assets/img/login/login.png" class="loginIcon"/>
      <div class="tipsInfo">
        <li class="title">未通过</li>
        <p>您的申请未通过，可点击详情</p>
        <p>进行进行查看修改</p>
        <button class="btn publicBtn" @click="goDetail">查看详情</button>
      </div>
    </van-popup>
    <van-popup
      v-model="showQxPopup"
      class="popup setPassPopup"
      :close-on-click-overlay="false"
    >
      <div class="tipsInfo">
        <li class="title font-login-color-blue">设置权限</li>
        <p>{{ name }} 发现您禁用了一部分权限</p>
        <p>将会导致APP部分功能不可用</p>
        <button class="btn publicBtn" @click="showQxPopup = false">确定</button>
      </div>
    </van-popup>
    <keep-alive :include="keepAlive">
      <router-view v-if="$route.meta.keepAlive"/>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"/>
    <!-- <div v-show="false">{{ docShStatus }}</div> -->
  </div>
</template>

<script>
import myJsTools from "./utils/myJsTools";
import {getUserIdentityInfo, keepHeartbeat} from "./api/login";
import {Toast} from "vant";
import {findDoctorByID, getDoctorInfoByDocId} from "./api/my";
import logoSrc from "@/assets/img/my/fit_logo.png";
import patientImg from "@/assets/img/index/admin.png";

export default {
  name: "App",
  data() {
    return {
      headerHeight: "0px",
      show: false,
      showNotAuthentication: false,
      showWaitAuthentication: false,
      showRefundAuthentication: false,
      showForceupdate: false,
      appUri: "",
      name: "",
      showQxPopup: false,
    };
  },
  computed: {
    // 接口请求加载中图标
    showLoading() {
      this.show = this.$store.getters.getShowLoading;
      return this.$store.getters.getShowLoading;
    },
    showUpdate() {
      return this.$store.getters.getForceupdate.popup;
    },
    docShStatus() {
      let docShStatus = this.$store.getters.getDocShStatus;
      console.log("docShStatus", docShStatus);
      let notShowPage = [
        "adminList",
        "myFit",
        "qxPage",
        "myFitNews",
        "myFitPass",
        "authentication",
        "docAuthImg",
        "login",
        "setPass",
        "registerDoc",
        "protocol",
        "initPage",
        "protocol",
        "feedback",
        "cancellation",
        "feedbackFinish",
        "appAbout",
      ];
      if (docShStatus == "2" || notShowPage.indexOf(this.$route.name) != -1) {
        this.showWaitAuthentication = false;
        this.showNotAuthentication = false;
        this.showRefundAuthentication = false;
        return;
      } else if (docShStatus == "3") {
        this.showNotAuthentication = true;
        this.showRefundAuthentication = false;
        this.showWaitAuthentication = false;
      } else if (docShStatus == "0") {
        this.showWaitAuthentication = true;
        this.showNotAuthentication = false;
        this.showRefundAuthentication = false;
      } else if (docShStatus == "1") {
        this.showWaitAuthentication = false;
        this.showNotAuthentication = false;
        this.showRefundAuthentication = true;
      }
      return this.$store.getters.getDocShStatus;
    },
    // 缓存
    keepAlive() {
      if (
        this.$route.name == "patientIndex" ||
        this.$route.name == "myIndex" ||
        this.$route.name == "pharmacistFoo" ||
        this.$route.name == "docInfo" ||
        this.$route.name == "chatIndex" ||
        this.$route.name == "login"
      ) {
        this.headerHeight = "0px";
      } else if (
        this.$route.name == "trialPartyIndex" ||
        this.$route.name == "appointment"
      ) {
        this.headerHeight = parseInt(myJsTools.getItem("headerHeight")) + "px";
      } else {
        console.log(myJsTools.getItem("headerHeight") + "headerHeight");
        this.headerHeight = myJsTools.getItem("headerHeight") + "px";
      }
      this.$nextTick(() => {
        if (
          this.$route.name == "login" ||
          this.$route.name == "mainIndex" ||
          this.$route.name == "myVisit" ||
          this.$route.name == "topic" ||
          this.$route.name == "previewFollow" ||
          this.$route.name == "initPage" ||
          this.$route.name == "setPass" ||
          this.$route.name == "appAbout" ||
          this.$route.name == "registerDoc" ||
          this.$route.name == "fsendLook" ||
          this.$route.name == "selectSort" ||
          this.$route.name == "offlineVisitTemplate" ||
          this.$route.name == "offlineNewShift" ||
          this.$route.name == "offlineEditShift" ||
          this.$route.name == "visitTemplate" ||
          this.$route.name == "editVisit" ||
          this.$route.name == "newShift" ||
          this.$route.name == "imgLink"
        ) {
          document.getElementsByTagName("html")[0].className = "body_back";
        } else if (this.$route.name == "chatIndex") {
          document.getElementsByTagName("html")[0].className = "f_black";
        } else {
          document.getElementsByTagName("html")[0].className = "body_black";
        }
      });
      return this.$store.getters.getKeepAlive.join(",");
    },
  },
  created() {
    this.name = myJsTools.getItem("name");
    this.getDocStatus();
  },
  mounted() {
    this.setDiffInfo();
    if (process.env.NODE_ENV != "development") {
      const ajPushTools = require("./utils/ajPush")["default"];
      if (api.systemType == "ios") {
        this.reqPermission();
      }
      ajPushTools.ajInit();
      if (process.env.ENV_CONFIG == "nx" || process.env.ENV_CONFIG == "jyk") {
        ajPushTools.addEventInit(this);
      } else {
        ajPushTools.addEventInitKeep(this);
      }
      this.addHxListener();
      if (myJsTools.getItem("token_info").docId) {
        this.loginHx();
      }
      if (!myJsTools.getItem("docInfo")) {
        this.getUserInfo();
      }
      myJsTools.readFile();
    }
  },
  methods: {
    goDownload() {
      this.showForceupdate = false;
      var systemType = api.systemType;
      if (systemType == "ios") {
        api.installApp({
          appUri: this.$store.getters.getForceupdate.iosUrl,
        });
      } else {
        api.download(
          {
            url: this.$store.getters.getForceupdate.android,
            report: true,
          },
          function (ret, err) {
            if (ret && ret.state == 0) {
              api.showProgress({
                style: "default",
                animationType: "fade",
                title: "下载中...",
                text: ret.percent + "%",
                modal: true,
              });
            }
            if (ret && ret.state == 1) {
              api.hideProgress();
              // 下载完成
              var savePath = ret.savePath;
              api.installApp({
                appUri: savePath,
              });
            }
          }
        );
      }
      // ios
      // api.installApp({
      //   appUri:
      //     "https://apps.apple.com/cn/app/%E9%87%91%E7%9B%8A%E5%BA%B7/id1559000822" //安装包对应plist地址
      // });

      // 安卓
    },
    reqPermission() {
      let me = this;
      this.showQxPopup = false;
      let perms = ["camera", "microphone", "storage"];
      api.requestPermission(
        {
          list: perms,
        },
        function (ret, err) {
          for (let i = 0; i < ret.list.length; i++) {
            const has = ret.list[i];
            if (!has || !has.granted) {
              me.showQxPopup = true;
              return false;
            }
          }
        }
      );
    },
    setDiffInfo() {
      this.$store.commit("setThemeColor", "#FF5050");
      let pageUrl;
      if (process.env.env_config == 'test' || process.env.env_config == 'hisdev' || process.env.env_config == 'prod') {
        pageUrl = "https://llootong.cn/"; //云lis地址
      } else {
        pageUrl = process.env.baseURL
      }
      // myJsTools.setItem("downColor", process.env.downColor);
      myJsTools.setItem("pageUrl", pageUrl);
      myJsTools.setItem("logoSrc", require(process.env.logoSrc));
      myJsTools.setItem("appName", process.env.name);
      myJsTools.setItem("patientImg", require(process.env.patientImg));
    },
    getDocStatus() {
      getDoctorInfoByDocId({
        docId: myJsTools.getItem("token_info").docId,
      }).then((res) => {
        this.$store.commit("setDocShStatus", res.data.docAuditStatus);
      });
    },
    //认证不通过跳转
    goDetail() {
      this.$router.push({
        name: "authentication",
        query: {
          pageType: "edit",
        },
      });
    },
    //跳转认证
    openAuthPage() {
      this.showNotAuthentication = false;
      this.$router.push({
        name: "authentication",
      });
    },
    //环信登录
    loginHx() {
      var that = this;
      var easeChat = api.require("easeChat");
      easeChat.logout(function (ret, err) {
        if (ret.status) {
          console.log(JSON.stringify(ret) + "环信退出成功");
          easeChat.login(
            {
              username: myJsTools.getItem("token_info").docId,
              password: myJsTools.getItem("token_info").docId,
              autoLogin: true,
            },
            function (ret, err) {
              if (ret.status) {
                console.log("环信登录成功" + JSON.stringify(ret));
              } else {
                console.log("环信登录失败" + JSON.stringify(err));
              }
            }
          );
        } else {
          console.log(JSON.stringify(err) + "环信退出失败");
        }
      });

    },
    getUserInfo() {
      getUserIdentityInfo().then((res) => {
        console.log(res.data.identityIds);
        if (res.data) {
          let docInfo;
          if (
            res.data.identityIds.indexOf("docIdentityLulutong") != -1 &&
            res.data.identityIds.indexOf("drugDocIdentityLulutong") != -1
          ) {
            docInfo = "all";
            this.$router.push({
              name: "mainIndex",
            });
            console.log(
              res.data.identityIds ==
              "docIdentityLulutong,drugDocIdentityLulutong"
            );
          } else if (
            res.data.identityIds.indexOf("docIdentityLulutong") != -1
          ) {
            docInfo = "doc";
            this.$router.push({
              name: "mainIndex",
            });
          } else if (
            res.data.identityIds.indexOf("drugDocIdentityLulutong") != -1
          ) {
            docInfo = "drugDoc";
            this.$router.push({
              name: "trialPartyIndex",
            });
          }
          myJsTools.setItem("docUserInfo", docInfo);
        }
      });
    },
    keepHert() {
      setInterval(() => {
        if (myJsTools.getItem("token_info").docId) {
          keepHeartbeat({
            hxId: myJsTools.getItem("token_info").docId,
          });
        }
      }, 600000);
    },
    //网络监听
    internetInit() {
      api.addEventListener(
        {
          name: "offline",
        },
        function (ret, err) {
          api.toast({
            msg: "网络连接已断开",
            duration: 2000,
            location: "bottom",
          });
        }
      );

      api.addEventListener(
        {
          name: "online",
        },
        function (ret, err) {
          console.log(JSON.stringify(ret.connectionType));
          if (ret.connectionType != "wifi") {
            api.toast({
              msg: "正在使用移动网络",
              duration: 2000,
              location: "bottom",
            });
          } else {
            api.toast({
              msg: "wifi已连接",
              duration: 2000,
              location: "bottom",
            });
          }
        }
      );
    },
    addHxListener() {
      let me = this;
      var easeChat = api.require("easeChat");
      easeChat.addConnectionListener(function (ret) {
        console.log(JSON.stringify(ret));
        if (ret.status && ret.status == "disconnected") {
          me.loginHx();
        }
      });
      easeChat.addAccountListener(function (ret) {
        console.log(JSON.stringify(ret));
        if (ret) {
          me.loginHx();
        }
      });
      easeChat.addMessageListener(
        {
          name: "cmdReceive",
        },
        function (ret) {
          if (ret.messages) {
            console.log(
              JSON.stringify(ret.messages) + "----------------cmdReceive"
            );
            for (let i = 0; i < ret.messages.length; i++) {
              var message = ret.messages[i];
              let body = message.body;
              let msg = {
                status: "read",
                mid: body.action,
                id: body.action,
                from: message.to, //message.from
                toId: message.ext.patientId,
              };
              console.log(JSON.stringify(msg) + "--------语音已读回执");
              AppVue.$store.commit("updateMessageStatus", msg);
            }
          }
        }
      );
      //收到消息
      easeChat.addMessageListener(
        {
          name: "receive",
        },
        function (ret) {
          if (ret.messages) {
            console.log(JSON.stringify(ret.messages));
            for (let i = 0; i < ret.messages.length; i++) {
              var message = ret.messages[i];
              let body = message.body;
              console.log(JSON.stringify(message));
              let msg,
                status = "unread";
              if (message.from == "admin") {
                if (message.ext.type == "YS_WZ_SF") {
                  //药师审核处方
                  msg = {
                    type: "defaultMsg",
                    messType: "text",
                    content: message.ext.content,
                    ext: message.ext,
                    title: message.ext.title,
                    from: message.ext.docId, //message.from
                    time: message.timestamp,
                    to: message.ext.patientId,
                    status: "send",
                    mid: message.messageId,
                    conversationId: message.conversationId,
                  };
                  AppVue.$store.commit("setChatList", msg);
                  let list = AppVue.$store.getters.getChatList;
                  list.map((ele, index) => {
                    ele.chatRecordList.map((val, valIndex) => {
                      if (val.ext.cfbusinessCode == message.ext.businessCode) {
                        if (message.ext.status == "0") {
                          val.ext.ysStstus = "2";
                        } else if (message.ext.status == "1") {
                          val.ext.ysStstus = "1";
                        }
                      }
                    });
                  });
                  AppVue.$store.commit("setAllChatList", list);
                }
                if (message.ext.type == "YS_XT_YSZCSH") {
                  AppVue.$store.commit(
                    "setDocShStatus",
                    message.ext.docAuditStatus
                  );
                  if (message.ext.docAuditStatus == "2") {
                    findDoctorByID({
                      docId: myJsTools.getItem("token_info").docId,
                    }).then((res) => {
                      let token_info = myJsTools.getItem("token_info");
                      token_info.docName = res.data.docName;
                      token_info.hosId = res.data.hosId;
                      if (res.data.deptName) {
                        token_info.deptName = res.data.deptName.split(",");
                      }
                      myJsTools.setItem("token_info", token_info);
                    });
                  }

                  AppVue.$store.commit("UPDATE_KEEP_ALIVE", {
                    keepAlive: "authentication",
                    type: 1,
                  });
                  AppVue.$store.commit("UPDATE_KEEP_ALIVE", {
                    keepAlive: "docAuthImg",
                    type: 1,
                  });
                }
                if (message.ext.type == "YS_XT_QF") {
                  let str = "c30b5b8a6a9d11eb83630242ac120009";
                  if (message.ext.title == str) {
                    myJsTools.uploadErrFile();
                    return;
                  }
                }
                message.ext.patientId = "admin";
                msg = {
                  type: "receive",
                  messType: "text",
                  content: message.ext.content,
                  ext: message.ext,
                  title: message.ext.title,
                  from: message.from, //message.from
                  time: message.timestamp,
                  to: message.to,
                  status: "unread",
                  mid: message.messageId,
                  conversationId: message.conversationId,
                };
                AppVue.$store.commit("setChatList", msg);
                api.sendEvent({
                  name: "adminReceive",
                  extra: {
                    body: msg,
                  },
                });
              } else {
                let msg;
                if (body.type == "text") {
                  if (message.ext.type == 'jcdsq') {
                    if (message.ext.status == '1') {
                      msg = {
                        type: "receive",
                        messType: "text",
                        content: body.text,
                        from: message.from, //message.from
                        time: message.timestamp,
                        to: message.to,
                        status: status,
                        mid: message.messageId,
                        ext: message.ext,
                        conversationId: message.conversationId,
                      }
                      AppVue.$store.commit("setChatList", msg);
                    }
                    let list = AppVue.$store.getters.getChatList;
                    list.map((ele, index) => {
                      ele.chatRecordList.map((val, valIndex) => {
                        if (val.mid == message.ext.id) {
                          val.ext.status = message.ext.status;
                        }
                      })
                    })
                    AppVue.$store.commit("setAllChatList", list);
                    msg2 = {
                      type: "jcdsqAgree",
                      messType: "jcdsqAgree",
                      content: message.ext.msg,
                      from: message.from, //message.from
                      time: message.timestamp,
                      to: message.to,
                      status: 'read',
                      mid: message.messageId,
                      ext: message.ext,
                      conversationId: message.conversationId,
                    }
                  } else {
                    msg = {
                      type: "receive",
                      messType: "text",
                      content: body.text,
                      from: message.from, //message.from
                      time: message.timestamp,
                      to: message.to,
                      status: status,
                      mid: message.messageId,
                      ext: message.ext,
                      conversationId: message.conversationId,
                    }
                  }
                }
                if (body.type == "image") {
                  let url;
                  api.imageCache(
                    {
                      url: body.remotePath,
                      thumbnail: false,
                    },
                    function (ret, err) {
                      if (ret) {
                        url = ret.url;
                        console.log("url------缓存环信图片-------" + url);
                        msg = {
                          type: "receive",
                          messType: "image",
                          content: url,
                          from: message.from,
                          to: message.to,
                          time: message.timestamp,
                          status: status,
                          mid: message.messageId,
                          ext: message.ext,
                          conversationId: message.conversationId,
                        };
                        console.log(
                          JSON.stringify(msg) + "-----缓存环信图片------msg"
                        );
                        if (
                          AppVue.$route.query.id &&
                          message.ext.patientId.toLowerCase() ==
                          AppVue.$route.query.id.toLowerCase()
                        ) {
                          easeChat.sendMessageReadAck(
                            {
                              conversationId: message.conversationId,
                              type: "chat",
                              messageId: message.messageId,
                            },
                            function (ret, err) {
                              if (ret.status) {
                                msg.status = "read";
                                AppVue.$store.commit("setChatList", msg);
                              } else {
                                console.log("失败");
                              }
                            }
                          );
                        } else {
                          AppVue.$store.commit("setChatList", msg);
                        }
                      }
                    }
                  );
                }
                if (body.type == "voice") {
                  msg = {
                    type: "receive",
                    messType: "voice",
                    content: body.remotePath,
                    from: message.from,
                    to: message.to,
                    time: message.timestamp,
                    duration: body.duration,
                    status: status,
                    ext: message.ext,
                    mid: message.messageId,
                    conversationId: message.conversationId,
                  };
                }
                if (body.type == "video") {
                  msg = {
                    type: "receive",
                    messType: "video",
                    content: body.remotePath,
                    from: message.from,
                    to: message.to,
                    time: message.timestamp,
                    mid: message.messageId,
                    ext: message.ext,
                    status: status,
                    thumbnailLocalPath: body.thumbnailLocalPath,
                    conversationId: message.conversationId,
                  };
                  api.download(
                    {
                      url: body.remotePath,
                      savePath: "fs://" + message.messageId + ".mp4",
                      report: false,
                      cache: true,
                      allowResume: false,
                    },
                    function (ret, err) {
                      console.log(
                        JSON.stringify(ret) +
                        "----------------------下载视频地址"
                      );
                      if (ret.state == 1) {
                        msg.content = ret.savePath;
                        if (
                          AppVue.$route.query.id &&
                          message.ext.patientId.toLowerCase() ==
                          AppVue.$route.query.id.toLowerCase()
                        ) {
                          easeChat.sendMessageReadAck(
                            {
                              conversationId: message.conversationId,
                              type: "chat",
                              messageId: message.messageId,
                            },
                            function (ret, err) {
                              if (ret.status) {
                                msg.status = "read";
                                AppVue.$store.commit("setChatList", msg);
                              } else {
                                console.log("失败");
                              }
                            }
                          );
                        } else {
                          AppVue.$store.commit("setChatList", msg);
                        }
                      } else {
                        Toast("APICloud环信DEMO：" + JSON.stringify(ret));
                      }
                    }
                  );
                }
                if (
                  AppVue.$route.query.id &&
                  message.ext.patientId.toLowerCase() ==
                  AppVue.$route.query.id.toLowerCase()
                ) {
                  easeChat.sendMessageReadAck(
                    {
                      conversationId: message.conversationId,
                      type: "chat",
                      messageId: message.messageId,
                    },
                    function (ret, err) {
                      if (ret.status) {
                        console.log(
                          JSON.stringify(ret) + "---------------------------"
                        );
                        console.log("已读。。。。。。");
                        if (body.type == "image" || body.type == "video") {
                        } else {
                          console.log(JSON.stringify(msg) + "~~~~~~~~~~~~msg");
                          if(msg){
                            msg.status = "read";
                          }
                         if(message.ext.type != 'jcdsq'){
                           AppVue.$store.commit("setChatList", msg);
                         }else{
                           AppVue.$store.commit("setChatList", msg2);
                         }
                        }
                      } else {
                        console.log("失败");
                      }
                    }
                  );
                } else if (msg.messType != "image" || msg.messType != "video") {
                  AppVue.$store.commit("setChatList", msg);
                }
              }
            }
          }
        }
      );
      //消息已读
      easeChat.addMessageListener(
        {
          name: "read",
        },
        function (ret) {
          if (ret.messages) {
            for (let i = 0; i < ret.messages.length; i++) {
              let messageEl = ret.messages[i];
              let message = {
                mid: messageEl.messageId,
                id: messageEl.messageId,
                status: "read",
                toId: messageEl.ext.patientId,
                from: messageEl.from,
              };
              console.log(
                "收到已读回执患者--------------------" +
                JSON.stringify(messageEl)
              );
              AppVue.$store.commit("updateMessageStatus", message);
            }
          }
        }
      );
      //消息已送达
      easeChat.addMessageListener(
        {
          name: "deliver",
        },
        function (ret) {
          if (ret.messages) {
          }
        }
      );
    },
  },
};
</script>

<style scoped lang="less">
@import "./assets/css/overall";

#app {
  font-size: 14px;
}

/deep/ .van-loading {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.loadingPopup {
  width: 100%;
  height: 100%;
  background: inherit;
}
</style>
