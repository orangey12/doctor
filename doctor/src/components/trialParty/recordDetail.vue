<template>
  <div class="patientDetail" id="patientDetail">
    <navbar title="问诊详情"></navbar>
    <div class="userInfo">
      <img
        v-zlazy="info.patientImg"
        class="userImg"
        @click="openInfoMa"
        v-if="info.patientName"
      />
      <div class="info">
        <li class="userName">{{ info.patientName }}</li>
        <li class="otherInfo">
          <img
            src="../../assets/img/index/sex_girl.png"
            class="icon-width-height-sm-16"
            v-if="info.sex == '女'"
          />
          <img
            src="../../assets/img/index/sex.png"
            class="icon-width-height-sm-16"
            v-if="info.sex == '男'"
          />
          <span>{{ info.age }}{{ info.ageUnit }}</span>
        </li>
      </div>
    </div>
    <div class="detailInfo">
      <van-field v-model="isSubsequent" label="服务类型" disabled/>
      <van-field v-model="visitTypeName" label="问诊类型" disabled/>
      <van-field v-model="signTime" label="问诊时间" disabled/>
      <van-field v-model="recordsTitle" label="标题" disabled/>

      <van-field v-model="diagnosisDisease" label="确诊疾病" disabled/>
      <van-field v-model="sickTime" label="患病时长" disabled>
        <template #button>
          <span>{{ timeUnit }}</span>
        </template>
      </van-field>
      <li class="title">病情描述</li>
      <div class="condition">
        <span>{{ diseaseDescription }}</span>
      </div>
      <li class="title">期望获得的帮助</li>
      <div class="condition">
        <span v-if="expectHelp">{{ expectHelp }}</span>
        <span v-else style="color: #999999">暂无期望获得的帮助</span>
      </div>
      <li class="title">
        病情照片
        <span class="tips">（仅限本人和接诊医生可看）</span>
      </li>
      <div class="condition" v-if="diseaseImgList.length > 0">
        <img
          v-zlazy="item"
          class="medicImg"
          v-for="(item, index) in diseaseImgList"
          :key="index"
          @click.stop="getImgView(diseaseImgList, index)"
        />
      </div>
      <div class="condition helpDiv" v-else>
        <span style="color:#E5E5E5;">暂未上传图片</span>
      </div>
      <van-overlay :show="bqImgShow" @click="bqImgShow = false">
        <span>
          <img style="width: 60%;margin: 50% auto" v-zlazy="this.bqImg"/>
        </span>
      </van-overlay>
      <li class="title">
        其它照片
        <span class="tips">（仅限本人和接诊医生可看）</span>
      </li>
      <div class="condition" v-if="medicalImgList.length > 0">
        <img
          v-zlazy="item"
          class="medicImg"
          v-for="(item, index) in medicalImgList"
          :key="index"
          @click.stop="getImgView(medicalImgList, index)"
        />
      </div>
      <div class="condition helpDiv" v-else>
        <span style="color:#E5E5E5;">暂未上传图片</span>
      </div>
      <van-overlay :show="qtImgShow" @click="qtImgShow = false">
        <span>
          <img style="width: 60%;margin: 50% auto" v-zlazy="this.qtImg"/>
        </span>
      </van-overlay>
      <van-cell-group class="vanCell">
        <van-cell title="本次处方" is-link @click="openCf"/>
      </van-cell-group>
    </div>
    <img-save
      v-if="showPic"
      :showPic="showPic"
      :index="index"
      :images="images"
      @changePreview="changePreview"
      @onClose="onClose"
    ></img-save>
  </div>
</template>

<script>
import navbar from "@/common/navbar";
import $api from "@/utils/api.js";
import {getCheckPatientRecords, saveProReceive} from "@/api/judge";
import {Toast} from "vant";
import myJstools from "@/utils/myJsTools";
import {getLabPresentationOssImg} from "@/api/oss";
import myJsTools from "../../utils/myJsTools";
import ossUpDown from "../../utils/ossUpDown";
import ImgSave from "../../common/imgSave";

