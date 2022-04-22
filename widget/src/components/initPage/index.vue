<template>
  <div class="init">
    <img :src="logoSrc" class="logo" />
    <div class="bottom">
      <button class="publicBtn" @click="openApp">立即体验</button>
      <div class="agree">
        <van-checkbox v-model="checked" icon-size="14">
          <span class="font-login-sm font-login-color">已阅读并同意</span>
          <span
            class="font-login-sm font-login-color-blue"
            @click="openAgreement('4')"
            >《服务协议》</span
          >
          <span class="font-login-sm font-login-color">与</span>
          <span
            class="font-login-sm font-login-color-blue"
            @click="openAgreement('5')"
            >《隐私政策》</span
          >
        </van-checkbox>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import myJsTools from "../../utils/myJsTools";

export default {
  name: "index",
  data() {
    return {
      checked: false,
      logoSrc: require("../../assets/img/init/logo.png")
    };
  },
  created() {
    // console.log("sss");
    this.logoSrc = myJsTools.getItem("logoSrc");
    // if (process.env.NODE_ENV != 'development') {
    //   api.clearCache(function() {
    // Toast("清除成功")
    //   });
    // }
  },
  methods: {
    openAgreement(type) {
      this.$router.push({
        name: "protocol",
        query: {
          type: type //隐私服务协议
        }
      });
    },
    openApp() {
      if (!this.checked) {
        Toast("请先阅读并同意协议");
        return;
      }
      myJsTools.setItem("firstInit", "2"); //设置启动页不显示
      this.$router.push({
        name: "login"
      });
    }
  }
};
</script>

<style scoped lang="less">
.logo {
  position: relative;
  width: 97px;
  height: 126px;
  left: 50%;
  transform: translate(-50%, 60%);
}
.bottom {
  position: fixed;
  bottom: 71px;
  text-align: center;
  padding: 0 38px;
  width: 100%;
  box-sizing: border-box;
  .agree {
    margin: 20px auto;
    width: 98%;
  }
}
</style>
