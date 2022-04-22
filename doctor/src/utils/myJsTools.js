/**
 * 公共方法封装
 *
 *
 */
import { downOssImg, getLabPresentationOssImg, uploadOssImg } from "../api/oss";
import apiFun from "./api";
import axios from "axios";
import lrz from "lrz";
import ossUpDown from "./ossUpDown";
import Pinyin from "./pinYin";
import { Toast } from "vant";
import date from "./date";

const myJsTools = {};

myJsTools.request = function(paras) {
  var url = location.href;
  var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
  var paraObj = {};
  for (var i = 0, j; (j = paraString[i]); i++) {
    paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = decodeURIComponent(
      j.substring(j.indexOf("=") + 1, j.length)
    );
  }
  var returnValue = paraObj[paras.toLowerCase()];
  if (typeof returnValue == "undefined") {
    return "";
  } else {
    return returnValue;
  }
};
/**
 * 转换成字符串
 */
myJsTools.toString = function(O) {
  try {
    var j = JSON.stringify(O);
    return j;
  } catch (e) {
    var s = [];
    var J = "";
    if (Object.prototype.toString.apply(O) === "[object Array]") {
      for (var i = 0; i < O.length; i++) S.push(this.O2String(O[i]));
      J = "[" + S.join(",") + "]";
    } else if (Object.prototype.toString.apply(O) === "[object Date]") {
      J = "new Date(" + O.getTime() + ")";
    } else if (
      Object.prototype.toString.apply(O) === "[object RegExp]" ||
      Object.prototype.toString.apply(O) === "[object Function]"
    ) {
      J = O.toString();
    } else if (Object.prototype.toString.apply(O) === "[object Object]") {
      for (var i in O) {
        O[i] =
          typeof O[i] == "string"
            ? '"' + O[i] + '"'
            : typeof O[i] === "object"
            ? this.O2String(O[i])
            : O[i];
        S.push(i + ":" + O[i]);
      }
      J = "{" + S.join(",") + "}";
    }
    return J;
  }
};

myJsTools.setPromiss = function() {
  let perms = ["camera", "microphone", "photos", "notification", "storage"];
  let s = true;
  api.requestPermission(
    {
      list: perms,
      code: 100001
    },
    function(ret, err) {
      console.log(JSON.stringify(ret))
      for (let i = 0; i < ret.list.length; i++) {
        const has = ret.list[i];
        if (!has || !has.granted) {
          s = false;
          return false;
        }
      }
    }
  );
  console.log(s + "------------s");
  return s;
};

myJsTools.readFile = function() {
  if (process.env.NODE_ENV != "development") {
    // if (api.systemType != "ios") {
    if (myJsTools.getPromise("storage")) {
      api.readFile(
        {
          path: "cache://chatList.json"
        },
        function(ret, err) {
          if (ret.status) {
            var data = ret.data;
            console.log(JSON.parse(data) + "---------------------------------");
            AppVue.$store.commit("setAllChatList", JSON.parse(data));
          } else {
            console.log("无法读取服务器信息，跳转到服务器配置界面!");
          }
        }
      );
    } else{

          myJsTools.getPromise("storage");

    }
  }
};

myJsTools.writrFile = function(tips, dataVal) {
  console.log(tips + "-----------" + JSON.stringify(dataVal));
  if (process.env.NODE_ENV != "development") {
    api.writeFile(
      {
        path:
          "fs://" + date.format(new Date().getTime()).split(" ")[0] + ".txt",
        data:
          "[" +
          date.format(new Date().getTime()) +
          "]   " +
          tips +
          "-------" +
          JSON.stringify(dataVal) +
          "\n",
        append: true
      },
      function(ret, err) {
        if (ret.status) {
          //成功
          // console.log("写入成功")
        } else {
          // console.log("写入失败")
        }
      }
    );
  }
};

