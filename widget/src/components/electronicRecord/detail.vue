<template>
  <div>
    <van-form @submit="saveFun">
      <div class="detailCom">
        <div class="patientRecord">
          <li>患者主诉</li>
          <van-field
            v-model="info.chiefComplaint"
            rows="2"
            autosize
            type="textarea"
            maxlength="20"
            show-word-limit
            placeholder="请输入患者主诉"
          />
        </div>
        <div class="patientRecord">
          <li>现病史</li>
          <van-field
            v-model="info.presentDiseaseHistory"
            rows="2"
            autosize
            type="textarea"
            maxlength="200"
            show-word-limit
            placeholder="请输入患者现病史,若无,请填写无"
          />
        </div>
        <div class="patientRecord">
          <li>既往病史</li>
          <van-field
            v-model="info.previousHistory"
            rows="2"
            autosize
            type="textarea"
            maxlength="200"
            show-word-limit
            placeholder="请输入患者既往病史,若无请填写无"
          />
        </div>
        <div class="patientRecord">
          <li>药物过敏史</li>
          <van-field
            v-model="info.drugAllergyHistory"
            rows="2"
            autosize
            type="textarea"
            maxlength="200"
            show-word-limit
            placeholder="请输入患者药物过敏史，若无请填写无"
          />
        </div>
        <div class="patientRecord">
          <li>遗传病史</li>
          <van-field
            v-model="info.geneticHistory"
            rows="2"
            autosize
            type="textarea"
            maxlength="200"
            show-word-limit
            placeholder="请输入患者遗传病史，若无请填写无"
          />
        </div>
        <div class="patientRecord">
          <li>家族病史</li>
          <van-field
            v-model="info.familyMedicalHistory"
            rows="2"
            autosize
            type="textarea"
            maxlength="200"
            show-word-limit
            placeholder="请输入患者家族病史，若无请填写无"
          />
        </div>
        <div class="patientRecord">
          <li>手术史</li>
          <van-field
            v-model="info.surgicalHistory"
            rows="2"
            autosize
            type="textarea"
            maxlength="200"
            show-word-limit
            placeholder="请输入患者手术史，若无请填写无"
          />
        </div><div class="patientRecord">
        <li>预防接种史</li>
        <van-field
          v-model="info.vaccinationHistory"
          rows="2"
          autosize
          type="textarea"
          maxlength="200"
          show-word-limit
          placeholder="请输入患者预防接种史，若无请填写无"
        />
      </div>
        <div class="patientRecord">
          <li>诊断</li>
          <van-field
            v-model="info.diagName"
            rows="2"
            autosize
            type="textarea"
            maxlength="200"
            show-word-limit
            placeholder="请输入诊断"
          />
        </div>
        <!-- <div class="patientRecord">
        <li>医嘱</li>
        <van-field
          v-model="info.medicalAdvice"
          rows="2"
          autosize
          type="textarea"
          maxlength="200"
          show-word-limit
          placeholder="请输入医嘱"
        />
      </div> -->
        <!-- <div class="patientRecord">
        <li>治疗意见</li>
        <van-field
          v-model="info.cureOpinion"
          rows="2"
          autosize
          type="textarea"
          show-word-limit
          maxlength="200"
          placeholder="请输入治疗意见"
        />
      </div> -->
      </div>
      <div class="picDiv">
        <div class="uploadPicDiv" v-if="inspectionReport.length > 0 || !emrId">
          <li>检验报告 <span class="tips">(请上传检验报告，选填)</span></li>
          <div class="imgDiv">
            <div v-for="(item, index) in inspectionReport" :key="index">
              <img
                v-zlazy="item.src"
                alt=""
                class="uploadPic"
                @click="lookImg(1)"
              />
              <img
                src="../../assets/img/cf/deleteZd.png"
                v-if="!emrId"
                class="deleteIcon"
                @click="deleteImg('1', index)"
              />
            </div>
            <div v-if="inspectionReport.length < 6">
              <img
                src="../../assets/img/record/uploadPic.png"
                v-if="!emrId"
                class="uploadPic"
                @click="openSelectPic('1')"
              />
            </div>
          </div>
        </div>
        <div class="uploadPicDiv" v-if="checkReport.length > 0 || !emrId">
          <li>检查报告 <span class="tips">(请上传检查报告)</span></li>
          <div class="imgDiv">
            <div v-for="(item, index) in checkReport" :key="index">
              <img
                v-zlazy="item.src"
                alt=""
                class="uploadPic"
                @click="lookImg(2)"
              />
              <img
                src="../../assets/img/cf/deleteZd.png"
                v-if="!emrId"
                class="deleteIcon"
                @click="deleteImg('2', index)"
              />
            </div>
            <div v-if="checkReport.length < 6">
              <img
                src="../../assets/img/record/uploadPic.png"
                v-if="!emrId"
                class="uploadPic"
                @click="openSelectPic('2')"
              />
            </div>
          </div>
        </div>
        <div class="uploadPicDiv" v-if="qtPic.length > 0 || !emrId">
          <li>其他照片 <span class="tips">(请上传其他照片，选填)</span></li>
          <div class="imgDiv">
            <div v-for="(item, index) in qtPic" :key="index">
              <img
                v-zlazy="item.src"
                alt=""
                class="uploadPic"
                @click="lookImg(3)"
              />
              <img
                src="../../assets/img/cf/deleteZd.png"
                v-if="!emrId"
                class="deleteIcon"
                @click="deleteImg('3', index)"
              />
            </div>
            <div v-if="qtPic.length < 6">
              <img
                src="../../assets/img/record/uploadPic.png"
                v-if="!emrId"
                class="uploadPic"
                @click="openSelectPic('3')"
              />
            </div>
          </div>
        </div>
      </div>
      <div
        class="commitBtn"
        @click="saveFun"
        v-if="!emrId"
        native-type="submit"
      >
        保存
      </div>
    </van-form>
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
  </div>
