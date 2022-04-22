<template>
  <div class="card">
    <div v-if="list.length > 0">
      <div
        class="cardList"
        @click="openAddYy(item)"
        v-for="(item, index) in list"
        :key="index"
      >
        <span v-if="item.queueNumber" class="queueNumber">{{item.queueNumber}}</span>
        <img v-zlazy="item.patientImg" class="userImg" />
        <div class="userInfoCard">
          <li class="userInfo">
            <u class="info">
              <span class="name">{{ item.patientName }}</span>
              <span class="sex">{{ item.sex }}</span>
              <span class="age">{{ item.age }}{{ item.ageUnit }}</span>
            </u>
            <u>
              <span v-if="item.is_subsequent == 0">咨询</span>
              <span v-if="item.is_subsequent == 1">复诊</span>
              <span class="voice-sign" v-if="item.visitTypeCode == 2">{{
                item.visitTypeName
              }}</span>
              <span class="tel-sign" v-if="item.visitTypeCode == 3">{{
                item.visitTypeName
              }}</span>
              <span class="img-text-sign" v-if="item.visitTypeCode == 1">{{
                item.visitTypeName
              }}</span>
              <span class="video-sign" v-if="item.visitTypeCode == 4">{{
                item.visitTypeName
              }}</span>
            </u>
          </li>
          <li class="chatContent">{{ item.recordsTitle }}</li>
          <li class="time" v-if="type == 1 || type == 4">
            问诊时间：{{ item.inquiringTime }}
          </li>
          <li class="time" v-if="type == 0">
            预约时间：{{ item.inquiringTime }}
          </li>
          <li class="time" v-if="type == 2">
            剩余时间：
            <span v-if="resetDataFun(item.receiveTime, item.presentTime) > 0">
              <van-count-down
                :time="resetDataFun(item.receiveTime, item.presentTime)"
                format="HH 时 mm 分 ss 秒"
                v-if="
                  24 * 3600 * 1000 >
                    resetDataFun(item.receiveTime, item.presentTime)
                "
              />
              <van-count-down
                :time="resetDataFun(item.receiveTime, item.presentTime)"
                format="DD 天 HH 时 mm 分 ss 秒"
                v-if="
                  resetDataFun(item.receiveTime, item.presentTime) >
                    24 * 3600 * 1000
                "
              />
            </span>
            <span v-else>问诊结束</span>
          </li>
        </div>
      </div>
    </div>
    <div class="emytyDiv" v-else>
      <img src="../../assets/img/index/yyEmpty.png" class="emptyIcon" />
      <li v-if="type == '0'">暂时没有已预约的患者</li>
      <li v-if="type == '1'">
        <div>暂时没有待接诊的患者</div>
      </li>
      <li v-if="type == '2'">暂时没有接诊中的患者</li>
      <li v-if="type == '3'">
        <div>暂时没有已结束的患者</div>
      </li>
    </div>
  </div>
</template>

<script>
import myJstools from "@/utils/myJsTools";
import date from "@/utils/date";
import avatar from "@/assets/img/my/default.png";
export default {
  props: ["list", "type"],
  data() {
    return {
      defaultImg: 'this.src="' + avatar + '"'
    };
  },
  methods: {
    // 重置数据
    resetDataFun(inquiringTime, presentTime) {
      var time = date.DateDifference(inquiringTime.replace(/-/g,"/"), presentTime.replace(/-/g,"/"));
      return time.usedTime;
    },
    openAddYy(item) {
      var  appointment;
      if (item.appointDate) {
        appointment =
          item.appointDate.split(" ")[0] +
          " " +
          item.appointStartTime.split(" ")[1] +
          "--" +
          item.appointEndTime.split(" ")[1];
      } else {
        appointment = item.inquiringTime;
      }
      item.type = this.type;
      myJstools.setItem("patientInfo", item);
      if (this.type == 2) {
        this.$router.push({
          name: "chatIndex",
          query: {
            name: item.patientName,
            id: item.patientId
          }
        });
      } else {
        this.$router.push({
          name: "appYy",
          query: {
            type: this.type,
            regId: item.regId
          }
        });
      }
    }
  }
};
</script>

<style scoped lang="less">

.card {
  padding: 0 16px;

  .cardList {
    position: relative;
    background: @white;
    border-radius: 8px;
    margin-top: 8px;
    padding: 12px;
    display: flex;
    .userImg {
      .img-width-height-lg;
      margin-right: 14px;
    }
    .userInfoCard {
      width: 100%;
      .userInfo {
        .display-div;
        line-height: 21px;
        .black-font;
        .info {
          width: 70%;
          span {
            margin-right: 10px;
            .font-size-md-2;
          }
        }
      }
      .chatContent {
        .font-login-color;
        .font-login-sm;
        margin-top: 5px;
        line-height: 18px;
      }
    }
  }
}
.time {
  .font-login-color;
  .font-login-sm;
  margin-top: 5px;
  line-height: 18px;
  display: flex;
  /deep/.van-count-down {
    .font-login-color;
    .font-login-sm;
    letter-spacing: -1px;
    line-height: 18px;
  }
}

.queueNumber{
  background: @red;
  color: #FFFFFF;
  position: absolute;
  left: 0;
  top: 8px;
  border-radius: 0 20px 20px 0;
  padding: 2px 6px;
  font-size: 12px;
}

.emytyDiv {
  text-align: center;
  margin-top: 78px;
  li {
    line-height: 20px;
    margin-top: 20px;
    .font-size-md;
    .font-login-color;
  }
}
</style>
