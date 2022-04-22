<template>
  <div class="myFit">
    <navbar type="defaultPage" title="设置"></navbar>
    <div class="myFit_box">
      <img :src="logoSrc" alt/>
      <p>开启中国医生的全新工作方式</p>
    </div>
    <div class="my_menu">
      <div class="my_menu_item" @click="goNews">
        <span>新消息通知</span>
        <img src="@/assets/img/my/my_back.png" alt/>
      </div>
      <div class="my_menu_line"></div>
      <div class="my_menu_item" @click="goPass">
        <span>修改/设置密码</span>
        <img src="@/assets/img/my/my_back.png" alt/>
      </div>
      <div class="my_menu_line"></div>
      <div class="my_menu_item" @click="uploadFIle">
        <span>日志上传</span>
        <img src="@/assets/img/my/my_back.png" alt/>
      </div>
      <div class="my_menu_line"></div>
      <div class="my_menu_item" @click="openXyPage('4')">
        <span>服务协议</span>
        <img src="@/assets/img/my/my_back.png" alt/>
      </div>

      <div class="my_menu_line"></div>
      <div class="my_menu_item" @click="openXyPage('5')">
        <span>隐私政策</span>
        <img src="@/assets/img/my/my_back.png" alt/>
      </div>
      <div class="my_menu_line" v-if="isAndrio"></div>
      <div class="my_menu_item" @click="openQxPage" v-if="isAndrio">
        <span>隐私设置</span>
        <img src="@/assets/img/my/my_back.png" alt/>
      </div>
      <div class="my_menu_line"></div>
      <div class="my_menu_item" @click="openFeedBack(1)">
        <span>意见反馈</span>
        <img src="@/assets/img/my/my_back.png" alt/>
      </div>
      <div class="my_menu_line"></div>
      <div class="my_menu_item" @click="openCancellation">
        <span>注销申请</span>
        <img src="@/assets/img/my/my_back.png" alt/>
      </div>
      <div class="my_menu_line"></div>
      <div class="my_menu_item" @click="openOther()">
        <span>关于</span>
        <img src="@/assets/img/my/my_back.png" alt/>
      </div>
    </div>
    <div class="myFit_btn" @click="loginOut">退出登录</div>
  </div>
</template>
<script>
import $api from "@/utils/api.js";
import navbar from "@/common/navbar";
import {findDoctorByID} from "@/api/my";
import myJsTools from "../../utils/myJsTools";
import date from "../../utils/date";
import ajPushTools from "../../utils/ajPush";

export default {
  name: "myFit",
  components: {navbar},
  data() {
    return {
      logoSrc: require("../../assets/img/my/fit_logo.png"),
      isAndrio:false
    };
  },
  created() {
    this.logoSrc = myJsTools.getItem("logoSrc");
    if(api.systemType != 'ios'){
      this.isAndrio = true;
    }
  },
  methods: {
    openQxPage(){
      this.$router.push({
        name:"qxPage"
      })
    },
    goNews() {
      this.$router.push({
        name: "myFitNews"
      });
    },
    goPass() {
      this.$router.push({
        name: "myFitPass"
      });
    },
    openFeedBack(){
      this.$router.push({
        name: "feedback"
      });
    },
    //注销申请
    openCancellation(){
      this.$router.push({
        name: "cancellation"
      });
    },
    async loginOut() {
      myJsTools.setItem("token_info", {});
      myJsTools.setItem("showCodeLogin", true);
      myJsTools.setItem("active", 0);
      var easeChat = api.require("easeChat");
      easeChat.logout(function (ret, err) {
        if (ret.status) {
          console.log(JSON.stringify(ret) + "环信退出成功");
        } else {
          console.log(JSON.stringify(err) + "环信退出失败");
        }
      });
      await ajPushTools.loginOut();
      this.$router.push({
        name: "login"
      });
    },
    // 打开服务协议
    openXyPage(type) {
      this.$router.push({
        name: "protocol",
        query: {
          type: type
        }
      });
    },
    //打开关于
    openOther() {
      this.$router.push({
        name: "appAbout"
      })
    },
    //上传日志
    uploadFIle() {
      myJsTools.uploadErrFile("set");
    },
  }
};
</script>
<style scoped lang="less">


.myFit_box {
  background: @white;
  padding: 44px 0 24px 0;

  img {
    width: 80px;
    height: 99px;
    margin: 0 auto 24px;
  }

  p {
    .font-color-2;
    .font-size-sm;
    line-height: 17px;
    text-align: center;
  }
}

.my_menu {
  width: 100%;
  margin-top: 12px;

  &_item {
    width: 92%;
    background: @white;
    padding: 12px 4%;
    display: flex;
    align-items: center;
    .font-size-md-2;
    .black-font;
    line-height: 21px;
    position: relative;

    img {
      .icon-width-height-sm;
      position: absolute;
      right: 4%;
    }

    span {
      margin-left: 10px;
    }
  }

  &_line {
    width: 92%;
    margin: 0 auto;
    height: 1px;
    background: @white;
  }
}

.myFit_btn {
  .font-login-color-red;
  .font-size-md;
  line-height: 22px;
  padding: 12px 0;
  width: 100%;
  text-align: center;
  background: @white;
  margin-top: 16px;
}
</style>
