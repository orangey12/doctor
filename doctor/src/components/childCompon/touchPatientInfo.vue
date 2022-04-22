<template>
  <div>
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
  </div>
</template>

<script>
import {getNowAndLastTimeRecord, getPatientInfoRecordTitleByRegId} from "../../api/cf";
import myJsTools from "../../utils/myJsTools";
import ImgSave from "../../common/imgSave";
import {getDoctorInfoByDocId} from "../../api/my";

export default {
name: "touchPatientInfo",
  components: {ImgSave},
  props:{
    patientId:{
      default:"",
      type:String
    }
  },
  data(){
    return{
      patientPopup:false,
      blInfo:{},
      showImgPic: false, //保存图片组件
      images: [],
      index: 0,
      userInfo:{},
      scrollHeight: "",
      paddingTop:"",
      docInfo:{},
    }
  },
  created() {
    this.getPatentInfo();
    this.getDocInfo();
    var h = document.documentElement.clientHeight || document.body.clientHeight;
    this.scrollHeight = h;
    this.paddingTop = api.safeArea.top || 0;
  },
  methods:{
    //打开患者病情信息 本次及上次病情
    openPatientInfo() {
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
    getDocInfo() {
      getDoctorInfoByDocId({
        docId: myJsTools.getItem("token_info").docId,
      }).then(res => {
        this.docInfo = res.data;
      })
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
    //获取患者信息
    getPatentInfo() {
      getPatientInfoRecordTitleByRegId({
        docId: myJsTools.getItem("token_info").docId,
        patientId: this.patientId,
      }).then(res => {
        this.userInfo = res.data;
      })
    },
    onSwipeRight() {
      this.patientPopup = false;
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
  }
}
</script>

<style scoped lang="less">

.patientInfo {
  padding-bottom: 8px;
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
