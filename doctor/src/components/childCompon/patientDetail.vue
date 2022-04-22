<template>
  <div class="patientDetail" id="patientDetail">
    <div class="userInfo">
      <img v-zlazy="patientImg" class="img-width-height-lg"/>
      <div class="info">
        <li class="userName">{{ patientName }}</li>
        <li class="otherInfo">
          <img
            src="../../assets/img/index/sex_girl.png"
            class="icon-width-height-sm-16"
            v-if="sex == '女'"
          />
          <img
            src="../../assets/img/index/sex.png"
            class="icon-width-height-sm-16"
            v-if="sex == '男'"
          />
          <span>{{ age }}{{ ageUnit }}</span>
        </li>

      </div>
    </div>
    <div class="detailInfo">
      <van-field v-model="isSubsequent" label="服务类型" disabled/>
      <van-field v-model="visitTypeName" label="问诊类型" disabled/>
      <van-field
        v-model="signTime"
        label="问诊时间"
        disabled
        v-if="type == 0"
      />
      <van-field v-model="appointment" label="预约问诊时间" disabled v-else/>
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
      <van-field v-model="geneticHistory" label="遗传病史" disabled placeholder="暂无遗传病史"/>
      <van-field v-model="previousHistory" label="既往史" disabled placeholder="暂无既往史"/>
      <van-field v-model="drugAllergyHistory" label="药物过敏史" disabled placeholder="暂无药物过敏史"/>
      <van-field v-model="familyMedicalHistory" label="家族病史" disabled placeholder="暂无家族病史"/>
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
  import $api from "@/utils/api.js";
  import {Toast} from "vant";
  import myJstools from "@/utils/myJsTools";
  import {getCheckPatientRecords} from "../../api/cf";
  import ossUpDown from "../../utils/ossUpDown";
  import ImgSave from "../../common/imgSave";
  import myJsTools from "../../utils/myJsTools";

  export default {
    components: {ImgSave},
    props: {
      regId: {
        type: String
      },
      patientId: {
        type: String
      },
      type: {
        default: 0,
        type: Number
      },
      pagetype: {
        type: String,
        default: "wzDetail"
      },
      addTime: {
        type: String,
        default: "",
      }
    },
    data() {
      return {
        regCode: "", // 挂号编号
        patientName: "", //患者姓名
        deptName: "",
        recordsTitle: "", // 病历标题
        diagnosisDisease: "", // 确诊疾病
        sickTime: 0, //患病时长
        timeUnit: "天", // 时长单位
        ageUnit: "",
        docName: "",
        isSubsequent: "",
        signTime: "",
        visitTypeName: "",
        diseaseDescription: "", // 疾病描述
        expectHelp: "", //期望帮助
        diseaseImg: [], //病情图片
        medicalImg: [],
        diseaseImgList: [],
        medicalImgList: [],
        age: "",
        sex: "",
        showRefundRe: false, //选择拒诊原因
        result: [],
        userInfo: {}, //用户信息传参
        docId: "",
        geneticHistory: "",
        previousHistory: "",
        drugAllergyHistory: "",
        familyMedicalHistory: "",
        showPic: false,
        images: [],
        index: 0,
        diagName: "",
        inquiryTime: "",
        patientImg: "",
      };
    },
    created() {
      this.userInfo = myJstools.getItem("patientInfo");
      if (this.$route.query.diagName) {
        this.diagName = this.$route.query.diagName;
        this.inquiryTime = this.$route.query.inquiryTime
      }
      console.log(this.userInfo, "patientInfo");
      var queVal = this.$route.query;
      console.log(queVal);
      this.conType = queVal.conType;
      this.appointment = queVal.appointment;
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
      //获取问诊详情
      getDetail() {
        let me = this;
        getCheckPatientRecords({
          regId: this.regId,
          patientId: this.patientId
        }).then(async res => {
          console.log(JSON.stringify(res) + "=============问诊详情");
          let data = res.data;
          if (data.isSubsequent == "1") {
            data.isSubsequent = "复诊";
          } else {
            data.isSubsequent = "咨询";
          }
          Object.assign(this.$data, data);
          // 其他照片
          if (data.medicalImg) {
            this.medicalImgList = JSON.parse(data.medicalImg);
          }
          // 病情照片
          if (data.diseaseImg) {
            this.diseaseImgList = JSON.parse(data.diseaseImg);
            console.log(data.diseaseImg)
          }
        });
      },
      toggle(index) {
        this.$refs.checkboxes[index].toggle();
      }
    }
  };
</script>

<style lang="less" scoped>


  .patientDetail {
    background: @page-back;

    .userInfo {
      border-top: 1px solid @back-border;
      background: @white;
      display: flex;
      align-items: center;
      padding: 14px;

      .img-width-height-lg {
        margin-right: 11px;
      }

      .info {
        .userName {
          line-height: 22px;
          .black-font;
          .font-size-lg;
          .font-blod-2;
        }

        .otherInfo {
          display: flex;
          margin-top: 5px;

          span {
            line-height: 16px;
            .font-size-sm;
            .font-color-2;
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
      padding: 0 16px 17px;
      /deep/ .van-cell {
        padding: 18px 0;
        font-size: 16px;
        border-bottom: 1px solid @back-border;
      }

      /deep/ .van-field__control:disabled{
        .black-font;
      }

      .title {
        padding: 19px 0 10px 0;

        .tips {
          .font-color-2;
          margin-left: 8px;
        }
      }

      .condition {
        padding: 15px 8px 7px 8px;
        border: 1px solid @back-border;
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

    }
  }
</style>
