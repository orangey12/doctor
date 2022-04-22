<template>
  <div class="thisPrescription">
    <navbar title="未通过"></navbar>
    <div class="preListBody">
      <div class="sfInfo">
        <li class="font-login-color-red font-blod-2">药师审核未通过</li>
        <van-row>
          <van-col span="12">{{ info.checkTime }}</van-col>
          <van-col span="12" style="text-align: right"
          >药师：{{ info.checkUserName }}
          </van-col
          >
        </van-row>
        <div class="notPassDiv">
          <li class="title font-blod-2">不通过理由</li>
          <div
            class="reasonDiv"
            v-for="(item, index) in info.notPassReasons"
            :key="index"
          >
            <li v-if="item.duptName">类型：{{ item.duptName }}</li>
            <li v-if="item.checkMemo">备注：{{ item.checkMemo }}</li>
            <li v-if="item.itemName">药品：{{ item.itemName }}</li>
          </div>
        </div>
      </div>
      <div class="patientInfo">
        <img
          v-zlazy="patientImg"
          class="img-width-height-lg"
          :onerror="defaultImg"
          @click="openInfoMa"
        />
        <div class="userBasic">
          <li class="userName">{{ info.patientName }}</li>
          <li class="sexAge">
            <img src="../../assets/img/index/sex.png" class="icon-width-height-sm-16" v-if="info.sex=='男'"/>
            <img src="../../assets/img/index/sex_girl.png" class="icon-width-height-sm-16" v-else/>
            <span>{{ info.age }}{{ info.ageUnit }}</span>
          </li>
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
        <van-row v-if="info.recordsTitle">
          <van-col span="6">患者主诉</van-col>
          <van-col span="18">{{ info.recordsTitle }}</van-col>
        </van-row>
        <van-row>
          <van-col span="6">开方时间</van-col>
          <van-col span="18">{{ info.addTime }}</van-col>
        </van-row>
      </div>
      <div class="patientCondition">
        <van-row>
          <van-col span="6">处方诊断</van-col>
          <van-col span="18">{{ info.diagName }}</van-col>
        </van-row>
      </div>
      <div class="cfDiagnosis">
        <van-row>
          <van-col span="6">订单编号</van-col>
          <van-col span="12">{{ info.businessCode }}</van-col>
          <van-col
            span="6"
            class="cfStatus font-login-color-red"
            style="text-align: right;"
          >未通过
          </van-col
          >
        </van-row>
        <cf-list :info="info.checkPreMVOs"></cf-list>
      </div>
      <div class="bottomBtn" v-if="info.docId == docId">
        <button class="publicWhiteBtn" @click="openElePre">电子处方</button>
        <button @click="openEdit" class="publicBtn twoBtn">修改</button>
        <button @click="show = true" class="publicBtn threeBtn">双签执行</button>
      </div>
      <div class="bottomBtn" v-else>
        <button class="publicBtn" @click="openElePre">电子处方</button>
      </div>
      <van-popup v-model="show" class="popup" round>
        <li class="title">是否执行双签</li>
        <li>您确定要双签执行吗？</li>
        <div class="btns">
          <button class="publicWhiteBtn" @click="show = false">取消</button>
          <button class="publicBtn twoBtn" @click="determine">确定</button>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import navbar from "@/common/navbar";
import {
  getNotPassCheckPrescriptionInfo,
  updateBussStatus
} from "../../api/cf";
import myJsTools from "../../utils/myJsTools";
import CfList from "../childCompon/cfList";
import {Toast} from "vant";

export default {
  name: "prescDetail",
  data() {
    return {
      cfList: [],
      show: false,
      businessId: "",
      sex: "",
      patientImg: "",
      patientName: "",
      age: "",
      ageUnit: "",
      defaultImg:
        'this.src="' + require("../../assets/img/my/default.png") + '"',
      info: {},
      docId:""
    };
  },
  created() {
    let query = this.$route.query;
    this.businessId = query.businessId;
    this.docId = myJsTools.getItem("token_info").docId;
    this.getDetail();
  },
  mounted() {
  },
  methods: {
    //查看电子处方
    openElePre() {
      this.$router.push({
        name: "electronicPrescription",
        query: {
          businessId: this.businessId
        }
      })
    },
    openEdit() {
      this.$router.push({
        name: "prescription",
        query: {
          businessId: this.businessId,
          patientId: this.info.patientId,
          pageType:"edit"
        }
      });
    },
    getDetail() {
      getNotPassCheckPrescriptionInfo({
        businessId: this.businessId
      }).then(async res => {
        console.log(res);
        this.patientImg = res.data.patientImg;
        this.info = res.data;
      });
    },
    //双签执行
    determine() {
      Toast.loading({
        message: '双签执行中...',
        forbidClick: true,
        closeOnClick: false,
        duration: 0
      });
      updateBussStatus({
        businessId: this.businessId,
        status: "8"
      }).then(res => {
        console.log(res);
        this.show = false;
        this.$router.go(-1);
      });
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
  .font-size-md;

  .patientCondition,
  .patientInfo,
  .cfDiagnosis,
  .sfInfo,
  .reason {
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
    .notPassDiv .title {
      line-height: 20px;
    }

    .notPassDiv {
      padding: 12px 0px;
      margin-top: 12px;
      border-top: 0.5px solid @back-border;

      .reasonDiv {
        margin-top: 12px;
        background: @span-back;
        border-radius: 4px;
        padding: 12px;

        :nth-child(1) {
          margin-top: 0px;
        }

        li {
          margin-top: 8px;
        }
      }
    }
  }

  .cfDiagnosis {
    padding: 0 16px 13px 16px;

    .van-row {
      padding: 13px 0;
    }

    /deep/ .cfList{
      padding: 4px 0 0;
      border-top: 1px solid @back-border;
    }

  }

  .reason {
    padding: 13px 16px;
  }
}
</style>
