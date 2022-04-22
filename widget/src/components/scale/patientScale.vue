<template>
  <div class="patientScale">
    <navbar :title="isFeedback == '1' ? '已反馈' : '未反馈'"></navbar>
    <detail-com
      :sendId="sendId"
      :isFeedback="isFeedback"
      :patientId="patientId"
      :userId="userId"
      :isCt="true"
    ></detail-com>
  </div>
</template>

<script>
import Navbar from "../../common/navbar";
import DetailCom from "./detailCom";
export default {
  name: "patientScale",
  components: { DetailCom, Navbar },
  data() {
    return {
      sendId: "",
      isFeedback: "0",
      userId:"",
    };
  },
  created() {
    this.sendId = this.$route.query.sendId;
    this.userId = this.$route.query.userId;
    this.patientId = this.$route.query.patientId;
    this.isFeedback = this.$route.query.isFeedback;
  },
  methods: {}
};
</script>

<style scoped lang="less"></style>
