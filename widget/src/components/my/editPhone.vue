<template>
    <div>
      <navbar title=""></navbar>
      <div class="fromData">
        <van-field
          v-model="telNo"
          label
          type="number"
          placeholder="请输入新的的手机号"
          clearable
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
            <button @click="getCode" :disabled="!codeinfo.sendAuthCode">
              {{ codeinfo.btnText }}
            </button>
          </template>
        </van-field>
      </div>
      <div class="bottomBtn" @click="commitNewPhone">
        <button class="publicBtn">确定</button>
      </div>
    </div>
</template>

<script>
    import Navbar from "../../common/navbar";
    import {Toast} from "vant";
    import {sendCaptcha} from "../../api/login";
    import {verificationCode} from "../../api/myCenter";
    export default {
        name: "editPhone",
      components: {Navbar},
      data(){
          return{
            telNo:"",
            beforeTelNo:"",//之前的手机号
            captcha:"",
            codeinfo: {
              sendAuthCode: true,
              auth_time: "",
              btnText: "发送验证码"
            } //验证码时间及是否可点击
          }
      },
      created() {
        this.beforeTelNo = this.$route.query.telNo;
      },
      methods:{
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
          } else if (this.beforeTelNo == this.telNo) {
            Toast("请输入新的手机号");
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
        commitNewPhone(){
          verificationCode({
            telNo:this.telNo,
            captcha: this.captcha
          }).then(res=>{
            console.log(res);
            api.sendEvent({
              name: 'editPhone',
              extra: {
                telNo: this.telNo,
              }
            });
            this.$router.go(-1);
          })
        },
      }
    }
</script>

<style scoped lang="less">

  .fromData {
    button {
      border: none;
      color: #14A0E6;
      font-size: 14px;
      line-height: 20px;
      background: #ffffff;
    }
    .van-cell {
      line-height: 20px;
      padding: 12px 16px;
      font-size: 14px;
      line-height: 20px;
      /deep/input::-webkit-input-placeholder{
        color: #333333;
        font-size: 14px;
        line-height: 20px;
      }
      /*border-bottom: 0.4 solid #ebebeb;*/
    }
  }
  .saveBtn{
    text-align: center;
    margin-top: 120px;
    width: 100%;
    font-weight: 600;
    button{
      background: #14A0E6;
      font-size: 18px;
      color: #ffffff;
      width: 90%;
      line-height: 44px;
      border-radius: 24.5px;
    }
  }
</style>
