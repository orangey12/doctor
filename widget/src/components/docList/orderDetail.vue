<template>
  <div>
    <navbar title="处方详情"></navbar>

    <div class="details">
      <patient-info :info="info"></patient-info>
      <div class="zdDiv">
        <li class="titleTips">
          <span class="line"></span>
          <span>临床诊断</span>
        </li>
        <div class="addZd">
          <div class="selectedDiag">
            <div v-for="(item,index) in info.diags" :key="index"
                 :class="item.editZdShow && item.diagType == '3'?'':'diagsName'">
                <span v-if="item.diagType == '1'">
                  <span>{{ item.diagNamePrefix }}</span>
                  <span class="font-login-color-blue">{{ item.diagName }}</span>
                  <span>{{ item.diagNameSuffix }}</span>
                </span>
              <span v-if="item.diagType == '3'">
                  <span class="font-login-color-blue">{{ item.diagName }} - {{
                      item.symptomaticName
                    }}</span>
                </span>
            </div>
          </div>
        </div>
      </div>
      <show-patent :order-cf-list="info.checkPreMVOs"></show-patent>
    </div>
  </div>
</template>

<script>
import myJsTools from "../../utils/myJsTools";
import ShowPatent from "../childCompon/showPatent";
import {getPrescriptionInfoById} from "../../api/cf";
import Navbar from "../../common/navbar";
import PatientInfo from "../childCompon/patientInfo";

export default {
  name: "orderDetail",
  components: {PatientInfo, Navbar, ShowPatent},
  data() {
    return {
      info: {},
      orderCfList: [],
    }
  },
  created() {
    this.getDetail();
  },
  methods: {
    getDetail() {
      getPrescriptionInfoById({
        orderNo: this.$route.query.orderNo
      }).then(res => {
        this.info = Object.assign({}, res.data);
      })
    },

  }
}
</script>

<style scoped lang="less">


.details {
  padding: 12px 16px;
}

.zdDiv {
  background: @white;
  padding: 8px;
  margin-top: 8px;
  border-radius: 4px;
  .font-size-md;
}

.selectedDiag {
  display: flex;
  flex-wrap: wrap;

  div {
    display: flex;
    align-items: center;

    .editZd {
      margin-left: 6px;
    }
  }

  .diagsName {
    background: #EAF8FF;
    padding: 8px;
    .font-size-md;
    margin-top: 8px;
    margin-right: 8px;
  }
}
</style>
