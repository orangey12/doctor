import Vue from "vue";
import App from "./App";
import './utils/api.js';
import store from "./store/store.js";
import router from "./router";
import less from 'less'
import Vant, {Lazyload} from "vant";
import WebIM from "./utils/WebIM";
import LightTimeline from "vue-light-timeline";
import myJsTools from "./utils/myJsTools";
import global from "./assets/js/global";
import "vant/lib/index.css";
import "@/assets/css/base.css";
import "@/assets/css/base.less";
import "@/assets/css/overall.less";
import "lib-flexible";
import VueTouch from 'vue-touch'
// 引入全局自定义指令 图片懒加载
import './utils/lazy.js';
import vueFingerDirective from "vue-finger-directive";
import date from "./utils/date";
import {getDoctorInfoByDocId} from "./api/my";

Vue.config.productionTip = false;
Vue.use(Vant)
  .use(Lazyload)
  .use(LightTimeline)
  .use(vueFingerDirective).use(less);

Vue.prototype.global = global;

Vue.use(VueTouch, {name: 'v-touch'})
VueTouch.config.swipe = {
  threshold: 10 //手指左右滑动距离
}

if (!myJsTools.getItem("firstInit")) {
  myJsTools.setItem("firstInit", '1');
  myJsTools.setItem("firstInitPopup", '1');
}

let isApp = false;

router.beforeEach((to, from, next) => {
  if (to.matched.some(res => res.meta.requireAuth)) {
    let appVersion = '';
    if (process.env.NODE_ENV != 'development') {
      appVersion = api.appVersion;
    }
    //请求医生信息 及审核状态
    if (myJsTools.getItem("token_info") && myJsTools.getItem("token_info").docId && myJsTools.getItem("token_info").token) {
      if (!myJsTools.getItem("token_info").docName || store.getters.getDocShStatus != '2') {
        getDoctorInfoByDocId({
          docId: myJsTools.getItem("token_info").docId
        }).then(res => {
          let token_info = myJsTools.getItem("token_info");
          token_info.docName = res.data.docName;
          token_info.hosId = res.data.hosId;
          if (res.data.deptName) {
            token_info.deptName = res.data.deptName.split(",");
          }
          myJsTools.setItem("token_info", token_info);
          store.commit("setDocShStatus", res.data.docAuditStatus);
          //埋点
          let val = "  进入页面： 从   " + from.name + "    到   " + to.name + "版本号：   " + appVersion + "\n";
          myJsTools.writrFile("页面参数", val);
          myJsTools.writrFile("页面带参===========", to.query)
          let s = store.getters.getDocShStatus;
          console.log(s,'s')
          if (s != 2) {
            let notShowPage = ["adminList", "myFit","qxPage", 'myFitNews', 'myFitPass', 'authentication', 'docAuthImg', 'login', 'setPass', 'registerDoc', 'protocol', 'initPage', 'protocol', 'feedback', 'cancellation', 'feedbackFinish', 'appAbout']
            if (notShowPage.indexOf(to.name) == -1) {
              store.commit("setDocShStatus", -1);
              store.commit("setDocShStatus", s);
            }
          }
          if (to.name == "login" || to.name == "setPass" || to.name == "protocol" || to.name == 'initPage' || to.name == 'registerDoc') {
            next();
          } else {
            let customerType = 'A', ver = '0.0.1';
            if (process.env.NODE_ENV != 'development') {
              ver = api.appVersion;
              if (api.systemType == 'ios') {
                customerType = 'I';
              } else if (api.systemType == 'android') {
                customerType = 'A'
              }
            }
            let showPage = ["mainIndex", "myFit", "myFitNews", "myFitPass", "adminList","qxPage", "patientIndex", "myIndex", "trialPartyIndex", "authentication", "docAuthImg", 'protocol', 'feedback', 'cancellation', 'feedbackFinish', 'appAbout']
            if (myJsTools.getItem("token_info") && myJsTools.getItem("token_info").token) {
              let param = {
                "customerTime": date.format(new Date().getTime()),
                "customerType": customerType,
                "event": "P1",
                "page": to.name,
                "position": "未知",
                "userId": myJsTools.getItem("token_info").userId,
                "userType": "1",
                "version": ver
              }
              myJsTools.requestUrl(param);
              if (s != 2 && showPage.indexOf(to.name) == -1) {
                return false;
              } else {
                next();
              }
            } else {
              next("/login");
            }
          }
        });
        myJsTools.setItem("videoCallSratus", false);
      }
    }


    //埋点
    let val = "  进入页面： 从   " + from.name + "    到   " + to.name + "版本号：   " + appVersion + "\n";
    myJsTools.writrFile("页面参数", val);
    myJsTools.writrFile("页面带参===========", to.query)
    let s = store.getters.getDocShStatus;
    console.log(s,'s')
    if (s != 2) {
      let notShowPage = ["adminList", "myFit","qxPage", 'myFitNews', 'myFitPass', 'authentication', 'docAuthImg', 'login', 'setPass', 'registerDoc', 'protocol', 'initPage', 'protocol', 'feedback', 'cancellation', 'feedbackFinish', 'appAbout']
      if (notShowPage.indexOf(to.name) == -1) {
        store.commit("setDocShStatus", -1);
        store.commit("setDocShStatus", s);
      }
    }
    if (to.name == "login" || to.name == "setPass" || to.name == "protocol" || to.name == 'initPage' || to.name == 'registerDoc') {
      next();
    } else {
      let customerType = 'A', ver = '0.0.1';
      if (process.env.NODE_ENV != 'development') {
        ver = api.appVersion;
        if (api.systemType == 'ios') {
          customerType = 'I';
        } else if (api.systemType == 'android') {
          customerType = 'A'
        }
      }
      let showPage = ["mainIndex", "myFit", "myFitNews", "myFitPass", "adminList","qxPage", "patientIndex", "myIndex", "trialPartyIndex", "authentication", "docAuthImg", 'protocol', 'feedback', 'cancellation', 'feedbackFinish', 'appAbout']
      if (myJsTools.getItem("token_info") && myJsTools.getItem("token_info").token) {
        let param = {
          "customerTime": date.format(new Date().getTime()),
          "customerType": customerType,
          "event": "P1",
          "page": to.name,
          "position": "未知",
          "userId": myJsTools.getItem("token_info").userId,
          "userType": "1",
          "version": ver
        }
        myJsTools.requestUrl(param);
        if (s != 2 && showPage.indexOf(to.name) == -1) {
          return false;
        } else {
          next();
        }
      } else {
        next("/login");
      }
    }
  }
});
router.afterEach((to, from, next) => {
  store.commit("setHistoryUrl", from.name);
  window.scrollTo(0, 0);
});
var u = navigator.userAgent, app = navigator.appVersion;
window.isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
console.log(process.env, 'env=======================main.js===================>')
if (process.env.NODE_ENV != 'development') {
  window.apiready = function () {
    isApp = true;
    window.AppVue = new Vue({
      el: "#app",
      router,
      store,
      WebIM,
      components: {App},
      template: "<App/>"
    });
    api.readFile({
      path: 'cache://token_info.json',
    }, function (ret, err) {
      if (ret.status) {
        var data = ret.data;
        console.log(data + "=============>data");
        myJsTools.setItem("token_info", JSON.parse(data));
      } else {
        console.log('无法读取服务器信息，跳转到服务器配置界面!');
      }
    });
  };
} else {
  window.apiready = function () {
    console.log('ready ================================>')
    isApp = true;
  window.AppVue = new Vue({
    el: "#app",
    router,
    store,
    WebIM,
    components: {App},
    template: "<App/>"
  });
}
}





