<template>
  <div class="drugList" id="drugList">
    <navbar type="defaultPage" title="我的处方"></navbar>
    <div class="searchDiv" :style="{ top: headerHeight + 'px' }" id="searchDiv">
      <div class="searchField">
        <van-form action="/">
          <van-search
            v-model="searchVal"
            :left-icon="searchIcon"
            placeholder="请输入想要搜索的内容"
            :clearable="true"
            @search="onRefresh"
          />
        </van-form>
      </div>
      <span @click="clearSearch" class="font-login-color-blue">取消</span>
    </div>

    <div id="vanTabs">
      <van-tabs
        v-model="active"
        color="#14A0E6"
        title-active-color="#14A0E6"
        @change="onRefresh"
        sticky
        offset-top="120"
      >
        <van-tab title="常用处方">
          <div>
            <div class="emptyCfList" v-if="commonlyCfList.length == 0">
              <img src="../../assets/img/cf/cycfEmpty.png" class="emptyIcon" />
              <li>您暂未处方信息，赶快添加吧</li>
            </div>
            <div v-else class="commonlyCfList">
              <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
                <van-list
                  v-model="loading"
                  :finished="finished"
                  finished-text="没有更多了"
                  @load="onLoad"
                >
                  <div
                    class="commonlyCfCard"
                    @click="openAddDrug(item)"
                    v-for="(item, index) in commonlyCfList"
                    :key="index"
                  >
                    <li class="title">
                      <u>Rp</u>
                      <u>
                        <span v-if="item.prescriptionType == 1">西药方</span>
                        <span v-if="item.prescriptionType == 3">草药方</span>
                        <span v-if="item.prescriptionType == 4">食品方</span>
                      </u>
                    </li>
                    <li class="font-blod-3">{{ item.dpmpName }}</li>
                    <li
                      v-for="(drugItem, drugIndex) in item.drug"
                      :key="drugIndex"
                    >
                      <u
                        >{{ drugIndex + 1 }}.{{
                          drugItem.drugName
                        }}&nbsp;&nbsp;{{ drugItem.gg }}</u
                      >
                      <u>x{{ drugItem.quan }}</u>
                    </li>
                  </div>
                </van-list>
              </van-pull-refresh>
            </div>
          </div>
        </van-tab>
        <van-tab title="历史处方">
          <div>
            <van-dropdown-menu>
              <van-dropdown-item
                v-model="selectType"
                :options="option1"
                @change="onRefresh"
              />
            </van-dropdown-menu>
            <div class="emptyCfList" v-if="historyCfList.length == 0">
              <img src="../../assets/img/cf/cycfEmpty.png" class="emptyIcon" />
              <li>您暂未历史处方信息</li>
            </div>

            <div v-else class="commonlyCfList">
              <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
                <van-list
                  v-model="loading"
                  :finished="finished"
                  finished-text="没有更多了"
                  @load="onLoad"
                >
                  <div
                    class="commonlyCfCard"
                    v-for="(item, index) in historyCfList"
                    :key="index"
                    @click="openAddDrug(item)"
                  >
                    <li class="title historyTitle">
                      <u>Rp</u>
                      <u>
                        <span v-if="item.prescriptionType == 1">西药方</span>
                        <span v-if="item.prescriptionType == 2">代煎处方</span>
                        <span v-if="item.prescriptionType == 3">草药方</span>
                        <span v-if="item.prescriptionType == 4">食品方</span>
                        <span
                          class="font-login-color-red"
                          v-if="item.status != 6"
                          >待核销</span
                        >
                        <span class="font-login-color-blue" v-else>已核销</span>
                      </u>
                    </li>
                    <li>患者姓名：{{ item.patientName }}</li>
                    <li>医生诊断：{{ item.diagName }}</li>
                    <li>开方时间：{{ item.prescriptionTime }}</li>
                    <div class="drugInfo">
                      <li>药品信息：</li>
                      <li
                        v-for="(drugItem, drugIndex) in item.drug"
                        class="drug"
                        :key="drugIndex"
                      >
                        <u
                          >{{ drugIndex + 1 }}.{{
                            drugItem.drugName
                          }}&nbsp;&nbsp;({{ drugItem.gg }})</u
                        >
                        <u>x{{ drugItem.quan }}</u>
                      </li>
                    </div>
                  </div>
                </van-list>
              </van-pull-refresh>
            </div>
          </div>
        </van-tab>
        <van-tab title="经典处方">
          <div>
            <div class="emptyCfList" v-if="classicList.length == 0">
              <img src="../../assets/img/cf/cycfEmpty.png" class="emptyIcon" />
              <li>您暂未经典处方信息</li>
            </div>

            <div v-else class="commonlyCfList">
              <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
                <van-list
                  v-model="loading"
                  :finished="finished"
                  finished-text="没有更多了"
                  @load="onLoad"
                >
                  <div
                    class="commonlyCfCard"
                    v-for="(item, index) in classicList"
                    :key="index"
                    @click="openAddDrug(item)"
                  >
                    <li class="title historyTitle">
                      <u>Rp</u>
                    </li>
                    <li class="cfName font-blod-3">{{ item.dpmpName }}</li>
                    <li>功用：{{ item.functionInfo }}</li>
                    <li>主治：{{ item.indicationsInfo }}</li>
                    <div class="drugInfo">
                      <li>药品信息：</li>
                      <li
                        v-for="(drugItem, drugIndex) in item.drug"
                        class="drug"
                        :key="drugIndex"
                      >
                        <u
                          >{{ drugIndex + 1 }}.{{
                            drugItem.drugName
                          }}&nbsp;&nbsp;{{ drugItem.gg }}</u
                        >
                        <u>x{{ drugItem.quan }}</u>
                      </li>
                    </div>
                  </div>
                </van-list>
              </van-pull-refresh>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import {
  findDocCommonPrescription,
  findDocPrescriptionHistory
} from "@/api/cf.js";
import navbar from "@/common/navbar";
import myJsTools from "../../utils/myJsTools";
import {
  getClassicPrescriptionList,
  getDicDrugType,
  getDrugPrescriptionPreInfo,
  getHistoryDetailPrescriptionImportInfo
} from "../../api/cf";
import ossUpDown from "../../utils/ossUpDown";
export default {
  data() {
    return {
      searchVal: "",
      headerHeight: "",
      active: 0,
      userInfo: {},
      ddtId: "", //分类id
      activeKey: 0,
      listQuery: {
        page: 1,
        limit: 10,
        size: 1
      },
      isLoading: false,
      finished: false,
      loading: false,
      classicList: [], //经典处方类型
      commonlyCfList: [], //常用处方列表
      historyCfList: [], //历史处方列表
      selectType: "0",
      docId: "",
      option1: [
        { text: "全部", value: "0" },
        { text: "待核销", value: "1" },
        { text: "已核销", value: "2" }
        // { text: "已退款", value: "3" }
      ],
      pageType: 0, //0 诊断 1常用处方
      typeList: [], //分类列表
      searchDivHeight: "", //搜索框高度
      searchIcon: require("../../assets/img/index/search.png")
    };
  },
  created() {
    this.userInfo = myJsTools.getItem("patientInfo");
    this.docId = myJsTools.getItem("token_info").docId;
    this.pageType = this.$route.query.type;
    this.headerHeight = myJsTools.getItem("headerHeight");
    this.onRefresh();
    this.getDrugTypeList();
  },
  components: { navbar },
  mounted() {},
  methods: {
    //获取药品分类
    getDrugTypeList() {
      getDicDrugType().then(res => {
        console.log(res);
        this.typeList = res.data;
      });
    },
    onChange(index) {
      console.log(index - 1);
      if (index == 0) {
        this.ddtId = "";
      } else {
        this.ddtId = this.typeList[index - 1].ddtId;
      }
      this.onRefresh();
    },
    showPickerPopup() {
      this.showPicker = true;
    },
    // 查询处方列表详情
    openAddDrug(item) {
      if (this.active == 0 || this.active == 2) {
        getDrugPrescriptionPreInfo({
          docId: this.docId,
          dpmpId: item.dpmpId
        }).then(res => {
          this.setData(res);
        });
      } else {
        getHistoryDetailPrescriptionImportInfo({
          prescriptionId: item.prescriptionId,
          docId: this.docId
        }).then(res => {
          this.setData(res);
        });
      }
    },
    setData(res) {
      let cfList = this.$store.getters.getCfList;
      let data = res.data;
      myJsTools.setItem("preType", data.prescriptionType);
      data.type = data.prescriptionType;
      data.name = data.prescriptionType == "3" ? "herbal" : "patent";
      let val = {
        cfIndex: cfList.length - 1,
        cf: data
      };
      this.$store.commit("editCf", val);
      myJsTools.setItem("passDiags", data.diags);
      this.$router.go(-1);
    },
    clearSearch() {
      this.searchVal = "";
      this.onRefresh();
    },
    // 下拉刷新
    onRefresh() {
      // 清空列表数据
      this.finished = false;
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.listQuery = {
        page: 1,
        limit: 10,
        size: 1
      };
      this.commonlyCfList = this.classicList = this.historyCfList = [];
      this.onLoad();
    },
    onLoad() {
      if (this.isLoading) {
        this.isLoading = false;
      }
      this.getDrugList();
    },
    // 获取列表
    getDrugList() {
      this.listQuery.docId = this.docId;
      this.listQuery.prescriptionType = this.$route.query.prescriptionType;
      this.listQuery.dpmpName = this.searchVal;
      if (this.active == 0) {
        findDocCommonPrescription(this.listQuery).then(res => {
          this.dataSetFun(res, "1");
        });
      } else if (this.active == 1) {
        if (this.userInfo && this.pageType == 0) {
          this.listQuery.patientId = this.userInfo.patientId;
        }
        this.listQuery.type = this.selectType;
        this.listQuery.searchKey = this.searchVal;
        findDocPrescriptionHistory(this.listQuery).then(res => {
          this.dataSetFun(res, "2");
        });
      } else {
        this.listQuery.dpmpName;
        getClassicPrescriptionList(this.listQuery).then(res => {
          this.dataSetFun(res, "3");
        });
      }
    },
    // 数据处理
    async dataSetFun(res, type) {
      this.loading = false;
      this.listQuery.size = res.data.total / this.listQuery.limit;
      if (this.listQuery.size < 2) {
        this.loading = false;
      }
      if (this.active == 0 && type == "1") {
        let data = res.data.rows;
        if (this.listQuery.page == 1) {
          this.listQuery.page = 1;
          this.isLoading = false;
          this.commonlyCfList = res.data.rows;
        } else {
          this.commonlyCfList = this.commonlyCfList.concat(res.data.rows);
          this.loading = false;
        }
      } else if (this.active == 1 && type == "2") {
        if (this.listQuery.page == 1) {
          this.listQuery.page = 1;
          this.isLoading = false;
          this.historyCfList = res.data.rows;
        } else {
          this.historyCfList = this.historyCfList.concat(res.data.rows);
          this.loading = false;
        }
      } else if (this.active == 2 && type == "3") {
        let data = res.data.rows;
        if (this.listQuery.page == 1) {
          this.listQuery.page = 1;
          this.isLoading = false;
          this.classicList = data;
        } else {
          this.classicList = this.classicList.concat(data);
          this.loading = false;
        }
      }
      if (this.listQuery.page >= this.listQuery.size) {
        this.finished = true; // 若数据已全部获取完毕
        return;
      }
      this.listQuery.page++;
    }
  }
};
</script>

