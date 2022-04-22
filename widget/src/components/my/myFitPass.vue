<template>
  <div class="myFitPass">
    <navbar type="defaultPage" title="修改密码"></navbar>
    <div class="loginBody">
      <div class="fromData">
        <van-field
          v-model="telNo"
          label
          type="number"
          clearable
          placeholder="请输入您的手机号"
        ></van-field>
        <van-field
          class="captcha"
          v-model="captcha"
          label
          type="number"
          maxlength="6"
          placeholder="请输入短信验证码"
          clearable
        >
          <template #button>
            <button @click="getCode" class="font-login-color-blue" :disabled="!codeinfo.sendAuthCode">
              {{ codeinfo.btnText }}
            </button>
          </template>
        </van-field>
        <van-field
          v-model="newPass"
          class="captcha"
          label
          clearable
          type="password"
          placeholder="请输入新密码"
        ></van-field>
        <van-field
          v-model="repeatPass"
          class="captcha"
          label
          clearable
          type="password"
          placeholder="请重复新密码"
        ></van-field>
      </div>
    </div>
    <div class="bottomBtn" @click="commit">
      <button class="publicBtn">保存</button>
    </div>
  </div>
</template>
<script>
import $api from "@/utils/api.js";
import navbar from "@/common/navbar";
import { Toast } from "vant";
import {
  sendCaptcha,
  hisDoctorSetPasswordByTelPhoneAndCaptcha,
  hisDoctorUpdatePassword
} from "@/api/login";
import myJsTools from "../../utils/myJsTools";
export default {
  name: "myFitPass",
  components: { navbar },
  data() {
    return {
      flag: true, //flag为false的时候显示填写手机号和验证码 忘记密码，true为设置密码
      telNo: "",
      captcha: "",
      newPass: "",
      repeatPass: "",
      tagType: "",
      codeinfo: {
        sendAuthCode: true,
        auth_time: "",
        btnText: "发送验证码"
      } //验证码时间及是否可点击
    };
  },
  created() {
    var telNo = this.$route.query.telNo;
    var captcha = this.$route.query.captcha;
    if (telNo) {
      this.telNo = telNo;
      this.flag = this.$route.query.flag; //false为密码登录设置密码 true为验证码设置密码
      this.tagType = this.$route.query.tagType; //tagType有值时为忘记密码
      console.log(this.tagType);
      if (this.flag) {
        this.captcha = captcha;
      } else {
        this.captcha = "";
      }
    }
  },
  mounted() {
    // $api.css(
    //   $api.byId("setPass"),
    //   "padding-top:" + parseInt(api.safeArea.top) + "px"
    // );
  },
  methods: {
    //手机号正则表达式
    telBlur() {
      var re = /^1\d{10}$/;
      if (!this.telNo) {
        Toast("手机号不能为空");
        return false;
      } else if (!re.test(this.telNo)) {
        Toast("请输入正确的手机号");
        return false;
      } else {
        return true;
      }
    },
    //设置密码或修改密码
    commit() {
      if (!this.flag) {
        if (!this.telBlur()) {
          return;
        }
        if (!this.captcha) {
          Toast("验证码不能为空");
          return;
        }
      }
      // 设置或修改都验证密码
      var patrn = /(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{8,12}/;
      let input_value = this.newPass.replace(/(^\s*)|(\s*$)/g, "");
      if (!patrn.test(input_value)) {
        Toast("密码必须是8-12位字母和数字组合");
        return;
      }
      if (!this.repeatPass) {
        Toast("请输入确认密码");
        return;
      }
      if (this.repeatPass != this.newPass) {
        Toast("两次输入密码不正确，请重新输入");
        return;
      }

      if (this.tagType == "1") {
        var param = {
          captcha: this.captcha,
          newPassword: this.newPass,
          telNo: this.telNo
        };
        hisDoctorUpdatePassword(param).then(res => {
          Toast("密码修改成功");
          this.$router.go(-1);
        });
      } else {
        var param = {
          captcha: this.captcha,
          password: this.newPass,
          telNo: this.telNo
        };
        hisDoctorSetPasswordByTelPhoneAndCaptcha(param).then(res => {
          Toast("密码设置成功");
          myJsTools.setItem("token_info", {});
          myJsTools.setItem("showCodeLogin", true);
          myJsTools.setItem("active", 0);
          var easeChat = api.require("easeChat");
          easeChat.logout(function(ret, err) {
            if (ret.status) {
              api.alert({ msg: "退出成功" });
            } else {
              api.alert({ msg: JSON.stringify(err) });
            }
          });
          this.$router.push({
            name: "login"
          });
        });
      }
    },
    // 获取短信验证码
    getCode() {
      if (this.telBlur()) {
        this.codeinfo.sendAuthCode = false;
        var para = {};
        para.telNo = this.telNo;
        sendCaptcha(para).then(response => {
          console.log(response);
          Toast("验证码发送成功");
          this.codeinfo.auth_time = 60;
          var auth_timetimer = setInterval(() => {
            this.codeinfo.auth_time--;
            this.codeinfo.btnText = this.codeinfo.auth_time + "s后重新发送";
            if (this.codeinfo.auth_time <= 0) {
              this.codeinfo.sendAuthCode = true;
              this.codeinfo.btnText = "发送验证码";
              clearInterval(auth_timetimer);
            }
          }, 1000);
        });
      }
    }
  }
};
</script>
<style scoped lang="less">

.loginBody {
  padding-top: 12px;
  background: @white;
  .fromData {
    button {
      border: none;
      font-size: 14px;
      .font-size-md;
      line-height: 20px;
      background: @white;
    }
    .van-cell {
      line-height: 20px;
      padding: 12px 16px;
    }
  }
  .changeLogin {
    .font-size-md;
    .font-login-color;
    margin-top: 12px;
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
}
</style>
