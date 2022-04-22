<template>
  <div class="thisPrescription">
    <navbar title="本次处方"></navbar>
    <div class="preListBody">
      <div class="patientInfo">
        <img
          v-zlazy="userInfo.patientImg"
          class="img-width-height-lg"
          :onerror="defaultImg"
          @click="openInfoMa"
        />
        <div class="userBasic">
          <li class="userName">{{ userInfo.patientName }}</li>
          <li class="sexAge">
            <img
              src="../../assets/img/index/sex.png"
              class="icon-width-height-sm-16"
              v-if="userInfo.sex == '男'"
            />
            <img
              src="../../assets/img/index/sex_girl.png"
              class="icon-width-height-sm-16"
              v-else
            />
            <span>{{ userInfo.age }}{{ userInfo.ageUnit }}</span>
          </li>
        </div>
      </div>
      <div class="patientCondition">
        <van-row>
          <van-col span="6">科室</van-col>
          <van-col span="18">{{ deptName }}</van-col>

        </van-row>
        <van-row v-if="recordsTitle">
          <van-col span="6">患者主诉</van-col>
          <van-col span="18" class="div-overflow">{{ recordsTitle }}</van-col>
        </van-row>
        <van-row>
          <van-col span="6">问诊时间</van-col>
          <van-col span="18">{{ inquiryTime }}</van-col>
        </van-row>
      </div>
      <div v-if="cfList.length > 0" style="padding-bottom: 80px;">
        <div class="cfDiagnosis" v-for="(item, index) in cfList" :key="index" @click="openDetail(item)">
          <img src="../../assets/img/cf/waitPass.png" class="passIcon" v-if="item.status == 0"/>
          <img src="../../assets/img/cf/notPass.png" class="passIcon" v-if="item.status == 2"/>
          <img src="../../assets/img/cf/pass.png" class="passIcon" v-if="item.status == 1"/>
          <van-row>
            <van-col span="6">处方诊断</van-col>
            <van-col span="12" class="div-overflow">{{ item.diagsName }}</van-col>
            <van-col span="6" v-if="item.isOfflineSelfBuyMedicine == '1'"
                     style="text-align: right;position: relative;z-index: 8888">
              <span style="color: #FF3B30;font-size: 12px;">线下自主购药</span>
            </van-col>
            <van-col span="6" v-if="item.status == 1&&item.isOfflineSelfBuyMedicine == '0'"
                     style="text-align: right;position: relative;z-index: 8888">
              <span v-if="item.payStatus == '0'" style="color: #FF3B30">待支付</span>
              <span v-if="item.payStatus == '1'" style="color: #1890FF">已支付</span>
              <span v-if="item.payStatus == '2'" style="color: #333333">已退费</span>
            </van-col>
          </van-row>
          <van-row>
            <van-col span="6">订单编号</van-col>
            <van-col span="18">{{ item.businessCode }}</van-col>
          </van-row>
          <cf-list :info="item.checkPreMVOs"></cf-list>
          <div class="cfStatus display-div">
            <u class="font-login-color-red" v-if="item.status == 2">审核未通过</u>
            <u class="font-login-color-blue" v-if="item.status == 1">审核已通过</u>
            <u class="font-color-green" v-if="item.status == 0">待审核</u>
            <u class="goDetail" @click="openDetail(item)">
              <span>查看详情</span>
              <img src="../../assets/img/cf/blurRioght.png" class="rightIcon icon-width-height-sm-16"/>
            </u>
          </div>
        </div>
      </div>

      <div class="emptyDiv" v-if="cfList.length == 0">
        <img src="../../assets/img/cf/cfEmpty.png" class="emptyIcon"/>
        <li>本次问诊尚未给患者诊断开方</li>
      </div>
    </div>
  </div>
</template>

<script>
import navbar from "@/common/navbar";
import {getPatientPrescriptionInfo} from "../../api/cf";
import myJsTools from "@/utils/myJsTools";
import CfList from "../childCompon/cfList";

