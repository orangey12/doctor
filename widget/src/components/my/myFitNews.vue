<template>
  <div class="myFitNews">
    <navbar type="defaultPage" title="新消息通知"></navbar>
    <div class="myFitNews_box">
      <div class="myFitNews_box_item">
        <span>勿扰模式</span>
        <van-switch v-model="newsChecked"/>
      </div>
      <div class="myFitNews_puple" v-if="newsChecked==true">
        <div class="myFitNews_box_item">
          <span>开始时间</span>
          <span @click="getStartTime">{{ news.startValue }}</span>
        </div>
        <div class="myFitNews_box_item">
          <span>结束时间</span>
          <span @click="getEndTime">{{ news.endValue }}</span>
        </div>
      </div>
    </div>
    <div class="bottomBtn" @click="saveNewsInfo">
      <button class="publicBtn">保存</button>
    </div>

    <van-popup v-model="isStart" position="bottom">
      <van-datetime-picker
        v-model="startTime"
        type="time"
        title="选择时间"
        @confirm='confirmS'
        @cancel='cancel'
      />
    </van-popup>
    <van-popup v-model="isEnd" position="bottom">
      <van-datetime-picker
        v-model="endTime"
        type="time"
        title="选择时间"
        @confirm='confirmE'
        @cancel='cancel'
      />
    </van-popup>
  </div>
</template>
<script>
import $api from "@/utils/api.js";
import navbar from "@/common/navbar";
import {
  findDoctorByID
} from "@/api/my";
import {getNewMessageSetUpInfo, updateNewMessageSetUpInfo} from "../../api/my";
import myJsTools from "../../utils/myJsTools";

export default {
  name: "myFitNews",
  components: {navbar},
  data() {
    return {
      //消息通知开关
      newsChecked: false,
      isStart: false,
      isEnd: false,
      startTime: '',
      endTime: '',
      docId: "",
      //新消息通知
      news: {
        startValue: '08:00',
        endValue: '11:00'
      },

    }
  },
  mounted() {
    this.docId = myJsTools.getItem("token_info").docId;
    this.getNewsInfo();
  },
  methods: {
    //开始时间(展开时间选择器)
    getStartTime() {
      this.isStart = true
    },
    //结束时间(展开时间选择器)
    getEndTime() {
      this.isEnd = true
    },
    //点击确认(开始)
    confirmS(e) {
      this.news.startValue = this.startTime
      this.isStart = false
    },
    //点击确认(结束)
    confirmE() {
      this.news.endValue = this.endTime
      this.isEnd = false
    },
    //点击取消
    cancel() {
      this.isEnd = false
      this.isStart = false
    },
    getNewsInfo() {
      getNewMessageSetUpInfo({
        docId: this.docId
      }).then(res => {
        console.log(res)
        let data = res.data;
        this.newsChecked = data.newMessageInform == '0' ? true : false;
        if (data.newMessageInform == '0') {
          this.news = {
            startValue: data.newMessageFreetimeBegin.substr(0, 5),
            endValue: data.newMessageFreetimeEnd.substr(0, 5),
          }
        }
      })
    },
    //保存新消息设置
    saveNewsInfo() {
      let param = {
        docId: this.docId,
        newMessageInform: this.newsChecked ? '0' : '1',
      }
      if (this.newsChecked) {
        param.newMessageFreetimeBegin = this.news.startValue + ":00";
        param.newMessageFreetimeEnd = this.news.endValue + ":00";
      }
      updateNewMessageSetUpInfo(param).then(res => {
        console.log(res);
        this.$router.go(-1);
      })
    },
  }
}
</script>
<style scoped lang="less">


.myFitNews_box {
  width: 96%;
  background: @white;
  padding-left: 4%;

  &_item {
    display: flex;
    align-items: center;
    padding: 12px 4% 12px 0;
    border-bottom: 1px solid @back-border;
    justify-content: space-between;

    span {
      .black-font;
      .font-size-md;
      line-height: 22px;
    }
  }
}

.myFitNews_set {
  width: 92%;
  padding: 12px 4%;
  background: @white;
  margin-top: 12px;

  p {
    .black-font;
    .font-size-md;
    line-height: 22px;
    margin-bottom: 3px;
  }

  span {
    display: block;
    font-size: 12px;
    .font-color-2;
    .font-size-sm;
    line-height: 22px;
  }
}
</style>
