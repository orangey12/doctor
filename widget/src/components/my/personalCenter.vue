<template>
  <div class="personalCenter">
    <navbar title="个人中心"></navbar>
    <div class="personInfo"
         v-if="info.docId">
      <li class="head"
          @click="changeHeadImg">
        <span>头像</span>
        <div class="display-div">
          <img v-zlazy="docImg"
               class="img-inline-block img-width-height-spe" />
          <img src="../../assets/img/my/rightIcon.png"
               class="headRight" />
        </div>
      </li>

      <li>
        <span>名字</span>
        <div>
          <span>{{ info.docName }}</span>
        </div>
      </li>
      <!-- <li @click="showCode">
        <span>我的二维码</span>
        <div>
          <span></span>
          <img src="../../assets/img/my/code.png"
               class="rightArrow" />
          <img src="../../assets/img/my/rightIcon.png"
               alt="" />
        </div>
      </li> -->
      <li>
        <span>科室</span>
        <div>
          <span>{{ info.deptStr }}</span>
        </div>
      </li>
      <li>
        <span>职称</span>
        <div>
          <span>{{ info.docProf }}</span>
        </div>
      </li>
      <li @click="setLabel">
        <span>标签</span>
        <div>
          <span>{{ info.docLabelStr_2 }}</span>
          <img src="../../assets/img/my/rightIcon.png"
               alt="" />
        </div>
      </li>
      <li @click="editPhone">
        <span>手机号</span>
        <div>
          <span>{{ info.telNo }}</span>
          <img src="../../assets/img/my/rightIcon.png"
               alt="" />
        </div>
      </li>

    </div>
    <div class="moretext">
      <p>简介(选填)</p>
      <div class="moretext-box">
        <van-field v-model="info.docSynopsis"
                   rows="2"
                   autosize
                   class="font-size-md-2 fiels"
                   type="textarea"
                   maxlength="100"
                   show-word-limit
                   placeholder="请输入" />
      </div>
    </div>
    <div class="moretext">
      <p>擅长(选填)</p>
      <div class="moretext-box">
        <van-field v-model="info.specialties"
                   rows="2"
                   autosize
                   class="font-size-md-2 fiels"
                   type="textarea"
                   maxlength="100"
                   show-word-limit
                   placeholder="请输入" />
      </div>
    </div>
    <div class="bottomBtn"
         @click="saveInfo">
      <button class="publicBtn">保存</button>
    </div>
    <van-action-sheet v-model="showPic"
                      :actions="actions"
                      cancel-text="取消"
                      close-on-click-action
                      style="width:100%"
                      @select="onSelect" />

    <!-- <van-popup v-model="codeShow"
               class="shareHbPopup"
               round>
      <div>
        <div class="userInfo">
          <img v-zlazy="docImg"
               class="headImg img-width-height-lg">
          <div class="info">
            <li class="name">{{ info.docName }} {{ info.docProf }}</li>
            <li class="dept">{{ info.deptStr }}</li>
            <li class="tags">
              <span v-for="(item,index) in info.docLabelList">{{ item }}</span>
            </li>
          </div>
        </div>
        <div class="codeDiv">
          <qrcode :qr-url='"docId=" + info.docId'
                  :qr-size='250'
                  :qr-logo-size="20"
                  v-if="info.docId"></qrcode>
        </div>
      </div>
    </van-popup> -->

  </div>
</template>

<script>
import navbar from "../../common/navbar";
import qrcode from '../../common/qrcode'
import myJsTools from "../../utils/myJsTools";
import { getDoctorInfo, updateDoctorInfo } from "../../api/myCenter";
import { Toast } from "vant";
import avatar from "@/assets/img/my/default.png";
import ossUpDown from "../../utils/ossUpDown";
import VueQr from 'vue-qr'

