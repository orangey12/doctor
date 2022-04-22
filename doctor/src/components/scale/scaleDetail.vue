<template>
  <div class="scaleDetail">
    <navbar title="量表详情"></navbar>
    <van-tabs
      v-model="active"
      title-inactive-color="#666666"
      title-active-color="#14A0E6"
      color="#14A0E6"
    >
      <van-tab title="详情">
        <detail-com
          :title="title"
          :didId="didId"
          :didOnlyId="didOnlyId"
          :isCt="false"
        ></detail-com>
      </van-tab>
      <van-tab title="历史">
        <history-com
          :title="title"
          :didOnlyId="didOnlyId"
          :didId="didId"
        ></history-com>
      </van-tab>
      <van-tab title="患者">
        <patient-list :didOnlyId="didOnlyId"></patient-list>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import Navbar from "../../common/navbar";
import DetailCom from "./detailCom";
import HistoryCom from "./historyCom";
import PatientList from "./patientList";
export default {
  name: "scaleDetail",
  components: { PatientList, HistoryCom, DetailCom, Navbar },
  data() {
    return {
      title: "",
      topicList: [],
      didId: "",
      active: 0,
      didOnlyId: ""
    };
  },
  computed: {
    topicOverList() {
      return this.$store.getters.getTopicList;
    }
  },
  created() {
    this.didId = this.$route.query.didId;
    this.didOnlyId = this.$route.query.didOnlyId;
    this.title = this.$route.query.title;
  },
  methods: {}
};
</script>

<style scoped lang="less">

</style>