</template>

<script>
import {
  addProElectronicMedical,
  getLatestDetail,
  getOneDetail,
  medicalRecord,
  getLatestDetailOrPatientSelfForHistory
} from "../../api/record";
import myJsTools from "../../utils/myJsTools";
import ossUpDown from "../../utils/ossUpDown";
import { Toast, Dialog } from "vant";
import imgSave from "@/common/imgSave";

export default {
  name: "detail",
  components: { imgSave },
  props: {
    regId: {
      default: ""
    },
    patientName: {
      default: ""
    },
    patientId: {
      default: ""
    },
    emrId: {
      default: ""
    }
  },
  data() {
    return {
      info: {
        chiefComplaint: "",
        // cureOpinion: "",//治疗意见
        diagName: "", //诊断名称
        // medicalAdvice: "",//医嘱
        presentDiseaseHistory: "", //现病史
        previousHistory: "", //既往史
        sexCode: "",
        drugAllergyHistory: "" //药物过敏史
      },
      // 验证疾病
      ValidationValue: "",
      // 验证高热
      hotValue: "",
      picActions: [
        { name: "拍照", sourceType: "camera" },
        { name: "从相册选择", sourceType: "album" }
      ],
      showPic: false,
      inspectionReport: [],
      checkReport: [],
      qtPic: [],
      showImgPic: false, //保存图片组件
      images: [],
      index: 0,
      selectType: "" //其他 检验 检查
    };
  },
  created() {
    if (this.emrId) {
      this.getOneDetail();
    } else {
      this.getNewRecord();
    }
  },
  methods: {
    //获取空白记录
    getNewRecord() {
      getLatestDetailOrPatientSelfForHistory({
        regId: this.regId,
        patientId: this.patientId
      }).then(async res => {
        console.log(JSON.stringify(res));
        await this.dataReset(res);
      });
    },
    getmedicalRecord() {
      medicalRecord().then(res => {
        //禁词验证数据
        let valueData = res.medicalHistory.data.sex.data;
        //发热验证数据
        let hotData = res.medicalHistory.data.required[0].hot.data;
        if (this.info.sexCode == "") {
          this.ValidationValue = "";
        } else if (this.info.sexCode == "1") {
          // 男：性别疾病校验
          this.ValidationValue = valueData[1];
          this.hotValue = hotData;
        } else if (this.info.sexCode == "2") {
          // 女：性别疾病校验
          this.ValidationValue = valueData[2];
          this.hotValue = hotData;
        }
      });
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
    lookImg(type) {
      let imgUrl = [],
        data;
      if (type == 1) {
        data = this.inspectionReport;
      } else if (type == 2) {
        data = this.checkReport;
      } else if (type == 3) {
        data = this.qtPic;
      }
      for (let i = 0; i < data.length; i++) {
        imgUrl.push(data[i].src);
      }
      this.showImgPic = true;
      this.images = imgUrl;
    },
    //  删除图片
    deleteImg(type, index) {
      if (type == "1") {
        this.inspectionReport.splice(index, 1);
      } else if (type == "2") {
        this.checkReport.splice(index, 1);
      } else if (type == "3") {
        this.qtPic.splice(index, 1);
      }
    },
    //获取最新一次的记录详情
    // getNewRecord() {
    //   getLatestDetail({
    //     regId: this.regId
    //   }).then(async res => {
    //     console.log(JSON.stringify(res));
    //     await this.dataReset(res);
    //   });
    // },
    //获取某次记录的详情
    getOneDetail() {
      getOneDetail({
        emrId: this.emrId
      }).then(async res => {
        console.log(JSON.stringify(res));
        await this.dataReset(res);
      });
    },
    //数据赋值
    async dataReset(res) {
      let me = this;
      this.info = Object.assign({}, res.data);
      let data = res.data;
      if (data) {
        let lisReport = [],
          pacsReport = [],
          qtImg = [];
        if (data.lisReport) {
          lisReport = res.data.lisReport.split(";");
          for (let i = 0; i < lisReport.length; i++) {
            const imgName = lisReport[i];
            if (imgName) {
              this.inspectionReport.push({
                src: imgName,
                imgUrl: lisReport[i]
              });
            }
          }
        }
        if (data.pacsReport) {
          pacsReport = res.data.pacsReport.split(";");
          for (let i = 0; i < pacsReport.length; i++) {
            const imgName = pacsReport[i];
            if (imgName) {
              this.checkReport.push({
                src: imgName,
                imgUrl: pacsReport[i]
              });
            }
          }
        }
        if (data.qtImg) {
          qtImg = res.data.qtImg.split(";");
          for (let i = 0; i < qtImg.length; i++) {
            const imgName = qtImg[i];
            if (imgName) {
              this.qtPic.push({
                src: imgName,
                imgUrl: qtImg[i]
              });
            }
          }
        }
      }
      this.getmedicalRecord();
    },
    violateReg(reg, str) {
      if (!reg || !str) {
        return [];
      }
      const Reg = new RegExp(reg, "g");
      let i;
      let arr = [];
      // 每次匹配一个
      while ((i = Reg.exec(str))) {
        // 取每条数据
        let item = i[0];
        // 放入数组
        arr.push(item);
      }
      return arr;
    },
    //保存修改记录
    saveFun() {
      if (!this.info.chiefComplaint) {
        Toast("主诉不能为空");
        return;
      }
      if (!this.info.diagName) {
        Toast("诊断不能为空");
        return;
      }
      if (!this.info.presentDiseaseHistory) {
        Toast("现病史不能为空");
        return;
      }
      if (!this.info.previousHistory) {
        Toast("既往病史不能为空");
        return;
      }
      if (!this.info.drugAllergyHistory) {
        Toast("药物过敏史不能为空");
        return;
      }
      if (!this.info.geneticHistory) {
        Toast("遗传病史不能为空");
        return;
      }
      if (!this.info.familyMedicalHistory) {
        Toast("家族病史不能为空");
        return;
      }
      if (!this.info.surgicalHistory) {
        Toast("手术史不能为空");
        return;
      }
      if (!this.info.vaccinationHistory) {
        Toast("预防接种史不能为空");
        return;
      }
      const {
        chiefComplaint,
        presentDiseaseHistory,
        previousHistory,
        drugAllergyHistory,
        diagName
      } = this.info;

      let arr = this.violateReg(this.ValidationValue, chiefComplaint);
      if (arr.length) {
        Dialog.alert({
          title: "提示",
          message: `您的“患者主诉”中含有与当前患者性别不符的用词，请进行修改。"${arr}"`,
          confirmButtonColor: "#02BB00"
        }).then(() => {});
        return;
      }
      arr = this.violateReg(this.ValidationValue, presentDiseaseHistory);
      // 现病史
      if (arr.length) {
        Dialog.alert({
          title: "提示",
          message: `您的“现病史”中含有与当前患者性别不符的用词，请进行修改。"${arr}"`,
          confirmButtonColor: "#02BB00"
        }).then(() => {});
        return;
        return;
      }
      arr = this.violateReg(this.ValidationValue, previousHistory);
      // 既往史
      if (arr.length) {
        Dialog.alert({
          title: "提示",
          message: `您的“既往史”中含有与当前患者性别不符的用词，请进行修改。"${arr}"`,
          confirmButtonColor: "#02BB00"
        }).then(() => {});
        return;
      }
      arr = this.violateReg(this.ValidationValue, drugAllergyHistory);
      // 药物过敏史
      if (arr.length) {
        Dialog.alert({
          title: "提示",
          message: `您的“药物过敏史”中含有与当前患者性别不符的用词，请进行修改。"${arr}"`,
          confirmButtonColor: "#02BB00"
        }).then(() => {});
        return;
      }
      arr = this.violateReg(this.ValidationValue, diagName);
      // 诊断
      if (arr.length) {
        Dialog.alert({
          title: "提示",
          message: `您的“诊断”中含有与当前患者性别不符的用词，请进行修改。"${arr}"`,
          confirmButtonColor: "#02BB00"
        }).then(() => {});
        return;
      }

      let param = this.info;
      param.regId = this.regId;
      param.patientName = this.patientName;
      param.patientId = this.patientId;
      param.docId = myJsTools.getItem("token_info").docId;
      param.docName = myJsTools.getItem("token_info").docName;
      let lisReport = [],
        pacsReport = [],
        qtImg = [];
      for (let i = 0; i < this.inspectionReport.length; i++) {
        lisReport.push(this.inspectionReport[i].imgUrl);
      }
      for (let i = 0; i < this.checkReport.length; i++) {
        pacsReport.push(this.checkReport[i].imgUrl);
      }
      for (let i = 0; i < this.qtPic.length; i++) {
        qtImg.push(this.qtPic[i].imgUrl);
      }
      param.lisReport = lisReport.join(";");
      param.pacsReport = pacsReport.join(";");
      param.qtImg = qtImg.join(";");

      let hotVal = [
        chiefComplaint,
        presentDiseaseHistory,
        previousHistory,
        drugAllergyHistory,
        diagName
      ].toString();

      let isHot = this.violateReg(this.hotValue, hotVal);
      if (isHot.length) {
        Dialog.confirm({
          title: "提示",
          message:
            "若该患者为高热患者，请提醒患者去医院门诊进行就诊，暂不支持互联网医院问诊",
          confirmButtonColor: "#02BB00",
          confirmButtonText: "继续提交"
        })
          .then(() => {
            addProElectronicMedical(param).then(res => {
              Toast("保存成功");
              this.$router.go(-1);
            });
          })
          .catch(() => {
            return;
          });
      } else {
        console.log('53423423432432432',param)
        addProElectronicMedical(param).then(res => {
          Toast("保存成功");
          this.$router.go(-1);
        });
      }
    },
    // 选择照片或者拍照
    getPic(val) {
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
          function(ret, err) {
            if (ret) {
              me.saveImg({
                path: ret.data
              });
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
    openSelectPic(type) {
      this.selectType = type;
      this.showPic = true;
    },
    // 选择图片
    selectPicOpt() {
      let me = this;
      var UIAlbumBrowser = api.require("UIAlbumBrowser");
      let type = this.selectType,
        maxNum;
      if (type == "1") {
        maxNum = 6 - me.inspectionReport.length;
      } else if (type == "2") {
        maxNum = 6 - me.checkReport.length;
      } else if (type == "3") {
        maxNum = 6 - me.qtPic.length;
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
              size: 20
            },
            nav: {
              bg: "rgba(0,0,0,0.6)",
              titleColor: "#fff",
              titleSize: 18,
              cancelColor: "#fff",
              cancelSize: 16,
              finishColor: "#fff",
              finishSize: 16
            }
          },
          rotation: true
        },
        function(ret, err) {
          console.log(JSON.stringify(ret.list) + "获取图片错误");
          if (ret && ret.list && ret.list.length > 0) {
            for (let i = 0; i < ret.list.length; i++) {
              const element = ret.list[i];
              if (api.systemType == "ios") {
                me.transPath(element);
              } else {
                me.saveImg(element);
              }
            }
          } else {
            console.log(JSON.stringify(err) + "ssssssss");
          }
        }
      );
    },
    transPath: function(element, type) {
      var me = this;
      var UIAlbumBrowser = api.require("UIAlbumBrowser");
      UIAlbumBrowser.transPath(
        {
          path: element.path
        },
        function(ret, err) {
          if (ret) {
            var iospath = ret.path;
            element.path = iospath;
            me.saveImg(element);
          } else {
            console.log(JSON.stringify(err));
          }
        }
      );
    },
    async saveImg(element) {
      let me = this;
      let type = this.selectType;
      await myJsTools.appendFile(
        "17",
        element.path,
        "333.png",
        element.size,
        me.patientId
      );
      await api.addEventListener(
        {
          name: "upImg"
        },
        function(ret, err) {
          console.log(JSON.stringify(ret.value));
          let m = {};
          m.imgUrl = ret.value.url;
          m.src = ret.value.src;
          if (type == "1") {
            me.inspectionReport.push(m);
          } else if (type == "2") {
            me.checkReport.push(m);
          } else if (type == "3") {
            me.qtPic.push(m);
          }
        }
      );
    }
  }
};
</script>

<style scoped lang="less">
.detailCom {
  background: #ffffff;
  padding: 0 16px 15px;
  color: #333333;
  font-size: 16px;
  line-height: 23px;
  .patientRecord {
    li {
      padding: 19px 0 10px;
    }
    /deep/.van-cell {
      padding: 15px 8px;
      border: 1px solid #e5e5e5;
    }
  }
}
.picDiv {
  margin-top: 8px;
  background: #ffffff;
  padding: 0 16px 15px;
  margin-bottom: 60px;
  .uploadPicDiv {
    li {
      padding: 19px 0 10px;
      color: #333;
      font-size: 16px;
      span {
        color: #999999;
        font-size: 12px;
      }
    }
    .imgDiv {
      display: flex;
      flex-wrap: wrap;
      border: 1px solid #e5e5e5;
      padding: 14px 0 0 14px;
      .uploadPic {
        margin-right: 14px;
        margin-bottom: 14px;
        object-fit: cover;
      }
      div {
        position: relative;
      }
      .deleteIcon {
        width: 15px;
        height: 15px;
        position: absolute;
        right: 8px;
        top: -8px;
      }
    }
  }
}
.uploadPic {
  width: 94px;
  height: 94px;
}
.commitBtn {
  background: #14a0e6;
  color: #ffffff;
  width: 100%;
  position: fixed;
  bottom: 0;
  text-align: center;
  line-height: 49px;
  font-size: 18px;
}
</style>
