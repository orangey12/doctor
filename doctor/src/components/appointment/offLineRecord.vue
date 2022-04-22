<template>
<div class="offLineRecord">
  <navbar title="病历详情"></navbar>
  <van-tabs
    v-model="active"
    title-inactive-color="#666666"
    title-active-color="#14A0E6"
    color="#14A0E6"
  >
    <van-tab title="病情描述">
      <div class="detailInfo">
        <van-field v-model="sponsorDocName" label="转诊医生" disabled  v-if="sponsorDocName"/>
        <van-field v-model="subsequent" label="服务类型" disabled />
        <van-field v-model="visitTypeName" label="问诊类型" disabled />
        <van-field
          v-model="appointment"
          label="预约时间"
          disabled
          v-if="type == 1"
        />
        <van-field
          v-model="inquiryTime"
          label="问诊时间"
          disabled
          v-if="type == 2"
        />
        <van-field
          v-model="recordsTitle"
          label="标题"
          disabled
          placeholder="未填写标题"
        />
        <van-field
          v-model="diagnosisDisease"
          label="确诊疾病"
          disabled
          placeholder="未确诊"
        />
        <van-field
          v-model="sickTime"
          label="患病时长"
          disabled
          placeholder="暂未填写患病时长"
        >
        </van-field>
        <li class="title">病情描述</li>
        <div class="condition helpDiv">
          <span>{{ diseaseDescription }}</span>
        </div>
        <li class="title">期望获得的帮助</li>
        <div class="condition helpDiv">
          <span v-if="expectHelp">{{ expectHelp }}</span>
          <span v-else>暂未填写希望获得的帮助</span>
        </div>
        <li class="title">
          病情照片
          <span class="tips">（仅限本人和接诊医生可看）</span>
        </li>
        <div class="condition">
          <img
            :src="item"
            class="medicImg"
            v-for="(item, index) in diseaseImgList"
            :key="index"
            @click.stop="getImgView(diseaseImgList, index)"
          />
        </div>
        <li class="title">
          其它照片
          <span class="tips">（仅限本人和接诊医生可看）</span>
        </li>
        <div class="condition" v-if="medicalImgList.length > 0">
          <img
            :src="item"
            class="medicImg"
            v-for="(item, index) in medicalImgList"
            :key="index"
            @click.stop="getImgView(medicalImgList, index)"
          />
        </div>
        <div class="condition helpDiv" v-else>
          <span style="color:#E5E5E5;">暂未上传图片</span>
        </div>
      </div>
    </van-tab>
    <van-tab title="电子病历">
      <detail :emrId="emrId"></detail>
    </van-tab>
  </van-tabs>
</div>
</template>

<script>
    import Navbar from "../../common/navbar";
    import Detail from "../electronicRecord/detail";
    export default {
        name: "offLineRecord",
      components: {Detail, Navbar},
      data(){
          return{
            emrId:"",
            active:1,
            regCode: "", // 挂号编号
            patientId: "", //患者id
            patientName: "", //患者姓名
            recordsTitle: "", // 病历标题
            diagnosisDisease: "", // 确诊疾病
            sickTime: "", //患病时长
            timeUnit: "", // 时长单位
            diseaseDescription: "", // 疾病描述
            expectHelp: "", //期望帮助
            diseaseImg: "", //病情图片
            medicalImg: "",
            regId: "", //挂号id
            inquiryTime:"",//问诊时间
            visitTypeName:"",
            age: "",
            deptName:"",
            sex: "",
            type: "",
            isSubsequent:"",
            visitTypeCode:"",
            sponsorDocName:"",
            userInfo: {}, //用户信息传参
            showRetreatRe: false, //选择退诊原因
            retreatResult: [],
            retreatList: [],
            resultMessage: "", //退诊替他原因
            showRefundMessage: false,
            reasonTitle: "退诊原因",
            medicalImgList: [], //其他照片列表
            diseaseImgList: [], //病例照片
            showPic: false,
            images: [],
            index: 0,
            show: false,
            showMzyy: false, //医生是否给患者发送过门诊预约
            userDocId: "", //当前登录用户id
            docId: "", //当前问诊详情接诊医生id
            visitRealType: "",
            showEndWz: false,
            subsequent: "",
            btnStatus:{},
            lisUserInfo:{},
            jzStatus:"",//就诊状态
            userId:"",
          }
      },
      created() {
        this.emrId = this.$route.query.emrId;
      },
    }
