<template>
  <div class="my">
    <div
      class="my_head"
      :style="{
        'padding-top': headerHeight,
        background:
          'url(' + require('../../assets/img/my/back.png') + ') no-repeat',
        'background-size': '100% 85%'
      }"
    >
      <div class="setDiv">
        <img
          src="../../assets/img/my/myscan.png"
          @click="openSacn"
          class="icon-width-height-sm"
        />
        <img
          src="../../assets/img/my/cfcodeHead.png"
          class="icon-width-height-sm"
          @click="goQrcodes()"
        />
        <img
          @click="goFit"
          src="../../assets/img/my/myset.png"
          class="icon-width-height-sm"
        />
      </div>
      <div class="docInfo">
        <div class="my_head_top" v-if="info.docId">
          <div class="my_head_top_1" @click="openCenter">
            <img class="img-width-height-lg" v-zlazy="info.docImg" />
          </div>
          <div class="my_head_top_2" @click="openCenter">
            <li class="div-overflow font-blod">{{ info.docName }}</li>
            <div class="my_head_top_2_1">
              <li>
                <span v-if="info.deptName">{{ info.deptName }} |</span>
                <span v-if="info.docProf" style="margin-left: 3px">{{
                  info.docProf
                }}</span>
              </li>
              <div class="imgDiv">
                <!-- <img src="../../assets/img/my/mycode.png" class="icon-width-height-sm"> -->
                <img
                  src="../../assets/img/my/rightArrowHead.png"
                  class="icon-width-height-sm"
                />
              </div>
            </div>
            <div class="my_head_top_2_2" v-if="info.docLable">
              <span v-for="(item, index) in info.docLable" :key="index">{{
                item.lableName
              }}</span>
            </div>
          </div>
        </div>
        <div class="my_head_bootom">
          <div class="my_head_bootom_item">
            <span>好评度</span>
            <span>{{ info.percentage }}%</span>
          </div>
          <div class="divLine">|</div>
          <div class="my_head_bootom_item">
            <span>接诊量</span>
            <span>{{ info.consultationCount }}</span>
          </div>
          <div class="divLine">|</div>
          <div class="my_head_bootom_item">
            <span>平均响应</span>
            <span>{{ info.responseTime }}分钟</span>
          </div>
        </div>
      </div>
    </div>
    <div class="my_menu">
      <div class="cfOrder">
        <li class="titleTips">
          <span class="line"></span>
          <span>常用功能</span>
        </li>
        <div class="cards">
          <div class="cardInfo" @click="goAuditor">
            <img
              src="../../assets/img/my/wdsf.png"
              class="img-width-height-spe"
            />
            <li>我的审方</li>
          </div>
          <div class="cardInfo" @click="openMyEarbings">
            <img
              src="../../assets/img/my/wdsy.png"
              class="img-width-height-spe"
            />
            <li>我的统计</li>
          </div>
          <div class="cardInfo" @click="goHisRecipel">
            <img
              src="../../assets/img/my/cfdd.png"
              class="img-width-height-spe"
            />
            <li>处方订单</li>
          </div>
          <div class="cardInfo" @click="goMyCheck">
            <img
              src="../../assets/img/my/wdjc.png"
              class="img-width-height-spe"
            />
            <li>我的检查</li>
          </div>
          <div class="cardInfo" @click="goMyLis">
            <img
              src="../../assets/img/my/wdjy.png"
              class="img-width-height-spe"
            />
            <li>我的检验</li>
          </div>
          <div class="cardInfo" v-if="isStudy" @click="goStudying">
            <img
              src="../../assets/img/my/study.png"
              class="img-width-height-spe"
            />
            <li>我的学习</li>
          </div>
        </div>
      </div>

      <div class="cfOrder">
        <li class="titleTips">
          <span class="line"></span>
          <span>服务设置</span>
        </li>
        <div class="cards">
          <div class="cardInfo" @click="openVisit">
            <img
              src="../../assets/img/my/wdcz.png"
              class="img-width-height-spe"
            />
            <li>我的出诊</li>
          </div>
          <div class="cardInfo" @click="openZzSet">
            <img
              src="../../assets/img/my/wdfw.png"
              class="img-width-height-spe"
            />
            <li>我的服务</li>
          </div>
          <div class="cardInfo" @click="goRecipel">
            <img
              src="../../assets/img/my/wdcf.png"
              class="img-width-height-spe"
            />
            <li>我的处方</li>
          </div>
          <div class="cardInfo" @click="goDrug">
            <img
              src="../../assets/img/my/myDrug.png"
              class="img-width-height-spe"
            />
            <li>我的药品</li>
          </div>
          <div class="cardInfo" @click="goFriend">
            <img
              src="../../assets/img/my/wdhy.png"
              class="img-width-height-spe"
            />
            <li>我的好友</li>
          </div>
        </div>
      </div>
      <div class="beianInfo display-div" @click="goRecordInformation">
        <u class="leftInfo"
          ><img
            src="../../assets/img/my/hlwyyba.png"
            class="icon-width-height-sm"
          />
          <span>互联网医院备案</span></u
        >
        <u>
          <img
            src="../../assets/img/my/rightArrow.png"
            class="icon-width-height-sm-16"
          />
        </u>
      </div>
    </div>
    <tabbar></tabbar>
  </div>
