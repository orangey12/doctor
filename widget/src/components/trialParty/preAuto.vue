<template>
  <div>
    <navbar title="自动审方设置"></navbar>
    <li class="switchService">
      <u>是否自动审方</u>
      <u>
        <van-switch v-model="checked" @change="tapSwitch" size="30px"/>
      </u>
    </li>
  </div>
</template>

<script>
import Navbar from "../../common/navbar";
import myJsTools from "../../utils/myJsTools";
import {
  saveMedicinePrescriptionsSwitchAutomatically,
  selectMedicinePrescriptionsSwitchAutomatically
} from "../../api/set";
import {getConfigInfoByKey} from "../../api/my";
import {Toast} from "vant";

export default {
  name: "preAuto",
  components: {Navbar},
  data() {
    return {
      checked: false,
      is_auto_check_prescription: "",//是否自动审核处方 1是 0否
    }
  },
  created() {
    this.is_auto_check_prescription = myJsTools.getItem("global_config").is_auto_check_prescription;
    this.getConfig();
  },
  methods: {
    getConfig() {
      getConfigInfoByKey({
        configKey: "is_auto_check_prescription"
      }).then(res => {
        this.is_auto_check_prescription = res.data.configValue;
        if (this.is_auto_check_prescription == '1') {
          this.getDocSet();
        }
      })
    },
    getDocSet() {
      selectMedicinePrescriptionsSwitchAutomatically({
        docId: myJsTools.getItem("token_info").docId
      }).then(res => {
        this.checked = res.data.isAutoCheck == '1' ? true : false;
      })
    },
    tapSwitch() {
      getConfigInfoByKey({
        configKey: "is_auto_check_prescription"
      }).then(res => {
        this.is_auto_check_prescription = res.data.configValue;
        if (this.is_auto_check_prescription == '0') {
          this.checked = false;
          Toast("医院未给您开通自动审方权限");
        } else {
          saveMedicinePrescriptionsSwitchAutomatically({
            docId: myJsTools.getItem("token_info").docId,
            isAutoCheck: this.checked ? '1' : '0'
          }).then(res => {

          })
        }
      })
    }
  }
}
</script>

<style scoped lang="less">


.switchService {
  .display-div;
  padding: 12px 15px;
  .black-font;
  .font-size-md;
  background: @white;
  line-height: 20px;
  border-radius: 8px;
}
</style>
