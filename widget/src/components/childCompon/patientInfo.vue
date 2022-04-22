<template>
  <div class="patientInfo" @click="openPatientInfo" v-if="info.patientName">
    <img v-zlazy="info.patientImg" class="img-width-height-md">
    <div class="patientDetailInfo">
      <li>
        <span class="patientName black-font font-size-lg">{{ info.patientName }}</span>
      </li>
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
        <span class="ageSpan font-color-2 font-size-sm">{{ info.age }}{{ info.ageUnit }}</span>
      </li>
    </div>
    <img src="../../assets/img/cf/rightArrow.png" class="rightArrow">
  </div>
</template>

<script>
import myJsTools from "../../utils/myJsTools";

export default {
  name: "patientInfo",
  props: {
    info: {
      default: {}
    }
  },
  methods: {
    openPatientInfo() {
      this.$router.push({
        name: "information",
        query: {
          patientId: this.info.patientId,
          docId: myJsTools.getItem("token_info").docId,
          pageType: "doc"
        }
      });
    },
  }
}
</script>

<style scoped lang="less">


.patientInfo {
  display: flex;
  align-items: center;
  background: @white;
  padding: 12px 16px;
  border-radius: 8px;

  .patientDetailInfo {
    width: 80%;
    padding-left: 14px;

    .otherInfo {
      display: flex;
      align-items: center;
      margin-top: 4px;
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
</style>
