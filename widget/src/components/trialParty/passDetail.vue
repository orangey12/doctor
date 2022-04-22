<template>
  <div class="thisPrescription">
    <div class="preListBody" v-if="info">
      <div class="sfInfo">
        <van-row>
          <van-col class="font-blod-3" span="12">药师审核已通过</van-col>
          <van-col
            span="12"
            v-if="checkType == 1"
            style="text-align: right;"
            class="font-login-color-blue"
          >一次审方通过</van-col>
          <van-col
            span="12"
            v-if="checkType == 2"
            style="text-align: right;"
            class="font-color-orange"
          >医生修改处方通过</van-col>
          <van-col span="12" v-if="checkType == 3" style="text-align: right;" class="font-login-color-red">医生双签通过</van-col>
        </van-row>
        <van-row>
          <van-col span="12">{{info.checkTime}}</van-col>
          <van-col span="12" style="text-align: right">药师：{{this.userName}}</van-col>
        </van-row>
      </div>
      <div class="patientCondition">
        <van-row>
          <van-col span="6">医生</van-col>
          <van-col span="18">{{info.docName}}</van-col>
        </van-row>
        <van-row>
          <van-col span="6">科室</van-col>
          <van-col span="18">{{info.deptName}}</van-col>
        </van-row>
        <van-row>
          <van-col span="6">处方诊断</van-col>
          <van-col span="18">{{info.diagName}}</van-col>
        </van-row>
        <van-row>
          <van-col span="6">提交时间</van-col>
          <van-col span="18">{{info.addTime}}</van-col>
        </van-row>
      </div>
      <cf-list :info="info.checkPreMVOs"></cf-list>
    </div>
  </div>
</template>

<script>
import navbar from "@/common/navbar";
import { getPrescriptionInfoById } from "@/api/cf";
import myJsTools from "../../utils/myJsTools";
import CfList from "../childCompon/cfList";
export default {
  data() {
    return {
      cfList: [],
      show: false,
      info: {
        proBusinessInfo: {
          docName: "",
          deptName: "",
          addTime: "",
        }
      }
    };
  },
  props:{
    addTime:{
      type:String
    },
    checkType:{
      default:-1,
      type:Number
    },
    businessId:{
      type:String
    },
  },
  created() {
    this.getPassList();
    this.userName = myJsTools.getItem("token_info").docName;
  },
  mounted() {},
  methods: {
    // 获取已通过处方详情
    getPassList() {
      getPrescriptionInfoById({
        businessId: this.businessId
      }).then(res => {
        console.log("详情", res);
        this.info = res.data;
      });
    }
  },
  components: {
    CfList,
    navbar
  }
};
</script>

<style scoped lang="less">

.preListBody {
  padding: 0 16px;
  .black-font;
  .patientCondition{
    margin-top: 12px;
    background: @white;
    .font-size-md;
    padding: 12px;
    border-radius: 1px;
  }

  .patientCondition {
    .van-row:nth-child(1) {
      margin-top: 0;
    }
    .van-row {
      margin-top: 12px;
    }
  }
}
.sfInfo {
  background: @white;
  padding: 12px 16px 12px 12px;
  font-size: 14px;
  margin-top: 20px;
  .van-row:first-child {
    margin-bottom: 10px;
  }
}
</style>
