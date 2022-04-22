<template>
  <div @click.stop="setPopupStatus">
    <navbar :title="title" @quit="quit"></navbar>
    <v-touch id="touch" v-on:swipeleft="openPatientInfo" v-on:swiperight="onSwipeRight" tag="div">
      <div class="preInfo">
        <div class="patientInfo" @click="openPatientInfo" v-if="userInfo.patientName">
          <img v-zlazy="userInfo.patientImg" class="img-width-height-md">
          <div class="patientDetailInfo">
            <li class="display-div">
              <u class="nameSexAge">
                <span class="patientName black-font font-size-lg">{{ userInfo.patientName }}</span>
                <img
                  src="../../assets/img/index/sex_girl.png"
                  class="sexIcon"
                  v-if="userInfo.sex == '女'"
                />
                <img
                  src="../../assets/img/index/sex.png"
                  class="sexIcon"
                  v-if="userInfo.sex == '男'"
                />
                <span class="ageSpan font-color-2 font-size-sm">{{ userInfo.age }}{{ userInfo.ageUnit }}</span>
              </u>
              <u>
                <img src="../../assets/img/cf/rightArrow.png" class="rightArrow">
              </u>
            </li>
            <li class="complaint" v-if="userInfo.recordsTitle">
              主诉：{{ userInfo.recordsTitle }}
            </li>
          </div>
        </div>

        <showZd :beforeZdList="beforeZdList" v-if="$route.query.status"></showZd>
        <zd-com :beforeZdList="beforeZdList" ref="zdCom" @commitDiagList="commitDiagList" v-else></zd-com>
        <cf-com :regId="regId" v-if="!prePool" ref="cfCom" :docInfo="docInfo"></cf-com>
        <show-patent v-else :orderCfList="orderCfList"></show-patent>
        <div class="addCfBtn" @click="addNewCf" v-if="!prePool">
          <img src="../../assets/img/cf/addCfBtn.png" class="icon-width-height-sm">
          <span>新增处方</span>
        </div>
      </div>
      <div v-if="!$route.query.status">
        <div class="bottomBtn" v-if="pageType=='edit' && !prePool">
          <button class="publicBtn" @click="sendDrug">修改并提审</button>
        </div>

        <div class="bottomBtn" v-else>
          <button class="publicBtn" @click="sendDrug">发送</button>
        </div>
      </div>

      <div class="bottomBtn" v-else-if="prePool && $route.query.status == '1'">
        <button class="publicBtn" @click="confirmCf">确认</button>
      </div>


    </v-touch>
    <van-popup position="right" class="patientPopup"
               v-model="patientPopup" transition-appear duration="0.5">
      <v-touch v-on:swiperight="onSwipeRight" tag="div">
        <div class="illness" :style="{'padding-top':paddingTop + 'px'}">
          <div class="leftArrow" @click="patientPopup=false" :style="{'height': scrollHeight + 'px'}">
            <img src="../../assets/img/cf/whiteArrow.png" class="rightArrow closePopup">
          </div>
          <div class="illnessInfo" :style="{'height': scrollHeight + 'px'}" v-if="blInfo.patientId">
            <v-touch id="touch2" v-on:swiperight="onSwipeRight" tag="div">
              <div class="patientInfo" @click="openPatientInfo">
                <img v-zlazy="blInfo.patientImg" class="img-width-height-md">
                <div class="patientDetailInfo">
                  <li class="display-div">
                    <u class="nameSexAge">
                      <span class="patientName black-font font-size-lg">{{ blInfo.patientName }}</span>
                      <img
                        src="../../assets/img/index/sex_girl.png"
                        class="sexIcon"
                        v-if="blInfo.sex == '女'"
                      />
                      <img
                        src="../../assets/img/index/sex.png"
                        class="sexIcon"
                        v-if="blInfo.sex == '男'"
                      />
                      <span class="ageSpan font-color-2 font-size-sm">{{ blInfo.age }}{{ blInfo.ageUnit }}</span>
                    </u>
                    <u class="openMore" @click="openPatientIndex">
                      <span>查看更多</span>
                      <img src="../../assets/img/cf/doubleArroe.png" class="rightArrow">
                    </u>
                  </li>
                </div>
              </div>
              <div class="thisIllness">
                <img src="../../assets/img/cf/thisTime.png" class="thisTime">
                <van-row class="optTitle">
                  <van-col span="6">
                    问诊时间
                  </van-col>
                  <van-col span="18" class="font-login-color">
                    <span v-if="blInfo.nowCondition.signTime">{{ blInfo.nowCondition.signTime }}</span>
                    <span v-else>无</span>
                  </van-col>
                </van-row>
                <van-row class="optTitle">
                  <van-col span="6">
                    患者主诉
                  </van-col>
                  <van-col span="18" class="font-login-color div-overflow">
                    <span v-if="blInfo.nowCondition.recordsTitle">{{ blInfo.nowCondition.recordsTitle }}</span>
                    <span v-else>无</span>
                  </van-col>
                </van-row>
                <van-row class="optTitle">
                  <van-col span="6">
                    患病时长
                  </van-col>
                  <van-col span="18" class="font-login-color">
                    <span v-if="blInfo.nowCondition.sickTime">
                      {{ blInfo.nowCondition.sickTime }}{{ blInfo.nowCondition.timeUnit }}
                    </span>
                    <span v-else>无</span>
                  </van-col>
                </van-row>
                <van-row class="optTitle">
                  <van-col span="6">
                    病情照片
                  </van-col>
                </van-row>
                <div class="imgShow" v-if="blInfo.nowCondition.diseaseImg && blInfo.nowCondition.diseaseImg.length > 0">
                  <img v-zlazy="item" @click="getImgView(blInfo.nowCondition.diseaseImg,index)"
                       v-for="(item,index) in blInfo.nowCondition.diseaseImg" class="illnessImg">
                </div>
                <div class="imgShow" v-else>
                  <img src="../../assets/img/cf/empty.png" class="illnessImg">
                </div>
              </div>
              <div class="thisIllness">
                <img src="../../assets/img/cf/beforeTime.png" class="thisTime">
                <van-row class="optTitle">
                  <van-col span="6">
                    问诊时间
                  </van-col>
                  <van-col span="18" class="font-login-color">
                    {{ blInfo.lastTimeCondition.signTime }}
                  </van-col>
                </van-row>
                <van-row class="optTitle">
                  <van-col span="6">
                    患者主诉
                  </van-col>
                  <van-col span="18" class="font-login-color div-overflow">
                    <span
                      v-if="blInfo.lastTimeCondition.recordsTitle">{{ blInfo.lastTimeCondition.recordsTitle }}</span>
                    <span v-else>无</span>
                  </van-col>
                </van-row>
                <van-row class="optTitle">
                  <van-col span="6">
                    患病时长
                  </van-col>
                  <van-col span="18" class="font-login-color">
                    <span v-if="blInfo.lastTimeCondition.sickTime">
                      {{ blInfo.lastTimeCondition.sickTime }}{{ blInfo.lastTimeCondition.timeUnit }}
                    </span>
                    <span v-else>无</span>
                  </van-col>
                </van-row>
                <van-row class="optTitle">
                  <van-col span="6">
                    病情照片
                  </van-col>
                </van-row>
                <div class="imgShow"
                     v-if="blInfo.lastTimeCondition.diseaseImg && blInfo.lastTimeCondition.diseaseImg.length > 0">
                  <img v-zlazy="item" v-for="(item,index) in blInfo.lastTimeCondition.diseaseImg" class="illnessImg">
                </div>
                <div class="imgShow" v-else>
                  <img src="../../assets/img/cf/empty.png" class="illnessImg">
                </div>
              </div>
            </v-touch>
          </div>
        </div>
      </v-touch>
    </van-popup>
    <van-popup
      v-model="visitUser"
      class="loginPopup"
      :close-on-click-overlay="false"
      round
    >
      <li class="title">请进行身份验证</li>
      <div class="fromData" v-show="showCodeLogin">
        <van-field
          v-model="telNo"
          label
          type="number"
          placeholder="请输入您的手机号"
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
            <button class="font-login-color-blue" @click="getCode" :disabled="!codeinfo.sendAuthCode">
              {{ codeinfo.btnText }}
            </button>
          </template>
        </van-field>
      </div>
      <div class="fromData" v-show="!showCodeLogin">
        <van-field
          v-model="telNo"
          label
          type="number"
          placeholder="请输入您的手机号"
          clearable
        ></van-field>
        <van-field
          class="captcha"
          v-model="password"
          label
          type="password"
          placeholder="请输入登录密码"
          clearable
        ></van-field>
      </div>
      <div class="changeLogin" @click="changLogin" v-show="showCodeLogin">
        <span>密码验证</span>
      </div>
      <div class="changeLogin" v-show="!showCodeLogin">
        <span @click="changLogin">手机验证码验证</span>
      </div>
      <div class="btns">
        <button class="publicWhiteBtn" @click="visitUser = false">取消</button>
        <button class="publicBtn twoBtn" @click="login">确定</button>
      </div>
    </van-popup>


    <van-popup v-model="usageShow" :close-on-click-overlay="false" class="popup">
      <li class="title">提示</li>
      <li class="tipsInfo">存在未设置用法用量的处方，请您确认</li>
      <div class="btns">
        <button @click="usageShow=false" class="publicBtn commitBtn">确定</button>
      </div>
    </van-popup>

    <van-popup v-model="numTipsShow" :close-on-click-overlay="false" class="popup">
      <li class="title">库存不足</li>
      <li class="tipsInfo">您的处方中，存在库存不足的药品，请修改药品数量后再发送给患者</li>
      <div class="btns">
        <button @click="numTipsShow=false" class="publicBtn commitBtn">确定</button>
      </div>
    </van-popup>

    <img-save
      v-if="showImgPic"
      :showPic="showImgPic"
      :index="index"
      :images="images"
      @changePreview="changePreview"
      @onClose="onClose"
    ></img-save>
  </div>
