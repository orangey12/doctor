<template>
  <div>
    <van-swipe-cell>
      <!-- 使用 title 插槽来自定义标题 -->
      <div style="display: flex;align-items:center;">
        <span class="custom-title">
          <img v-zlazy="val.patientImg" class="userImg user-head" :onerror="defaultImg" v-if="val.patientId != 'admin'"/>
          <img :src="val.patientImg" class="userImg user-head" :onerror="defaultImg" v-else/>
          <span
            class="brage"
            v-if="parseInt(val.brage) > 0 && getUnreadNum(val) == 0 && val.undisturbedSwitch != '1'"
          >{{ val.brage }}</span
          >
          <span class="brage" v-if="getUnreadNum(val) != 0 && val.undisturbedSwitch != '1'" >{{
            getUnreadNum(val)
          }}</span>
          <span class="brage undisturbedSwitchBrage" v-if="val.undisturbedSwitch == '1' && getUnreadNum(val) != 0"></span>
        </span>
        <span :class="index==0?'cellContent topBorder':'cellContent'" v-if="!val.msgtype">
          <li class="userInfo display-div">
            <u class="userName black-font font-size-md-2 div-overflow">
              <span v-if="val.patientMemo">{{ val.patientMemo }}</span>
              <span v-else>{{ val.patientName }}</span>
              <span>{{ val.sex }}</span>
              <span>{{ val.age }}{{ val.ageUnit }}</span>
            </u>
            <u class="userType">
              <span class="voice-sign" v-if="val.visitTypeCode && val.visitTypeCode == 2">语音</span>
              <span class="tel-sign" v-if="val.visitTypeCode && val.visitTypeCode == 3">电话</span>
              <span class="img-text-sign" v-if="val.visitTypeCode && val.visitTypeCode == 1">图文</span>
              <span class="video-sign" v-if="val.visitTypeCode && val.visitTypeCode == 4">视频</span>
            </u>
          </li>
          <li
            class="content div-overflow font-login-sm black-font"
            v-html="renderTxt(val.content)"
            v-if="val.type == 'text'"
          ></li>
          <li class="content div-overflow font-login-sm black-font" v-html="val.content" v-else></li>
          <li class="endTime font-login-sm font-login-color" v-if="val.receiveTime">
            剩余时间：
            <van-count-down
              :time="val.usedTime"
              format="HH时mm分ss秒"
              v-if="24 * 3600 * 1000 >= val.usedTime > 0"
            />
            <van-count-down
              :time="val.usedTime"
              format="DD天HH时mm分ss秒"
              v-if="val.usedTime > 24 * 3600 * 1000"
            />
          </li>
          <li v-else class="endTime font-login-sm font-login-color">{{ getTime(val.time) }}</li>
        </span>
        <span :class="index==0?'cellContent topBorder':'cellContent'" v-if="val.msgtype">
          <li class="userInfo display-div">
            <u class="userName black-font font-size-md-2 div-overflow">
              <span class="name">{{ val.patientName }}</span>
            </u>
          </li>
          <li
            class="content div-overflow font-login-sm black-font"
            v-html="renderTxt(val.content)"
            v-if="val.type == 'text'"
          ></li>
          <li class="endTime font-login-sm font-login-color">{{ getTime(val.time) }}</li>
        </span>
      </div>
      <template #right>
        <van-button
          @click="setTop"
          square
          :text="val.top?'取消置顶':'置顶'"
          color="#666666"
          id="top"
        /><van-button @click="delChat" square text="删除" color="#FF5050" id="del"/>
      </template>
    </van-swipe-cell>
  </div>
</template>

