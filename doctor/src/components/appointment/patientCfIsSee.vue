<template>
  <div class="zzSet">
    <navbar title="处方可见设置"></navbar>
    <div class="setDiv" v-if="docSelfSwitch == '1' && hosSwitch == '1'">
      <li class="openLi">
        <u>
          <span>处方可见设置</span>
          <span class="tips">请设置患者支付成功前处方是否可见</span>
        </u>
        <u>
          <van-switch :disabled="docSelfSwitch == '0' || hosSwitch == '0'" v-model="checked" size="24px"
                      @change="changeSwitch"/>
        </u>
      </li>
    </div>
    <div v-else class="emptyDiv">
      <img src="../../assets/img/my/qx.png" class="noneQx emptyIcon">
      <li>暂无设置权限</li>
    </div>
  </div>
</template>

<script>
import Navbar from "../../common/navbar";
import myJsTools from "../../utils/myJsTools";
import {
  editDoctordocSelfSwitch, editDoctorToPatientDidNotPayDrugs, getDocToOnePatientCanLookDrugSetting,
  getDoctordocSelfSwitch
} from "../../api/set";

export default {
  name: "patientCfIsSee",
  components: {Navbar},
  data() {
    return {
      checked: false,
      hosSwitch: "",
      docSelfSwitch: "",
    }
  },
  created() {
    this.getSet();
  },
  methods: {
    //获取医生的设置及平台的配置
    getSet() {
      getDocToOnePatientCanLookDrugSetting({
        docId: myJsTools.getItem("token_info").docId,
        patientId: this.$route.query.patientId
      }).then(res => {
        this.docSelfSwitch = res.data.docSelfSwitch;
        this.hosSwitch = res.data.hosSwitch;
        this.checked = res.data.docToPatientSwitch == '1' ? true : false;
      })
    },
    //开关
    changeSwitch(val) {
      getDocToOnePatientCanLookDrugSetting({
        docId: myJsTools.getItem("token_info").docId,
        patientId: this.$route.query.patientId
      }).then(res => {
        this.docSelfSwitch = res.data.docSelfSwitch;
        this.hosSwitch = res.data.hosSwitch;
        if (res.data.docSelfSwitch == '1') {
          editDoctorToPatientDidNotPayDrugs({
            docId: myJsTools.getItem("token_info").docId,
            patientId: this.$route.query.patientId,
            didNotPayDrugs: this.checked ? '1' : '0'
          }).then(res => {

          })
        } else {
          this.checked = true;
        }
      })
    },
  }
}
</script>

<style scoped lang="less">


.openLi {
  padding: 12px 16px;
  background: @white;
  border-bottom: 0.5px solid @back-border;
  .display-div;
  .font-size-md;
  .black-font;
  line-height: 22px;

  .tips {
    .font-color-2;
    margin-top: 3px;
  }

  span {
    display: block;
  }
}

.popup {
  li, .title {
    margin-bottom: 12px;
  }

  .van-cell {
    padding: 6px 12px;
    margin: 0px 0 8px;
    background: #F8F8F8;
    border: none;
  }
}

.setDiv {
  /deep/ .van-field__control {
    text-align: right;
  }
}

/deep/ .van-field__label {
  .font-color-2;
  width: 60px;
}
</style>