</template>

<script>
import Navbar from "../../common/navbar";
import myJsTools from "../../utils/myJsTools";
import {
  checkDrugStorage,//验证药品库存是否满足
  getDrugPrescriptionPreInfo,//查询处方模板详情
  getNowAndLastTimeRecord,//根据医生id和患者id查询患者本次以及上次病情
  getPatientInfoRecordTitleByRegId, //根据挂号id查询患者基本信息与主诉
  getPrescriptionInfoById, //根据ID获取处方业务信息
  queryProPrescriptionPoolPrescriptionInfo, //根据主键查询处方池处方信息
  savePrescription, //保存处方
  updateRepurchaseConfirm //复购确认接口
} from "../../api/cf";
import {Toast} from "vant";
import Patent from "../childCompon/patent";
import Herbal from "../childCompon/herbal";
import ImgSave from "../../common/imgSave";
import showZd from '../childCompon/showZd'
import {getDoctorInfo} from "../../api/myCenter";
import {sendCaptcha, verificationCode, verificationTelNoAndPassword} from "../../api/login";
import eschatUnit from "../../utils/eschat";
import ZdCom from "../childCompon/zdCom";
import CfCom from "../childCompon/cfCom";
import {getDoctorInfoByDocId} from "../../api/my";
import {mapGetters} from 'vuex'
import ShowPatent from "../childCompon/showPatent";
import {docBeforeThePrescriptionNeedCheck} from "../../api/set";
import {getRegInfoByPatient} from "../../api/chat";

