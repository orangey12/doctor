<template>
  <div class="recordInformation">
    <navbar title="互联网医院备案"></navbar>
    <div class="infoDiv">
      <van-field
        v-model="info.docName"
        label="姓名"
        type="text"
        placeholder="暂未填写姓名"
        clearable
        disabled
      ></van-field>
      <van-field
        v-model="info.sex"
        label="性别"
        type="text"
        disabled
        placeholder="暂未填写性别"
        clearable
      ></van-field>
      <van-field
        v-model="info.countryName"
        label="国籍"
        type="text"
        placeholder="暂未填写国籍"
        clearable
        disabled
      ></van-field>
      <van-field
        v-model="info.papersTypeName"
        label="证件类型"
        type="text"
        placeholder="暂未填写证件类型"
        clearable
        disabled
      ></van-field>
      <van-field
        v-model="info.papersNo"
        label="证件号码"
        type="text"
        placeholder="暂未填写证件号码"
        clearable
        disabled
      ></van-field>
      <van-field
        v-model="info.papersTime"
        label="证件有效期"
        type="text"
        placeholder="暂未填写证件有效期"
        clearable
        disabled
      ></van-field>
      <div class="cardInfo" v-if="info.papersFrontImg">
        <li class="title">身份证照片</li>
        <div>
          <img
            v-zlazy="info.papersFrontImg"
            class="zjPicture sfzInfo"
            @click="getImgView(info.papersFrontImg)"
          />
          <img
            v-zlazy="info.papersReverseImg"
            class="zjPicture sfzInfo"
            @click="getImgView(info.papersReverseImg)"
          />
        </div>
      </div>
      <div
        class="cardInfo"
        v-if="info.professionalImg && info.professionalImg.length > 0"
      >
        <li class="title">职称证书</li>
        <div>
          <img
            v-zlazy="item"
            class="zjPicture"
            @click="getImgView(info.professionalImg, index)"
            v-for="(item, index) in info.professionalImg"
          />
        </div>
      </div>
      <div
        class="cardInfo"
        v-if="info.qualificationImg && info.qualificationImg.length > 0"
      >
        <li class="title">医师资格证</li>
        <div>
          <img
            v-zlazy="item"
            class="zjPicture"
            @click="getImgView(info.qualificationImg, index)"
            v-for="(item, index) in info.qualificationImg"
          />
        </div>
      </div>
      <div
        class="cardInfo"
        v-if="info.employmentImg && info.employmentImg.length > 0"
      >
        <li class="title">医师从业证</li>
        <div>
          <img
            v-zlazy="item"
            class="zjPicture"
            @click="getImgView(info.employmentImg, index)"
            v-for="(item, index) in info.employmentImg"
          />
        </div>
      </div>
    </div>
    <img-save
      v-if="show"
      :showPic="show"
      :index="index"
      :images="images"
      @changePreview="changePreview"
      @onClose="onClose"
    ></img-save>
  </div>
</template>

<script>
import Navbar from "../../common/navbar";
import { getDoctorRecordInfo } from "../../api/myCenter";
import { getLabPresentationOssImg } from "../../api/oss";
import imgSave from "@/common/imgSave";
import ossUpDown from "../../utils/ossUpDown";
import myJsTools from "../../utils/myJsTools";

export default {
  name: "recordInformation",
  components: { Navbar, imgSave },
  data() {
    return {
      telNo: "",
      docId: "",
      info: {},
      show: false,
      images: [],
      index: 0,
      papersTime: "",
      papersFrontImg: "", //证件照正面图片
      papersReverseImg: "", //证件照反面图片
      professionalImg: "", //职称图片
      qualificationImg: "", //医师资格证图片
      employmentImg: "" //医师从业证图片
    };
  },
  created() {
    this.docId = this.$route.query.docId;
    this.getInfo();
  },
  methods: {
    // 预览图片
    getImgView(item) {
      this.images = [item];
      this.index = 0;
      this.show = true;
    },
    changePreview(index) {
      this.index = index;
    },
    onClose() {
      this.show = false;
    },
    //  获取医生互联网备案信息接口
    getInfo() {
      let docType = myJsTools.getItem("docInfo");
      let docTypeNum;
      if (docType == "all" || docType == "doc") {
        docTypeNum = "1";
      } else {
        docTypeNum = "2";
      }
      getDoctorRecordInfo({
        docId: this.docId,
        docType: docTypeNum
      }).then(async res => {
        console.log(res);
        let data;
        if (res.data.professionalImg) {
          res.data.professionalImg = res.data.professionalImg.split("|");
        }
        if (res.data.qualificationImg) {
          res.data.qualificationImg = res.data.qualificationImg.split("|");
        }

        if (res.data.employmentImg) {
          res.data.employmentImg = res.data.employmentImg.split("|");
        }
        this.info = data = res.data;
        if (res.data.papersStartDate) {
          this.papersTime =
            res.data.papersStartDate.split(" ")[0] +
            " 至 " +
            res.data.papersEndDate.split(" ")[0];
        } else {
          this.papersTime = "";
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.cardInfo {
  margin-top: 12px;
  background: @white;

  .title {
    padding: 12px 16px;
  }

  div {
    display: flex;
  }
}

.zjPicture {
  width: 28%;
  height: 101px;
  padding: 10px 10px;
}

.sfzInfo {
  width: 44%;
}

.van-cell {
  padding: 12px 16px;
  font-size: 14px;
  line-height: 22px;

  /deep/ input::-webkit-input-placeholder {
    .font-login-color;
    .font-size-md;
    line-height: 22px;
  }

  .van-field__label {
    .black-font;
  }
}
</style>