export default {
  data() {
    return {
      cfList: [],
      regId: "",
      userInfo: {},
      recordsTitle: "",
      inquiryTime: "",
      deptName: "",
      defaultImg:
        'this.src="' + require("../../assets/img/my/default.png") + '"'
    };
  },
  computed: {},
  created() {
    console.log(this.$route.query)
    this.regId = this.$route.query.regId;
    this.inquiryTime = this.$route.query.inquiryTime;
    this.deptName = this.$route.query.deptName;
    this.userInfo = myJsTools.getItem("patientInfo");
    this.recordsTitle = this.$route.query.recordsTitle;
    this.getDetail();
  },
  mounted() {
  },
  watch: {},
  methods: {
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
    // 获取处方列表
    getDetail() {
      getPatientPrescriptionInfo({regId: this.regId}).then(res => {
        this.cfList = res.data;
        for (let i = 0; i < this.cfList.length; i++) {
          const element = this.cfList[i];
          var diagsName = [];
          for (let m = 0; m < element.diags.length; m++) {
            const diagsElement = element.diags[m];
            diagsName.push(diagsElement.diagName);
          }
          element.diagsName = diagsName.join("、");
        }

        console.log(JSON.stringify(this.cfList) + "-----------this.cfList");
      });
    },
    // 去开处方
    openAddCf() {
      this.$router.push({
        name: "prescription"
      });
    },
    // 查看订单详情
    openDetail(item) {
      if (
        item.status == 0
      ) {
        this.$router.push({
          name: "waitPassPerSetail",
          query: {
            businessId: item.businessId,
          }
        });
      } else if (item.status == 1) {
        if (item.isOfflineSelfBuyMedicine == '1') {
          this.$router.push({
            name: "offLinepay",
            query: {
              businessId: item.businessId
            }
          });
        } else {
          if (item.payStatus == '1') {
            this.$router.push({
              name: "payPre",
              query: {
                businessId: item.businessId,
              }
            })
          } else {
            this.$router.push({
              name: "waitPay",
              query: {
                businessId: item.businessId,
              }
            })
          }
        }

      } else {
        this.$router.push({
          name: "prescDetail",
          query: {
            businessId: item.businessId,
          }
        });
      }
    }
  },
  components: {
    CfList,
    navbar
  }
};
</script>

<style scoped lang="less">


/deep/ .cfList {
  padding: 0;
  margin: 0;
}

.preListBody {
  padding: 0 16px;
  .black-font;
  .font-size-md;

  .patientCondition,
  .cfDiagnosis,
  .patientInfo {
    margin-top: 12px;
    background: @white;
    padding: 12px;
    border-radius: 4px;
  }

  .patientInfo {
    padding: 14px 12px;
    display: flex;
    align-items: center;

    .userBasic {
      margin-left: 12px;

      .userName {
        line-height: 22px;
        .font-blod-2;
        .font-size-lg;
      }

      .sexAge {
        display: flex;
        align-items: center;
        line-height: 16px;
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
    .van-row:nth-child(2) {
      margin: 12px 0px;
    }
  }

  .cfDiagnosis {
    padding: 0 16px 14px 16px;
    position: relative;

    .passIcon {
      width: 82px;
      height: 82px;
      position: absolute;
      right: 13px;
      top: 14px;
    }

    .van-row {
      border-bottom: 0.5px solid @back-border;
      padding: 13px 0;
    }

    .cfDetail {
      .font-size-md;
      line-height: 20px;

      u {
        display: inline-block;
      }

      .cfTitle {
        margin-top: 14px;
        .font-blod-2;
      }

      .medicineName {
        margin-top: 8px;
        .font-blod-2;
      }

      .usage,
      .explanation {
        margin-top: 7px;
      }
    }

    .cfStatus {
      .font-size-md;
      line-height: 20px;
      margin-top: 8px;

      .goDetail {
        display: flex;
        align-items: center;
        .font-login-color-blue;

        .rightIcon {
          margin-left: 4px;
        }
      }
    }
  }
}
</style>