export default {
  name: "patientDetail",
  data() {
    return {
      bqImgShow: false, // 病情图片遮罩
      bqImg: "",
      visitTypeName: "",
      isSubsequent: "",
      qtImgShow: false, // 其他图片遮罩
      qtImg: "",
      regId: "", //挂号id
      regCode: "", // 挂号编号
      patientId: "0", //患者id
      patientName: "", //患者姓名
      recordsTitle: "", // 病历标题
      diagnosisDisease: "", // 确诊疾病
      sickTime: 2, //患病时长
      timeUnit: "", // 时长单位
      diseaseDescription: "", // 疾病描述
      expectHelp: "", //期望帮助
      diseaseImg: [], //病情图片
      medicalImg: "", // 其他图片
      age: "",
      sex: "",
      signTime: "",
      type: "",
      showRefundRe: false, //选择拒诊原因
      result: [],
      userInfo: {}, //用户信息传参
      info: [],
      docId: "",
      geneticHistory: "",
      previousHistory: "",
      drugAllergyHistory: "",
      familyMedicalHistory: "",
      headImg: "",
      medicalImgList: [],
      diseaseImgList: [],
      showPic: false,
      images: [],
      index: 0,
    };
  },
  created() {
    var queVal = this.$route.query;
    console.log("queVal", queVal);
    this.appointment = queVal.appointment;
    this.regId = queVal.regId;
    this.patientId = queVal.patientId;
    this.getDetail();
  },
  methods: {
    // 预览图片
    getImgView(item, index) {
      console.log(item);
      this.images = item;
      this.index = index;
      this.showPic = true;
    },
    changePreview(index) {
      this.index = index;
    },
    onClose() {
      this.showPic = false;
    },
    getDetail() {
      let me = this;
      getCheckPatientRecords({
        regId: myJsTools.getItem("patientInfo").regId,
        patientId: myJsTools.getItem("patientInfo").patientId
      }).then(res => {
        this.info = res.data;
        let data = res.data;
        if (data.isSubsequent == "1") {
          data.isSubsequent = "复诊";
        } else {
          data.isSubsequent = "咨询";
        }
        Object.assign(this.$data, res.data);
        if (data.medicalImg) {
          me.medicalImgList = JSON.parse(data.medicalImg);
          console.log(data.medicalImg)
        }

        // 病情照片
        if (data.diseaseImg) {
          me.diseaseImgList = JSON.parse(data.diseaseImg);
        }
      });
    },
    // 打开本次处方
    openCf() {
      console.log(JSON.stringify(this.$route.query) + "------------this.$route.query");
      this.$router.push({
        name: "thisPrescription",
        query: this.$route.query
      });
    },
    // 打开问诊历史
    openLs() {
      this.$router.go(-1);
    },
    // 资料服务页面
    openInfoMa() {
      if (this.$store.getters.getHistoryUrl == "information") {
        this.$router.go(-1);
      } else {
        this.$router.push({
          name: "information",
          query: {
            patientId: this.patientId,
            docId: this.userDocId,
            pageType: "doc"
          }
        });
      }
    },
  },
  components: {
    ImgSave,
    navbar
  }
};
</script>

<style lang="less" scoped>
@import '../../assets/css/overall';

.patientDetail {
  background: @page-back;

  .userInfo {
    border-top: 1px solid @back-border;
    background: @white;
    display: flex;
    align-items: center;
    padding: 14px;

    .userImg {
      .img-width-height-lg;
      margin-right: 11px;
    }

    .info {
      .userName {
        line-height: 22px;
        .font-blod-3;
        .black-font;
        .font-size-lg;
      }

      .otherInfo {
        display: flex;
        margin-top: 5px;

        span {
          line-height: 16px;
          .font-color-2;
          .font-size-sm;
        }
      }
    }
  }

  .detailInfo {
    .black-font;
    .font-size-lg;
    line-height: 22px;
    margin-top: 8px;
    background: @white;
    padding: 0 16px;

    /deep/ .van-cell {
      padding: 19px 0;
      border-bottom: 1px solid @back-border;
      .font-size-lg;
    }

    /deep/ .van-field__control {
      .font-login-color;
    }

    .title {
      padding: 19px 0 10px 0;

      .tips {
        .font-login-color;
        margin-left: 8px;
      }
    }

    .vanCell {
      .van-cell {
        padding: 12px 0;
      }
    }
  }
}

.condition {
  padding: 15px 8px 7px 8px;
  border: 1px solid #e5e5e5;
  display: flex;
  border-radius: 8px;
  flex-wrap: wrap;

  span {
    display: inline-block;
    padding-bottom: 8px;
  }

  .medicImg {
    width: 30%;
    height: 100px;
    margin-bottom: 8px;
  }

  :nth-child(2),
  :nth-child(5),
  :nth-child(8) {
    margin: 0 9px;
  }
}
</style>
