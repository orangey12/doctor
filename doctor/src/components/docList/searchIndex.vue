<template>
  <div class="searchIndex">
    <header class="headers" :style="{ paddingTop: paddingTop }">
      <div class="searchField">
        <van-form action="/">
          <van-search
            v-model="searchVal"
            :left-icon="searchIcon"
            placeholder="输入关键词快速查找"
            :clearable="true"
            maxlength="50"
            @search="searchFun"
          />
        </van-form>
      </div>
      <span @click="clearSearch" class="font-login-color-blue">取消</span>
    </header>
    <div
      class="searchHistory"
      v-if="
        searchHistory.length > 0 && !searchVal
      "
    >
      <li class="title">
        <span>历史记录</span>
        <span @click="deleteAllHis">
          <img src="../../assets/img/index/delete2.png" class="deleteIcon"/>
          <span>清空</span>
        </span>
      </li>
      <li
        class="seatchOpt"
        @click="clickItem(item)"
        v-for="(item, index) in searchHistory"
        :key="index"
      >
        {{ item }}
      </li>
    </div>
    <div class="searchHistory" v-if="searchVal">
      <div v-if="patientList.length > 0">
        <li class="title">
          患者
        </li>
        <li
          class="patientInfo"
          @click="openInfor(item)"
          v-for="(item, index) in patientList"
          :key="index"
        >
          <img v-zlazy="item.patientImg" class="headImg"/>
          <span>{{ item.patientName }}</span>
        </li>
      </div>
      <div v-if="diagnosisList.length > 0">
        <li class="title">
          其他
        </li>
        <div
          class="detailInfo"
          v-for="(item, index) in diagnosisList"
          @click="openCfDetail(item)"
          :key="index"
        >
          <img v-zlazy="item.patientImg" class="headImg"/>
          <div style="width:80%">
            <li class="name">
              {{ item.patientName }} <span>{{ item.sex }}</span> {{ item.age }}岁
            </li>
            <li class="docInfo">
              医生：{{ item.docName }} {{ item.deptName }}
            </li>
            <li class="zsInfo">主诉：{{ item.chiefComplaint }}</li>
            <li class="zdInfo">诊断：{{ item.diagnosis }}</li>
          </div>
        </div>
      </div>
      <div class="emptyDiv" v-if="searchResultShowEmpty">
        <img src="../../assets/img/my/pitera.png" class="emptyIcon">
        <li>无搜索结果</li>
      </div>
    </div>
  </div>
</template>

<script>
  import myJsTools from "../../utils/myJsTools";
  import {homeSearchPatient} from "../../api/docList";

  export default {
    name: "searchIndex",
    data() {
      return {
        paddingTop: "",
        headerHeight: "",
        searchVal: "",
        diagnosisList: [],
        patientList: [],
        searchResultShowEmpty: false,//搜索结果为空时显示
        searchIcon: require("../../assets/img/index/search.png"),
      };
    },
    created() {
    },
    computed: {
      searchHistory() {
        return this.$store.getters.getSearchHistory || [];
      }
    },
    mounted() {
      this.paddingTop = parseInt(api.safeArea.top) + 5 + "px";
      if (myJsTools.getItem("headerHeight")) {
        this.headerHeight = myJsTools.getItem("headerHeight") + 5 + "px";
      }
    },
    methods: {
      //点击搜索历史
      clickItem(item) {
        this.searchVal = item;
        this.searchFun();
      },
      //打开处方详情
      openCfDetail(item) {
        let title;
        if (item.status == "0") {
          title = "待审方";
        } else if (item.status == "1") {
          title = "已通过";
        } else if (item.status == "2") {
          title = "未通过";
        }
        if (item.status == 1 || item.status == 0) {
          this.$router.push({
            name: "waitPassPerSetail",
            query: {
              title: title,
              businessId: item.businessId,
              sex: item.sex,
              patientImg: item.patientImg,
              patientName: item.patientName,
              age: item.age,
              ageUnit: item.ageUnit,
              businessCode: item.businessCode
            }
          });
        } else {
          this.$router.push({
            name: "prescDetail",
            query: {
              status: title,
              businessId: item.businessId,
              sex: item.sex,
              patientImg: item.patientImg,
              patientName: item.patientName,
              age: item.age,
              ageUnit: item.ageUnit,
              businessCode: item.businessCode
            }
          });
        }
      },
      clearSearch(){
        this.searchVal = "";
        this.$router.go(-1);
      },
      //搜索结果
      searchFun() {
        this.searchResultShowEmpty = false;
        this.diagnosisList = this.patientList = []
        if (JSON.stringify(this.searchHistory).indexOf(this.searchVal) == -1) {
          this.$store.commit("setsearchHistory", this.searchVal);
        }
        homeSearchPatient({
          docId: myJsTools.getItem("token_info").docId,
          text: this.searchVal
        }).then(res => {
          console.log(res);
          this.patientList = res.data.patientList || [];
          let diagnosisList = res.data.diagnosisList || []
          this.diagnosisList = diagnosisList;
          if (this.patientList.length == 0 && this.diagnosisList.length == 0) {
            this.searchResultShowEmpty = true;
          }
        });
      },
      //清空搜索历史
      deleteAllHis() {
        this.$store.commit("clearAllHistory", []);
      },
      //  关闭搜索页面
      closeSearch() {
        this.$router.go(-1);
      },
      //打开患者资料服务页面
      openInfor(item) {
        myJsTools.setItem("patientInfo", item);
        this.$router.push({
          name: "information",
          query:{
            patientId: item.patientId
          }
        });
      }
    }
  };