export default {
  name: "prescription",
  components: {ShowPatent, CfCom, ZdCom, ImgSave, Herbal, Patent, Navbar,showZd},
  data() {
    return {
      userInfo: {
        sex: "女",
        age: 24,
        ageUnit: "岁",
      },
      selectedDiagList: [],
      beforeZdList: [],
      cfIndex: "",//当前选中切换类型的处方index
      showImgPic: false, //保存图片组件
      images: [],
      usageShow: false,
      numTipsShow: false,//库存不足提示
      index: 0,
      patientPopup: false,
      paddingHeight: "",
      scrollHeight: "",
      patientId: "",
      blInfo: {},
      name: "patent",
      //验证用户身份
      telNo: "",
      captcha: "",
      password: "",
      visitUser: false,
      checked: true,
      docId: "",
      phone: "",
      docInfo: {},
      showCodeLogin: true, //手机登录和账号密码登录切换 true 为验证码登录，false为密码登录
      codeinfo: {
        sendAuthCode: true,
        auth_time: "",
        btnText: "发送验证码"
      }, //验证码时间及是否可点击
      title: "诊断开方",
      pageType: "add",//add为新增
      businessCode: "",
      prePool: false,
      orderNo: "",//处方池订单编号
      orderCfList: [],
      paddingTop:"",
      regId:"",//挂号id
    }
  },
  computed: {
    ...mapGetters([
      'getCfList',
    ]),
    cfList() {
      return this.getCfList;
    }
  },
  watch: {
    cfList: {
      handler() {
        this.setStyle();
        let list = this.getCfList;
        if (list.length > 0) {
          myJsTools.setItem("preType", list[list.length - 1].type);
        } else {
          let cfType = myJsTools.getItem("preType") || '1'
          myJsTools.setItem("preType", cfType);
        }
      },
      deep: true,
    }
  },
  created() {
    this.prePool = false;
    if (this.$route.query.type == 'passPre') {
      if(myJsTools.getItem("passDiags")) {
        this.beforeZdList = myJsTools.getItem("passDiags");
      }
    } else if (this.$route.query.type != 'prePool') {
      if(myJsTools.getItem("passDiags")){
        this.beforeZdList = this.beforeZdList.concat(myJsTools.getItem("passDiags"));
      }
    }
    if (this.$route.query.pageType == 'edit') {
      this.title = "处方修改"
      this.pageType = this.$route.query.pageType;
    }

    this.docId = myJsTools.getItem("token_info").docId;
    this.patientId = this.$route.query.patientId;
    if (this.patientId) {
      this.getPatentInfo();
      this.getRegId();
    }
    this.getDocInfo();
    if (this.$route.query.dpmpId) {
      this.getDrufInfo();
    }
    if (this.$route.query.type == 'prePool') {
      this.prePool = true;//处方池响应界面
      if(this.$route.query.status){
        this.businessId = this.$route.query.businessId;
        this.getBeforeCf();
      }else{
        this.orderNo = this.$route.query.orderNo;
        this.getOrderInfo();
      }
    } else if (this.$route.query.businessId){
      this.prePool = false;
      this.getBeforeCf();
    } else {
      this.prePool = false;
      if (this.cfList.length == 0) {
        let type, name;
        type = myJsTools.getItem("preType") || '1';
        name = type == '3' ? 'herbal' : 'patent'
        let value = {
          type: type,
          drugList: [],
          name: name
        }
        this.$store.commit("setCfList", value);
      }
    }
  },
  beforeCreate() {
    this.$store.commit("UPDATE_KEEP_ALIVE", {
      keepAlive: "prescription"
    });
  },


  mounted() {
    var h = document.documentElement.clientHeight || document.body.clientHeight;
    this.scrollHeight = h;
    if(!this.prePool){
      this.setStyle();
    }
    this.paddingTop = api.safeArea.top || 0;
    this.getPhone();
  },
  activated() {
    if (this.patientPopup) {
      this.patientPopup = false;
    }
    let diags = this.selectedDiagList;
    let newDiags = [];
    if(myJsTools.getItem("passDiags")){
      newDiags = myJsTools.getItem("passDiags")
    }
    let oldDiags = [];
    for (let i = 0; i < diags.length; i++) {
      if (diags[i].diagType == '1') {
        oldDiags.push(diags[i].diagName);
      } else {
        oldDiags.push(diags[i].symptomaticName + diags[i].diagName);
      }
    }

    for (let j = 0; j < newDiags.length; j++) {
      if (newDiags[j].diagType == '1') {
        if (oldDiags.indexOf(newDiags[j].diagName) == -1) {
          diags.push(newDiags[j]);
        }
      } else {
        if (oldDiags.indexOf((newDiags[j].symptomaticName + newDiags[j].diagName)) == -1) {
          diags.push(newDiags[j]);
        }
      }
    }
    let me = this;
    api.addEventListener(
      {
        name: "keyback"
      },
      function (ret, err) {
        me.quit();
      }
    );
  },
  methods: {
    getRegId(){
      getRegInfoByPatient({
        patientId: this.patientId,
        docId: this.docId
      }).then(res=>{
        if(res.data){
          this.regId= res.data.regId
        }

      })
    },
    getOrderInfo() {
      queryProPrescriptionPoolPrescriptionInfo({
        orderNo: this.orderNo
      }).then(res => {
        this.orderCfList = res.data.checkPreMVOs;
        this.patientId = res.data.patientId;
        myJsTools.setItem("preType", this.orderCfList[this.orderCfList.length - 1].prescriptionType);
        this.getPatentInfo();
      })
    },
    getPhone() {
      getDoctorInfo({
        docId: myJsTools.getItem("token_info").docId
      }).then(res => {
        console.log(res);
        let data = res.data;
        this.phone = data.telNo;
      });
    },
    setPopupStatus() {
      this.$refs.zdCom.zdListPopup = false;
      this.$refs.zdCom.zxListPopup = false;
      this.$refs.zdCom.zxList = [];
      this.$refs.zdCom.diagList = [];
    },
    setStyle() {
      let list = this.cfList;
      this.$nextTick(() => {
        let refList = this.$refs.cfCom.$refs.cfList;
        for (let i = 0; i < refList.length - 1; i++) {
          let type = list[i].type;
          if (type == '3') {
            refList[i].$refs.drugList.classList.remove("minHeight");
          } else {
            refList[i].$el.classList.remove("minHeight");
          }
        }
      })
    },
    quit() {
      console.log("sss 处方诊断");
      if (this.patientPopup) {
        this.patientPopup = false
      } else if (this.$refs.zdCom && this.$refs.zdCom.zdAddPopup) {
        this.$refs.zdCom.zdAddPopup = false;
      } else if (this.$refs.cfCom && this.$refs.cfCom.showPicker) {
        this.$refs.cfCom.showPicker = false;
      } else {
        console.log("sss 处方诊断");
        if (this.pageType != 'usedCf') {
          myJsTools.setItem("passDiags", []);
          this.$store.commit("setAllCfList", []);
        }
        this.$store.commit("UPDATE_KEEP_ALIVE", {
          keepAlive: "prescription",
          type: 1
        });
        this.$router.go(-1);
      }
    },
    // 获取常用处方详情添加到药品列表
    getDrufInfo(item) {
      getDrugPrescriptionPreInfo({
        docId: this.docId,
        dpmpId: this.$route.query.dpmpId,
      }).then(res => {
        let cfList = this.$store.getters.getCfList;
        let data = res.data;
        data.type = data.prescriptionType;
        data.name = data.prescriptionType == '3' ? 'herbal' : 'patent'
        let val = {
          cfIndex: cfList.length - 1,
          cf: data,
        }
        this.$store.commit("editCf", val);
      })
    },
    //诊断组件返回值
    commitDiagList(value) {
      console.log(value)
      this.selectedDiagList = value;
    },
    //登录
    login() {
      if (this.phone != this.telNo) {
        Toast("手机号必须是当前登录医生的手机号");
        return;
      }
      if (this.showCodeLogin) {
        if (this.codeBlur() && this.telBlur()) {
          var capParam = {
            captcha: this.captcha,
            telNo: this.telNo
          };
          verificationCode(capParam).then(res => {
            Toast("验证成功");
            console.log(JSON.stringify(res) + "验证码登录");
            this.saveFun();
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
          telNo: this.telNo,
          userType: "3"
        };
        verificationTelNoAndPassword(passParam).then(res => {
          Toast("验证成功");
          console.log(JSON.stringify(res) + "密码验证");
          this.saveFun();
        });
      }
    },
    sendDrug() {
      if (this.selectedDiagList.length == 0) {
        Toast("请选择诊断");
        return;
      }
      if (!this.prePool && this.cfList.length == 1 && this.cfList[0].drugList.length == 0) {
        Toast("至少添加一个药品");
        return;
      } else {
        for (let i = 0; i < this.cfList.length; i++) {
          let item = this.cfList[i];
          if (item.drugList.length > 0) {
            if (item.type == '3') {
              if (!item.days || !item.herbalFormulations || !item.herbalFormulations || !item.herbalNum || !item.rc || !item.rj) {
                this.usageShow = true;
                return;
              }
            }
          }
        }
      }
      if (process.env.NODE_ENV == 'development') {
        this.getPreCheck();
      } else {
        this.getPreCheck();
      }
    },

    getPreCheck(){
      docBeforeThePrescriptionNeedCheck({
        docId: myJsTools.getItem("token_info").docId
      }).then(res=>{
        if(res.data.needPrescriptionAuthenticate == '1'){
          this.visitUser = true;
        }else {
          this.saveFun();
        }
      })
    },

    // 获取之前保存的处方信息
    getBeforeCf() {
      let param = {
        businessId: this.$route.query.businessId
      };
      if(this.$route.query.status == '1'){
        param.isRepurchaseWaitConfirm = '1'
      }
      getPrescriptionInfoById(param).then(res => {
        console.log("上次保存的处方详情", JSON.stringify(res));
        if (res.data.diags) {
          this.beforeZdList = res.data.diags;
        }
        this.businessCode = res.data.businessCode;
        if (res.data.checkPreMVOs) {
          for (let m = 0; m < res.data.checkPreMVOs.length; m++) {
            const element = res.data.checkPreMVOs[m];
            element.drugList = element.details;
            element.type = element.prescriptionType;
            if (element.prescriptionType == '3') {
              element.name = 'herbal'
            } else {
              element.name = 'patent'
            }
          }
          this.orderCfList = res.data.checkPreMVOs;
          this.$store.commit("setAllCfList", res.data.checkPreMVOs);
        }
      });
    },
    saveFun() {
      var pro = {
        age: this.userInfo.age,
        ageUnit: this.userInfo.ageUnit,
        birthDate: this.userInfo.birthDate,
        deptId: this.docInfo.defaultDeptId,
        deptName: this.docInfo.defaultDeptName,
        docId: this.docInfo.docId,
        docName: this.docInfo.docName,
        idNo: this.userInfo.idNo,
        isMedicare: "0",
        patientId: this.userInfo.patientId,
        patientName: this.userInfo.patientName,
        sex: this.userInfo.sex,
        sexCode: this.userInfo.sexCode,
        telNo: this.userInfo.telNo,
        docTel: this.docInfo.telNo,
        drugstoreId:this.docInfo.drugstoreId
      };
      if (this.businessCode && this.$route.query.pageType != 'continutredCf') {
        pro.businessId = this.$route.query.businessId;
        pro.businessCode = this.businessCode;
      }
      let prescriptions = [], drugList = [];

      if (!this.prePool) {
        pro.businessType = '1';//业务类型  医生端开的处方
        for (let i = 0; i < this.cfList.length; i++) {
          let item = this.cfList[i];
          if (item.drugList.length > 0) {
            for (let j = 0; j < item.drugList.length; j++) {
              let el = item.drugList[j];
              if (item.type == '3') {
                drugList.push({
                  drugId: el.drugId,
                  quan: parseFloat(parseFloat(el.quan) * parseFloat(item.herbalNum)).toFixed(2)
                })
              } else {
                drugList.push({
                  drugId: el.drugId,
                  quan: el.quan
                })
              }
            }

            let s = {};
            if (item.type == '3') {
              prescriptions.push({
                details: item.drugList,
                proPrescriptionMaster: {
                  days: item.days,
                  dduName: "口服",
                  herbalNum: item.herbalNum,
                  prescriptionType: item.type,
                  rc: item.rc,
                  rj: item.rj,
                  status: "0",
                  herbalFormulations: item.herbalFormulations,
                }
              });
            } else {
              prescriptions.push({
                details: item.drugList,
                proPrescriptionMaster: {
                  prescriptionType: item.type
                }
              });
            }
          }
        }
      } else {
        let data = this.orderCfList;
        for (var i = 0; i < data.length; i++) {
          data[i].proPrescriptionMaster = {
            prescriptionType: data[i].prescriptionType
          }
        }
        prescriptions = data;
        pro.businessType = '5';
        pro.orderNo = this.orderNo;
      }

      let param = {
        diags: this.selectedDiagList,
        proBusinessInfo: pro,
        prescriptions: prescriptions
      }

      if (!this.prePool) {
        checkDrugStorage({
          drugList: drugList,
          drugNum: drugList.length,
          drugstoreId: myJsTools.getItem("docAllInfo").drugstoreId
        }).then(response => {
          if (response.data.checkDrugStorage == '0') {
            this.visitUser = false;
            this.numTipsShow = true;
          } else if (response.data.checkDrugStorage == '1') {
            this.saveprescriFun(param)
          }
        })
      } else {
        this.saveprescriFun(param);
      }
    },
    confirmCf(){
      updateRepurchaseConfirm({
        businessCode: this.businessCode,
        businessId: this.$route.query.businessId
      }).then(res=>{
        this.$router.go(-1);
      })
    },
    saveprescriFun(param) {
      Toast.loading({
        message: '加载中...',
        forbidClick: true,
        closeOnClick: false,
        duration: 0
      });
      savePrescription(param).then(res => {
        if (this.cfList.length > 0) {
          myJsTools.setItem("preType", this.cfList[this.cfList.length - 1].type);
          this.$store.commit("setAllCfList", []);
          myJsTools.setItem("passDiags", []);
        }
        if (this.pageType != 'edit' && !this.prePool) {
          this.sendMsg(res);
        } else {
          this.$store.commit("UPDATE_KEEP_ALIVE", {
            keepAlive: "prescription",
            type: 1
          });
          if (this.prePool) {
            this.$router.go(this.$route.query.goPage);
          } else {
            this.$router.go(-2);
          }
        }
      });
    },
    sendMsg(res) {
      let is_check_prescription = myJsTools.getItem("global_config");//1需要审核 0不需要审核
      let ysStstus;
      if (this.$route.query.isSubsequent == '0' && is_check_prescription == 1) {
        ysStstus = 1;
      } else if (this.$route.query.isSubsequent == '1' && is_check_prescription == 2) {
        ysStstus = 1;
      } else if (is_check_prescription == 3) {
        ysStstus = 1;
      } else {
        ysStstus = 0;
      }
      let ext = {
        type: "cf",
        cfbusinessCode: res.data.businessCode,
        ysStstus: ysStstus,
        isSubsequent: res.data.isRealPre //1为复诊 0为咨询
      };
      let sendText = res.data.isRealPre == '1' ? "[处方]" : "[处方建议]"
      eschatUnit.sendMsg(
        sendText,
        myJsTools.getItem("token_info").docId,
        this.userInfo.patientId,
        this.userInfo.userId,
        ext
      );
      this.$store.commit("UPDATE_KEEP_ALIVE", {
        keepAlive: "prescription",
        type: 1
      });
      if (this.$route.query.pageType == 'usedCf') {
        this.$router.push({
          name: "mainIndex"
        })
      } else {
        this.$router.go(-1);
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
    changLogin() {
      this.showCodeLogin = !this.showCodeLogin;
      myJsTools.setItem("showCodeLogin", this.showCodeLogin); //存储选择的登录方式
    },
    // 预览图片
    getImgView(item, index) {
      this.images = item;
      this.index = index;
      this.showImgPic = true;
    },
    //保存图片到本地
    changePreview(index) {
      this.index = index;
    },
    //关闭图片查看
    onClose() {
      this.showImgPic = false;
    },
    //打开患者资料服务页面
    openPatientIndex() {
      this.patientPopup = false;
      setTimeout(() => {
        this.$router.push({
          name: "information",
          query: {
            patientId: this.userInfo.patientId,
            docId: myJsTools.getItem("token_info").docId,
            pageType: "doc"
          }
        });
      }, 300);
    },
    getPatentInfo() {
      getPatientInfoRecordTitleByRegId({
        docId: this.docId,
        patientId: this.patientId,
      }).then(res => {
        this.userInfo = res.data;
      })
    },
    getDocInfo() {
      getDoctorInfoByDocId({
        docId: this.docId,
      }).then(res => {
        this.docInfo = res.data;
      })
    },
    //新增处方 如果上一个处方没有添加药品不让新增药品
    addNewCf() {
      if (this.cfList[this.cfList.length - 1].drugList.length == 0) {
        Toast("已有空白处方，不可重复添加");
        return;
      }
      let type = this.cfList[this.cfList.length - 1].type;
      let refList = this.$refs.cfCom.$refs.cfList;
      if (type == '3') {
        refList[refList.length - 1].$refs.drugList.classList.remove("minHeight");
      } else {
        refList[refList.length - 1].$el.classList.remove("minHeight");
      }

      let value = {
        type: this.cfList[this.cfList.length - 1].type,
        drugList: [],
        name: this.cfList[this.cfList.length - 1].name
      }
      this.$store.commit("setCfList", value);
    },
    //打开患者病情信息 本次及上次病情
    openPatientInfo() {
      console.log("dddd");
      this.patientPopup = true;
      getNowAndLastTimeRecord({
        docId: myJsTools.getItem("token_info").docId,
        patientId: this.userInfo.patientId
      }).then(res => {
        let data = res.data;
        if (data.lastTimeCondition && data.lastTimeCondition.diseaseImg) {
          data.lastTimeCondition.diseaseImg = JSON.parse(data.lastTimeCondition.diseaseImg)
        }
        if (data.nowCondition && data.nowCondition.diseaseImg) {
          data.nowCondition.diseaseImg = JSON.parse(data.nowCondition.diseaseImg)
        }
        this.blInfo = res.data;
      })
    },
    onSwipeRight() {
      this.patientPopup = false;
    },
  }
}
</script>

<style scoped lang="less">



#touch, #touch2 {
  touch-action: pan-y !important;
}

#touch {
  height: 90vh;
  overflow: scroll;
}


.fromData {
  margin-top: 38px;

  button {
    border: none;
    color: #14a0e6;
    font-size: 14px;
    line-height: 20px;
    background: #ffffff;
  }

  .captcha {
    margin-top: 15px;;
  }

  .van-cell {
    line-height: 20px;
    padding: 10px 0;
    border-bottom: 1px solid #ebebeb;
  }
}

.changeLogin {
  font-size: 14px;
  color: #999999;
  margin-top: 12px;
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.loginPopup {
  width: 80%;
  padding: 20px;

  /deep/ .van-cell {
    width: 100%;
    background: #FFFFFF;
  }

  .title {
    font-size: 16px;
    line-height: 22px;
    margin-bottom: 10px;
    font-weight: 600;
    text-align: center;
  }

  .commitbtns {
    display: flex;
    margin-top: 19px;

    button {
      width: 48%;
      font-size: 16px;
      line-height: 34px;
      border-radius: 23px;
    }

    :nth-child(1) {
      border: 1px solid #14a0e6;
      color: #14a0e6;
      background: #ffffff;
    }

    :nth-child(2) {
      color: #ffffff;
      background: #14a0e6;
      margin-left: 20px;
    }
  }
}

.addCfBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 12px;
  color: @font-color-7;
  .font-size-md;

  img {
    margin-right: 5px;
  }
}

.preInfo {
  padding: 8px 8px 70px;
  min-height: 80vh;
}

.patientInfo {
  display: flex;
  align-items: center;
  background: @white;
  padding: 8px 19px 8px 8px;
  border-radius: 4px;

  .patientDetailInfo {
    width: 80%;
    padding-left: 14px;

    .nameSexAge {
      display: flex;
      align-items: center;
    }

    .sexIcon {
      .icon-width-height-sm-16;
      padding-left: 4px;
    }

    .ageSpan {
      line-height: 17px;
    }

    .complaint {
      .font-size-md;
      .black-font;
      padding-top: 6px;
    }
  }
}

.patientPopup {
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0);
}

///deep/ .defaultHeader {
//  z-index: 9999 !important;
//}

.illness {
  display: flex;
  align-items: center;

  .leftArrow {
    width: 10%;
  }

  .illnessInfo {
    background: @white;
    overflow: scroll;
    width: 90%;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }

  .closePopup {
    position: fixed;
    top: 40%;
    left: 14px;
    transform: translate(-40%);
    padding: 0 6px 0px 10px;
  }

  .patientInfo {
    padding-bottom: 8px;
  }

  .thisIllness {
    margin: 0 8px 8px;
    border: 1px solid @page-back;
    border-radius: 8px;

    position: relative;

    .thisTime {
      position: absolute;
      top: 0;
      right: 0;
      width: 27px;
      height: 27px;
    }

    .optTitle {
      .black-font;
      .font-size-md-2;
      line-height: 21px;
      padding: 8px;
    }

    .imgShow {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
    }

    .illnessImg {
      width: 87px;
      height: 87px;
      margin: 0px 9px 8px;
    }
  }
}

.openMore {
  display: flex;
  align-items: center;
  .font-size-md;
  .black-font;
  line-height: 20px;
}


</style>
