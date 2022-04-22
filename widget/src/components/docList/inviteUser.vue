<template>
  <div class="inviteUser">
    <navbar title="我的二维码"></navbar>
    <div class="inviteUserBody">
      <div class="box">
        <div class="changTitle">
          <div
            :class="active == 0 ? 'active font-login-color-blue' : ''"
            @click="changeTab(0)"
          >
            邀请患者
          </div>
          <div
            :class="active == 1 ? 'active font-login-color-blue' : ''"
            @click="changeTab(1)"
          >
            医疗协作
          </div>
          <span
            :class="active == 0 ? 'offset leftOff' : 'offset rightOff'"
          ></span>
        </div>
        <div class="codeDiv" v-show="active == 0">
          <qrcode :qr-url="codeUrl" :qr-size="250" v-if="codeUrl"></qrcode>
          <li>让患者用微信扫一扫</li>
          <li>添加医生进行问诊</li>
        </div>
        <div class="codeDiv" v-show="active == 1">
          <qrcode
            :qr-url="'docId=' + info.docId"
            :qr-size="250"
            :qr-logo-size="20"
            v-if="info.docId"
            key="2"
          ></qrcode>
          <li>让医生或代理商扫码添加</li>
          <li>好友关联</li>
        </div>
      </div>
      <van-popup v-model="show" class="sharePopup" position="bottom">
        <div class="iconDiv">
          <li @click="shareToWx('session')">
            <img src="../../assets/img/index/wx.png" alt="" class="wxIcon" />
            <span>微信好友</span>
          </li>
          <li @click="shareToWx('timeline')">
            <img src="../../assets/img/index/pyq.png" class="wxIcon" />
            <span>朋友圈</span>
          </li>
          <li @click="showHbFun">
            <img src="../../assets/img/index/hb.png" alt="" class="wxIcon" />
            <span>海报</span>
          </li>
        </div>
        <div class="btnDiv">
          <button class="publicBtn" @click="show = false">取消</button>
        </div>
      </van-popup>
      <van-popup v-model="showHb" class="shareHbPopup" round>
        <div>
          <div class="userInfo">
            <img alt="" class="headImg" v-zlazy="docImg" v-if="docImg" />
            <img
              src="../../assets/img/my/default.png"
              v-else
              alt=""
              class="headImg"
            />
            <div class="info">
              <li class="name">{{ info.docName }} {{ info.docProf }}</li>
              <li class="dept">{{ info.deptStr }}</li>
              <li class="tags">
                <span v-for="(item, index) in info.docLabelList">{{
                  item
                }}</span>
              </li>
            </div>
          </div>
          <div class="codeDiv">
            <qrcode
              :qr-url="hbCodeUrl"
              :qr-size="250"
              v-if="hbCodeUrl"
            ></qrcode>
            <li>微信扫描或长按识别二维码</li>
            <li>和医生进行交流</li>
          </div>
        </div>
        <div class="share">
          <span @click="toImage">保存相册</span>
        </div>
      </van-popup>
      <div style="position: fixed; opacity: 0">
        <div ref="imageWrapper" class="shareHbPopup" style="width: 100%">
          <div class="userInfo">
            <img v-zlazy="docImg" class="headImg" v-if="docImg">
            <img src="../../assets/img/my/default.png" class="headImg" v-else>
            <div class="info">
              <li class="name">{{ info.docName }} {{ info.docProf }}</li>
              <li class="dept">{{ info.deptStr }}</li>
              <li class="tags">
                <span v-for="(item, index) in info.docLabelList">{{
                  item
                }}</span>
              </li>
              <li>
                <span
                  v-for="(item, index) in info.docLabelStr"
                  :key="index"
                  class="labelItem"
                >
                  {{ item }}
                </span>
              </li>
            </div>
          </div>
          <div class="codeDiv">
            <qrcode
              :qr-url="hbCodeUrl"
              :qr-size="250"
              v-if="hbCodeUrl"
            ></qrcode>
            <li>微信扫描或长按识别二维码和医生进行交流</li>
          </div>
        </div>
      </div>
    </div>
    <div class="sharebtn-div" v-if="active == 0">
      <button class="publicBtn sharebtn" @click="show = true">分享</button>
    </div>
  </div>