export default {
  name: "personalCenter",
  data () {
    return {
      actions: [{ name: "从相册选择" }, { name: "拍照" }],
      showPic: false,
      docId: "",
      info: {},
      docImgName: "",
      docImg: "",
      defaultImg: 'this.src="' + avatar + '"',
      // codeShow: false,//展示医生二维码控制显示字段
      docCodeUrl: "",
      imagePath: require("../../assets/img/index_active.png"),
    };
  },
  components: { navbar, VueQr, qrcode },
  created () {
    this.docId = myJsTools.getItem("token_info").docId;
    this.getInfo();
    this.eventAddListener();
  },
  beforeCreate () {
    this.$store.commit("UPDATE_KEEP_ALIVE", {
      keepAlive: "personalCenter"
    });
  },
  methods: {
    saveInfo () {
      let param = {
        docId: this.docId,
        telNo: this.info.telNo,
        docSynopsis: this.info.docSynopsis,
        specialties: this.info.specialties
      };

      if (this.info.docLabelList) {
        param.docLabelList = this.info.docLabelList;
      }

      if (this.docImgName) {
        param.docImg = this.docImgName;
        let tokenInfo = myJsTools.getItem("token_info");
        tokenInfo.docImg = this.docImgName;
        myJsTools.setItem("token_info", tokenInfo);
        myJsTools.setItem("docUserInfo", tokenInfo);
      }
      
      updateDoctorInfo(param).then(res => {
        console.log(res);
        this.$router.go(-1);
        this.$store.commit("UPDATE_KEEP_ALIVE", {
          keepAlive: "personalCenter",
          type: 1
        });
      });
    },
    eventAddListener () {
      let me = this;
      api.addEventListener(
        {
          name: "editPhone"
        },
        function (ret, err) {
          me.info.telNo = ret.value.telNo;
        }
      );
      api.addEventListener(
        {
          name: "editLabel"
        },
        function (ret, err) {
          me.info.docLabelStr_2 = ret.value.label.join("、");
          me.info.docLabelStr = ret.value.label.join(",");
          me.info.docLabelList = ret.value.label;
          me.info = Object.assign({}, me.info);
        }
      );
    },
    getInfo () {
      getDoctorInfo({
        docId: this.docId
      }).then(async res => {
        console.log(res);
        let data = res.data;
        this.docImg = data.docImg;
        if (data.docLabelStr && data.docLabelStr.indexOf(",") > -1) {
          data.docLabelStr_2 = data.docLabelStr.split(",").join("、");
          data.docLabelList = data.docLabelStr.split(",");
        } else {
          data.docLabelStr_2 = data.docLabelStr;
          data.docLabelList = [data.docLabelStr];
        }

        this.info = Object.assign({}, data);
      });
    },
    //展示医生二维码
    // showCode () {
    //   this.codeShow = true;
    // },
    //  更换头像
    changeHeadImg () {
      this.showPic = true;
    },
    //选择拍照还是相册
    async onSelect (item) {
      if (api.systemType != 'ios') {
        let s = await myJsTools.getPromise("camera");
        if (!s) {
          Toast("请开启相机权限")
          return;
        }
      }
      this.show = false;
      let sourceType,
        filename,
        me = this;
      if (item.name == "拍照") {
        sourceType = "camera";
      } else {
        sourceType = "album";
      }
      filename =
        Number(
          Math.random()
            .toString()
            .substr(3, 18) + Date.now()
        ).toString(36) + ".png";
      api.getPicture(
        {
          sourceType: sourceType,
          encodingType: "png",
          mediaValue: "pic",
          destinationType: "base64",
          allowEdit: true,
          quality: 100,
          saveToPhotoAlbum: false
        },
        function (ret, err) {
          console.log(JSON.stringify(ret));
          if (ret && ret.data != '' && ret.base64Data != '') {
            myJsTools.appendFile(
              "4",
              ret.base64Data,
              "123.png",
              ret.base64Data.length
            );
            api.addEventListener(
              {
                name: "upImg"
              },
              function (ret, err) {
                me.docImgName = ret.value.url;
              }
            );
            me.docImg = ret.data;
          } else if (err) {
            console.log(JSON.stringify(err));
          }
        }
      );
    },
    setLabel () {
      this.$router.push({
        name: "setLabel",
        query: {
          label: this.info.docLabelStr
        }
      });
    },
    editPhone () {
      this.$router.push({
        name: "editPhone",
        query: {
          telNo: this.info.telNo
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.personInfo {
  .font-size-md;
  .black-font;

  img {
    .rightArrow;
    display: inline-block;
  }

  li {
    .display-div;
    padding: 12px 16px;
    background: @white;
    margin-top: 1px;

    div {
      display: flex;
      width: 75%;
      text-align: right;

      span {
        .font-login-color;
        line-height: 22px;
        display: inline-block;
        width: 100%;
        .div-overflow;
      }
    }
  }

  .head {
    line-height: 30px;

    div {
      width: 15%;
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
        .font-blod-2;
        .font-size-lg;
        line-height: 22px;
      }

      .dept {
        .font-color-2;
        .font-size-sm;
        line-height: 17px;
        margin-top: 2px;
      }

      .tags {
        margin-top: 10px;

        span {
          background: @span-back;
          display: inline-block;
          .font-login-color-blue;
          .font-size-sm;
          line-height: 16px;
          padding: 1px 6px;
        }
      }
    }

    .headImg {
      margin-right: 11px;
    }
  }

  .codeDiv {
    box-shadow: none;
    .font-login-color;
    .font-size-md;
    line-height: 26px;
    padding: 38px;
  }
}
.moretext {
  background: @white;
  border: 1px solid @back-border;
  p {
    align-items: center;
    padding: 0.32rem 0.426667rem;
    margin-top: 0.026667rem;
  }
  .moretext-box {
    margin: 0 16px 12px;
    padding-bottom: 12px;
    .fiels {
      background: #f6f8fb;
    }
  }
}
.personalCenter {
  padding-bottom: 60px;
}
</style>
