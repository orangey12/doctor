<template>
  <div class="patientList">
    <van-dropdown-menu v-if="sendId">
      <van-dropdown-item
        v-model="value1"
        :options="option1"
        @change="getPatientList"
      />
    </van-dropdown-menu>
    <div class="box" ref="box">
      <van-index-bar :index-list="indexList" :sticky="false">
        <div v-for="(item, key, index) in patientList" :key="index">
          <van-index-anchor
            :index="key != '☆' ? key : '☆ 星标用户'"
            style="background:#F5F5F5;"
          ></van-index-anchor>
          <div class="list" v-for="(val, i) in item" :key="i">
            <div class="item" @click="getScaleDetail(val)">
              <img v-zlazy="val.patientImg" class="list_img img-width-height-spe" />
              <span>{{ val.patientName }}</span>
              <span v-if="val.isFeedback == '0'" class="notFeed font-login-color-red">未反馈</span>
              <span v-if="val.isFeedback == '1'" class="hasFeed font-login-color-blue">已反馈</span>
            </div>
          </div>
        </div>
      </van-index-bar>
    </div>
  </div>
</template>

<script>
import { getSendPatientByDidOnlyId, getSendPatientList } from "../../api/scale";
import ossUpDown from "../../utils/ossUpDown";
import Pinyin from "../../utils/pinYin";
import myJsTools from "../../utils/myJsTools";

export default {
  name: "patientList",
  props: {
    sendId: String,
    didOnlyId: String
  },
  data() {
    return {
      value1: "",
      option1: [
        { text: "全部", value: "" },
        { text: "已反馈", value: "1" },
        { text: "未反馈", value: "0" }
      ],
      indexList: [],
      patientList: []
    };
  },
  created() {
    if (this.didOnlyId) {
      this.getSendPatient();
    } else {
      this.getPatientList();
    }
  },
  methods: {
    getScaleDetail(item) {
      if (this.sendId) {
        this.$router.push({
          name: "patientScale",
          query: {
            isFeedback: item.isFeedback,
            sendId: item.sendId,
            patientId: item.patientId
          }
        });
      } else {
        this.$router.push({
          name: "patientScaleList",
          query: {
            didOnlyId: this.didOnlyId,
            patientId: item.patientId
          }
        });
      }
    },
    getSendPatient() {
      getSendPatientByDidOnlyId({
        didOnlyId: this.didOnlyId
      }).then(async res => {
        console.log(res);
        let arrList = res.data;
        let arr = myJsTools.data_letter_sort(arrList, "py");
        this.patientList = arr;
        this.indexList = Object.keys(this.patientList);
      });
    },
    getPatientList() {
      getSendPatientList({
        sendId: this.sendId,
        isFeedback: this.value1
      }).then(async res => {
        console.log(res);
        let arrList = res.data;
        let arr = myJsTools.data_letter_sort(arrList, "py");
        this.patientList = arr;
        this.indexList = Object.keys(this.patientList);
      });
    },
  }
};
</script>

<style scoped lang="less">

.list_img {
  margin-right: 16px;
}
.item {
  background: @white;
  display: flex;
  padding: 14px 16px;
  align-items: center;
  position: relative;
  .black-font;
  line-height: 20px;
  .hasFeed,
  .notFeed {
    position: absolute;
    top: 21px;
    right: 36px;
  }
}
</style>
