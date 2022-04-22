<template>
  <div class="followPatientList">
    <navbar title="患者"></navbar>
    <div class="box" ref="box">
      <van-index-bar :index-list="indexList" :sticky="false">
        <div v-for="(item, key, index) in patientList" :key="index">
          <van-index-anchor
            :index="key != '☆' ? key : '☆ 星标用户'"
            style="background:#F5F5F5;"
          ></van-index-anchor>
          <div class="list" v-for="(val, i) in item" :key="i">
            <div class="item" @click="getScaleDetail(val)">
              <img v-zlazy="val.patientImg" class="list_img" />
              <span>{{ val.patientName }}</span>
            </div>
          </div>
        </div>
      </van-index-bar>
    </div>
  </div>
</template>

<script>
import Navbar from "../../common/navbar";
import { getPatientListByFlockId } from "../../api/followUp";
import myJsTools from "../../utils/myJsTools";
import Pinyin from "../../utils/pinYin";
import ossUpDown from "../../utils/ossUpDown";
export default {
  name: "followPatientList",
  components: { Navbar },
  data() {
    return {
      flockId: "",
      patientList: [],
      indexList: []
    };
  },
  created() {
    this.flockId = this.$route.query.flockId;
    this.getPatientList();
  },
  methods: {
    getPatientList() {
      getPatientListByFlockId({
        flockId: this.flockId,
        docId: myJsTools.getItem("token_info").docId
      }).then(async res => {
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
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 16px;
}
.item {
  background: #ffffff;
  display: flex;
  padding: 14px 16px;
  align-items: center;
  position: relative;
  font-size: 14px;
  line-height: 20px;
}
</style>
