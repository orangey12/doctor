<template>
  <div class="record">
    <navbar title="电子病历"></navbar>
    <div class="recordBody">
      <van-tabs
        v-model="active"
        title-inactive-color="#666666"
        title-active-color="#14A0E6"
        color="#14A0E6"
        @click="getList()"
      >
        <van-tab title="详情">
          <detail
            :regId="regId"
            :patientId="patientId"
            :patientName="patientName"
          ></detail>
        </van-tab>
        <van-tab title="修改记录">
          <div class="listDiv">
            <div
              class="card"
              v-for="(item, index) in list"
              :key="index"
              @click="openDetail(item)"
            >
              <li class="name">修改人： {{ item.docName }}</li>
              <li class="type">身份： {{ item.docIdentity }}</li>
              <li class="time">修改时间：{{ item.addTime }}</li>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import Navbar from "../../common/navbar";
import Detail from "./detail";
import { getElectronicMedicalRegPage } from "../../api/record";
export default {
  name: "index",
  components: { Detail, Navbar },
  data() {
    return {
      active: 0,
      regId: "",
      patientId: "",
      patientName: "",
      listQuery: {
        regId: "",
        limit: 20,
        page: 1
      },
      list: []
    };
  },
  created() {
    let queryVal = this.$route.query;
    this.regId = this.listQuery.regId = queryVal.regId;
    this.patientId = queryVal.patientId;
    this.patientName = queryVal.patientName;
    this.getList();
  },
  methods: {
    getList() {
      getElectronicMedicalRegPage(this.listQuery).then(res => {
        console.log(res);
        this.list = res.data.rows;
      });
    },
    openDetail(item) {
      this.$router.push({
        name: "eleRecordDetail",
        query: {
          emrId: item.emrId
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.listDiv {
  padding: 0 16px;
  .card {
    margin-top: 12px;
    padding: 12px;
    background: #ffffff;
    color: #333333;
    border-radius: 4px;
    font-size: 14px;
    .type {
      margin: 15px 0;
    }
  }
}
</style>
