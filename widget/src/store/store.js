import Vue from "vue";
import Vuex from "vuex";
import myJsTools from "../utils/myJsTools";

Vue.use(Vuex);

function writrFile(dataVal) {
  if (process.env.NODE_ENV != "development") {
    api.writeFile(
      {
        path: "cache://chatList.json",
        data: JSON.stringify(dataVal)
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
}

let store = new Vuex.Store({
  state: {
    chatList: [],
    medicineList: [],
    herbList: [],
    foodList: [],
    groupsList: [],
    showLoading: false,
    historyUrl: "",
    keep_alive: [],
    groupsInfo: {},
    fsendgroupsList: [],
    searchHistory: [],
    topicList: [],
    checkList: [],
    lisList: [],
    herbArr: [],
    docShStatus: -1,
    themeColor: "#FF5050",
    cfList: [],
    forceUpdateobj: {
      popup: false,
      iosUrl: "",
      android: ""
    }
  },
  getters: {
    getChatList(state) {
      return state.chatList;
    },
    getOneChatList: state => {
      return chatId => state.chatList.find(item => item.id == chatId);
    },
    getMedicineList(state) {
      return state.medicineList;
    },
    getHerbList(state) {
      return state.herbList;
    },
    getShowLoading(state) {
      return state.showLoading;
    },
    getForceupdate(state) {
      return state.forceUpdateobj;
    },
    getHistoryUrl(state) {
      return state.historyUrl;
    },
    getKeepAlive(state) {
      return state.keep_alive;
    },
    getGroupsList(state) {
      return state.groupsList;
    },
    getFsendGroupsList(state) {
      return state.fsendgroupsList;
    },
    getGroupsInfo(state) {
      return state.groupsInfo;
    },
    getSearchHistory(state) {
      return state.searchHistory;
    },
    getTopicList(state) {
      return state.topicList;
    },
    getCheckList(state) {
      return state.checkList;
    },
    getLisList(state) {
      return state.lisList;
    },
    getHerbArr(state) {
      return state.herbArr;
    },
    getDocShStatus(state) {
      return state.docShStatus;
    },
    getThemeColor(state) {
      return state.themeColor;
    },
    getCfList(state) {
      return state.cfList;
    },
    getFoodList(state) {
      return state.foodList;
    }
  },
  mutations: {
    setCfList(state, value) {
      state.cfList.push(value);
    },
    setAllCfList(state, value) {
      state.cfList = value;
    },
    editCf(state, value) {
      state.cfList.splice(value.cfIndex, 1, value.cf);
    },
    switchCf(state, value) {
      let list = state.cfList[value.cfIndex];
      list.type = value.type;
      list.name = value.name;
      state.cfList.splice(value.cfIndex, 1, list);
    },
    setDrugOne(state, value) {
      console.log(value);
      if (value.type == "edit") {
        state.cfList[value.cfIndex].drugList.splice(
          value.index,
          1,
          value.drugVal
        );
      } else {
        state.cfList[value.cfIndex].drugList.push(value.drugVal);
      }
    },
    deleteDrug(state, value) {
      state.cfList[value.cfIndex].drugList.splice(value.index, 1);
    },
    deleteCf(state, value) {
      if (value == 0 && state.cfList.length == 1) {
        console.log("处方删除");
        state.cfList[value].drugList.splice(
          0,
          state.cfList[value].drugList.length
        );
      } else {
        console.log("处方删除33", value);
        state.cfList.splice(value, 1);
      }
    },
    setThemeColor(state, value) {
      state.themeColor = value;
    },
    setTopicList(state, value) {
      state.topicList.push(value);
    },
    setTopicListOne(state, value) {
      state.topicList[value.index] = value.item;
      state.topicList = Object.assign([], state.topicList);
    },
    setAllTopic(state, value) {
      state.topicList = Object.assign([], value);
    },
    setsearchHistory(state, payload) {
      state.searchHistory.unshift(payload);
    },
    clearAllHistory(state, payload) {
      state.searchHistory = [];
    },
    setEmptyList(state, value) {
      let id = value.patientId.toLowerCase() + "," + value.docId.toLowerCase();
      let arr = [];
      if (state.chatList.length > 0) {
        state.chatList.map(item => {
          arr.push(item.id);
        });
      }

      if (arr.indexOf(id) == -1 || state.chatList.length == 0) {
        state.chatList.push({
          id: id,
          chatRecordList: [],
          top: false
        });
      }

      console.log(JSON.stringify(id) + "setEmptyList =============");
      console.log(
        JSON.stringify(arr.indexOf(id)) + "setEmptyList ============="
      );
      // console.log(JSON.stringify(state.chatList) + "--------list");
      api.sendEvent({
        name: "jzPatient"
      });
      state.chatList = Object.assign([], state.chatList);
      writrFile(state.chatList);
    },
    setChatList(state, payload) {
      let status = "sending";
      console.log(JSON.stringify(payload) + "--------payload");
      if (payload.type == "receive") {
        if (AppVue.$route.query && AppVue.$route.query.id) {
          var id = AppVue.$route.query.id
            ? AppVue.$route.query.id.toLowerCase()
            : "";

          console.log(id + "-----------" + payload.ext.patientId.toLowerCase());
          if (id == payload.ext.patientId.toLowerCase()) {
            status = "read";
          }
        } else {
          status = payload.status;
        }
        if (payload.from != "admin") {
          var id =
            payload.ext.patientId.toLowerCase() +
            "," +
            payload.to.toLowerCase(); //患者id加医生id
        } else {
          var id = payload.from.toLowerCase() + "," + payload.to.toLowerCase(); //患者id加医生id
        }
      }else if(payload.type == 'jcdsqAgree'){
        var id = payload.ext.patientId.toLowerCase() + "," + payload.to.toLowerCase(); //患者id加医生id
      } else {
        var id =
          payload.ext.patientId.toLowerCase() +
          "," +
          payload.from.toLowerCase();
        if (!status) {
          status = "sending";
        }
      }
      if (!payload.status) {
        payload.status = status;
      }
      //如果是第一次发消息 则直接存储
      let idList = [];
      state.chatList.map(item => {
        idList.push(item.id);
      });
      if (idList.length == 0) {
        state.chatList.push({
          chatRecordList: [payload],
          id: id,
          time: payload.time
        });
        api.sendEvent({
          name: "jzPatient"
        });
      } else {
        if (idList.indexOf(id) == -1) {
          state.chatList.push({
            chatRecordList: [payload],
            id: id,
            time: payload.time
          });
        } else {
          let index = idList.indexOf(id);
          state.chatList[index].chatRecordList.push(payload);
          state.chatList[index].time = payload.time;
        }
      }
      state.chatList = Object.assign([], state.chatList);
      writrFile(state.chatList);
    },
    updateMessageStatus(state, message) {
      let name;
      if (
        AppVue.$route.query.id &&
        message.toId == AppVue.$route.query.id.toLowerCase()
      ) {
        name =
          AppVue.$route.query.id.toLowerCase() +
          "," +
          message.from.toLowerCase();
      } else if (message.toId) {
        name = message.toId.toLowerCase() + "," + message.from.toLowerCase();
      }
      let id = message.id || message.mid;
      console.log(id + "--------------id-------" + name);
      state.chatList.map((item, index) => {
        if (name == item.id) {
          let list = item.chatRecordList;
          list.map((el, elIndex) => {
            if (el.mid == id) {
              if (el.status != "recall") {
                el.status = message.status;
                el.mid = message.mid;
                el.conversationId = message.conversationId;
                if (message.content) {
                  el.content = message.content;
                }
              }
            }
          });
        }
      });
      state.chatList = Object.assign([], state.chatList);
      writrFile(state.chatList);
    },
    updateCardStatus(state, message) {
      let name = message.chatId;
      state.chatList.map((item, index) => {
        if (name == item.id) {
          let list = item.chatRecordList;
          list.map((el, elIndex) => {
            if (el.mid == message.mid) {
              el = message;
            }
          });
        }
      });
      state.chatList = Object.assign([], state.chatList);
      writrFile(state.chatList);
    },

    setIndexChatList(state, value) {
      state.chatList.map((item, index) => {
        if (value.chatId == item.id) {
          let list = item.chatRecordList;
          list.map((el, elIndex) => {
            if (elIndex == value.index) {
              el = value.item;
            }
          });
        }
      });
      state.chatList = Object.assign([], state.chatList);
      writrFile(state.chatList);
    },
    setOneChatList(state, value) {
      let list;
      if (JSON.stringify(this.state.chatList).indexOf(value.chatId) == -1) {
      } else {
        if (state.chatList.length == 0) {
          state.chatList.push({
            id: value.chatId,
            chatRecordList: value.chatRecordList
          });
        } else {
          state.chatList.map((item, index) => {
            if (value.chatId == item.id) {
              list = item.chatRecordList;
              if (list[0].time >= value.chatRecordList[0].time) {
                item.chatRecordList = value.chatRecordList;
              } else {
                let s = false;
                let m = item.chatRecordList.length - 1;
                for (; m >= 0; m--) {
                  let el = list[m];
                  let val = value.chatRecordList[0];
                  if (val.time > el.time) {
                    let arr = list.slice(0, m + 1);
                    arr = arr.concat(value.chatRecordList);
                    item.chatRecordList = arr;
                    break;
                  }
                }
              }
            }
          });
        }
      }
      state.chatList = Object.assign([], state.chatList);
      writrFile(state.chatList);
    },
    setItemChatList(state, value) {
      state.chatList[value.id] = value.item;
      state.chatList = Object.assign([], state.chatList);
      writrFile(state.chatList);
    },
    setAllChatList(state, value) {
      state.chatList = Object.assign([], value);
      writrFile(state.chatList);
    },
    setMedicineList(state, value) {
      state.medicineList = value;
    },
    setHerbList(state, value) {
      state.herbList = value;
    },
    setFoodList(state, value) {
      state.foodList = value;
    },
    setHerbArr(state, value) {
      state.herbArr = value;
    },
    setShowLoading(state, value) {
      state.showLoading = value;
    },
    setForceupdate(state, value) {
      state.forceUpdateobj = value;
    },
    setHistoryUrl(state, value) {
      state.historyUrl = value;
    },
    setGroupsList(state, value) {
      state.groupsList = value;
    },
    setGroupList(state, value) {
      state.fsendgroupsList = value;
    },
    setGroupsInfo(state, value) {
      state.groupsInfo = value;
    },
    setDocShStatus(state, value) {
      console.log("sssss------------审核状态" + state.docShStatus);
      state.docShStatus = value;
    },
    setCheckList(state, value) {
      let list = state.checkList;
      list.push(value);
      state.checkList = Object.assign([], list);
      console.log(state.checkList, "state.checkList");
    },
    setAllCheckList(state, value) {
      state.checkList = Object.assign([], value);
    },
    setLisList(state, value) {
      let list = state.lisList;
      list.push(value);
      state.lisList = Object.assign([], list);
      console.log(state.lisList, "state.lisList");
    },
    setAllLisList(state, value) {
      state.lisList = Object.assign([], value);
    },
    UPDATE_KEEP_ALIVE(state, payload) {
      //当payload.type不为空则代表清除指定缓存组件，否则添加指定组件
      if (payload.type) {
        let index = state.keep_alive.indexOf(payload.keepAlive);
        if (index !== -1) {
          state.keep_alive.splice(index, 1); //删除数组的缓存的组件
        }
      } else {
        let index = state.keep_alive.indexOf(payload.keepAlive);
        if (index === -1) {
          state.keep_alive.push(payload.keepAlive); //添加需要缓存的组件
        }
      }
    }
  }
});

export default store;
