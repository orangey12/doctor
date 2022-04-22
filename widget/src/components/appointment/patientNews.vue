<template>
  <div class="zzSet">
    <navbar title="新消息通知"></navbar>
    <div class="setDiv">
      <li class="openLi">
        <u>
          <span>新消息通知</span>
          <span class="tips">开启后，将不再接收患者信息推送</span>
        </u>
        <u>
          <van-switch v-model="checked" size="24px" @change="changeSwitch"/>
        </u>
      </li>
    </div>
  </div>
</template>

<script>
import Navbar from "../../common/navbar";
import myJsTools from "../../utils/myJsTools";
import {
  editDoctordocSelfSwitch, editDoctorToPatientDidNotPayDrugs, getDocPatientSwitch, getDocToOnePatientCanLookDrugSetting,
  getDoctordocSelfSwitch, saveDocPatientSwitch
} from "../../api/set";
import {Toast} from "vant";

export default {
  name: "",
  components: {Navbar},
  data() {
    return {
      checked: false,
    }
  },
  created() {
    this.getSet();
  },
  methods: {
    //获取医生的设置及平台的配置
    getSet() {
      getDocPatientSwitch({
        docId: myJsTools.getItem("token_info").docId,
        patientId: this.$route.query.patientId,
        switchType:"2"
      }).then(res => {
        this.checked = res.data.switchValue == '1' ? true : false;
      })
    },
    //开关
    changeSwitch(val) {
      saveDocPatientSwitch({
        docId: myJsTools.getItem("token_info").docId,
        patientId: this.$route.query.patientId,
        switchValue: this.checked ? '1' : '0',
        switchType:"2"
      }).then(res => {
          Toast("保存成功")
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
