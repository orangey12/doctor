<template>
  <div>
    <navbar title="注册"></navbar>
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
            <button class="font-login-sm code-gray-btn font-login-color-blue" @click="getCode" :disabled="!codeinfo.sendAuthCode">
              {{ codeinfo.btnText }}
            </button>
          </template>
        </van-field>
      </div>
      <button class="btn publicBtn" style="margin-top: 258px" @click="commit">下一步</button>
    </div>
    <van-popup v-model="isDocTips" class="popup setPassPopup">
      <img src="../../assets/img/login/login.png" class="loginIcon"/>
      <div class="tipsInfo">
        <li class="title">提示</li>
        <p>该手机号已被注册，是否立即登录</p>
        <button class="btn publicBtn" @click="goBack">确定</button>
        <button class="cancel" @click="isDocTips = false">取消</button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import Navbar from "../../common/navbar";
import {Toast} from "vant";
import {docRegisterTelNo, docUpdateHxStatus, sendCaptcha} from "../../api/login";
import myJsTools from "../../utils/myJsTools";

export default {
  name: "registerDoc",
  components: {Navbar},
  data(){
    return{
      telNo: "",
      captcha: "",
      isDocTips:false,
      codeinfo: {
        sendAuthCode: true,
        auth_time: "",
        btnText: "获取验证码"
      } //验证码时间及是否可点击
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
    //登录返回上一页
    goBack(){
      this.$router.go(-1);
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
    },
    //环信注册
    registerUser(res) {
      var that = this;
      var easeChat = api.require("easeChat");
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
            }).then(res=>{
              console.log("环信注册成功调用接口");
              that.$router.push({
                name:"setPass",
                query:{
                  flag:true,
                  pageType:"register"
                }
              })
            })
          } else {
            console.log(JSON.stringify(err) + "环信注册失败");
          }
        }
      );
    },
    commit(){
      if (this.codeBlur() && this.telBlur()) {
        docRegisterTelNo({
          captcha:this.captcha,
          telNo:this.telNo
        }).then(res=>{
          console.log(res);
          if(res.data && res.data.isDoc){
            this.isDocTips = true; //如果是已经注册的提示去登录
          }else if(res.data){
            myJsTools.setItem("docShStatus",3);//0.待审核 1.未通过 2.已通过 3.未提交审核
            this.$store.commit("setDocShStatus",3);
            res.data.telNo = this.telNo;
            myJsTools.setItem("token_info",res.data);//1 为待审核  2为
            myJsTools.setItem("docUserInfo",res.data);
            this.registerUser(res);
          }
        })
      }
    },
  }
}
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