</template>
<script>
import navbar from "@/common/navbar";
import tabbar from "@/common/tabbar";
import myJsTools from "@/utils/myJsTools";
import { findDoctorByID } from "@/api/my";
import {
  getImageUrlCanDownLoad,
  getLabPresentationOssImg
} from "../../api/oss";
import $api from "@/utils/api";
import ossUpDown from "../../utils/ossUpDown";
import { docAddToDocAdministrator } from "../../api/my";
import { Toast } from "vant";
import qrcode from "../../common/qrcode";
import { createWxQrCode } from "../../api/docList";
import { getSysPlatformConfigBykey } from "../../api/login";

export default {
  name: "my",
  components: { navbar, tabbar, qrcode },
  data() {
    return {
      codeUrl: "",
      info: {},
      headerHeight: "",
      docImg: "",
      adminId: "", //管理员id
      // qrcodes: false, //二维码遮盖弹窗的显隐
      qrtabnum: 0, //tab标识切换二维码
      rootCodeUrl: "",
      appid: "",
      isStudy: false, //判断学习是否显示
      studylink: "" //学习跳转链接
    };
  },
  created() {},
  mounted() {
    this.baseurl = process.env.baseURL + "cloud/cloudHosPatient/index.html";
    this.appid = process.env.appid;
    this.getInfo();
    this.getStudylink();
    this.headerHeight = parseInt(api.safeArea.top) + 20 + "px";
  },
  methods: {
    //扫一扫
    async openSacn() {
      if (api.systemType != "ios") {
        let s = await myJsTools.getPromise("camera");
        if (!s) {
          Toast("请开启相机权限");
          return;
        }
      }
      let _this = this;
      var FNScanner = api.require("FNScanner");
      FNScanner.openScanner(
        {
          autorotation: true
        },
        function(ret, err) {
          if (ret) {
            if (ret.eventType == "success") {
              let content = ret.content;
              if (content.indexOf("docId") != -1) {
                _this.$router.push({
                  name: "docInfo",
                  query: {
                    docId: content.split("=")[1],
                    type: "add"
                  }
                })
              }else{
                _this.adminId = content;
                _this.setCode();
              }
            }
          } else {
          }
        }
      );
    },
    setCode() {
      console.log('aaaaaaaaaaaaaaaaaa5')
      docAddToDocAdministrator({
        ddaoId: this.adminId,
        docId: this.info.docId
      }).then(res => {
        Toast("扫码成功");
      });
    },
    openQrcode() {},
    //我的好友
    goFriend() {
      this.$router.push({
        name: "myFriendIndex"
      });
    },
    changeQr(num) {
      if (num === 0) {
        this.qrtabnum = 0;
      } else {
        this.qrtabnum = 1;
      }
    },
    goDrug() {
      this.$router.push({
        name: "myDrug"
      });
    },
    //我的检查
    goMyCheck() {
      this.$router.push({
        name: "myCheck"
      });
    },
    //我的检验
    goMyLis() {
      this.$router.push({
        name: "myLis"
      });
    },
    //服务设置
    openZzSet() {
      this.$router.push({
        name: "serviceIndex"
      });
    },
    // 获取学习链接
    getStudylink() {
      getSysPlatformConfigBykey({
        configKey: "doctorTerminalWebLink"
      }).then(res => {
        if (res.data.configValue) {
          this.studylink = res.data.configValue;
          this.isStudy = true;
        }
      });
    },
    // 我的学习跳转外部浏览器
    goStudying() {
      if (api.systemType == "ios") {
        api.openApp({
          iosUrl: this.studylink
        });
      } else {
        api.openApp({
          androidPkg: "android.intent.action.VIEW",
          mimeType: "text/html",
          uri: this.studylink
        });
      }
    },
    goQrcodes() {
      this.$router.push({
        name: "inviteUser"
      });
    },
    //获取医生详细信息
    getInfo() {
      findDoctorByID({ docId: myJsTools.getItem("token_info").docId }).then(
        res => {
          this.info = res.data;
          // 调取邀请患者二维码
          // this.getCodeUrl();
        }
      );
    },
    openCenter() {
      this.$router.push({
        name: "personalCenter",
        query: { docId: this.info.docId, docName: this.info.docName }
      });
    },
    //跳转互联网备案信息
    goRecordInformation() {
      this.$router.push({
        name: "recordInformation",
        query: {
          docId: this.info.docId
        }
      });
    },
    //我的统计
    openMyEarbings() {
      this.$router.push({
        name: "myEarnings"
      });
    },
    // 我的出诊
    openVisit() {
      this.$router.push({
        name: "myVisit",
        query: {
          deptId: this.info.deptId,
          dntName: this.info.dntName
        }
      });
    },
    goAuditor() {
      this.$router.push({
        name: "myAuditor",
        query: {
          docId: this.info.docId
        }
      });
    },
    goRecipel() {
      this.$router.push({
        name: "myRecipel",
        query: { docId: this.info.docId, docName: this.info.docName }
      });
    },
    goHisRecipel() {
      this.$router.push({
        name: "myHisRecipel",
        query: { docId: this.info.docId, docName: this.info.docName }
      });
    },
    goFit() {
      this.$router.push({
        name: "myFit"
      });
    },
    openCheckList() {
      this.$router.push({
        name: "checkVerification"
      });
    }
  }
};
</script>
<style scoped lang="less">
.my_head {
  width: 100%;
  box-sizing: border-box;
  padding: 16px 4%;
  background-size: 100% 85%;
  border-radius: 0px 0px 8px 8px;
}

