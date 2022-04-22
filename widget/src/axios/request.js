import axios from "axios";
import Vue from "vue";
import store from "../store/store";
import { Toast } from "vant";
import myJsTools from "../utils/myJsTools";

Vue.use(Toast);
import router from "../router";
import md5 from "js-md5";

let Base64 = require("js-base64").Base64;
let baseURL = process.env.baseURL + "his/";
let firmId = process.env.firmId;
console.log('111111111111',baseURL)
let appV;
if (process.env.NODE_ENV == "development") {
  firmId = "dev";
}

// 创建axios实例
const service = axios.create({
  baseURL: baseURL, // api 的 base_url
  timeout: 20000 // 请求超时时间
});

function reSetData(requestData) {
  // 1.时间戳
  let timestamp = new Date().getTime() + "";
  // 2. uuid
  let nonce = guid();
  // 3.token
  let token_info = myJsTools.getItem("token_info");
  // 4.data base64
  let base64Data = "";
  if (requestData) {
    base64Data = Base64.encode(JSON.stringify(requestData));
  } else {
    let map = {};
    base64Data = Base64.encode(JSON.stringify(map));
  }

  let data = { data: base64Data };
  data.timestamp = timestamp;
  data.nonce = nonce;
  if (token_info) {
    data.token = token_info.token;
  }
  let s = "";
  Object.keys(data)
    .sort()
    .forEach(k => {
      if (data[k] && data[k].length > 0) {
        if (s.length > 0) {
          s += "&";
        }
        ``;
        s += k + "=" + data[k];
      }
    });
  let md5Data = md5(s).toLocaleUpperCase();
  data.sign = md5Data;
  console.log(data);
  return data;
}

function guid() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }

  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  );
}

// request拦截器
service.interceptors.request.use(
  config => {
    store.commit("setShowLoading", true);
    let token_info = myJsTools.getItem("token_info");
    var token = "";
    if (token_info) {
      token = token_info.token || "";
      let hosId = token_info.hosId || "";
      config.headers.Authorization = `${token}`;
    }
    if (!config.headers.hosId) {
      config.headers.hosId = "";
    }
    // 版本号修改
    // 移动端1.2.3 和本地1.3.5
    config.headers.version = "1.3.7";
    config.headers.firmId = firmId;
    config.headers.clientType = "A";
    if (process.env.NODE_ENV != "development" && api) {
      config.headers.appV = api.appVersion;
    } else {
      config.headers.appV = "";
    }
    // 接口安全验证
    myJsTools.writrFile("-----入参-------", config);
    if (config.method == "post") {
      config.data = reSetData(config.data);
    } else {
      config.data = reSetData(config.data);
    }

    return config;
  },
  error => {
    Promise.reject(error);
  }
);

// response 拦截器
try {
  service.interceptors.response.use(
    response => {
      store.commit("setShowLoading", false);
      if (response.data) {
        myJsTools.writrFile("-----出参-------", response.data);
        Toast.clear();
        const res = response.data;
        if (res.code == 20000) {
          return res;
        } else if (res.code == 20008) {
          if (!res.data) {
            res.data = {};
          }
          res.data.isLogin = true;
          return res;
        } else if (res.code == 20010) {
          if (!res.data) {
            res.data = {};
          }
          res.data.isUser = true;
          return res;
        } else if (res.code == 20017) {
          if (!res.data) {
            res.data = {};
          }
          res.data.isDoc = true;
          return res;
        } else if (res.code == 20014) {
          if (!res.data) {
            res.data = {};
          }
          res.data.isTel = true;
          return res;
        } else if (res.code == 20006) {
          //token 过期
          myJsTools.setItem("token_info", "");
          router.push({
            path: "/login"
          });
        } else if (res.code == 20012) {
          //没有医院id
          myJsTools.setItem("token_info", "");
          router.push({
            path: "/login"
          });
        } else if (res.code == 20001) {
          Toast({
            message: res.message,
            position: "bottom",
            duration: 3 * 1000
          });
          // myJsTools.uploadErrFile();
          return Promise.reject(res);
        } else if (res.code == 50007) {
          console.log("r1111111111111es", res.data);
          store.commit("setForceupdate", {
            popup: true,
            iosUrl: res.data.ios,
            android: res.data.android
          });
          return Promise.reject(res);
        } else {
          Toast({
            message: res.message,
            position: "bottom",
            duration: 3 * 1000
          });
          // myJsTools.uploadErrFile();
          return Promise.reject(res);
        }
      }
    },
    error => {
      store.commit("setShowLoading", false);
      Toast({
        message: error.message,
        position: "bottom",
        duration: 3 * 1000
      });
      return;
    }
  );
} catch (err) {}
export default service;
