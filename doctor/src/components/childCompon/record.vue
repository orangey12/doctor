<template>
  <div class="my_box">
    <div
      class="my_box_item"
      v-for="(item,index) in recordList"
      :key="index"
      @click="openDetail(item,index)"
    >
      <img
        v-zlazy="item.patientImg"
        class="headImg img-width-height-md"
      />
      <div>
        <div class="patientInfo">
          <span>{{item.patientName}}</span>
          <span style="margin: 0 10px">{{item.sex}}</span>
          <span>{{item.age}}</span>
          <span class="blueRight font-login-color-blue" v-if="item.isSubsequent == 1">在线问诊</span>
          <span class="blueRight font-login-color-blue" v-else>在线咨询</span>
        </div>
        <div>
          <span>医生：{{item.docName}}</span>
          <span style="margin-left: 10px">{{item.deptName}}</span>
        </div>
        <p class="one-txt-cut">诊断：{{item.diagName}}</p>
        <p>提交时间：{{item.inquiryTime}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import myJstools from "@/utils/myJsTools";
import { getDiagnosisTreat } from "@/api/judge";
export default {
  name: "record",
  data() {
    return {
      recordList: []
    }
  },
  created() {
    this.userInfo = myJstools.getItem("patientInfo").patientId;
    console.log(this.userInfo)
    this.getRecord();
  },
  methods: {
    getRecord() {
      getDiagnosisTreat({
        limit: 5,
        page: 1,
        patients: [this.userInfo]
      }).then(async res => {
        console.log("诊疗记录", res);
        let data = res.data.rows;
        this.recordList = data;
      });
    },
    openDetail(item, index) {
      this.$router.push({
        name: "recordDetail",
        query: item
      })
    }
  }
};
</script>

<style scoped lang="less">

.my_box{
    width: 90%;
    margin: 0 auto;
    padding: 0 16px;
    overflow: hidden;
    &_item{
      padding: 12px;
      margin-top: 12px;
      background:@white;
      border-radius:8px;
      margin-bottom: 10px;
      display: flex;
      .black-font;
      .font-size-md;
      line-height: 20px;
      .headImg{
        margin-right: 12px;
        margin-top: 25px;
      }
      .patientInfo{
        .font-size-md-2;
        .font-blod-2;
        margin-top: 5px;
        .blueRight {
          float: right;
        }
      }
      div,p{
        align-items: center;
        .font-size-md;
        .black-font;
        line-height:14px;
      }
      div{
        margin-bottom: 10px;
      }
      p{
        margin-top: 10px;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: inherit;
        width: 250px;
      }
    }
    &_item div span:first-child{
      width: 57%;
    }
  }
</style>