myJsTools.uploadErrFile = function(type) {
  Toast.loading({
    duration: 0, // 持续展示 toast
    forbidClick: true,
    message: "上传日志中"
  });
  var zip = api.require("zip");
  let name = "fs://" + date.format(new Date().getTime()).split(" ")[0] + ".txt";
  zip.archive(
    {
      files: [name]
    },
    function(ret, err) {
      if (ret.status) {
        let dto = {
          files: {
            file:
              "fs://" + date.format(new Date().getTime()).split(" ")[0] + ".zip"
          },
          values: {
            folderType: "23",
            fileName: date.format(new Date().getTime()).split(" ")[0] + ".zip",
            otherId:
              date.format(new Date().getTime()).split(" ")[0] +
              "/" +
              myJsTools.getItem("token_info").docId
          }
        };
        //上传剪辑后的图像到服务器
        api.ajax(
          {
            // report : false,
            url: "https://test.llootong.net/oss/ossUpload/uploadFileWithFile",
            headers: {
              Authorization: myJsTools.getItem("token_info").token,
              firmId: "YiXiaoLu"
            },
            //这里是我们约定好的后台上传图片的位置 ，你可以根据你的需求来改
            method: "post",
            cache: "false",
            timeout: 30,
            dataType: "multipart/form-data;charset=UTF-8\n",
            data: dto
          },
          function(ret, err) {
            Toast.clear();
            myJsTools.writrFile("上传日志----------", JSON.stringify(ret));
            if (type && type == "set") {
              Toast("上传成功");
            }
          }
        );
      } else {
        myJsTools.writrFile("上传日志错误----------", JSON.stringify(err));
      }
    }
  );
};

myJsTools.rowsByGroup = function(rows) {
  var map = {};
  for (var i in rows) {
    if (rows[i].data.length != 0) {
      for (var v of rows[i].data) {
        if (!map[v.key]) {
          map[v.key] = {};
        }
        map[v.key][i] = v.value;
      }
    }
  }
  return map;
};
// 数组中，所有对象按照指定的属性，进行分组
myJsTools.dataByGroup = function(arr) {
  var map = {},
    dest = [];
  for (var i = 0; i < arr.length; i++) {
    var ai = arr[i];
    if (!map[ai.kQType]) {
      dest.push({
        kQType: ai.kQType,
        data: [ai]
      });
      map[ai.kQType] = ai;
    } else {
      for (var j = 0; j < dest.length; j++) {
        var dj = dest[j];
        if (dj.kQType == ai.kQType) {
          dj.data.push(ai);
          break;
        }
      }
    }
  }
  return dest;
};
/**
 * 存储  global_config 全局参数配置  patientInfo患者信息存储  active 切换之后的tab保存状态
 *       token_info 登录信息  showCodeLogin 登录方式状态存储  myActive 我的处方tab 状态存储
 *       chatList 聊天记录存储，未读消息记录存储
 */
myJsTools.setItem = function(key, value) {
  if (process.env.NODE_ENV != "development") {
    console.log("keykeykey" + key);
    if (key == "token_info") {
      console.log("``````````````xiewenjian ");
      api.writeFile(
        {
          path: "cache://token_info.json",
          data: JSON.stringify(value)
        },
        function(ret, err) {
          if (ret.status) {
            //成功
            console.log("写入成功");
          } else {
            console.log("写入失败");
          }
        }
      );
    }
    apiFun.setStorage(key, value);
  } else {
    if (!window.localStorage) {
      alert("请检查浏览器版本，该版本不支持localStorage存储");
    } else {
      var ms = "mystorage";
      var storage = window.localStorage;
      var mydata = storage.getItem(ms);
      if (!mydata) {
        storage.setItem(ms, '{"data":{}}');
        mydata = storage.getItem(ms);
      }
      mydata = JSON.parse(mydata);
      mydata.data[key] = value;
      storage.setItem(ms, JSON.stringify(mydata));
    }
  }
};
myJsTools.getItem = function(key) {
  let result;
  if (process.env.NODE_ENV != "development") {
    result = apiFun.getStorage(key);
    return result;
  } else {
    if (!window.localStorage) {
      alert("请检查浏览器版本，该版本不支持localStorage存储");
    } else {
      var ms = "mystorage";
      var storage = window.localStorage;
      var mydata = storage.getItem(ms);
      if (!mydata) {
        return false;
      }
      mydata = JSON.parse(mydata);
      return mydata.data[key];
    }
  }
};
myJsTools.removeItem = function(key) {
  if (!window.localStorage) {
    alert("请检查浏览器版本，该版本不支持localStorage存储");
  } else {
    var ms = "mystorage";
    var storage = window.localStorage;
    var mydata = JSON.parse(mydata);
    delete mydata.data[key];
    storage.setItem(ms, JSON.stringify(mydata));
  }
};
myJsTools.clearItem = function() {
  if (!window.localStorage) {
    alert("请检查浏览器版本，该版本不支持localStorage存储");
  } else {
    var ms = "mystorage";
    var storage = window.localStorage;
    storage.removeItem(ms);
  }
};
myJsTools.getUrl = function(imgName, type) {
  return new Promise(async (resolve, reject) => {
    if (process.env.NODE_ENV != "development") {
      let url;
      if (myJsTools.getItem(imgName)) {
        var fs = api.require("fs");
        fs.exist(
          {
            path: myJsTools.getItem(imgName)
          },
          function(ret, err) {
            console.log(ret.exist);
            if (ret.exist) {
              resolve(myJsTools.getItem(imgName));
            } else {
              myJsTools.downLoadImg(imgName, type).then(url => {
                console.log("dddddd");
                resolve(url);
              });
            }
          }
        );
      } else {
        myJsTools.downLoadImg(imgName, type).then(url => {
          console.log("ddddddddddddddddddd3333333d");
          resolve(url);
        });
      }
    } else {
      console.log(imgName, "isiOS");
      downOssImg({
        imgName: imgName
      }).then(res => {
        let herfUrl = res.data.url.split("-internal").join("");
        let url = herfUrl.split("?")[0];
        resolve(url);
      });
    }
  });
};
myJsTools.downLoadImg = function(imgName, type) {
  return new Promise(resolve => {
    downOssImg({
      imgName: imgName
    }).then(res => {
      let herfUrl = res.data.url.split("-internal").join("");
      let url = herfUrl.split("?")[0];
      if (type) {
        resolve(url);
      } else {
        url =
          herfUrl.split("?")[0] + "?x-oss-process=image/resize,l_600,m_lfit";
        console.log(url + "mmmmmmmmmmmmm================");
        api.imageCache(
          {
            url: url,
            thumbnail: false
          },
          function(ret, err) {
            if (ret) {
              let localUrl = ret.url;
              console.log(localUrl + "==============url");
              myJsTools.setItem(imgName, localUrl);
              resolve(localUrl);
            }
          }
        );
      }
    });
  });
};

