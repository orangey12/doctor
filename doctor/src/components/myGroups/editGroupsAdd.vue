<template>
  <div class="editGroupsAdd">
    <navbar title="添加患者"></navbar>
    <div class="head">
      <van-form action="/">
        <van-search
          v-model="value"
          background="rgba(0,0,0,0.03)"
          :left-icon="searchIcon"
          placeholder="请输入想要搜索的内容"
          :clearable="true"
          @search="getPatientList"
        />
      </van-form>
      <div class="head_by" @click="show = true">
        <img src="@/assets/img/group/by.png" alt=""/>
        <span>筛选</span>
      </div>
    </div>
    <patient-select :indexList="indexList" ref="patientInfo" :patientList="patientList"></patient-select>
    <div :class="result.length > 0 ? 'foot' : 'foot_1'">
      <span v-if="result.length > 0">已选（{{ result.length }}）</span>
      <div @click="addPatient">添加</div>
    </div>
    <!-- 筛选 -->
    <van-popup
      v-model="show"
      position="right"
      :style="{
        height: '100vh',
        boxSizing:'border-box',
        padding: '16px 15px 0px',
        paddingTop: paddTop,
        width:'80%',
      }"
    >
      <screen-patient @getList="getPatientList" @screenPatienList="screenPatienList"></screen-patient>
    </van-popup>
  </div>
</template>
<script>
import navbar from "@/common/navbar";
import slider from "@/common/slider";
import {Toast} from "vant";
import {
  findAllUserIdAndNameAndHead,
  doctorAddPatientToSomeOneGroup,
  findPatientList
} from "../../api/myGroups";
import myJsTools from "../../utils/myJsTools";
import PatientSelect from "../childCompon/patientSelect";
import ScreenPatient from "../childCompon/screenPatient";

export default {
  name: "myGroupsIndex",
  components: {ScreenPatient, PatientSelect, navbar, slider},
  data() {
    return {
      item: {},
      result: [],
      indexList: [],
      patientList: [],
      value: "",
      show: false,
      paddTop: "",
      searchIcon: require("../../assets/img/index/search.png"),
    };
  },
  created() {
    this.result = this.$route.query.result;
  },
  mounted() {
    this.item = this.$store.getters.getGroupsInfo;
    this.getPatientList();
    this.paddTop = parseInt(api.safeArea.top) + 12 + "px";
  },
  methods: {
    screenPatienList(val){
      findPatientList(val).then( res => {
        if (res.data != null) {
          let arr = myJsTools.data_letter_sort(res.data, "py");
          this.patientList = arr;
          this.indexList = Object.keys(this.patientList);
        } else {
          this.patientList = [];
          this.indexList = [];
        }
        this.show = false;
      });
    },
    //初始化查询该医生下的所有患者
    getPatientList() {
      findAllUserIdAndNameAndHead({
        patientName: this.value
      }).then(async res => {
        let arr = myJsTools.data_letter_sort(res.data, "py");
        this.patientList = arr;
        this.indexList = Object.keys(this.patientList);
      });
    },
    //添加患者
    addPatient() {
      doctorAddPatientToSomeOneGroup({
        groupId: this.item.groupId,
        patientIdArray: this.$refs.patientInfo.result
      }).then(res => {
        if (res.code == 20000) {
          Toast("添加成功");
          this.$router.go(-1);
        }
      });
    },
  }
};
</script>
<style scoped lang="less">


.editGroupsAdd {
  min-height: 100vh;
  background: @white;

  .head {
    position: relative;
    border-top: 1px solid #ebebeb;
    border-bottom: 1px solid #ebebeb;
    display: flex;
    align-items: center;

    /deep/ .van-cell {
      align-items: center;
    }

    /deep/ .van-search__content {
      background: #ffffff;
      padding: 11px 16px;
    }

    /deep/ .van-search{
      padding: 0px !important;
    }

    .van-form {
      width: 90%;
    }

    .head_by {
      img {
        width: 23px;
        height: 20px;
        margin-bottom: 2px;
      }

      span {
        font-size: 11px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
        line-height: 12px;
      }
    }
  }

  .box {

    &_item {
      display: flex;
      align-items: center;
      padding: 14px 0;

      img {
        width: 32px;
        height: 32px;
        margin-right: 16px;
        margin-left: 16px;
      }

      span {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        line-height: 20px;
      }
    }

    .btn {
      width: 72px;
      height: 100%;
      background: rgba(255, 80, 80, 1);
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      line-height: 17px;
      display: flex;
      align-items: center;
      text-align: center;
      float: left;

      span {
        width: 100%;
        display: block;
      }
    }
  }

  .foot,
  .foot_1 {
    width: 100%;
    position: fixed;
    bottom: 0;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(235, 235, 235, 1);
    padding: 7px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;

    div {
      width: 80px;
      padding: 7px 0;
      text-align: center;
      background: rgba(20, 160, 230, 1);
      border-radius: 18px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      line-height: 22px;
      float: right;
      margin-right: 16px;
    }

    span {
      margin-left: 16px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      line-height: 22px;
    }
  }

  .foot_1 {
    display: block;
  }
}
</style>
