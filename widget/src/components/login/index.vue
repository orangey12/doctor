<template>
  <div class="login" id="login">
    <header :style="{'background':'url('+ backUrl +') no-repeat','background-size': '100% 60%'}">
      <img :src="logoSrc" class="logoIcon">
    </header>
    <div class="loginBody">
      <div class="fromData" v-show="showCodeLogin">
        <van-field v-model="telNo" label type="number" placeholder="请输入您的手机号" clearable></van-field>
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
            <button class="font-login-sm code-gray-btn" @click="getCode">{{ codeinfo.btnText }}</button>
          </template>
        </van-field>
      </div>
      <div class="fromData" v-show="!showCodeLogin">
        <van-field v-model="telNo" label type="number" placeholder="请输入您的手机号" clearable></van-field>
        <van-field
          class="captcha"
          v-model="password"
          label
          type="password"
          placeholder="请输入登录密码"
          clearable
        ></van-field>
      </div>
      <div class="changeLogin center-div font-login-sm display-div font-login-color" v-show="showCodeLogin">
        <span @click="changLogin">密码登录</span>
        <span @click="registerDoc">注册</span>
      </div>
      <div class="changeLogin center-div font-login-sm display-div font-login-color" v-show="!showCodeLogin">
        <span @click="changLogin">手机验证码登录</span>
        <span @click="openSetPass('1')">忘记密码？</span>
      </div>
      <button class="publicBtn loginBtn" @click="login">登录</button>
      <div class="agree">
        <van-checkbox v-model="checked" icon-size="14">
          <span class="font-login-sm font-login-color">已阅读并同意</span>
          <span class="font-login-sm font-login-color-blue" @click="openAgreement('4')">《服务协议》</span>
          <span class="font-login-sm font-login-color">与</span>
          <span class="font-login-sm font-login-color-blue" @click="openAgreement('5')">《隐私政策》</span>
        </van-checkbox>
      </div>
      <van-popup v-model="showSetSelect" class="popup setPassPopup">
        <img src="../../assets/img/login/login.png" class="loginIcon"/>
        <div class="tipsInfo">
          <li class="title">提示</li>
          <p>若希望以后使用手机号与密码登录</p>
          <p>您可以去设置密码</p>
          <button class="btn publicBtn" @click="openSetPass()">去设置</button>
          <button class="cancel" @click="closePass">跳过</button>
        </div>
      </van-popup>
      <van-popup v-model="showTips" class="popup setPassPopup">
        <img src="../../assets/img/login/login.png" class="loginIcon"/>
        <div class="tipsInfo">
          <!-- <li class="title">提示</li> -->
          <p>该手机号未注册，是否立即注册</p>
          <button class="btn publicBtn" @click="registerDoc">确定</button>
          <button class="cancel" @click="showTips = false">取消</button>
        </div>
      </van-popup>
      <van-popup v-model="showQxPopup" class="popup setQXPopup" :close-on-click-overlay="false">
        <div class="tipsInfo">
          <li class="title font-login-color-blue">设置权限及隐私政策</li>
          <div style="text-align: left">我们将向您提示申请使用如下权限，请详细确认使用目的</div>
          <div class="qxTips">
            <div>摄像头权限</div>
            <div>用于拍摄照片上传头像或与聊天沟通发送照片.</div>
          </div>

          <div class="qxTips">
            <div>录音权限</div>
            <div>用于聊天沟通发送音频信息.</div>
          </div>

          <div class="qxTips">
            <div>本地相册权限</div>
            <div>用于选择图片上传头像或与聊天沟通发送图片.</div>
          </div>

          <div v-html="content" class="contentDiv"></div>
          <div class="positionBtn">
            <button class="btn publicBtn" @click="commitQxTips">同意</button>
            <span @click="showNotAcess=true">不同意并退出app</span>
          </div>
        </div>
      </van-popup>
      <van-popup v-model="showNotAcess" class="popup">
        <li class="title">提示</li>
        <p>亲，要不再想想</p>
        <div class="btns">
          <button class=" publicWhiteBtn" @click="exitApp()">退出应用</button>
          <button class="twoBtn publicBtn" @click="showNotAcess=fasle">再次看看</button>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import {Toast} from "vant";
import {
  sendCaptcha,
  hisDoctorLoginByTelPhoneAndCaptcha,
  hisDoctorLoginByTelPhoneAndPassword,
  getConfigInfo,
} from "@/api/login";
import myJsTools from "@/utils/myJsTools";
import navbar from "../../common/navbar";
import {docUpdateHxStatus, getUserIdentityInfo} from "../../api/login";
import ajPushTools from "../../utils/ajPush";
import {findVisitAgreement} from "../../api/my";

