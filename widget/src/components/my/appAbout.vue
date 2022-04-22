<template>
  <div>
    <navbar title="关于"></navbar>
    <div>
      <div class="logoDiv">
        <img :src="logoSrc" class="logo">
        <div>V.{{ appVersion }}</div>
      </div>
      <div class="bottom">
        开启中国医生的全新工作方式
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "../../common/navbar";
import myJsTools from "../../utils/myJsTools";

export default {
  name: "appAbout",
  components: {Navbar},
  data() {
    return {
      appVersion: "0.0.1",
      logoSrc: require("../../assets/img/my/fit_logo.png"),
    }
  },
  created() {
    this.appVersion = api.appVersion;
    this.logoSrc = myJsTools.getItem("logoSrc");
  }
}
</script>

<style scoped lang="less">


.logoDiv {
  position: relative;
  left: 50%;
  transform: translate(-50%, 60%);
  text-align: center;
  .black-font;
  .font-size-sm;
}

.logo {
  width: 97px;
  height: 126px;
  display: inline-block;
}

.bottom {
  position: fixed;
  bottom: 23px;
  .font-size-sm;
  .font-login-color;
  width: 100%;
  text-align: center;
}
</style>
