<template>
  <div class="waitPayOrder">
    <navbar title="处方详情"></navbar>
    <div class="patientCondition">
      <van-row>
        <van-col span="6">患者姓名</van-col>
        <van-col span="18">{{info.patientName}}</van-col>
      </van-row>
      <van-row>
        <van-col span="6">医生姓名</van-col>
        <van-col span="18">{{info.docName}}</van-col>
      </van-row>
      <van-row v-if="info.checkUserName">
        <van-col span="6">药师</van-col>
        <van-col span="18">{{info.checkUserName}}</van-col>
      </van-row>
      <van-row>
        <van-col span="6">患者主诉</van-col>
        <van-col span="18">{{info.recordsTitle}}</van-col>
      </van-row>
      <van-row>
        <van-col span="6">处方诊断</van-col>
        <van-col span="18">{{info.diagName}}</van-col>
      </van-row>
      <van-row>
        <van-col span="6">问诊时间</van-col>
        <van-col span="18">{{info.inquiringTime}}</van-col>
      </van-row>
    </div>
    <div style="padding-bottom: 60px;margin-top: 12px">
      <div class="cfDiagnosis">
        <div class="cfDetail">
          <van-row>
            <van-col span="6">订单编号</van-col>
            <van-col span="12">{{ info.businessCode }}</van-col>
            <van-col span="6" style="text-align: right;">
              <span v-if="info.isMedicare == '0'">自费</span>
              <span v-if="info.isMedicare == '1'">医保</span>
            </van-col>
          </van-row>
          <cf-list :info="info.checkPreMVOs"></cf-list>
        </div>
      </div>
    </div>

    <div class="bottomTotal display-div">
      <div>
        合计：<span>
        ￥{{info.cost}}</span>
      </div>
      <u>
        <button class="publicWhiteBtn-80" @click="openElePre">电子处方</button>
        <button class="pubicBtn-80 twoBtn" @click="adjustedPre">续方调方</button>
      </u>
    </div>
  </div>
</template>

<script>
  import Navbar from "../../common/navbar";
  import {
    getPatientPrescriptionOrderInfoById,
    getPrescriptionInfoById,
    getPrescriptionInfoByIdContinuation, getPrescriptionInfoByPayment
  } from "../../api/cf";
  import CfList from "../childCompon/cfList";
  import myJsTools from "../../utils/myJsTools";
  export default {
    name: "payPre",
    components: {CfList, Navbar},
    data(){
      return{
        businessId:"",
        info:{},
        proBusinessInfo:{},
        diagName:"",
        active:0,
        orderInfo:{}
      }
    },
    created() {
      this.businessId = this.$route.query.businessId;
      this.getWaitPayInfo();
    },
    methods:{
      //  续方调方
      adjustedPre() {
        getPrescriptionInfoByIdContinuation({
          businessId:this.businessId,
          docId:myJsTools.getItem("token_info").docId
        }).then(res=>{
          this.setData(res);
        })
      },
      setData(res) {
        let cfList = this.$store.getters.getCfList;
        let data = res.data.checkPreMVOs;
        for (let i = 0; i < data.length; i++) {
          let el = data[i];
          el.type = el.prescriptionType;
          el.name = el.prescriptionType == '3' ? 'herbal' : 'patent'
        }
        myJsTools.setItem("preType",data[data.length - 1].prescriptionType);
        this.$store.commit("setAllCfList", data);
        myJsTools.setItem("passDiags",res.data.diags);
        this.$router.push({
          name: "prescription",
          query: {
            patientId: this.info.patientId,
            type:"passPre"
          }
        });
      },
      //查看电子处方
      openElePre(){
        this.$router.push({
          name:"electronicPrescription",
          query:{
            businessId: this.businessId
          }
        })
      },
      getWaitPayInfo(){
        getPrescriptionInfoByPayment(
          {
            "businessId": this.businessId,
          }
        ).then(res=>{
          let data = res.data;
          this.info = Object.assign({},data);
        })
      },
    }
  }
</script>

<style scoped lang="less">

  .patientCondition {
    .van-row {
      padding: 12px 0;
      border-top: 0.5px solid #EBEBEB;
    }
    .van-row:nth-child(1) {
      margin-top: 0;
      border:none;
    }
  }
  .patientCondition,.cfDiagnosis {
    margin: 12px 16px 0;
    background: #ffffff;
    padding:0 12px;
    font-size: 14px;
    border-radius: 4px;
  }

  .cfDiagnosis {
    padding: 0 8px 13px;
    .van-row {
      padding: 13px 0;
    }
    /deep/ .cfList{
      margin: 0;
      border-top: 1px solid @back-border;
    }
  }
  .bottomTotal {
    position: fixed;
    bottom: 0;
    width: 100%;
    margin-top: 8px;
    color: #333333;
    padding: 16px ;
    background: #ffffff;
    box-sizing: border-box;
    box-shadow: 0 2px 4px rgba(0,0,0,0.5);
    span {
      color: #ff0000;
    }
    font-size: 14px;
    line-height: 20px;
  }
</style>
