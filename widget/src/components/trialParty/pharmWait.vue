<template>
  <div class="waitPassPerSetail">
    <navbar :title="title" :businessId="businessId" :updateType="updateType"></navbar>
    <van-tabs v-model="active" @change="changeTabs">
      <!-- 处方详情 -->
      <van-tab title="处方详情">
        <div class="preListBody" v-if="type == 0">
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
            <button class="publicWhiteBtn" @click="noPass">不通过</button>
            <button class="publicBtn twoBtn" @click="pass">通过</button>
          </div>
        </div>
        <pass-detail v-if="type == 2" :checkType="checkType" :addTime="addTime" :businessId="businessId"></pass-detail>
        <pharm-detail v-if="type == 1" :businessId="businessId"></pharm-detail>
      </van-tab>
      <!-- 患者病情 -->
      <van-tab title="患者病情">
        <patient-detail pagetype="patientDefault" :addTime="addTime" :patientId="patientId"
                        :regId="regId"></patient-detail>
      </van-tab>
      <!-- 诊疗记录 -->
      <van-tab title="诊疗记录">
        <record :type="active"></record>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import navbar from "@/common/navbar";
import passDetail from "./passDetail";
import pharmDetail from "./pharmDetail";
import {Toast} from "vant";
import {
  getNotCheckPrescriptionInfoById,
  saveCheckPrescriptionM
} from "@/api/judge";
import myJsTools from "../../utils/myJsTools";
import patientDetail from "@/components/childCompon/patientDetail";
import record from "@/components/childCompon/record";
import CfList from "../childCompon/cfList";

export default {
  name: "pharmWait",
  data() {
    return {
      active: 0,
      cfList: [],
      status: "",
      userInfo: {},
      regId: "",
      title: "",
      checkType: "",
      addTime: "",
      businessId: "",
      type: "",//待审方，审核未通过，已通过
      info: {
        proBusinessInfo: {
          docName: "",
          deptName: "",
          addTime: ""
        }
      },
      updateType: false,
      diagName: "",
    };
  },
  created() {
    let val = this.$route.query;
    this.status = val.status;
    this.patientId = val.patientId;
    this.title = val.title;
    this.regId = val.regId;
    this.type = val.type;
    this.checkType = val.checkType;
    this.addTime = val.addTime;
    this.businessId = val.businessId;
    this.active = myJsTools.getItem("pharmActive") || 0;
    if (this.type == 0) {
      this.title = "审方中"
      this.updateType = true;
    } else if (this.type == 1) {
      this.title = "审核未通过详情"
    } else {
      this.title = "审核通过详情"
    }
    if (this.type == '0') {
      this.getCfDetail();
    }
  },
  mounted() {
  },
  methods: {
    changeTabs() {
      myJsTools.setItem("pharmActive", this.active);
    },
    // 资料服务页面
    openInfoMa() {
      this.$router.push({
        name: "information",
        query: {
          patientId: myJsTools.getItem("patientInfo").patientId,
          docId: this.docId
        }
      });
    },
    // 获取处方详情
    getCfDetail() {
      getNotCheckPrescriptionInfoById({
        businessId: this.businessId
      }).then(res => {
        this.info = res.data;
      });
    },
    // 通过状态
    noPass() {
      this.$router.push({
        name: "noPass",
        query: {
          businessId: this.businessId,
          businessCode: this.$route.query.businessCode
        }
      });
    },
    // 通过状态
    pass() {
      Toast.loading({
        message: '加载中...',
        forbidClick: true,
        closeOnClick: false,
        duration: 0
      });
      saveCheckPrescriptionM({
        businessId: this.businessId,
        businessCode: this.$route.query.businessCode,
        checkStatus: 1,
        checkUserId: myJsTools.getItem("token_info").userId,
        checkUserName: myJsTools.getItem("token_info").docName
      }).then(res => {
        console.log("通过信息", res);
        Toast("审核通过");
        this.$router.go(-1);
      });
    }
  },
  components: {
    CfList,
    navbar,
    patientDetail,
    record,
    passDetail,
    pharmDetail
  }
};
</script>

<style scoped lang="less">


.preListBody {
  padding: 0 16px 70px;
  .black-font;

  .patientCondition,
  .cfDiagnosis {
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

  .cfDiagnosis {
    padding: 0 16px 13px 16px;

    .van-row {
      border-bottom: 1px solid @back-border;
      padding: 13px 0;
    }

    .cfDetail {
      .cardDiv {
        border-top: 1px solid @back-border;
        margin-top: 15px;
        padding-bottom: 15px;
      }

      .medicineName,
      .priceLi,
      .cfTitle {
        justify-content: space-between;
      }

      .cfTitle {
        margin-top: 8px;
        padding-top: 12px;
        .font-blod-3;

        .betLeft {
          width: 80%;
          .font-size-lg;
          line-height: 24px;
        }

        .title {
          .font-size-md;
          line-height: 20px;
        }
      }

      .medicineName {
        margin-top: 8px;

        .name {
          .font-size-md;
          .font-blod-3;
          width: 90%;
          line-height: 20px;
        }
      }

      .priceLi {
        margin-top: 8px;

        .price {
          width: 88%;
        }

        .num {
          .font-size-md;
          line-height: 20px;
        }
      }

      .totalPrice {
        text-align: right;
        margin-top: 8px;
        .black-font;
        .font-size-md;
        line-height: 20px;
      }

      .usage,
      .explanation {
        margin-top: 7px;
        line-height: 20px;
        .font-size-md;
      }
    }
  }

}

/deep/ .van-tab {
  .font-size-lg;
}

</style>

