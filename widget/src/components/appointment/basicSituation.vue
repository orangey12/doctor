<template>
  <div class="basicSituation">
    <navbar type="defaultPage" title="基本情况"></navbar>
    <div class="formdiv">
      <van-form @submit="saveFun">
        <div class="basicInfo">
          <van-field
            v-model="info.height"
            label="身高"
            placeholder="暂未填写"
          />
          <van-field
            v-model="info.weight"
            label="体重"
            placeholder="暂未填写"
          />
        </div>

        <div class="detailCom">
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
        </div>
        <div class="commitBtn" @click="saveFun" native-type="submit">
          保存
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import navbar from "@/common/navbar";
import {
  getHeightWightAndFourHistory,
  editUnimportantInfoByPatientId
} from "../../api/chat";
import { medicalRecord } from "../../api/record";
import { Toast, Dialog } from "vant";

export default {
  components: { navbar },
  data() {
    return {
      info: {
        drugAllergyHistory: "",
        familyMedicalHistory: "",
        geneticHistory: "",
        height: "",
        previousHistory: "",
        weight: "",
        patientId: "",
        sexCode: ""
      },
      // 验证疾病
      ValidationValue: "",
      // 验证高热
      hotValue: "",
      patientId: ""
    };
  },
  created() {
    this.patientId = this.$route.query.patientId;
    this.getDetail();
  },
  methods: {
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
      // if (!this.info.previousHistory) {
      //   Toast("既往病史不能为空");
      //   return;
      // }
      // if (!this.info.drugAllergyHistory) {
      //   Toast("药物过敏史不能为空");
      //   return;
      // }
      // if (!this.info.geneticHistory) {
      //   Toast("遗传病史不能为空");
      //   return;
      // }
      // if (!this.info.familyMedicalHistory) {
      //   Toast("家族病史不能为空");
      //   return;
      // }
      const { previousHistory, drugAllergyHistory } = this.info;
      let arr = this.violateReg(this.ValidationValue, previousHistory);
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

      let param = this.info;
      let hotVal = [previousHistory, drugAllergyHistory].toString();

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
            editUnimportantInfoByPatientId(param).then(res => {
              Toast("保存成功");
              this.$router.go(-1);
            });
          })
          .catch(() => {
            return;
          });
      } else {
        editUnimportantInfoByPatientId(param).then(res => {
          Toast("保存成功");
          this.$router.go(-1);
        });
      }
    },
    getDetail() {
      getHeightWightAndFourHistory({
        patientId: this.patientId
      }).then(res => {
        this.info = Object.assign({}, res.data);
        this.info.patientId = this.patientId;
        this.getmedicalRecord();
      });
    }
  }
};
</script>

<style lang="less" scoped>
.basicSituation {
  background-color: rgb(244, 244, 244);
  padding: 0 16px 15px;
}
.formdiv {
  background: #ffffff;
  padding: 15px;
  margin: 15px 0 60px;
}
.detailCom {
  // background: #ffffff;
  // padding: 0 16px 15px;
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
.commitBtn {
  background: #14a0e6;
  color: #ffffff;
  width: 100%;
  position: fixed;
  bottom: 0;
  text-align: center;
  line-height: 49px;
  left: 0;
  font-size: 18px;
}
.basicInfo {
  height: 100%;
  // padding: 0 16px;
  background: @white;
  /deep/.van-cell {
    // padding: 12px 0;
    line-height: 20px;
    border-bottom: 1px solid @back-border;
    .font-size-md-2;
  }
}
.savBtn {
  margin-top: 16px;
  background: @white;
  line-height: 46px;
  .font-login-color-blue;
  .font-size-md;
  text-align: center;
}
</style>
