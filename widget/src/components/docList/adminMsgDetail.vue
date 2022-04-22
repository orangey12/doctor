<template>
  <div class="adminMsgDetail">
    <navbar :title="title"></navbar>
    <div class="msgDetail">
      <li>
        <u>{{ title }}</u>
        <u>{{ getTime(time) }}</u>
      </li>
      <div class="content">
        {{ content }}
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "../../common/navbar";
import date from "../../utils/date";
export default {
  name: "adminMsgDetail",
  components: { Navbar },
  data() {
    return {
      id: "admin",
      mid: "",
      content: "",
      title: "",
      time: ""
    };
  },
  created() {
    let query = this.$route.query;
    this.mid = query.mid;
    this.content = query.content;
    this.title = query.title;
    this.time = query.time;
    let list = this.$store.getters.getChatList;
    let arr = list["admin"];
    if (arr) {
      for (let i = 0; i < list["admin"].length; i++) {
        const element = list["admin"][i];
        element.showPress = false;
        if (element.mid == this.mid) {
          element.status = "read";
        }
        this.$store.commit("setAllChatList", list);
      }
    }
  },
  methods: {
    getTime(timestamp) {
      let time = "";
      let times = date.DateDifferenceMsgTime(timestamp);
      if (times.days > 0) {
        time = date.getNowDate();
      } else if (times.hours > 0) {
        time = times.hours + "小时前";
      } else if (times.minutes > 0) {
        time = times.minutes + "分钟前";
      } else {
        time = "刚刚";
      }
      console.log(time);
      return time;
    }
  }
};
</script>

<style scoped lang="less">
.msgDetail {
  padding: 12px 16px;
  background: #fff;
  margin: 12px 16px;
  border-radius: 8px;
  li {
    justify-content: space-between;
    u {
      font-size: 14px;
      line-height: 22px;
    }
    :nth-child(1) {
      color: #333333;
      font-weight: 700;
      width: 70%;
    }
    :nth-child(2) {
      color: #666666;
    }
  }
  .content {
    margin-top: 12px;
    color: #666666;
    font-size: 14px;
    line-height: 18px;
    height: 30vh;
  }
}
</style>
