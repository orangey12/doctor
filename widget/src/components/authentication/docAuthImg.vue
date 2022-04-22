<template>
  <div class="docAuthImg">
    <navbar title="医生认证"></navbar>
    <div class="uploadImg">
      <div class="upDiv">
        <li>医生职称照片</li>
        <div class="imgDiv">
          <div v-for="(item,index) in docProfList" :key="index">
            <img v-zlazy="item.src" alt="" class="uploadPic" @click="lookImg(1,index)">
            <img src="../../assets/img/record/del.png" class="deleteIcon" @click="deleteImg('1',index)">
          </div>
          <div v-if="docProfList.length < 6">
            <img src="../../assets/img/record/uploadPic.png" class="uploadPic" @click="openSelectPic('1')">
          </div>
        </div>
      </div>
      <div class="upDiv">
        <li>医生资格证书</li>
        <div class="imgDiv">
          <div v-for="(item,index) in qualificationList" :key="index">
            <img v-zlazy="item.src" alt="" class="uploadPic" @click="lookImg(2,index)">
            <img src="../../assets/img/record/del.png" class="deleteIcon" @click="deleteImg('2',index)">
          </div>
          <div v-if="qualificationList.length < 6">
            <img src="../../assets/img/record/uploadPic.png" class="uploadPic" @click="openSelectPic('2')">
          </div>
        </div>
      </div>
      <div class="upDiv">
        <li>医生执业证书</li>
        <div class="imgDiv">
          <div v-for="(item,index) in professionalList" :key="index">
            <img v-zlazy="item.src" alt="" class="uploadPic" @click="lookImg(3,index)">
            <img src="../../assets/img/record/del.png" class="deleteIcon" @click="deleteImg('3',index)">
          </div>
          <div v-if="professionalList.length < 6">
            <img src="../../assets/img/record/uploadPic.png" class="uploadPic" @click="openSelectPic('3')">
          </div>
        </div>
      </div>
      <div class="upDiv">
        <li>其他（选填）</li>
        <div class="imgDiv">
          <div v-for="(item,index) in qtList" :key="index">
            <img v-zlazy="item.src" alt="" class="uploadPic" @click="lookImg(4,index)">
            <img src="../../assets/img/record/del.png" class="deleteIcon" @click="deleteImg('4',index)">
          </div>
          <div v-if="qtList.length < 6">
            <img src="../../assets/img/record/uploadPic.png" class="uploadPic" @click="openSelectPic('4')">
          </div>
        </div>
      </div>
      <div class="upDiv">
        <li>简介（选填）</li>
        <van-field
          v-model="docSynopsis"
          rows="2"
          autosize
          label=""
          type="textarea"
          placeholder="请输入医生简介"
          clearable
          :border="false"
          maxlength="100"
        />
      </div>
      <div class="upDiv">
        <li>擅长（选填）</li>
        <van-field
          v-model="specialties"
          rows="2"
          autosize
          label=""
          type="textarea"
          placeholder="请输入医生擅长"
          clearable
          :border="false"
          maxlength="100"
        />
      </div>
      <div class="agree" v-if="info.docAuditStatus == '1' || info.docAuditStatus == '3'">
        <van-checkbox v-model="checked" icon-size="14">
          <span class="font-login-sm font-login-color">已阅读并同意</span>
          <span class="font-login-sm font-login-color-blue" @click="openAgreement">《合作协议》</span>
        </van-checkbox>

      </div>
    </div>
    <img-save
      v-if="showImgPic"
      :showPic="showImgPic"
      :index="index"
      :images="images"
      @changePreview="changePreview"
      @onClose="onClose"
    ></img-save>
    <van-action-sheet
      v-model="showPic"
      :actions="picActions"
      cancel-text="取消"
      close-on-click-action
      style="width:100%"
      @select="getPic"
      close-on-popstate
    />
    <van-overlay :show="loadshow" >
      <div class="wrapper" @click.stop>
        <van-loading size="24px">加载中...</van-loading>
      </div>
    </van-overlay>
    <div class="bottomBtn" v-if="info.docAuditStatus == '1' || info.docAuditStatus == '3'">
      <button class="publicBtn" @click="commit" :disabled="loadshow">提交</button>
    </div>

    <van-popup class="popup" v-model="shouCaptcha" :close-on-click-overlay="false">
      <li class="title">提示</li>
      <li class="tips">系统检测到您的用户信息已被注册，已向{{ showOldNum }}发送验证码，请填写验证码，核实您的信息，验证成功后将重新登录</li>
      <div id="app">
        <div class="captcha">
          <span>验证码</span>
          <input v-for="(c, index) in ct" :key="index"
                 type="number" v-model="ct[index]" ref="input"
                 @input="e => {onInput(e.target.value, index)}"
                 @keydown.delete="e=>{onKeydown(e.target.value, index)}"
                 @focus="onFocus"
                 :disabled="loading"
          >
        </div>
      </div>
      <div class="getNum" v-if='!codeinfoOld.auth_time'>
        未获取到验证码?点击 <span @click="getCode('old')" class="font-login-color-blue">重新发送</span>
      </div>
      <div class="getNum" v-else>
        验证码已发送，将在 <span class="font-login-color-blue">{{codeinfoOld.auth_time}}s</span> 后可重新发送
      </div>
      <div class="btns">
        <button class="publicWhiteBtn" @click="shouCaptcha=loadshow=false">取消</button>
        <button class="publicBtn twoBtn" @click="visitTel">确定</button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import Navbar from "../../common/navbar";
