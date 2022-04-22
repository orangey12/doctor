<template>
  <div class="adminList">
    <navbar title="系统消息"></navbar>
    <div class="msgList">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text=""
          @load="onLoad"
        >
          <div
            v-for="(item, index) in chatList"
            class="message"
            :key="index"
            @click="openAdminMsgDetail(item)"
          >
            <div style="position: relative">
              <img :src="logoSrc" class="adminIcon" />
              <div
                class="brage"
                v-if="item.status && item.status == 'unread'"
              ></div>
            </div>
            <div class="msgBody">
              <li class="title">{{ item.title }}</li>
              <li class="content">{{ item.content }}</li>
              <li class="time">{{ getTime(item.time) }}</li>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import Navbar from "../../common/navbar";
import date from "../../utils/date";
import myJsTools from "../../utils/myJsTools";
import {
  getPreBussIsRepurchaseWaitConfirm,
  getPrescriptionCardInfo
} from "../../api/cf";

export default {
  name: "adminList",
  components: { Navbar },
  data() {
    return {
      list: [],
      loading: false,
      finished: true,
      refreshing: false,
      historyList: [],
      chatId: "",
      logoSrc: ""
    };
  },
  computed: {
    chatList() {
      let chatList = this.$store.getters.getChatList;
      let list = [];
      chatList.map(item => {
        if (item.id == this.chatId) {
          list = item.chatRecordList;
        }
      });
      list.sort(function(a, b) {
        return b.time - a.time; //时间反序
      });
      this.onRefresh();
      return list;
    }
  },
  created() {
    this.chatId =
      "admin," + myJsTools.getItem("token_info").docId.toLowerCase();
    this.addEvent();
    this.logoSrc = myJsTools.getItem("patientImg");
  },
  methods: {
    addEvent() {
      let me = this;
      api.addEventListener(
        {
          name: "adminReceive"
        },
        function(ret, err) {
          me.list.unshift(ret.value.body);
        }
      );
    },
    getTime(timestamp) {
      let time = "";
      let times = date.DateDifferenceMsgTime(timestamp);
      if (times.days > 0) {
        time = date.getNowDate(timestamp);
      } else if (times.hours > 0) {
        time = times.hours + "小时前";
      } else if (times.minutes > 0) {
        time = times.minutes + "分钟前";
      } else {
        time = "刚刚";
      }
      console.log(time);
      return time;
    },
    //  打开通告详情
    openAdminMsgDetail(item) {
      let chatList = this.$store.getters.getChatList;
      chatList.map(itemEl => {
        if (itemEl.id == this.chatId) {
          itemEl.chatRecordList.map(element => {
            if (item.mid == element.mid) {
              if (element.type == "receive") {
                if (element.status != "read") {
                  element.status = "read";
                }
              }
            }
          });
        }
      });
      this.$store.commit("setAllChatList", chatList);
      if (item.ext.type == "YS_WZ_HZGH" || item.ext.type == "YS_WZ_HZYYGH") {
        let sponName = item.ext.sponsorDocName;
        if (sponName && sponName != "null") {
          sponName = item.ext.sponsorDocName;
        } else {
          sponName = "";
        }
        this.$router.push({
          name: "appYy",
          query: {
            type: "1",
            regId: item.ext.regId,
            sponsorDocName: sponName
          }
        });
      } else if (item.ext.type == "YS_WZ_SF") {
        this.getCfDetailSh(item);
      } else if (item.ext.type == "FUGOU") {
        this.getFgCfStatus(item);
      } else if (item.ext.type == "YS_XT_QF") {
        this.$router.push({
          name: "fsendLook",
          query: {
            sendId: item.ext.sendId,
            type: "look", //只查看
            pageType: "admin"
          }
        });
      } else if (item.ext.type == "YS_WZ_CFZF") {
        this.$router.push({
          name: "payPre",
          query: {
            businessId: item.ext.businessId
          }
        });
      } else if (
        item.ext.type == "YS_XT_YSZCSH" &&
        this.$store.getters.getDocShStatus == "1"
      ) {
        this.$router.push({
          name: "authentication",
          query: {
            pageType: "edit"
          }
        });
      }
    },
    getFgCfStatus(item) {
      getPreBussIsRepurchaseWaitConfirm({
        businessId: item.ext.businessId
      }).then(res => {
        let status;
        if (res.data.isRepurchaseWaitConfirm == "1") {
          status = 1;
        } else {
          status = 2;
        }
        this.$router.push({
          name: "prescription",
          query: {
            type: "prePool",
            status: status,
            businessId: item.ext.businessId,
            goPage: -1,
            patientId: item.ext.pId
          }
        });
      });
    },
    getCfDetailSh(item) {
      let title;
      getPrescriptionCardInfo({
        businessCode: item.ext.businessCode
      }).then(res => {
        item.ext.ysStstus = res.data.ysStstus;
        item.ext.diagName = res.data.diagName;
        item.ext.businessId = res.data.businessId;
        item.ext.payStatus = res.data.payStatus;
        if (item.ext.ysStstus == "0") {
          this.$router.push({
            name: "waitPassPerSetail",
            query: {
              businessId: item.ext.businessId,
              title: "待审方"
            }
          });
        } else if (item.ext.ysStstus == "1") {
          if (item.ext.payStatus == "1") {
            this.$router.push({
              name: "payPre",
              query: {
                businessId: item.ext.businessId
              }
            });
          } else {
            this.$router.push({
              name: "waitPay",
              query: {
                businessId: item.ext.businessId
              }
            });
          }
        } else if (item.ext.ysStstus == "2") {
          this.$router.push({
            name: "prescDetail",
            query: {
              businessId: item.ext.businessId
            }
          });
        }
      });
    },

    onLoad() {
      let me = this;
      setTimeout(() => {
        if (me.refreshing) {
          me.list = me.historyList = [];
          me.refreshing = false;
        }
        me.loading = false;
        if (me.chatList) {
          if (me.historyList.length == 0) {
            for (let i = 0; i < 10; i++) {
              if (me.chatList[me.historyList.length]) {
                me.list.push(me.chatList[me.historyList.length]);
                me.historyList.push(me.chatList[me.historyList.length]);
              }
            }
          } else {
            for (let i = 0; i < 10; i++) {
              if (me.chatList[me.historyList.length]) {
                me.list.push(me.chatList[me.historyList.length - 1]);
                me.historyList.push(me.chatList[me.historyList.length - 1]);
              }
            }
          }
        } else {
          me.finished = true;
        }
        console.log(JSON.stringify(me.list) + "wwwwwwwwwww");
        if (me.historyList.length >= me.chatList.length) {
          me.finished = true;
        }
      }, 300);
    },
    onRefresh() {
      // 清空列表数据
      this.finished = false;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.onLoad();
    }
  }
};
</script>

<style scoped lang="less">
.msgList {
  margin: 12px 16px;

  .message {
    display: flex;
    background: #fff;
    padding: 9px 16px;
    border-radius: 4px;
    margin-bottom: 12px;

    img {
      width: 52px;
      height: 52px;
      margin: 16px;
    }

    .msgBody {
      color: #333333;
      width: 80%;

      .title {
        margin: 9px 0 4px 0;
        font-weight: 700;
        font-size: 15px;
        line-height: 21px;
      }

      .content {
        font-size: 13px;
        line-height: 18px;
        margin-bottom: 5px;
        width: 80%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .time {
        color: #999999;
        font-size: 13px;
        line-height: 18px;
      }
    }
  }

  .brage {
    position: absolute;
    right: 16px;
    top: 16px;
    z-index: 999;
    width: 12px;
    height: 13px;
    border-radius: 50%;
    background: #ff5050;
  }
}
</style>
