<template>
  <div class="waitPassPerSetail">
    <navbar :title="title"></navbar>

    <div class="preListBody">
      <div class="patientInfo">
        <img
          v-zlazy="info.patientImg"
          class="img-width-height-lg"
          :onerror="defaultImg"
          @click="openInfoMa"
        />
        <div class="userBasic">
          <li class="userName">{{info.patientName}}</li>
          <li class="sexAge">
            <img src="../../assets/img/index/sex.png" class="icon-width-height-sm-16" v-if="info.sex=='男'"/>
            <img src="../../assets/img/index/sex_girl.png" class="icon-width-height-sm-16" v-else/>
            <span>{{info.age}}{{info.ageUnit}}</span>
          </li>
        </div>
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
        <van-row v-if="info.recordsTitle">
          <van-col span="6">患者主诉</van-col>
          <van-col span="18">{{info.recordsTitle}}</van-col>
        </van-row>
        <van-row>
          <van-col span="6">开方时间</van-col>
          <van-col span="18">{{info.addTime}}</van-col>
        </van-row>
      </div>
      <div class="patientCondition">
        <van-row>
          <van-col span="6">处方诊断</van-col>
          <van-col span="18">{{info.diagName}}</van-col>
        </van-row>
      </div>
      <div class="cfDiagnosis">
        <van-row>
          <van-col span="6">订单编号</van-col>
          <van-col span="18">{{info.businessCode}}</van-col>
        </van-row>
        <cf-list :info="info.checkPreMVOs"></cf-list>
      </div>
      <div class="bottomBtn">
        <button class="publicBtn" @click="openElePre">查看电子处方</button>
      </div>
    </div>
  </div>
</template>

<script>
  import navbar from "@/common/navbar";
  import {getPrescriptionCardDetailInfo} from "../../api/cf";
  import myJsTools from "../../utils/myJsTools";
  import CfList from "../childCompon/cfList";

  export default {
    data() {
      return {
        cfList: [],
        userInfo: {},
        info: {},
        title: "待审方",
        defaultImg:
          'this.src="' + require("../../assets/img/my/default.png") + '"',
      };
    },
    created() {
      this.userInfo = myJsTools.getItem("patientInfo");
      this.getCfDetail();
      this.title=this.$route.query.title
    },
    mounted() {
    },
    methods: {
      //查看电子处方
      openElePre(){
        this.$router.push({
          name:"electronicPrescription",
          query:{
            businessId: this.$route.query.businessId
          }
        })
      },
      // 资料服务页面
      openInfoMa() {
        this.$router.push({
          name: "information",
          query: {
            patientId: this.patientId,
            docId: this.docId
          }
        });
      },
      // 获取处方详情
      getCfDetail() {
        getPrescriptionCardDetailInfo({
          businessId: this.$route.query.businessId
        }).then(async res => {
          console.log(JSON.stringify(res) + "----------处方详情");
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
    padding: 0 16px 80px;
    .font-size-md;
    .black-font;

    .patientCondition,
    .cfDiagnosis, .patientInfo {
      margin-top: 12px;
      background: @white;
      padding: 12px;
      border-radius: 4px;
    }
    .patientCondition {
      .van-row:nth-child(1) {
        margin-top: 0;
      }
      .van-row {
        margin-top: 12px;
      }
    }
    .patientInfo {
      padding: 14px 12px;
      display: flex;
      align-items: center;
      .userBasic {
        margin-left: 12px;
        .userName {
          line-height: 22px;
          .font-size-lg;
          .font-blod-2;
        }

        .sexAge {
          display: flex;
          align-items: center;
          margin-top: 4px;
          span {
            .font-color-2;
            .font-size-sm;
            line-height: 16px;
          }
        }
      }
    }

    .patientCondition {
      .van-row:nth-child(1) {
        margin-top: 0;
      }

      .van-row {
        margin-top: 12px;
      }
    }

    .cfDiagnosis {
      padding: 0 16px;

      .van-row {
        border-bottom: 1px solid @back-border;
        padding: 13px 0;
      }

      /deep/ .cfList{
        margin: 0;
        padding:0;
      }
    }
  }
</style>