<style scoped lang="less">
.van-tabs {
  padding-top: 44px;
}
.drugInfo {
  margin-top: 15px;
  border-top: 1px dashed @back-border;

  .drug {
    padding-left: 20px;
  }
}

.searchDiv {
  position: fixed;
  left: 0;
  display: flex;
  align-items: center;
  background: @white;
  .font-size-md;
  box-sizing: border-box;
  z-index: 3;
  width: 100%;

  /deep/ .van-icon__image {
    .icon-width-height-sm;
    padding: 4px 12px;
  }

  span {
    .font-size-md;
    line-height: 18px;
    padding: 12px 0 12px 11px;
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

  div {
    input {
      width: 100%;
    }
  }
}

/deep/ .van-tab--active {
  font-weight: 500;
}

/deep/ .van-hairline--top-bottom {
  position: fixed;
  top: 0px;
  z-index: 3;
  width: 100%;
}

.alldrug {
  width: 73%;

  /deep/ .van-pull-refresh {
    overflow: hidden;
    user-select: none;
    position: relative;
    left: 100px;
    width: 100%;
    z-index: 0;
    background: @white;
  }
}

/deep/ .van-sidebar-item {
  background-color: @page-back;
  text-align: center;
}

/deep/ .van-sidebar {
  width: 100px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  position: fixed;
  height: 100%;
  background: @page-back;
}

/deep/ .van-sidebar-item--select {
  background: @white;
  border-radius: 8px 0px 0px 8px;
}

/deep/ .van-sidebar-item--select::before {
  background-color: @blue;
  /*left: 20%;*/
}

.drugListInfo {
  padding: 8px 10px;

  .drugCard {
    .star {
      position: absolute;
      left: 0;
      width: 27px;
      height: 27px;
      top: 0;
    }

    position: relative;
    padding: 12px;
    background: @page-back;
    margin-bottom: 8px;
    border-radius: 8px;
  }

  .usedDrug {
    background: @white;
  }

  .drugInfo {
    display: flex;

    .info {
      padding-left: 12px;

      li {
        text-align: left;
      }

      .name {
        .black-font;
        .font-size-md;
        .font-blod-2;
      }

      .specification {
        .font-login-color;
        .font-login-sm;
        margin-top: 2px;
      }

      .price {
        .font-login-color-red;
        .font-size-md;
        margin-top: 4px;
        .font-blod-2;
      }
    }
  }

  .btns {
    text-align: right;
    margin-top: 12px;

    .grayBtn {
      border: 1px solid @font-color-3;
      .font-login-color;
    }
  }
}

.allDrugList {
  position: relative;
  left: 20%;
  width: 80%;
}

.emptyCfList {
  text-align: center;
  margin-top: 76px;

  li {
    .font-login-color;
    .font-login-sm;
    line-height: 20.5px;
    margin-top: 17px;
  }
}

.commonlyCfList {
  padding: 0 16px;
  .font-size-md;
  .black-font;

  .commonlyCfCard {
    margin-top: 12px;
    background: @white;
    padding: 12px;
    border-radius: 4px;
  }

  li {
    margin-top: 15px;
    line-height: 16px;

    :nth-child(1) {
      width: 90%;
      .div-overflow;
    }
  }

  .title {
    margin-top: 0px;

    :nth-child(1) {
      width: 85%;
    }
  }

  .historyTitle {
    :nth-child(1) {
      width: 55%;
    }

    :nth-child(2) {
      text-align: right;
    }

    span {
      margin-left: 15px;
    }
  }
}

.van-dropdown-menu {
  border-radius: 4px;
  margin: 12px 16px;
}

/deep/ .van-dropdown-menu__item {
  -webkit-justify-content: left;
  justify-content: left;
  padding-left: 12px;
  border-radius: 4px;
}

/deep/ .van-dropdown-item__content {
  border-radius: 0 0 4px 4px;
}

/deep/ .van-dropdown-menu__bar {
  height: 32px;
  line-height: 32px;
  border-radius: 4px;
}

.viList {
  display: flex;
  position: relative;
}
</style>