myJsTools.appendFile = function(type, path, filename, size, patientId) {
  Toast.loading({
    duration: 0, // 持续展示 toast
    forbidClick: true,
    message: "上传图片中"
  });
  let otherId = "";
  if (type == "13") {
    otherId = myJsTools.getItem("token_info").docId;
  } else {
    otherId = patientId || "";
  }
  lrz(path, {
    width: api.winWidth * 2,
    quality: 0.7 //自定义使用压缩方式
  })
    .then(function(rst) {
      ossUpDown.upImg(type, rst.base64.split(",")[1], otherId, path);
    })
    .catch(function(error) {
      //失败时执行
      console.log(JSON.stringify(error) + "------------图片压缩失败");
    })
    .always(function() {
      //不管成功或失败，都会执行
    });
};

myJsTools.getImgByteSize = function(base64) {
  if (base64) {
    // 获取base64图片byte大小
    base64 = base64.split(",")[1].split("=")[0];
    var strLength = base64.length;
    var fileLength = strLength - (strLength / 8) * 2;
    return Math.floor(fileLength); // 向下取整
  } else {
    return null;
  }
};

myJsTools.getHeadImg = function(fileName) {
  return new Promise((resolve, reject) => {
    if (myJsTools.getItem(fileName)) {
      resolve(myJsTools.getItem(fileName));
    } else {
      getLabPresentationOssImg({
        bucket: "2",
        Img_name: fileName
      }).then(res => {
        var herfUrl = res.data.url.split("-internal").join("");
        resolve(herfUrl);
      });
    }
  });
};

myJsTools.data_letter_sort = function(data, field) {
  var letter_reg = /^[A-Z]$/;
  var list = new Array();
  list["☆"] = new Array();
  list["#"] = new Array();
  for (var i = 0; i < data.length; i++) {
    // 添加 # 分组，用来 存放 首字母不能 转为 大写英文的 数据
    if (data[i].asterisk == 1) {
      list["☆"].push(data[i]);
    }
    if (data[i].patientNameMemo) {
      data[i]["py"] = Pinyin.GetQP(data[i].patientNameMemo);
    } else if (data[i].patientName) {
      data[i]["py"] = Pinyin.GetQP(data[i].patientName);
    }
    // 首字母 转 大写英文
    let letter = data[i][field].substr(0, 1).toUpperCase();
    // 是否 大写 英文 字母
    if (!letter_reg.test(letter)) {
      letter = "#";
    }
    // 创建 字母 分组
    if (!(letter in list)) {
      list[letter] = new Array();
    }
    // 字母 分组 添加 数据
    list[letter].push(data[i]);
  }
  // 转换 格式 进行 排序；
  var resault = new Array();
  for (var key in list) {
    resault.push({
      letter: key,
      list: list[key]
    });
  }
  resault.sort(function(x, y) {
    return x.letter.charCodeAt(0) - y.letter.charCodeAt(0);
  });
  // # 号分组 放最后
  var last_arr = resault[0];
  resault.splice(0, 1);
  resault.push(last_arr);
  if (list["#"].length == 0) {
    resault.splice(-1, 1);
  }
  // ☆ 号放在最前面
  if (list["#"].length == 0) {
    if (list["☆"].length != 0) {
      resault.unshift(resault.splice(-1, 1)[0]);
    } else if (list["☆"].length == 0) {
      resault.splice(-1, 1);
    }
  } else if (list["#"].length != 0) {
    if (list["☆"].length != 0) {
      resault.unshift(resault.splice(-2, 1)[0]);
    } else if (list["☆"].length == 0) {
      resault.splice(-2, 1);
    }
  }

  // 转换 数据 格式
  var json_sort = {};
  for (var i = 0; i < resault.length; i++) {
    json_sort[resault[i].letter] = resault[i].list;
  }

  return json_sort;
};

