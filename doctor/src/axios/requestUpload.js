import axios from "axios";
import Vue from "vue";

import {Toast} from "vant";
import myJsTools from "@/utils/myJsTools";

Vue.use(Toast);
import router from "../router";
import md5 from "js-md5";
import base from "./base";

let Base64 = require("js-base64").Base64;

let baseURL = process.env.baseURL+"oss/";

console.log(baseURL + "-----oss");
// let baseURL = "https://llootong.cn/oss/";
// 创建axios实例
const serviceUpload = axios.create({
  baseURL: baseURL, // api 的 base_url
  timeout: 20000, // 请求超时时间
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

  let data = {data: base64Data};
  data.timestamp = timestamp;
  data.nonce = nonce;
  if (token_info) {
    data.token = token_info.token;
  }
  let s = "";
  Object.keys(data)
    .sort()
    .forEach((k) => {
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
  return data;
}

function guid() {
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

function S4() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

// request拦截器
serviceUpload.interceptors.request.use(
  (config) => {
    let token_info = myJsTools.getItem("token_info");
    var token = "";
    if (token_info) {
      token = token_info.token;
      let hosId = token_info.hosId;
      config.headers.Authorization = `${token}`;
      if (hosId) {
        config.headers.hosId = `${hosId}`;
      }
    }
    config.headers.firmId = process.env.firmId;
    // 接口安全验证
    if (config.method == "post") {
      config.data = reSetData(config.data);
    } else {
      config.data = reSetData(config.data);
    }
    // 拼接到url地址

    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

// response 拦截器
try {
  serviceUpload.interceptors.response.use(
    (response) => {
      Toast.clear();
      if (response.data) {
        const res = response.data;
        if (res.code == 20000) {
          return res;
        } else if (res.code == 20008) {
          if (!res.data) {
            res.data = {};
          }
          res.data.isLogin = true;
          return res;
        } else if (res.code == 20006) {
          router.push({
            path: "/",
          });
        } else if (res.code == 20001) {
          console.log("xxxxxxxxx");
          Toast({
            message: res.message,
            position: "bottom",
            duration: 3 * 1000,
          });
          return Promise.reject(res);
        } else {
          Toast({
            message: res.message,
            position: "bottom",
            duration: 3 * 1000,
          });
          return Promise.reject(res);
        }
      }
    },
    (error) => {
      console.log(error);
      Toast({
        message: error.message,
        position: "bottom",
        duration: 3 * 1000,
      });
      return;
    }
  );
} catch (err) {
}
export default serviceUpload;
