<template>
  <div class="thisPrescription">
    <navbar title="审核未通过详情"></navbar>
    <div class="preListBody">
      <div class="sfInfo">
        <li class="status">药师审核未通过</li>
        <van-row>
          <van-col span="12">{{ info.checkTime }}</van-col>
          <van-col span="12" style="text-align: right">药师：{{ info.checkUserName }}</van-col>
        </van-row>
        <div class="notPassDiv" v-for="(item,index) in info.notPassReasons" :key="index">
          <li class="title">不通过理由</li>
          <div class="reasonDiv">
            <li>类型：{{ item.duptName }}</li>
            <li v-if="item.checkMemo">备注：{{ item.checkMemo }}</li>
            <li v-if="item.itemName">药品：{{ item.itemName }}</li>
          </div>
        </div>
      </div>
      <div class="patientCondition">
        <van-row>
          <van-col span="6">医生</van-col>
          <van-col span="18">{{ info.docName }}</van-col>
        </van-row>
        <van-row>
          <van-col span="6">科室</van-col>
          <van-col span="18">{{ info.deptName }}</van-col>
        </van-row>
        <van-row>
          <van-col span="6">处方诊断</van-col>
          <van-col span="18">{{ info.diagName }}</van-col>
        </van-row>
        <van-row>
          <van-col span="6">提交时间</van-col>
          <van-col span="18">{{ info.addTime }}</van-col>
        </van-row>
      </div>
      <cf-list :info="info.checkPreMVOs"></cf-list>
      <div class="bottomBtn">
        <button class="publicBtn" @click="openEdit">修改为通过</button>
      </div>
    </div>
  </div>
</template>

<script>
import navbar from "@/common/navbar";
import {Toast} from "vant";
import {
  getNotPassCheckPrescriptionInfo,
  updateCheckPrePass
} from "@/api/judge";
import CfList from "../childCompon/cfList";

export default {
  data() {
    return {
      cfList: [],
      show: false,
      info: [],
    };
  },
  props: {
    businessId: {
      type: String
    }
  },
  created() {
    this.getNoPassList();
  },
  mounted() {
  },
  methods: {
    // 获取未通过处方详情
    getNoPassList() {
      getNotPassCheckPrescriptionInfo({
        businessId: this.businessId
      }).then(res => {
        console.log("详情", res);
        this.info = res.data;
      });
    },
    openEdit() {
      Toast.loading({
        message: '加载中...',
        forbidClick: true,
        closeOnClick: false,
        duration: 0
      });
      updateCheckPrePass({
        businessId: this.businessId,
        checkStatus: 1,
        checkId: this.info.checkId
      }).then(res => {
        console.log("通过", res);
        this.$router.go(-1);
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
  padding: 0 16px 70px;
  .black-font;

  .patientCondition,
  .cfDiagnosis,
  .sfInfo,
  .reason {
    margin-top: 12px;
    background: @white;
    .font-size-md;
    padding: 12px;
    border-radius: 1px;
  }
  .patientCondition,
  .sfInfo {
    .van-row:nth-child(1) {
      margin-top: 0;
    }

    .van-row {
      margin-top: 12px;
    }
  }

  .sfInfo {
    .status,
    .notPassDiv .title {
      .black-font;
      .font-size-md;
      .font-blod-2;
      line-height: 20px;
    }

    .notPassDiv {
      padding: 12px 0px;

      .reasonDiv {
        margin-top: 12px;
        background: @chat-light;
        border-radius: 4px;
        padding: 4px 12px;

        :nth-child(1) {
          margin-top: 8px;
        }

        li {
          margin-bottom: 8px;
        }
      }
    }
  }

  .reason {
    padding: 13px 16px;
  }
}
</style>