</script>

<style scoped lang="less">
  .detailInfo {
    color: #333333;
    font-size: 16px;
    line-height: 22px;
    margin-top: 8px;
    background: #ffffff;
    padding: 0 16px;
    /deep/.van-cell {
      padding: 19px 0;
      font-size: 16px;
    }
    .title {
      padding: 19px 0 10px 0;
      .tips {
        color: #999999;
        margin-left: 8px;
      }
    }
    .wzHistory {
      display: flex;
      padding: 19px 0 10px 0;
      border-bottom: 1px solid #ebebeb;
      .spanHistory {
        width: 92%;
        .wzTime {
          margin-left: 30px;
        }
      }
      .rightIcon {
        width: 22px;
        height: 22px;
      }
    }
    .btns {
      display: flex;
      text-align: center;
      padding: 18px 0;
      button {
        line-height: 49px;
        text-align: center;
        font-size: 16px;
        border-radius: 25px;
        width: 50%;
      }
      .refund {
        border: 1px solid #14a0e6;
        color: #14a0e6;
        background: #ffffff;
      }
      .commit {
        border: none;
        background: #14a0e6;
        color: #ffffff;
        margin-left: 8px;
      }
    }
    .inquiryBtns {
      padding: 15px 0;
      button {
        width: 31%;
        border: 1px solid #14a0e6;
        font-size: 16px;
        line-height: 49px;
        border-radius: 25px;
        display: inline-block;
        font-weight: bold;
      }
      .endAppoi {
        color: #14a0e6;
        background: #ffffff;
      }
      .refrundAppoi {
        margin: 0 6px;
        color: #14a0e6;
        background: #ffffff;
      }
      .goChat {
        color: #ffffff;
        background: #14a0e6;
      }
    }
    .popup {
      width: 75%;
      background: rgba(0.5, 0, 0, 0);
      text-align: center;
      .van-cell {
        padding: 5px 25px;
        border: 1px solid #ebebeb;
      }
      .van-radio__label {
        margin-left: 13px;
        color: #323233;
        line-height: 20px;
      }
      .van-radio__icon--checked .van-icon {
        color: #fff;
        background-color: #14a0e6;
        border-color: #14a0e6;
      }
      .raiodList {
        margin-bottom: 10px;
      }
      .loginIcon {
        width: 112px;
        height: 112px;
        position: relative;
        top: -50%;
        left: 50%;
        transform: translate(-50%, 50%);
      }
      .tipsInfo {
        background: #ffffff;
        border-radius: 8px;
        padding: 40px 38px 17px 38px;
        .title {
          color: #333333;
          font-size: 14px;
          line-height: 20px;
          margin-bottom: 17px;
        }
        p {
          color: #666666;
          font-size: 16px;
          line-height: 22px;
        }
        .btns {
          button {
            line-height: 34px;
          }
        }
        .cancel {
          border: none;
          letter-spacing: 2px;
          color: #666666;
          font-size: 14px;
          margin-top: 16px;
          background: #ffffff;
        }
      }
      /deep/.van-checkbox {
        padding: 6px 15px;
        font-size: 14px;
      }
    }
    .wzPopup {
      width: 70%;
      padding: 20px;
      text-align: center;
      color: #333333;
      .title {
        font-size: 16px;
        line-height: 22px;
        font-weight: 700;
      }
      .tips {
        margin-top: 28px;
        font-size: 12px;
        line-height: 17px;
        margin-bottom: 19px;
      }
      .btns {
        button {
          width: 48%;
          background: #fff;
          color: #14a0e6;
          font-size: 16px;
          line-height: 34px;
          text-align: center;
          border-radius: 23px;
        }
        :nth-child(1) {
          border: 1px solid #14a0e6;
        }
        :nth-child(2) {
          background: #14a0e6;
          color: #fff;
          margin-left: 20px;
        }
      }
    }
    .condition {
      padding: 15px 8px 7px 8px;
      border: 1px solid #e5e5e5;
      display: flex;
      border-radius: 8px;
      flex-wrap: wrap;
      span{
        display: inline-block;
        padding-bottom: 8px;
      }
      .medicImg {
        width: 30%;
        height: 100px;
        margin-bottom: 8px;
      }
      :nth-child(2),
      :nth-child(5),
      :nth-child(8) {
        margin: 0 9px;
      }
    }
    .helpDiv {
      height: 120px;
    }
  }
</style>
