<template>
  <div class="setPass" id="setPass">
    <navbar type="defaultPage" :title="tagType != 1 ? '设置密码' : '重设密码'"></navbar>
    <div class="loginBody">
      <div class="fromData">
        <van-field
          v-model="telNo"
          label
          type="number"
          clearable
          placeholder="请输入您的手机号"
          v-if="!flag"
        ></van-field>
        <van-field
          class="captcha"
          v-model="captcha"
          label
          type="number"
          maxlength="6"
          placeholder="请输入短信验证码"
          v-if="!flag"
          clearable
        >
          <template #button>
            <button class="font-login-sm code-gray-btn" @click="getCode">
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
          :placeholder="flag?'输入密码':'输入新密码'"
        ></van-field>
        <van-field
          v-model="repeatPass"
          class="captcha"
          label
          clearable
          type="password"
          :placeholder="flag?'再次输入密码':'再次输入新密码'"
        ></van-field>
      </div>
      <button class="btn publicBtn" :style="{'margin-top':flag?'258px':'145px'}" @click="commit">确认</button>
    </div>
  </div>
</template>

<script>
  import $api from "@/utils/api.js";
  import navbar from "@/common/navbar";
  import {Toast} from "vant";
  import {
    sendCaptcha,
    hisDoctorSetPasswordByTelPhoneAndCaptcha,
    hisDoctorUpdatePassword
  } from "@/api/login";
  import myJsTools from "../../utils/myJsTools";
  import {docSetPasswordByTelNo, hisDoctorFirstLogSetPassword} from "../../api/login";

  export default {
    components: {navbar},
    data() {
      return {
        flag: true, //flag为false的时候显示填写手机号和验证码 忘记密码，true为设置密码
        telNo: "",
        newPass: "",
        repeatPass: "",
        captcha: "",
        tagType: "",
        codeinfo: {
          sendAuthCode: false,
          auth_time: "",
          btnText: "获取验证码"
        } //验证码时间及是否可点击
      };
    },
    created() {
      var telNo = this.$route.query.telNo;
      var captcha = this.$route.query.captcha;
      this.flag = this.$route.query.flag; //false为密码登录设置密码 true为验证码设置密码
      this.tagType = this.$route.query.tagType; //tagType有值时为忘记密码
      if (telNo) {
        this.telNo = telNo;

        if (this.flag) {
          this.captcha = captcha;
        } else {
          this.captcha = "";
        }
      }
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
        }else if(this.$route.query.pageType == 'register'){
          var param = {
            telNo: myJsTools.getItem("token_info").telNo,
            password: this.newPass,
          };
          docSetPasswordByTelNo(param).then(res => {
            Toast("注册成功");
            this.$router.go(-2);
          });
        } else {
          var param = {
            userId: myJsTools.getItem("token_info").userId,
            password: this.newPass,
          };
          hisDoctorFirstLogSetPassword(param).then(res => {
            Toast("密码设置成功");
              this.$router.replace({
                name: "mainIndex"
              });
          });
        }
      },
      // 获取短信验证码
      getCode() {
        if (this.telBlur() && !this.codeinfo.sendAuthCode) {
          var para = {};
          para.telNo = this.telNo;
          sendCaptcha(para).then((response) => {
            console.log(response);
            Toast("验证码发送成功");
            this.codeinfo.sendAuthCode = true;
            this.codeinfo.auth_time = 60;
            var auth_timetimer = setInterval(() => {
              this.codeinfo.auth_time--;
              this.codeinfo.btnText = this.codeinfo.auth_time + "s后重新发送";
              if (this.codeinfo.auth_time <= 0) {
                this.codeinfo.sendAuthCode = false;
                this.codeInfo = Object.assign({}, this.codeInfo)
                this.codeinfo.btnText = "获取验证码";
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
  @import url("../../assets/css/overall");

  .loginBody {
    padding: 0 38px;
    background: @white;

    .fromData {
      margin-top: 38px;
      button {
        line-height: @font-line-height;
      }

      .captcha {
        margin-top: 15px;
      }

      .van-cell {
        line-height: 20px;
        padding: 25px 0px 11px;
        border-bottom: 0.5px solid @back-border;
      }
    }

    .changeLogin {
      .font-login-color;
      .font-size-md;
      margin-top: 12px;
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
</style>
