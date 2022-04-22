<template>
  <div class="zzSet">
    <navbar title="资料设置"></navbar>
    <div class="setDiv">
      <li class="openLi" @click="openAddGroup()">
        <u>
          <span>设置备注和分组</span>
        </u>
        <u>
          <van-icon name="arrow" />
        </u>
      </li>
      <!--缺少加入黑名单的提示框 -->
      <li class="openLi" style="margin-top:20px;">
        <u>
          <span>加入黑名单</span>
        </u>
        <u>
          <van-switch v-model="isBlack" size="24px" @change="changeSwitch" />
        </u>
      </li>
    </div>
  </div>
</template>

<script>
import Navbar from "../../common/navbar";
import myJsTools from "../../utils/myJsTools";
import {
  editDoctordocSelfSwitch,
  editDoctorToPatientDidNotPayDrugs,
  getDocToOnePatientCanLookDrugSetting,
  getDoctordocSelfSwitch
} from "../../api/set";
import {
  editPullBlackByPatientDocId,
  getPullBlackByPatientDocId
} from "@/api/myGroups";
export default {
  name: "setBlacklist",
  components: { Navbar },
  data() {
    return {
      isBlack: false,
      hosSwitch: "",
      docSelfSwitch: "",
      patientId: "",
      docId: ""
    };
  },
  created() {
    this.patientId = this.$route.query.patientId;
    this.docId = this.$route.query.docId;
    console.log("347823790234", this.docId, this.patientId);
    this.getSet();
  },
  methods: {
    // 打开分组选择界面
    openAddGroup() {
      this.$router.push({
        name: "patientGroup",
        query: {
          patientImg: this.$route.query.patientImg,
          patientName: this.$route.query.patientName,
          patientId: this.$route.query.patientId
        }
      });
    },
    //获取医生的设置及平台的配置
    getSet() {
      getPullBlackByPatientDocId({
        docId: this.docId,
        patientId: this.patientId
      }).then(res => {
        console.log("res", res);
        this.isBlack = res.data.isPullBlack == 0 ? false : true;
      });
    },
    //开关
    changeSwitch() {
      console.log("this.isPullBlack", this.isBlack);
      let temp = this.isBlack == true ? "1" : "0";
      console.log("temp", temp);
      editPullBlackByPatientDocId({
        docId: this.docId,
        patientId: this.patientId,
        isPullBlack: temp
      });
    }
  }
};
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
  li,
  .title {
    margin-bottom: 12px;
  }

  .van-cell {
    padding: 6px 12px;
    margin: 0px 0 8px;
    background: #f8f8f8;
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
