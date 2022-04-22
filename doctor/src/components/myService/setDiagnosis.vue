<template>
  <div class="zzSet">
    <navbar title="身份验证设置"></navbar>
    <div class="setDiv" v-if="hosPrescriptionAuthenticate == '0'">
      <li class="openLi">
        <u>
          <span>身份验证设置</span>
          <span class="tips">请设置您开方时是否再次进行身份验证</span>
        </u>
        <u><van-switch :disabled="hosPrescriptionAuthenticate == '1'" v-model="checked" size="24px" @change="changeSwitch"/></u>
      </li>
    </div>
    <div v-else class="emptyDiv">
      <img src="../../assets/img/my/qx.png" class="noneQx emptyIcon">
      <li>暂无设置权限</li>
    </div>
    <van-popup v-model="showInfo" class="popup" :close-on-click-overlay="false">
      <li class="title">请填写您的信息验证</li>
      <li>验证成功将保存您的开关设置</li>
      <div>
        <van-field
          v-model="name"
          label="姓名"
          type="text"
          placeholder="请输入姓名"
          clearable
        ></van-field>
        <van-field
          v-model="idNo"
          label
          type="text"
          label="身份证号"
          placeholder="请输入身份证号"
          maxlength="18"
          clearable

        ></van-field>
        <van-field
          v-model="telNo"
          label
          type="number"
          placeholder="请输入手机号"
          clearable
          maxlength="11"
          label="手机号"
        ></van-field>
        <van-field
          class="captcha"
          v-model="captcha"
          label
          maxlength="6"
          type="number"
          label="验证码"
          placeholder="请输入短信验证码"
          clearable
        >
          <template #button>
            <button class="font-login-color-blue" @click="getCode" :disabled="!codeinfo.sendAuthCode">
              {{ codeinfo.btnText }}
            </button>
          </template>
        </van-field>
      </div>
      <div class="btns">
        <button class="publicWhiteBtn" @click="verInfo('cancel')">取消</button>
        <button class="publicBtn twoBtn" @click="verInfo">确定</button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import Navbar from "../../common/navbar";
import myJsTools from "../../utils/myJsTools";
import {
  docBeforeThePrescriptionPrescriptionAuthenticate,
  editDoctorPrescriptionAuthenticate, getDoctorPrescriptionAuthenticate
} from "../../api/set";
import {Toast} from "vant";
import {sendCaptcha} from "../../api/login";
import regex from "../../utils/regex";
export default {
  name: "setDiagnosis",
  components: {Navbar},
  data(){
    return{
      checked:false,
      hosPrescriptionAuthenticate:"",
      showInfo:false,
      name:"",
      idNo:"",
      captcha:"",
      telNo:"",
      codeinfo: {
        sendAuthCode: true,
        auth_time: "",
        btnText: "发送验证码"
      }, //验证码时间及是否可点击
    }
  },
  created() {
      this.getSet();
  },
  methods:{
    // 获取短信验证码
    getCode() {
      if (this.telBlur()) {
        this.codeinfo.sendAuthCode = false;
        var para = {};
        para.telNo = this.telNo;
        sendCaptcha(para).then(response => {
          console.log(response);
          Toast("验证码发送成功");
          this.codeinfo.sendAuthCode = true;
          this.codeinfo.auth_time = 60;
          var auth_timetimer = setInterval(() => {
            this.codeinfo.auth_time--;
            this.codeinfo.btnText = this.codeinfo.auth_time + "s后重新发送";
            if (this.codeinfo.auth_time <= 0) {
              this.codeinfo.sendAuthCode = false;
              this.codeinfo.btnText = "发送验证码";
              clearInterval(auth_timetimer);
            }
          }, 1000);
        });
      }
    },
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
    //验证身份信息
    verInfo(type){
      if(type == 'cancel'){
        this.showInfo = false;
        this.checked = true;
        this.codeinfo = {
          sendAuthCode: true,
            auth_time: "",
            btnText: "发送验证码"
        }
        this.name = "";
        this.idNo = "";
        this.telNo = "";
        this.captcha = "";
      }else{
        if (regex.nameBlur(this.name) && regex.idNoBlur(this.idNo) && this.telBlur() && this.codeBlur() ){
          docBeforeThePrescriptionPrescriptionAuthenticate({
            docId:myJsTools.getItem("token_info").docId,
            docName:this.name,
            idNo:this.idNo,
            telNo:this.telNo,
            captcha:this.captcha
          }).then(res=>{
            this.checked = false;
            this.showInfo = false;
            editDoctorPrescriptionAuthenticate({
              docId: myJsTools.getItem("token_info").docId,
              prescriptionAuthenticate: this.checked ? '1':'0'
            }) .then(res=>{

            })
          })
        }
      }
    },
    //获取医生的设置及平台的配置
    getSet(){
      getDoctorPrescriptionAuthenticate({
        docId: myJsTools.getItem("token_info").docId
      }).then(res=>{
        this.hosPrescriptionAuthenticate = res.data.hosPrescriptionAuthenticate;
        if(res.data.hosPrescriptionAuthenticate == '1'){
          this.checked = true;
        }else{
          this.checked = res.data.docPrescriptionAuthenticate == '1' ? true : false;
        }
      })
    },
    //开关
    changeSwitch(val){
      getDoctorPrescriptionAuthenticate({
        docId: myJsTools.getItem("token_info").docId
      }).then(res=>{
        this.hosPrescriptionAuthenticate = res.data.hosPrescriptionAuthenticate;
        if(res.data.hosPrescriptionAuthenticate != '1'){
          if(!val){
            this.showInfo = true;
          }else{
            editDoctorPrescriptionAuthenticate({
              docId: myJsTools.getItem("token_info").docId,
              prescriptionAuthenticate: this.checked ? '1':'0'
            }) .then(res=>{

            })
          }
        }else {
          this.checked = true;
        }

      })

    },
  }
}
</script>

<style scoped lang="less">

.openLi{
  padding: 12px 16px;
  background: @white;
  border-bottom: 0.5px solid @back-border;
  .display-div;
  .font-size-md;
  .black-font;
  line-height: 22px;
  .tips{
    .font-color-2;
    margin-top: 3px;
  }
  span{
    display: block;
  }
}

.popup{
  li,.title{
    margin-bottom: 12px;
  }
  .van-cell{
    padding: 6px 12px;
    margin:0px 0 8px;
    background: #F8F8F8;
    border: none;
  }
}

.setDiv{
  /deep/.van-field__control {
    text-align: right;
  }
}
/deep/ .van-field__label{
  .font-color-2;
  width: 60px;
}
</style>