.setDiv {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  img {
    margin-left: 16px;
  }
}

.docInfo {
  background: @white;
  border-radius: 8px;
  margin-top: 12px;
  .black-font;
  padding: 16px;
  position: relative;
  top: 30%;
}

.cfOrder {
  background: @white;
  border-radius: 8px;
  width: 100%;
  box-sizing: border-box;
  padding: 16px 0;
  margin-bottom: 12px;
  .cards {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .cardInfo {
      width: 25%;
      text-align: center;
      margin-top: 22px;
      img {
        margin: 0 auto;
      }
      li {
        margin-top: 6px;
        .font-size-sm;
        .black-font;
      }
    }
  }
}

.titleTips {
  padding: 0 16px;
  .line {
    margin-right: 4px;
  }
}

.beianInfo {
  background: @white;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 12px;
  .leftInfo {
    display: flex;
    align-items: center;
    span {
      margin-left: 8px;
      .black-font;
      .font-size-md-2;
    }
  }
}

.my_head_top {
  display: flex;

  .my_head_top_1 {
    margin-right: 10px;
  }

  .my_head_top_2 {
    width: calc(96% - 64px);
    .font-size-lg-2;
    .docName {
      line-height: 25px;
    }

    .my_head_top_2_1 {
      .display-div;
      margin-bottom: 3px;

      span {
        .font-size-lg;
        line-height: 22px;
      }
    }
  }
}

.my_head_top_2_2 {
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  span {
    padding: 0px 7px;
    line-height: 17px;
    background: @span-back;
    border-radius: 8px;
    .font-size-sm;
    .font-login-color-blue;
    margin-right: 12px;
    margin-top: 7px;
  }
}

.my_head_bootom {
  display: flex;
  align-items: center;
  margin-top: 20px;
  background: rgba(255, 255, 255, 0.21);
  border-radius: 4px;
  justify-content: space-around;

  .divLine {
    color: @back-border;
    font-size: 20px;
  }

  .my_head_bootom_item {
    text-align: center;
  }

  .my_head_bootom_item span {
    display: block;
    .font-size-sm;
    line-height: 17px;
  }

  .my_head_bootom_item span:last-child {
    .font-size-lg-2;
    .font-blod-2;
    line-height: 28px;
  }
}

.my_menu {
  width: 100%;
  padding: 0 16px;
  box-sizing: border-box;
}

.imgDiv {
  display: flex;
  align-items: center;
  img {
    margin-right: 12px;
  }
}
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.qrcode-block {
  width: 75%;
  height: 45%;
  background-color: #fff;
  border-radius: 16px !important;
  .qr-tab {
    display: flex;
    justify-content: space-around;
    flex-direction: row;
    background: @page-back;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    div {
      width: 50%;
      text-align: center;
      height: 35px;
      line-height: 40px;
    }
    .qrtab {
      background: @page-back;
      color: #000;
      border-top-left-radius: 16px;
      border-top-right-radius: 16px;
    }
    .qrtab_active {
      background: @white;
      color: @blue;
      line-height: 65px;
      border-top-left-radius: 16px;
      border-top-right-radius: 16px;
      height: 55px;
      margin-top: -15px;
    }
  }
}
</style>