import imgSave from "@/common/imgSave";
import {Toast} from "vant";
import myJsTools from "../../utils/myJsTools";
import {docAttestInfoSubmit, docUpdateAttestInfo} from "../../api/my";
import store from "../../store/store";
import {docAppLogOneDataChangeTelNo, sendCaptcha} from "../../api/login";

export default {
  name: "docAuthImg",
  components: {Navbar,imgSave},
  data() {
    return {
      docProfList: [],
      qualificationList: [],
      professionalList: [],
      qtList: [],
      docSynopsis: "",
      specialties: "",
      selectType:"",
      showImgPic: false, //保存图片组件
      images: [],
      index: 0,
      showPic: false,
      loadshow: false,
      info:{},
      showOldNum: "",
      oldTelNo:"",
      oldNum:"",
      existDocId:"",
      shouCaptcha:false,
      ct: ['', '', '', '', '', ''],
      picActions: [
        {name: "拍照", sourceType: "camera"},
        {name: "从相册选择", sourceType: "album"}
      ],
      codeinfoOld: {
        sendAuthCode: true,
        auth_time: "",
        btnText: "获取验证码"
      },
      checked:false
    }
  },
  computed: {
    ctSize() {
      return this.ct.length;
    },
    cIndex() {
      let i = this.ct.findIndex(item => item === '');
      i = (i + this.ctSize) % this.ctSize;
      return i;
    },
    lastCode() {
      return this.ct[this.ctSize - 1];
    }
  },
  watch: {
    cIndex() {
      this.resetCaret();
    },
    lastCode(val) {
      if (val) {
        console.log('this.ctSize', this.ctSize)
        this.$refs.input[this.ctSize - 1].blur();
        this.sendCaptcha();
      }
    }
  },
  beforeCreate() {
    this.$store.commit("UPDATE_KEEP_ALIVE", {
      keepAlive: "docAuthImg"
    });
  },
  created() {
    this.getInfo();
  },
  activated() {
    let info = JSON.parse(this.$route.query.info);
    this.info = info
    console.log(this.$route.query.info + "---------医生信息");
  },
  methods: {
    onInput(val, index) {
      console.log(val,index)
      val = val.replace(/\s/g, '');
      if (index == this.ctSize - 1) {
        this.ct[this.ctSize - 1] = val[0];   // 最后一个码，只允许输入一个字符。
      } else if (val.length > 1) {
        let i = index;
        for (i = index; i < this.ctSize && i - index < val.length; i++) {
          this.ct[i] = val[i];
        }
        this.resetCaret();
      }
    },
    // 重置光标位置。
    resetCaret() {
      this.$nextTick(()=>{
        this.$refs.input[this.ctSize - 1].focus();
      })
    },
    onFocus() {
      // 监听 focus 事件，将光标重定位到“第一个空白符的位置”。
      let index = this.ct.findIndex(item => item === '');
      index = (index + this.ctSize) % this.ctSize;
      console.log(index)
      this.$refs.input[index].focus();
    },
    onKeydown(val, index) {
      if (val === '') {
        // 删除上一个input里的值，并对其focus。
        if (index > 0) {
          this.ct[index - 1] = '';
          this.$refs.input[index - 1].focus();
        }
      }
    },
    //隐私服务协议页面
    openAgreement() {
      this.$router.push({
        name: "protocol",
        query: {
          type: '3'//隐私服务协议
        }
      })
    },
    getInfo(){
      let info = JSON.parse(this.$route.query.info);
      if(info.pageType == 'edit'){
        this.docProfList = info.docProfList;
        this.qualificationList = info.qualificationList;
        this.professionalList = info.professionalList;
        this.qtList = info.qtList;
        this.docSynopsis = info.docSynopsis;
        this.specialties = info.specialties;
      }
      this.info = info
      console.log(this.$route.query.info + "---------医生信息");
    },
    //保存图片到本地
    changePreview(index) {
      this.index = index;
    },
    //关闭图片查看
    onClose() {
      this.showImgPic = false;
    },
    // 点击查看图片
    lookImg(type,index) {
      let imgUrl = [], data;
      if (type == 1) {
        data = this.docProfList;
      } else if (type == 2) {
        data = this.qualificationList;
      } else if (type == 3) {
        data = this.professionalList;
      }else if (type == 3) {
        data = this.qtList;
      }
      for (let i = 0; i < data.length; i++) {
        imgUrl.push(data[i].src);
      }
      this.showImgPic = true;
      this.index = index;
      this.images = imgUrl;
    },
    //  删除图片
    deleteImg(type, index) {
      if (type == '1') {
        this.docProfList.splice(index, 1);
      } else if (type == '2') {
        this.qualificationList.splice(index, 1);
      } else if (type == '3') {
        this.professionalList.splice(index, 1);
      } else if (type == '4') {
        this.qtList.splice(index, 1);
      }
    },
    openSelectPic(type) {
      this.selectType = type;
      this.showPic = true;
    },
    // 选择图片
    async selectPicOpt() {
      if (api.systemType != 'ios') {
        let s = await myJsTools.getPromise("camera");
        if(!s){
          Toast("请开启相机权限")
          return;
        }
      }
      let me = this;
      var UIAlbumBrowser = api.require("UIAlbumBrowser");
      let type = this.selectType,maxNum;
      if (type == '1') {
        maxNum = 6 - me.docProfList.length;
      } else if (type == '2') {
        maxNum = 6 - me.qualificationList.length;
      } else if (type == '3') {
        maxNum = 6 - me.professionalList.length;
      } else if (type == '4') {
        maxNum = 6 - me.qtList.length;
      }
      UIAlbumBrowser.open(
        {
          max: maxNum,
          type: "image",
          videoTimeFilter: 30,
          selectedAll: false,
          styles: {
            bg: "#fff",
            mark: {
              icon: "",
              position: "bottom_left",
              size: 20,
            },
            nav: {
              bg: "rgba(0,0,0,0.6)",
              titleColor: "#fff",
              titleSize: 18,
              cancelColor: "#fff",
              cancelSize: 16,
              finishColor: "#fff",
              finishSize: 16,
            },
          },
          rotation: true,
        },
        function (ret, err) {
          // alert(JSON.stringify(ret.list) + "获取图片错误");
          if (ret && ret.list && ret.list.length > 0) {
            for (let i = 0; i < ret.list.length; i++) {
              const element = ret.list[i];
              if (api.systemType == 'ios') {
                me.transPath(element);
              } else {
                me.saveImg(element)
              }
            }
          } else {
            console.log(JSON.stringify(err) + "ssssssss");
          }
        }
      );
    },
    transPath: function (element, type) {
      var me = this;
      var UIAlbumBrowser = api.require('UIAlbumBrowser');
      UIAlbumBrowser.transPath({
        path: element.path
      }, function (ret, err) {
        if (ret) {
          var iospath = ret.path;
          element.path = iospath;
          me.saveImg(element);
        } else {
          console.log(JSON.stringify(err));
        }
      });
    },
    async saveImg(element) {
      let me = this;
      let type = this.selectType;
      console.log(JSON.stringify(element) + "---------element");
      await myJsTools.appendFile(
        "6",
        element.path,
        "333.png",
        element.size,
        me.patientId
      );
      await api.addEventListener(
        {
          name: "upImg"
        },
        function (ret, err) {
          console.log(JSON.stringify(ret.value));
          let m = {};
          m.imgUrl = ret.value.url;
          m.src = ret.value.src;
          if (type == '1') {
            me.docProfList.push(m)
          } else if (type == '2') {
            me.qualificationList.push(m)
          } else if (type == '3') {
            me.professionalList.push(m)
          } else if (type == '4') {
            me.qtList.push(m)
          }
        }
      );
    },
    // 选择照片或者拍照
    getPic(val) {
      console.log(val);
      if (val.sourceType == "camera") {
        let me = this;
        api.getPicture(
          {
            sourceType: val.sourceType,
            encodingType: "png",
            mediaValue: "pic",
            destinationType: "base64",
            allowEdit: true,
            quality: 80,
            saveToPhotoAlbum: false
          },
          function (ret, err) {
            if (ret) {
              me.saveImg({
                path: ret.data
              })
              console.log(JSON.stringify(ret));
            } else {
              console.log(JSON.stringify(err));
            }
          }
        );
      } else {
        this.selectPicOpt();
      }
    },
    commit(){
      if(!this.checked){
        Toast("请先阅读并同意协议");
        return ;
      }
      if(this.docProfList.length == 0){
        Toast("请上传医生职称照片");
        return false;
      }
      if(this.qualificationList.length == 0){
        Toast("请上传医生资格证书");
        return false;
      }
      if(this.professionalList.length == 0){
        Toast("请上传医生执业证书");
        return false;
      }
      let professionalImg = [],qualificationImg = [],employmentImg = [],otherImg = [];
      for (let i = 0; i < this.docProfList.length; i++) {
        professionalImg.push(this.docProfList[i].imgUrl)
      }
      for (let i = 0; i < this.qualificationList.length; i++) {
        qualificationImg.push(this.qualificationList[i].imgUrl)
      }
      for (let i = 0; i < this.professionalList.length; i++) {
        employmentImg.push(this.professionalList[i].imgUrl)
      }
      for (let i = 0; i < this.qtList.length; i++) {
        otherImg.push(this.qtList[i].imgUrl)
      }
      let param = this.info;
      param.professionalImg = professionalImg.join("|");
      param.qualificationImg = qualificationImg.join("|");
      param.employmentImg = employmentImg.join("|");
      param.docId = myJsTools.getItem("token_info").docId;
      param.otherImg = otherImg.join("|");
      param.docSynopsis = this.docSynopsis;
      param.specialties = this.specialties;
      console.log(JSON.stringify(param) + "----------------传参")
      if(this.info.pageType == 'edit'){
        docUpdateAttestInfo(param).then(res=>{
          console.log(res);
          this.setData(res);
        })
      }else{
        docAttestInfoSubmit(param).then(res=>{
          console.log(res);
          this.setData(res);
        })
      }
    },
    // 获取短信验证码
    getCode() {
      this.codeinfoOld.sendAuthCode = false;
      var para = {};
      para.telNo = this.oldNum;
      sendCaptcha(para).then(response => {
        console.log(response);
        Toast("验证码发送成功");
        this.codeinfoOld.auth_time = 60;
        var auth_timetimer = setInterval(() => {
          this.codeinfoOld.auth_time--;
          this.codeinfoOld.btnText = this.codeinfoOld.auth_time + "s后重新发送";
          if (this.codeinfoOld.auth_time <= 0) {
            this.codeinfoOld.auth_time = "";
            this.codeinfoOld.sendAuthCode = true;
            this.codeinfoOld.btnText = "发送验证码";
            clearInterval(auth_timetimer);
          }
        }, 1000);
      });
    },
    //验证手机号
    visitTel(){
      docAppLogOneDataChangeTelNo({
        captcha: this.ct.join(""),
        newDocId:myJsTools.getItem("token_info").docId,
        existDocId:this.existDocId,
        oldTelNo:this.oldNum,
      }).then(res=>{
        myJsTools.setItem("token_info", {});
        myJsTools.setItem("showCodeLogin", true);
        myJsTools.setItem("active", 0);
        this.$router.replace({
          name:"login"
        })
      })
    },
    setData(res){
      this.loadshow=true
      if(res.data && res.data.isTel){
        this.shouCaptcha = true;
        this.existDocId = res.data.existDocId;
        this.oldTelNo = this.oldNum = res.data.oldTelNo;
        var reg = /^(\d{3})\d{4}(\d{4})$/;
        this.showOldNum = res.data.oldTelNo.replace(reg, "$1****$2");
        this.getCode();
        return ;
      }
      this.$store.commit("UPDATE_KEEP_ALIVE", {
        keepAlive: "authentication",
        type:1
      });
      this.$store.commit("UPDATE_KEEP_ALIVE", {
        keepAlive: "docAuthImg",
        type:1
      });
      this.$store.commit("setDocShStatus", 0);
      this.$router.go(-2);
    }
  },
}
</script>