<script>
  import {Dialog} from "vant";
  import {updateChatOperation} from "../../api/docList";
  import avatar from "@/assets/img/my/default.png";
  import date from "../../utils/date";

  export default {
    props: {
      //val.msgtype 判断是否是系统消息
      val: {
        type: Object,
        default() {
          return {}
        }
      },
      index: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        readStatus: "标为已读",
        defaultImg: 'this.src="' + avatar + '"',
        rightWidth: "",
      };
    },
    mounted() {
      console.log(this.val);
    },
    computed: {
      chatList() {
        let chatList = this.$store.getters.getChatList;
        chatList.map(item => {
          if (item.id == this.val.patientId.toLowerCase() + "," + this.val.docId.toLowerCase()) {
            this.val.top = item.top;
            let list = item.chatRecordList;

            if (list.length > 0) {
              if (this.val.patientId == 'admin') {
                list.sort(function (a, b) {
                  return a.time - b.time; //时间反序
                });
              }
              this.val.type = list[list.length - 1].messType;
              this.val.time = list[list.length - 1].time;
              if (list[list.length - 1].type == "reWithdraw") {
                this.val.content = "对方撤回了一条消息";
              } else if (list[list.length - 1].type == "withdraw") {
                this.val.content = "你撤回了一条消息";
              } else if (list[list.length - 1].type == "defaultMsg") {
                this.val.content = list[list.length - 1].ext.content;
              } else if (list[list.length - 1].type == "jcdsqAgree") {
                this.val.content = list[list.length - 1].content;
              } else {
                if (list[list.length - 1].messType == "voice") {
                  this.val.content = "[语音]";
                } else if (list[list.length - 1].messType == "image") {
                  this.val.content = "[图片]";
                } else if (list[list.length - 1].messType == "text") {
                  this.val.content = list[list.length - 1].content;
                } else if (list[list.length - 1].messType == "video") {
                  this.val.content = "[视频]";
                }
              }
            }
          }
        })
        return this.$store.getters.getChatList;
      }
    },
    methods: {

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
      // 获取未读数
      getUnreadNum() {
        let chatList;
        this.chatList.map(item => {
          if (this.val.patientId.toLowerCase() + "," + this.val.docId.toLowerCase() == item.id) {
            chatList = item;
          }
        })
        let unReadNum = 0;
        if (chatList) {
          chatList.chatRecordList.forEach(msg => {
            if (msg.status == "unread" && msg.type == 'receive') {
              unReadNum++;
            }
          });
        }
        return unReadNum;
      },
      // 置顶
      setTop() {
        let chatList = this.chatList;
        chatList.map((item, index) => {
          if (this.val.patientId.toLowerCase() + "," + this.val.docId.toLowerCase() == item.id) {
            item.top = !item.top;
            if (item.top) {
              chatList.splice(index, 1)
              chatList.unshift(item);
            }
            this.$store.commit("setAllChatList", chatList);
          }
        })
        let item = {
          val: this.val,
          index: this.index,
          show: false,
        }
        this.$emit("updateLoad");
      },
      // 删除
      delChat() {
        let chatList = this.chatList;
        chatList.map((item, index) => {
          if (item.id == this.val.patientId.toLowerCase() + "," + this.val.docId.toLowerCase()) {
            chatList.splice(index, 1);
          }
        })
        this.$store.commit("setAllChatList", chatList);
        this.$emit("updateList")
      },
      // 转换图片表情
      customEmoji(value) {
        return `<img src="https://llootong.cn/cloud/hisImg/static/faces/${value}" style="width:15px;height:15px"/>`;
      },
      // 收到的消息处理之后进行显示，文字和表情
      renderTxt(txt = "") {
        let rnTxt = [];
        let match = null;
        const regex = /(\[.*?\])/g;
        let start = 0;
        let index = 0;
        while ((match = regex.exec(txt))) {
          index = match.index;
          if (index > start) {
            rnTxt.push(txt.substring(start, index));
          }
          if (match[1] in WebIM.Emoji.obj) {
            const v = WebIM.Emoji.obj[match[1]];
            rnTxt.push(this.customEmoji(v));
          } else {
            rnTxt.push(match[1]);
          }
          start = index + match[1].length;
        }
        rnTxt.push(txt.substring(start, txt.length));
        return rnTxt.toString().replace(/,/g, "");
      }
    }
  };
</script>

<style scoped lang="less">
  @import url("../../assets/css/base");

  .custom-title {
    position: relative;

    .userImg {
      margin-top: 5px;
    }

    .brage {
      line-height: 12px;
      border-radius: 50%;
      position: absolute;
      right: 7px;
      top: 0px;
    }

    .undisturbedSwitchBrage{
      width: 3px;
      height: 8px;
      display: block;
      border-radius: 50%;
    }
  }

  .van-cell {
    width: 100%;
  }

  /deep/ .van-cell__title {
    display: flex;
  }

  /deep/ .van-button {
    height: 100%;
    display: inline-block;
  }

  .cellContent {
    width: 80%;
    padding: 10px 0;
    border-bottom: 0.5px solid @back-border;
    display: inline-block;
    li {
      text-align: left;
    }

    .userInfo {
      line-height: 22px;
      .userName {
        width: 70%;
      }
    }
    .content {
      line-height: 18px;
      margin-top: 4px;
      width: 90%;
      display: flex;
    }

    .endTime {
      line-height: 18px;
      display: flex;
      margin-top: 4px;
      /deep/ .van-count-down {
        font-size: @font-size-sm-2;
        color: @font-color-3;
        letter-spacing: 0px;
        line-height: 18px;
      }
    }
  }

  .topBorder{
    border-top: 0.5px solid @back-border;
    padding: 10px 0 ;
  }

  .btns {
    display: flex;

    button {
      height: 100%;
      background: #666666;
      color: #ffffff;
      font-size: 14px;
    }

    :nth-child(2) {
      background: #ff5050;
    }
  }
</style>