//埋点方法
myJsTools.requestUrl = function(data) {
  console.log(process.env.baseURL + "baseURL");
  let firmId = process.env.firmId;
  console.log('11111111111111112',firmId)
  if (process.env.NODE_ENV == "development") {
    firmId = "dev";
  }
  axios.defaults.headers.post["version"] = "1.2.3";
  axios.defaults.headers.post["firmId"] = firmId;
  axios.defaults.headers.post["clientType"] = "A";
  axios
    .post(process.env.baseURL + "his/buriedPoint/add", data)
    .then(function(res) {
      console.log("埋点成功++++++++++++++++++++++++");
    })
    .catch(function(error) {
      console.log(error);
    });
};

//转换元
myJsTools.unitConvert = function(num) {
  var moneyUnits = ["元", "万元", "亿元", "万亿"];
  var dividend = 10000;
  var curentNum = num;
  //转换数字
  var curentUnit = moneyUnits[0];
  //转换单位
  for (var i = 0; i < 4; i++) {
    curentUnit = moneyUnits[i];
    if (strNumSize(curentNum) < 5) {
      break;
    }
    curentNum = curentNum / dividend;
  }
  var m = { num: 0, unit: "" };
  m.num = curentNum.toFixed(2);
  m.unit = curentUnit;
  return m.num + m.unit;
};

function strNumSize(tempNum) {
  var stringNum = tempNum.toString();
  var index = stringNum.indexOf(".");
  var newNum = stringNum;
  if (index != -1) {
    newNum = stringNum.substring(0, index);
  }
  return newNum.length;
}

myJsTools.HashMap = function() {
  //定义长度
  var length = 0;
  //创建一个对象
  var obj = new Object();

  /**
   * 判断Map是否为空
   */
  this.isEmpty = function() {
    return length == 0;
  };

  /**
   * 判断对象中是否包含给定Key
   */
  this.containsKey = function(key) {
    return key in obj;
  };

  /**
   * 判断对象中是否包含给定的Value
   */
  this.containsValue = function(value) {
    for (var key in obj) {
      if (obj[key] == value) {
        return true;
      }
    }
    return false;
  };

  /**
   *向map中添加数据
   */
  this.put = function(key, value) {
    if (!this.containsKey(key)) {
      length++;
    }
    obj[key] = value;
  };

  /**
   * 根据给定的Key获得Value
   */
  this.get = function(key) {
    return this.containsKey(key) ? obj[key] : null;
  };

  /**
   * 根据给定的Key删除一个值
   */
  this.remove = function(key) {
    if (this.containsKey(key) && delete obj[key]) {
      length--;
    }
  };

  /**
   * 获得Map中的所有Value
   */
  this.values = function() {
    var _values = new Array();
    for (var key in obj) {
      _values.push(obj[key]);
    }
    return _values;
  };

  /**
   * 获得Map中的所有Key
   */
  this.keySet = function() {
    var _keys = new Array();
    for (var key in obj) {
      _keys.push(key);
    }
    return _keys;
  };

  /**
   * 获得Map的长度
   */
  this.size = function() {
    return length;
  };

  /**
   * 清空Map
   */
  this.clear = function() {
    length = 0;
    obj = new Object();
  };
};

myJsTools.getPromise = function(promise) {

  return new Promise(resolve => {
    var resultList = api.hasPermission({
      list: [promise]
    });
    resultList.map(item => {
      if (!item.granted) {
        if(promise == 'storage'){
          if(apiFun.getStorage('storageInit') != '1') {
            apiFun.setStorage('storageInit', "1")
            myJsTools.reqPermission(promise);
          }
        }else{
          myJsTools.reqPermission(promise);
        }
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};
myJsTools.reqPermission = function(promise) {
  let me = this;
  this.showQxPopup = false;
  let perms = [promise];
  //"camera", "microphone", "storage"
  api.requestPermission(
    {
      list: perms
    },
    function(ret, err) {}
  );
};

export default myJsTools;