export default {
  components: {navbar},
  data() {
    return {
      telNo: "",
      captcha: "",
      password: "",
      backUrl: require("../../assets/img/login/back.png"),
      checked: false,
      showCodeLogin: true, //手机登录和账号密码登录切换 true 为验证码登录，false为密码登录
      showSetSelect: false, //根据是否设置密码显示弹框
      showTips: false, //提示没有权限
      codeinfo: {
        sendAuthCode: false,
        auth_time: "",
        btnText: "获取验证码",
      }, //验证码时间及是否可点击
      logoSrc: require("../../assets/img/nx_logo.png"),
      showQxPopup: false,
      content: "",
      showNotAcess: false
    };
  },
  // 如果有token信息.则直接进主页
  beforeCreate() {
    myJsTools.setItem("token_info", null);
    if (myJsTools.getItem("token_info")) {
      this.$router.replace({
        name: "mainIndex",
      });
    }
  },
  created() {
    if (myJsTools.getItem("firstInitPopup") != '2') {
      this.showQxPopup = true;
    }
    this.logoSrc = myJsTools.getItem("logoSrc") || this.logoSrc;
  },
  mounted() {
    //获取之前选择的登录方式
    if (
      myJsTools.getItem("showCodeLogin") != null ||
      myJsTools.getItem("showCodeLogin") != undefined
    ) {
      this.showCodeLogin = myJsTools.getItem("showCodeLogin");
    }
    this.getXy();
  },
  methods: {
    exitApp() {
      api.closeWidget({
        silent: true
      });
    },
    getXy() {
      findVisitAgreement({
        agreementType: '5'
      }).then(res => {
        this.content = res.data.agreementContent;
      })
    },
    //切换登录方式
    changLogin() {
      this.showCodeLogin = !this.showCodeLogin;
      myJsTools.setItem("showCodeLogin", this.showCodeLogin); //存储选择的登录方式
    },
    //注册医生
    registerDoc() {
      this.$router.push({
        name: "registerDoc"
      })
    },
    commitQxTips() {
      this.showQxPopup = false;
      myJsTools.setItem("firstInitPopup", '2');
    },
    //隐私服务协议页面
    openAgreement(type) {
      this.$router.push({
        name: "protocol",
        query: {
          type: type//隐私服务协议
        }
      })
    },
    //登录
    login() {
      if (!this.checked) {
        Toast("请先阅读并同意协议");
        return;
      }
      if (this.showCodeLogin) {
        if (this.codeBlur() && this.telBlur()) {
          var capParam = {
            captcha: this.captcha,
            telNo: this.telNo,
          };
          hisDoctorLoginByTelPhoneAndCaptcha(capParam).then(async (res) => {
            console.log(JSON.stringify(res) + "用户登录返回信息")
            await this.goIndex(res);
          });
        }
      } else {
        var patrn = /(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{8,12}/;
        let input_value = this.password.replace(/(^\s*)|(\s*$)/g, "");
        if (!patrn.test(input_value)) {
          Toast("密码必须是8-12位字母和数字组合");
          return;
        }
        var passParam = {
          password: this.password,
          telPhone: this.telNo,
        };
        hisDoctorLoginByTelPhoneAndPassword(passParam).then(async (res) => {
          console.log(JSON.stringify(res) + "用户登录返回信息")
          await this.goIndex(res);
        });
      }
    },
    // 注册环信并登录  获取全局参数
    goIndex(res) {
      // 绑定极光推送
      var that = this;
      if (res) {
        myJsTools.setItem("token_info", res.data);
        myJsTools.setItem("docUserInfo", res.data);
        this.$store.commit("setDocShStatus", res.data.docAuditStatus);
        // 全局参数调用
        getConfigInfo().then((response) => {
          var config = {};
          console.log("全局参数接口回参", response);
          for (let i = 0; i < response.data.length; i++) {
            const element = response.data[i];
            config[element.configKey] = element.configValue;
          }
          // 全局参数设置
          myJsTools.setItem("global_config", config);
        });
        //isLogin 判断是否是第一次登录 isUser 是否是团队医生
        if (res.data.hxidIsregist == '0') {
          this.registerUser(res);
        } else if (res.data.isUser) {
          this.showTips = true;
        } else {
          if (process.env.NODE_ENV == 'development') {
            console.log("测试环境 不走环信")
            this.getUserInfo();
          }
          //环信登录
          this.loginHx(res);
        }
      }
    },
    //环信注册
    registerUser(res) {
      var that = this;
      var easeChat = api.require("easeChat");
      console.log(JSON.stringify(easeChat), 'easeChat ========================>删')
      easeChat.easeRegister(
        {
          username: res.data.docId,
          password: res.data.docId,
        },
        function (ret, err) {
          if (ret.status) {
            console.log("注册成功");
            docUpdateHxStatus({
              docId: res.data.docId
            }).then(res => {
              console.log("环信注册成功调用接口");
            })
            //如果是第一次登录，则显示输入密码
            if (res.data.isLogin) {
              that.showSetSelect = true;
            }
            that.loginHx(res);
          } else {
            console.log(JSON.stringify(err) + "环信注册失败");
            if (err.code == "203") {
              that.loginHx(res);
            }
          }
        }
      );
    },
    //获取用户身份信息进行不同按钮显示
    getUserInfo() {
      getUserIdentityInfo().then((res) => {
        console.log(res.data.identityIds);
        if (res.data) {
          let docInfo;
          if (
            res.data.identityIds.indexOf("docIdentityLulutong") != -1 &&
            res.data.identityIds.indexOf("drugDocIdentityLulutong") != -1
          ) {
            docInfo = "all";
            if (this.showSetSelect == false) {
              this.$router.replace({
                name: "mainIndex",
              });
            }
            console.log(
              res.data.identityIds ==
              "docIdentityLulutong,drugDocIdentityLulutong"
            );
          } else if (
            res.data.identityIds.indexOf("docIdentityLulutong") != -1
          ) {
            docInfo = "doc";
            if (this.showSetSelect == false) {
              this.$router.replace({
                name: "mainIndex",
              });
            }

          } else if (
            res.data.identityIds.indexOf("drugDocIdentityLulutong") != -1
          ) {
            docInfo = "drugDoc";
            if (this.showSetSelect == false) {
              this.$router.replace({
                name: "trialPartyIndex",
              });
            }
          }
          myJsTools.setItem("docInfo", docInfo);
        }
      });
    },
    //环信登录并绑定极光
    //环信登录并绑定极光
    loginHx(res) {
      var that = this;
      console.log('环信登录信息参数' + JSON.stringify(res))
      var easeChat = api.require("easeChat");
      easeChat.logout(function (ret, err) {
        if (ret.status) {
          console.log("环信退出登录成功");
          easeChat.login(
            {
              username: res.data.docId,
              password: res.data.docId,
              autoLogin: true,
            },
            function (ret, err) {
              console.log(JSON.stringify(ret) + "环信登录成功返回信息");
              if (ret.status) {
                // 获取用户身份
                that.getUserInfo();
                console.log("登录成功");
                ajPushTools.bindDoc(res.data.docId);
              } else {
                console.log(JSON.stringify(err));
                if (err.code == "204") {
                  that.registerUser(res);
                } else if (err.code == "301") {
                  that.loginHx(res);
                } else if (err.code == "200") {
                  that.getUserInfo();
                } else {
                  that.loginHx(res);
                }
                console.log("登录失败,请重新登录" + JSON.stringify(err));
              }
            }
          );
        } else {
          console.log("环信退出登录失败")
        }
      });

    },
    //关闭设置密码弹框
    closePass() {
      this.showSetSelect = false;
      this.$router.replace({
        name: "mainIndex",
      });
    },
    //验证码字段验证
    codeBlur() {
      var re = /^\d{6}$/;
      if (!this.captcha) {
        Toast("验证码不能为空");
        return;
      } else if (!re.test(this.captcha)) {
        Toast("请输入正确的验证码");
        return false;
      } else {
        return true;
      }
    },
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
    // 打开设置密码页面
    openSetPass(tagType) {
      var query = {
        flag: tagType ? false : true,
        telNo: this.telNo,
        captcha: this.captcha,
      };
      if (tagType) {
        query.tagType = tagType;
      }
      this.$router.push({
        name: "setPass",
        query: query,
      });
    },

    // 获取短信验证码
    getCode() {
      console.log(this.telBlur());
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
    },
  },
};
</script>
<style scoped lang="less">
@import url("../../assets/css/overall");

.login {
  background: @white;
  height: 100%;
}

/deep/ .setQXPopup .tipsInfo {
  padding: 45px 16px 80px 16px;
  height: 66vh;
  overflow: scroll;
}

.tipsInfo {
  .title {
    position: fixed;
    top: 0;
    background: #fff;
    width: 100%;
    left: 0;
    padding: 20px 0px;
  }
}


::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.qxTips {
  text-align: left;
  margin-top: 24px;
}

/deep/ input::placeholder, /deep/ input::-webkit-input-placeholder {
  color: @font-color-7; //c1c1c1
  font-size: @font-size-lg;
}

header {
  background-size: 100% 60%;
  width: 100%;
  height: 222px;
  position: relative;

  img {
    width: 74px;
    height: 100px;
    position: absolute;
    left: 50%;
    top: 68%;
    transform: translate(-50%, -50%);
    /*margin: 30% auto 0;*/
  }
}

.positionBtn {
  position: fixed;
  bottom: 0.32rem;
  left: 0px;
  background: #fff;
  padding: 10px 0px;
  text-align: center;
  width: 90%;

  span {
    margin-top: 12px;
    font-size: 12px;
    padding-left: 12px;
    display: inline-block;
  }
}

.loginBody {
  padding: 25% 38px 0;

  .fromData {
    button {
      line-height: @font-line-height;
    }

    .captcha {
      margin-top: 15px;
    }

    .van-cell {
      line-height: 20px;
      padding: 12px 20px;
      font-size: @font-size-md;
      background: @page-back;
      border-radius: @border-radius;
      border: none;
    }
  }

  .changeLogin {
    margin-top: @font-size-lg;
    width: 100%;
    padding-left: @padding-md;
  }

  .loginBtn {
    margin-top: 78px;
  }

  .agree {
    margin: 20px auto;
    width: 100%;
  }
}
</style>