<style scoped lang="less">

.captcha {
  display: flex;
  justify-content: center;
  margin-top: 15px;
  align-items: center;
  font-size: 14px;
  .font-blod-2;

  span {
    margin-right: 10px;
  }
}

input {
  margin-right: 10px;
  text-align: center;
  background: #ECECEC;
  font-size: 16px;
  outline: none;
  width: 16px;
  padding: 4px;
}

input:last-of-type {
  margin-right: 0;
}

input:disabled {
  color: #000;
  background-color: #fff;
}

.msg {
  text-align: center;
}

.getNum{
  margin-top: 10px;
}
.imgDiv {
  display: flex;
  flex-wrap: wrap;

  .uploadPic {
    margin-right: 14px;
    margin-top: 12px;
    object-fit: cover;
  }

  div {
    position: relative;
  }

  .deleteIcon {
    .icon-width-height-sm-16;
    position: absolute;
    right: 10px;
    top: 1px;
  }

  .uploadPic {
    width: 94px;
    height: 94px;
  }

}
.upDiv{
  background: @white;
  margin-top: 8px;
  padding:12px 16px ;
  .font-size-md-2;
  .black-font;
  /deep/ .van-cell{
    background: @field-back;
  }
}

.uploadImg{
  padding-bottom: 60px;
}

.agree {
  margin: 20px auto;
  width: 90%;
  text-align: center;
}

/deep/ .van-checkBox{

  justify-content: center;
}
</style>