</template>
<script>
import { findDocTypeLabelName } from "../../api/myCenter";
import qrcode from "../../common/qrcode";
import Navbar from "../../common/navbar";
import html2canvas from "html2canvas";
import { getDoctorInfo } from "../../api/myCenter";
import myJsTools from "../../utils/myJsTools";
import { createWxQrCode } from "../../api/docList";
import { Toast } from "vant";
export default {
  name: "inviteUser",
  components: { Navbar, qrcode },
  data() {
    return {
      active: 0,
      show: false,
      showHb: false,
      logo: require("../../assets/img/index_active.png"),
      imgUrl: "",
      info: {},
      docImg: "",
      docId: "",
      codeUrl: "",
      hbCodeUrl: "",
      rootCodeUrl: "",
      urlInfo: {},
      docInfo: {},
      appid: "",
      downLoadUrl: "",
    };
  },
  mounted() {
    this.docId = myJsTools.getItem("token_info").docId;
    this.appid=process.env.appid;
    this.baseUrl =
      process.env.baseURL+"cloud/cloudHosPatient/index.html";
    this.downLoadUrl =
      process.env.baseURL+"cloud/tools/docShare/?appType="+process.env.ENV_CONFIG;
    if(process.env.env_config=='test'||process.env.env_config=='hisdev'||process.env.env_config=='prod'){
      this.downLoadUrl =
        "https://llootong.cn/cloud/tools/docShare/?appType=yxl";
    }
    this.getInfo();
  },
  methods: {
    // 切换tab
    changeTab(active) {
      this.active = active;
    },
    //海报弹框展示
    showHbFun() {
      this.showHb = true;
      this.show = false;
    },
    //获取codeUrl
    getCodeUrl() {
      console.log(this.rootCodeUrl);
      console.log("111111111111111", this.docInfo.docName);
      createWxQrCode({
        docId: this.docInfo.docId,
        docName: this.docInfo.docName,
        codeType: "D_C_1",
        hosId: this.docInfo.hosId,
      }).then((res) => {
        console.log(res);
        this.codeUrl = res.data.url;
      });
    },
    //获取海报url
    getHbUrl() {
      let hbCodeUrl =
        this.baseUrl +
        "#/pages/shareDocCard/index?docId=" +
        this.docInfo.docId +
        "&hosId=" +
        this.docInfo.hosId +
        "&codeType=D_A_1&doCodeType=D_C_1";
      this.hbCodeUrl = hbCodeUrl;
    },
    //获取医生信息
    getInfo() {
      getDoctorInfo({
        docId: this.docId,
      }).then(async (res) => {
        console.log(res);
        let data = res.data;
        if (data.docLabelStr && data.docLabelStr.indexOf(",") > -1) {
          data.docLabelList = data.docLabelStr.split(",");
        } else {
          data.docLabelList = [data.docLabelStr];
        }
        this.docImg = data.docImg;
        this.info = Object.assign({}, data);
        this.docInfo = {
          docId: this.info.docId,
          docName: this.info.docName,
          docProf: this.info.docProf,
          deptName: this.info.deptStr,
          hosName: this.info.hosName,
          hosId: this.info.hosId,
          docLabelStr: this.info.docLabelStr,
        };
        if (this.info.docLabelList) {
          this.docInfo.docLable = [];
        }
        if (this.info.docImg) {
          this.docInfo.docImg = "";
        }
        this.urlInfo = {
          appid: this.appid,
          url: this.baseUrl,
        };
        var url = encodeURIComponent(
          this.urlInfo.url +
            "?appid=" +
            this.urlInfo.appid +
            "&docId=" +
            this.docInfo.docId +
            "&hosId=" +
            this.docInfo.hosId
        );
        this.rootCodeUrl =
          "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
          this.urlInfo.appid +
          "&redirect_uri=" +
          url +
          "&response_type=code&scope=snsapi_userinfo&state=1233456#wechat_redirect";
        this.getCodeUrl();
        this.getHbUrl();
      });
    },
    //分享到微信 朋友圈 传参:分享类型
    shareToWx(type) {
      let _this = this;
      var wxPlus = api.require("wxPlus");
      let contentUrl, description, title=process.env.name, thumb;
      if (this.active == 0) {
        contentUrl =
          this.baseUrl +
          "#/pages/shareDocCard/index?docId=" +
          this.docInfo.docId +
          "&hosId=" +
          this.docInfo.hosId +
          "&doCodeType=D_C_1";
        description = this.docInfo.docName + "医生名片，点击去沟通交流>>>";
      } else {
        contentUrl = this.downLoadUrl;
        description = "点击此处下载app";

      }
      wxPlus.isInstalled(function (ret, err) {
        if (ret.installed) {
          console.log("当前设备已安装微信客户端");
          if (type == "timeline") {
            title = _this.docInfo.docName + "医生名片，点击去沟通交流>>>";
          } else {
            if (process.env.ENV_CONFIG == "jyk") {
              title = "金益康";
              thumb = "widget://res/jykLogo2.png";
            } else {
              title = "医小鹿";
              thumb = "widget://res/index_active.png";
            }
          }
          wxPlus.shareWebpage(
            {
              apiKey: "",
              scene: type,
              title: title,
              description: description,
              thumb: thumb,
              contentUrl: contentUrl,
            },
            function (ret, err) {
              if (ret.status) {
                Toast("分享成功");
              } else {
                alert(JSON.stringify(err));
              }
            }
          );
        } else {
          alert("当前设备未安装微信客户端");
        }
      });
    },
    //保存海报到相册
    toImage() {
      html2canvas(this.$refs.imageWrapper, {
        allowTaint: true,
      }).then((canvas) => {
        let dataURL = canvas.toDataURL("image/png");
        // console.log(dataURL)
        this.imgUrl = dataURL;
        let me = this;
        var trans = api.require("trans");
        let filename = Number(
          Math.random().toString().substr(3, 18) + Date.now()
        ).toString(36);
        trans.saveImage(
          {
            base64Str: dataURL.split(",")[1],
            imgPath: "fs://img/",
            imgName: filename + ".png",
            album: true,
          },
          function (ret, err) {
            me.showHb = false;
            if (ret.status) {
              api.toast({
                msg: "图片保存成功",
                duration: 3000,
                location: "bottom",
              });
            } else {
              api.toast({
                msg: "图片保存失败",
                duration: 3000,
                location: "bottom",
              });
            }
          }
        );
      });
    },
  },
};
</script>
<style scoped lang="less">
.changTitle {
  background: @page-back;
  display: flex;
  text-align: center;
  position: relative;
  height: 90px;
  .font-size-sm;
  .font-login-color;
  div {
    position: absolute;
    bottom: 0;
    right: 0;
    display: inline-block;
    width: 50%;
    line-height: 46px;
    border-radius: 8px 8px 0px 0px;
    box-shadow: 0px -5px 10px rgba(150, 150, 150, 0.2);
  }
  :nth-child(1) {
    left: 0;
  }
  .active {
    background: @white;
    line-height: 56px;
    border-radius: 8px 8px 0px 0px;
    .font-size-md;
    .font-blod-3;
  }
  .offset {
    display: inline-block;
    width: 16px;
    height: 46px;
    position: absolute;
    bottom: 0;
  }
  .leftOff {
    left: 50%;
    background: linear-gradient(to right, #dddddd, #f5f5f5);
  }
  .rightOff {
    right: 50%;
    background: linear-gradient(to left, #dddddd, #f5f5f5);
  }
}
.inviteUser {
  .codeDiv {
    background: @white;
    box-shadow: 0px 4px 10px rgba(150, 150, 150, 0.2);
    border-radius: 0 0 8px 8px;
    text-align: center;
  }
}
.codeDiv {
  padding: 0 16px 16px;
  li {
    line-height: 20px;
    margin-bottom: 5px;
    .black-font;
    .font-size-md;
  }
  button {
    margin-top: 30px;
    letter-spacing: 1px;
  }
}
.sharePopup {
  border-radius: 0px;
  background: @page-back;
  padding-top: 21px;
  .iconDiv {
    display: flex;
    width: 100%;
    margin-bottom: 21px;
    padding: 0 34px;
    box-sizing: border-box;
    li {
      text-align: center;
      flex: 1;
      .font-size-sm;
      .font-login-color;
      img {
        .icon-width-height-wx;
        .img-inline-block;
      }
      span {
        display: block;
        margin-top: 6px;
      }
    }
  }
}
.shareHbPopup {
  width: 90%;
  padding: 12px 0;
  text-align: center;
  .userInfo {
    margin: 0 12px;
    padding: 12px;
    background: @page-back;
    border-radius: 8px;
    display: flex;
    .info {
      text-align: left;
      .name {
        .black-font;
        .font-blod-3;
        .font-size-lg;
        line-height: 22px;
      }
      .dept {
        line-height: 17px;
        margin-top: 2px;
        .font-color-2;
        .font-size-sm;
      }
      .tags {
        span {
          background: @span-back;
          display: inline-block;
          line-height: 16px;
          padding: 1px 6px;
          margin-top: 10px;
          .font-size-sm;
          .font-login-color-blue;
        }
      }
    }
    .headImg {
      .img-width-height-lg;
      margin-right: 11px;
    }
  }
  .codeDiv {
    box-shadow: none;
    line-height: 26px;
    padding-bottom: 38px;
    .black-font;
    .font-size-md;
  }
  .share {
    border-top: 1px solid @back-border;
    .font-color-2;
    .font-size-lg;
    .font-blod-2;
    line-height: 22px;
    span {
      display: inline-block;
      width: 30%;
      margin-top: 12px;
    }
    :nth-child(2) {
      border-left: 1px solid @back-border;
      border-right: 1px solid @back-border;
    }
  }
}
.sharebtn-div {
  position: absolute;
  bottom: 0px;
  z-index: 2;
  width: 100%;
  background-color: #fff;
  display: flex;
  align-items: center;
  .sharebtn {
    width: 92%;
    margin: 10px auto;
  }
}
.box {
  padding: 16px;
}
.labelItem {
  background: @white;
  .font-login-color;
  .font-size-md;
  line-height: 30px;
  display: inline-block;
  padding: 0 15px;
  border-radius: 2px;
  margin-right: 16px;
  margin-top: 12px;
}
</style>