</script>

<style scoped lang="less">


  .headers {
    width: 100%;
    box-sizing: border-box;
    background: @white !important;
    display: flex;
    position: fixed;
    top: 0;
    align-items: center;

    /deep/ .van-icon__image {
      .icon-width-height-sm;
      padding: 4px 12px;
    }

    .searchField {
      width: 85%;

      .van-field {
        width: 100%;
      }

      /deep/ .van-search {
        padding: 0;
      }

      /deep/ .van-search__content {
        padding-left: 0;
      }

      /deep/ .van-cell {
        align-items: center;
        padding-left: 12px;
      }
    }
    button {
      background: @white;
      .font-login-color-blue;
      .font-size-md;
    }
  }

  .searchHistory {
    padding: 0 16px;
    margin-top: 24px;

    .title {
      .display-div;
      span {
        display: inline-block;
        span {
          .font-login-color;
          .font-size-sm;
          line-height: 16px;
        }
      }
    }

    .deleteIcon {
      .icon-width-height-sm-16;
      .img-inline-block;
      vertical-align: middle;
    }

    .seatchOpt {
      padding-top: 16px;
      line-height: 18px;
      .font-login-color;
      .font-size-md;
    }
  }

  .searchHistory {
    .title {
      font-size: 14px;
      line-height: 22px;
      margin-top: 10px;
      .font-blod-2;
      .font-size-md;
    }

    .patientInfo {
      margin-top: 8px;
      background: @white;
      display: flex;
      padding: 14px 16px;
      border-radius: 4px;
      .black-font;
      img {
        .img-width-height-spe;
        margin-right: 16px;
      }

      span {
        padding-top: 6px;
        .font-size-lg;
      }
    }
  }

  .detailInfo {
    margin-top: 8px;
    background: @white;
    display: flex;
    align-items: center;
    padding: 12px;
    border-radius: 8px;
    .black-font;
    .font-size-md;
    img {
      .img-width-height-md;
      margin-right: 12px;
    }

    .docInfo,
    .zsInfo,
    .zdInfo {
      line-height: 20px;
      margin-top: 4px;
    }

    .zdInfo {
      .div-overflow;
      width: 100%;
    }

    .name {
      .font-size-md-2;
      line-height: 21px;
      margin-top: 0px;
      span{
        margin: 0 20px;
      }
    }
  }

  .emptyDiv {
    margin-top: 100px;
    width: 100%;


    li {
      text-align: center;
      margin-top: 20px;
      .font-login-color;
      .font-size-md;
    }
  }
</style>
