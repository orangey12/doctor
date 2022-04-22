<template>
  <div class="friendRequests">
    <navbar title="签到"></navbar>
    <div class="content">
      <div class="friendInfo display-div" @click="openPatientInfo">
        <div class="info">
          <img v-zlazy="patientInfo.patientImg" class="userHead">
          <div class="patientInfo">
            <li class="patientName">{{ patientInfo.patientName }} {{ patientInfo.sex }}</li>
            <li class="dept">{{ patientInfo.age }}{{ patientInfo.ageUnit }}</li>
          </div>
        </div>
        <img src="../../assets/img/my/my_right.png" class="icon-width-height-sm">
      </div>
    </div>
    <li class="remarks">
      <van-field v-model="time" disabled label="预约时间" placeholder="预约时间"/>
    </li>
    <div class="bottomBtn">
      <button class="publicBtn" @click="signinDoc">签到</button>
    </div>
  </div>
</template>

<script>
import Navbar from "../../common/navbar";
import {doctorEndClinicalSignIn} from "../../api/visit";
import {findPatientInfoByPatientId} from "../../api/chat";
import myJsTools from "../../utils/myJsTools";
import {Toast} from "vant";

export default {
  name: "signIn",
  components: {Navbar},
  data() {
    return {
      patientInfo: {},
      time: "2020-10-10 上午"
    }
  },
  created() {
    this.getPatientInfo();
    this.time = this.$route.query.time + "  " + this.$route.query.apw
  },
  methods: {
    //跳转患者资料服务页面
    openPatientInfo() {
      this.$router.push({
        name: "information",
        query: {
          pageType: "signin",
          patientId: this.$route.query.patientId
        }
      })
    },
    getPatientInfo() {
      findPatientInfoByPatientId({
        patientId: this.$route.query.patientId
      }).then(async res => {
        console.log(res);
        let data = res.data;
        this.patientInfo = Object.assign({}, data);
        myJsTools.setItem("patientInfo", data);
      })
    },
    signinDoc() {
      doctorEndClinicalSignIn({
        poaId: this.$route.query.poaId
      }).then(res => {
        console.log(res);
        Toast("签到成功");
        this.$router.go(-1);
      })
    }
  }
}
</script>

<style scoped lang="less">


.userHead {
  .img-width-height-lg;
  margin-right: 12px;
}

.friendInfo {
  background: @white;
  padding-right: 16px;
}

.info {
  padding: 14px 29px;
  display: flex;
  align-items: center;

  .patientName {
    .black-font;
    .font-size-lg;
    .font-blod-3;
    line-height: 22px;
  }

  .dept {
    .font-color-2;
    .font-size-md;
    line-height: 17px;
    margin-top: 2px;
  }
}


.remarks {
  margin-top: 12px;
}

/deep/ .van-field__control:disabled {
  .black-font;
}
</style>
