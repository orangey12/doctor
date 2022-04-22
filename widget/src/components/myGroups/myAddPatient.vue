<template>
  <div class="newsConnect">
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
      <div class="head_by" @click="showPopup">
        <img src="@/assets/img/group/by.png" alt=""/>
        <span>筛选</span>
      </div>
    </div>
    <patient-select :indexList="indexList" ref="patientInfo" :patientList="patientList"></patient-select>
    <div :class="result.length>0 ? 'foot' : 'foot_1'">
      <span v-if="result.length>0">已选（{{ result.length }}）</span>
      <button @click="addPatient" class="pubicBtn-80">添加</button>
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
import Pinyin from "@/utils/pinYin.js";
import {
  findAllUserIdAndNameAndHead,
  findPatientList
} from "@/api/myGroups";
import PatientSelect from "../childCompon/patientSelect";
import myJsTools from "../../utils/myJsTools";
import ScreenPatient from "../childCompon/screenPatient";
import {doctorAddPatientToSomeOneGroup} from "../../api/myGroups";
import {Toast} from "vant";

export default {
  name: "myAddPatient",
  components: {ScreenPatient, PatientSelect, navbar, slider},
  data() {
    return {
      value: "",
      item:{},
      result:[],
      indexList: [],
      patientList: {},
      show: false,
      paddTop: "",
      searchIcon: require("../../assets/img/index/search.png"),
    };
  },
  mounted() {
    this.getPatientList();
    this.item = this.$store.getters.getGroupsInfo;
    this.paddTop = (parseInt(api.safeArea.top) + 12) + 'px';
  },
  methods: {
    //初始化获取患者列表
    getPatientList() {
      findAllUserIdAndNameAndHead({patientName: this.value}).then(async res => {
        let arr = myJsTools.data_letter_sort(res.data, "py");
        this.patientList = arr;
        this.indexList = Object.keys(this.patientList);
      });
    },
    //添加患者
    addPatient() {
      if(this.$route.query.pageType == 'edit'){
        doctorAddPatientToSomeOneGroup({
          groupId: this.item.groupId,
          patientIdArray: this.$refs.patientInfo.result
        }).then(res => {
          if (res.code == 20000) {
            this.$router.go(-1);
          }
        });
      }else{
        let arr = [];
        this.result = this.$refs.patientInfo.result;
        for (const item in this.patientList) {
          this.patientList[item].map(itemChild => {
            if (this.$refs.patientInfo.result.indexOf(itemChild.patientId) != -1) {
              arr.push(itemChild);
            }
          })
        }
        this.$store.commit("setGroupsList", arr);
        this.$router.go(-1);
      }
    },
    //点击筛选
    showPopup() {
      this.show = true;
    },

    screenPatienList(dataForm) {
      findPatientList(dataForm).then(async res => {
        console.log(JSON.stringify(res.data) + "------------患者")
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
  }
};
</script>
<style scoped lang="less">



.newsConnect {
  min-height: 100vh;
  background: @white;

  .head {
    position: relative;
    border-top: 1px solid @back-border;
    border-bottom: 1px solid @back-border;
    display: flex;
    align-items: center;

    .van-form {
      width: 90%;
    }

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





  .foot,
  .foot_1 {
    width: 100%;
    position: fixed;
    bottom: 0;
    background: @white;
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
    border: 1px solid @back-border;
    padding: 7px 0;
    .display-div;

    button {
      float: right;
      margin-right: 16px;
    }

    span {
      margin-left: 16px;
      .black-font;
      .font-size-md;
      line-height: 22px;
    }
  }

  .foot_1 {
    display: block;
  }

  .popup {
    width: 266px;
    border-radius: 8px 0px 0px 8px;

    .popup_list {
      height: 100%;
      overflow-y: scroll;
    }

    &_item {
      margin-bottom: 12px;

      p {
        margin-bottom: 12px;
        .black-font;
        .font-size-md;
        line-height: 20px;
        text-align: left;
      }

      .box,
      .box_1,
      .box_2,
      .box_3 {
        background: @page-back;
        border-radius: 8px;
        padding: 12px 16px;
        display: flex;
        align-items: center;

        .label {
          .black-font;
          .font-size-md;
          line-height: 20px;
          display: block;
          width: 30%;
        }

        input {
          width: 100%;
          height: 20px;
          background: none;
        }

        .radio {
          width: 70%;
          .display-div;

          .sex,
          .sexActive {
            .black-font;
            .font-size-md;
            line-height: 20px;
            background: @white;
            border-radius: 4px;
            width: 58px;
            text-align: center;
          }

          .sexActive {
            .white-font;
            background: @blue;
          }
        }

        .age {
          width: 100%;
          display: flex;
          align-items: center;

          div {
            width: 94%;
            margin: 0 auto;
          }

          span {
            display: block;
            width: 10%;
            text-align: center;
          }
        }
      }

      .box_1,
      .box_2 {
        justify-content: space-between;
      }

      .box_2 {
        p {
          width: 49%;
          .font-size-md;
          .font-login-color;
          line-height: 20px;
          margin-bottom: 0;

          span {
            min-width: 10px;
            margin-left: 4px;
          }
        }
      }

      .box_3,
      .box_4 {
        height: 40px;
        background: @white;
        flex-wrap: wrap;
        padding: 0;
        overflow: hidden;

        .check {
          padding: 6px 12px;
          .font-size-md;
          .font-color-2;
          line-height: 20px;
          margin-right: 8px;
          background: @page-back;
          border-radius: 8px;
        }

        .checkActive {
          .white-font;
          .blue_backGround;
        }
      }

      .box_4 {
        display: flex;
        height: auto;
        overflow: visible;
      }
    }
  }

  .expend {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30%;
    margin: 0 auto;

    img {
      width: 14px;
      height: 14px;
      margin-right: 3px;
    }

    span {
      .font-size-xs;
      line-height: 14px;
    }
  }
}
</style>
