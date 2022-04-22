<template>
  <div class="myDrug">
    <navbar title="我的药品"></navbar>
    <div class="drugListInfo">
      <div class="search-sortDiv" id="searchDiv">
        <div class="serarchInfo">
          <div class="searchField">
            <van-form action="/">
              <van-search
                show-action
                v-model="searchVal"
                placeholder="请输入想要搜索的内容"
                :clearable="true"
                shape="round"
                @search="onRefresh"
              >
                <template #action>
                  <div @click="onRefresh" style="color:@blue;">搜索</div>
                </template>
              </van-search>
            </van-form>
          </div>
        </div>
        <div class="sortMenu">
          <div class="starsolt-menu">
            <div>星级</div>
            <div>
              <img
                v-if="startsort == 'ASC'"
                src="../../assets/img/mydrug/up.png"
                @click="startSort()"
              />
              <img
                v-else-if="startsort == 'DESC'"
                src="../../assets/img/mydrug/down.png"
                @click="startSort()"
              />
              <img
                v-else
                src="../../assets/img/mydrug/defalt.png"
                @click="startSort()"
              />
            </div>
          </div>
          <van-dropdown-menu active-color="#000" class="sx-menu">
            <van-dropdown-item title="星级范围" ref="starref">
              <van-cell clickable title="全部">
                <template #right-icon>
                  <van-checkbox
                    name="全部"
                    shape="square"
                    v-model="startall"
                    @click="clickAll('star')"
                  />
                </template>
              </van-cell>
              <van-checkbox-group v-model="listQuery.starList">
                <van-cell-group>
                  <van-cell
                    v-for="(item, index) in stratrr"
                    clickable
                    :key="index"
                    :title="item"
                  >
                    <template #right-icon>
                      <van-checkbox
                        :name="index + 1"
                        shape="square"
                        ref="startscreens"
                        @click="isAll('star')"
                      />
                    </template>
                  </van-cell>
                </van-cell-group>
              </van-checkbox-group>
              <div class="sx-btns">
                <van-button plain type="info" @click="sortReset('star')" round
                  >重置</van-button
                >
                <van-button color="#14A0E6" @click="sortConfirm('star')" round
                  >确认</van-button
                >
              </div>
            </van-dropdown-item>
            <van-dropdown-item title="药品分类" ref="typeref">
              <van-cell clickable title="全部">
                <template #right-icon>
                  <van-checkbox
                    name="全部"
                    shape="square"
                    v-model="durgtypeall"
                    @click="clickAll('type')"
                  />
                </template>
              </van-cell>
              <van-checkbox-group v-model="listQuery.drugTypeList">
                <van-cell-group>
                  <van-cell
                    v-for="item in durgTypearr"
                    clickable
                    :key="item.code"
                    :title="item.meaning"
                  >
                    <template #right-icon>
                      <van-checkbox
                        :name="item.code"
                        shape="square"
                        ref="startscreens"
                        @click="isAll('type')"
                      />
                    </template>
                  </van-cell>
                </van-cell-group>
              </van-checkbox-group>
              <div class="sx-btns">
                <van-button plain type="info" @click="sortReset('type')" round
                  >重置</van-button
                >
                <van-button color="#14A0E6" @click="sortConfirm('type')" round
                  >确认</van-button
                >
              </div>
            </van-dropdown-item>
            <van-dropdown-item title="药店" ref="drugstoreref">
              <van-radio-group v-model="listQuery.drugstoreId">
                <van-cell-group>
                  <van-cell
                    v-for="item in mydrugStorearr"
                    clickable
                    :key="item.drugstoreId"
                  >
                    <template #title>
                      <span class="custom-title">{{ item.drugstoreName }}</span>
                      <van-tag
                        round
                        type="primary"
                        v-if="item.isDefault == '1'"
                        style="font-size:12px;"
                        >默认</van-tag
                      >
                    </template>
                    <template #right-icon>
                      <van-radio
                        :name="item.drugstoreId"
                        @click="selectDrugstore()"
                        style="opacity:0"
                      />
                      <van-icon
                        name="success"
                        v-if="listQuery.drugstoreId == item.drugstoreId"
                        color="#14A0E6"
                      />
                    </template>
                  </van-cell>
                </van-cell-group>
              </van-radio-group>
            </van-dropdown-item>
          </van-dropdown-menu>
        </div>
      </div>

      <div class="viList" id="viList">
        < v-model="activeKey" id="van-sidebar" @change="onChange">
          <van-sidebar-item title="全部" />
          <van-sidebar-item title="常用药" />
          <van-sidebar-item
            :title="item.ddtName"
            v-for="(item, index) in typeList"
            :key="index"
          />
        </>
        <div
          class="emptyCfList allDrugList"
          v-if="patentList.length == 0 && usedDrugList.length == 0"
        >
          <img src="../../assets/img/cf/cycfEmpty.png" class="emptyIcon" />
          <li>暂未药品列表</li>
        </div>
        <div class="alldrug" v-else>
          <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
            <van-list
              v-model="loading"
              :finished="finished"
              finished-text="已经到底了"
              @load="onLoad"
            >
              <div class="drugListInfo" v-if="typeIndex != '1'">
                <div
                  class="drugCard"
                  v-for="(item, index) in patentList"
                  :key="index"
                >
                  <div
                    class="drugInfo"
                    @click="goDurgInstruction(item.drugId, item.flag)"
                  >
                    <img
                      v-zlazy="item.drugImg"
                      class="img-width-height-lg"
                      :data-type="item.drugType == 3 ? 'cyImg' : 'xyImg'"
                    />
                    <div class="info">
                      <li class="name">{{ item.drugName }}</li>
                      <li class="specification">规格：{{ item.gg }}</li>
                      <li class="specification" v-if="item.supplierName">
                        厂商：{{ item.scqy }}
                      </li>
                      <li class="specification" v-if="item.shareLevel != null">
                        星级：
                        <van-icon
                          name="star"
                          color="#14A0E6"
                          v-for="(item, index) in stratrr.slice(
                            0,
                            item.shareLevel
                          )"
                          :key="index"
                        />
                      </li>
                      <li class="price">¥{{ item.price }}</li>
                    </div>
                  </div>
                  <div class="btns">
                    <button
                      :class="
                        item.flag == '0'
                          ? 'publicWhiteBtn-80 grayBtn'
                          : 'publicWhiteBtn-80'
                      "
                      @click="colleCttDrug(item, index)"
                    >
                      <span v-if="item.flag == '0'">收藏</span>
                      <span v-else>已收藏</span>
                    </button>
                  </div>
                </div>
              </div>
              <div class="drugListInfo usedDrugListInfo" v-else>
                <div
                  class="drugCard usedDrug"
                  v-for="(item, index) in usedDrugList"
                  :key="index"
                >
                  <div
                    class="drugInfo"
                    @click="goDurgInstruction(item.drugId, item.flag)"
                  >
                    <img
                      v-zlazy="item.drugImg"
                      class="img-width-height-lg"
                      :data-type="item.drugType == 3 ? 'cyImg' : 'xyImg'"
                    />
                    <div class="info">
                      <li class="name">{{ item.drugName }}</li>
                      <li class="specification">
                        规格：{{ item.gg }}/{{ item.jldw }}
                      </li>
                      <li class="specification" v-if="item.supplierName">
                        厂商：{{ item.scqy }}
                      </li>
                      <li class="specification">
                        星级：
                        <van-icon
                          name="star"
                          color="#14A0E6"
                          v-for="(item, index) in stratrr.slice(
                            0,
                            item.shareLevel
                          )"
                          :key="index"
                        />
                      </li>
                      <li class="price">¥{{ item.price }}</li>
                    </div>
                  </div>
                  <div class="btns">
                    <button
                      :class="
                        item.flag == '0'
                          ? 'publicWhiteBtn-80 grayBtn'
                          : 'publicWhiteBtn-80'
                      "
                      @click="colleCttDrug(item, index)"
                    >
                      <span v-if="item.flag == '0'">收藏</span>
                      <span v-else>已收藏</span>
                    </button>
                  </div>
                </div>
              </div>
            </van-list>
          </van-pull-refresh>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import myJsTools from "@/utils/myJsTools";
import Navbar from "../../common/navbar";
import {
  addDoccommondrug,
  getDoctorLinkDrugstoreList,
  cancelDoccommondrug,
  findDrugByDocId,
  findAllDrug,
  getDicDrugType
} from "../../api/cf";
import { getSysCodeByType } from "../../api/scale";
import $api from "@/utils/api";

export default {
  name: "myDrug",
  components: { Navbar },
  data() {
    return {
      drugList: [],
      docId: "",
      docName: "",
      listQuery: {
        page: 1,
        limit: 10,
        size: 1,
        type: "",
        sortField: "drugName",
        sortType: "DESC",
        drugTypeList: [],
        starList: []
      },
      isLoading: false,
      finished: false,
      loading: false,
      usedDrugList: [], //常用药列表
      ddtId: "", //分类id
      typeList: [],
      activeKey: 0, //分类默认id
      searchVal: "",
      typeIndex: "",
      patentList: [], //西药列表
      type: "",
      startsort: "0", //按星级排序：true===up
      startall: false,
      stratrr: ["一星", "二星", "三星", "四星", "五星"], //星级（筛选）
      durgtypeall: false,
      durgTypearr: [],
      mydrugStorearr: [] //我的药店（筛选）
    };
  },
  created() {
    this.docId = myJsTools.getItem("token_info").docId;
    this.docName = myJsTools.getItem("token_info").docName;
    this.getDrugTypeList();
    this.onRefresh();
    this.getCfListType();
  },

  mounted() {
    setTimeout(() => {
      let searchDivHeight = parseInt($api.cssVal($api.byId('searchDiv'), "height").replace("px", ""));
      let height = parseInt($api.cssVal($api.byId('searchDiv'), "top").replace("px", "")) + parseInt(searchDivHeight);
      console.log(searchDivHeight,height,"1111",`height: calc(100% - ${height}px)`)
      $api.css($api.dom('.van-sidebar'), `height: calc(100% - ${height}px)`)
    }, 200)
  },

  beforeCreate() {
    this.$store.commit("UPDATE_KEEP_ALIVE", {
      keepAlive: "myDrug"
    });
  },
  methods: {
    // 点击全选
    clickAll(val) {
      if (val == "star") {
        if (this.startall) {
          this.listQuery.starList = [1, 2, 3, 4, 5];
        } else {
          this.listQuery.starList = [];
        }
      } else if (val == "type") {
        if (this.durgtypeall) {
          this.listQuery.drugTypeList = [];
          this.durgTypearr.forEach(e => {
            this.listQuery.drugTypeList.push(e.code);
          });
        } else {
          this.listQuery.drugTypeList = [];
        }
      }
    },
    // 判断是否全选
    isAll(val) {
      if (val == "star") {
        if (this.listQuery.starList.length < 5) {
          this.startall = false;
        } else if ((this.listQuery.starList.length = 5)) {
          this.startall = true;
        }
      } else if (val == "type") {
        if (this.listQuery.drugTypeList.length < 4) {
          this.durgtypeall = false;
        } else if ((this.listQuery.drugTypeList.length = 4)) {
          this.durgtypeall = true;
        }
      }
    },
    clearSearch() {
      this.searchVal = "";
      this.onRefresh();
    },
    startSort() {
      if (this.startsort == "ASC") {
        this.startsort = "DESC";
      } else if (this.startsort == "DESC") {
        this.startsort == "ASC";
      } else {
        this.startsort = "DESC";
      }
    },
    //收藏 取消收藏
    colleCttDrug(item, index) {
      if (item.flag == "0") {
        let param = {
          docId: this.docId,
          drugId: item.drugId,
          docName: myJsTools.getItem("token_info").docName
        };
        addDoccommondrug(param).then(res => {
          item.flag = "1";
          this.$set(this.patentList, index, item);
        });
      } else {
        let param = {
          docId: this.docId,
          drugId: item.drugId
        };
        cancelDoccommondrug(param).then(res => {
          item.flag = "0";
          this.$set(this.patentList, index, item);
          this.onRefresh();
        });
      }
    },
    //获取药品分类 左侧列表 全部之后的列表
    getDrugTypeList() {
      getDicDrugType().then(res => {
        console.log(res);
        this.typeList = res.data;
      });
    },
    onChange(index) {
      this.typeIndex = index;
      if (index == 0) {
        this.ddtId = "";
      } else if (index == 1) {
        this.ddtId = "";
      } else {
        this.ddtId = this.typeList[index - 2].ddtId;
      }
      this.onRefresh();
    },
    onRefresh() {
      // 清空列表数据
      this.finished = false;
      this.patentList = [];
      this.usedDrugList = [];
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.listQuery.page = 1;
      if (this.startsort !== "0") {
        this.listQuery.sortField = "shareLevel";
        this.listQuery.sortType = this.startsort;
      }
      this.onLoad();
    },
    onLoad() {
      if (this.isLoading) {
        this.isLoading = false;
      }
      if (this.typeIndex == "1") {
        this.getusedDrugList();
      } else {
        this.getDrugList();
      }
    },
    // 数据处理
    dataSetFun(res) {
      this.loading = false;
      this.listQuery.size = res.data.total / this.listQuery.limit;
      if (this.listQuery.page == 1) {
        this.listQuery.page = 1;
        this.isLoading = false;
        this.usedDrugList = res.data.rows;
      } else {
        this.usedDrugList = this.usedDrugList.concat(res.data.rows);
        this.loading = false;
      }
      if (this.listQuery.page >= this.listQuery.size) {
        this.finished = true; // 若数据已全部获取完毕
        return;
      }
      this.listQuery.page++;
    },
    //获取处方类型 中药 西药 食品级
    getCfListType() {
      getSysCodeByType({
        codeType: "025"
      }).then(res => {
        this.durgTypearr = res.data;
      });
      getDoctorLinkDrugstoreList({
        docId: this.docId
      }).then(res => {
        this.mydrugStorearr = res.data;
      });
    },
    // 获取列表
    getusedDrugList() {
      this.listQuery.docId = this.docId;
      this.listQuery.type = this.type == "1" ? "0" : this.type;
      this.listQuery.drugName = this.searchVal;
      this.listQuery.ddtId = "";
      findDrugByDocId(this.listQuery).then(res => {
        this.loading = false;
        this.listQuery.size = res.data.total / this.listQuery.limit;
        if (this.listQuery.page == 1) {
          this.listQuery.page = 1;
          this.isLoading = false;
          this.usedDrugList = res.data.rows;
        } else {
          this.usedDrugList = this.usedDrugList.concat(res.data.rows);
          this.loading = false;
        }
        if (this.listQuery.page >= this.listQuery.size) {
          this.finished = true; // 若数据已全部获取完毕
          return;
        }
        this.listQuery.page++;
      });
    },
    // 获取列表
    getDrugList() {
      this.listQuery.docId = myJsTools.getItem("token_info").docId;
      this.listQuery.type = this.type == "1" ? "0" : this.type;
      this.listQuery.drugName = this.searchVal;
      this.listQuery.ddtId = this.ddtId;
      this.listQuery.regId = this.regId;
      findAllDrug(this.listQuery).then(res => {
        this.loading = false;
        this.listQuery.size = res.data.total / this.listQuery.limit;
        if (this.listQuery.page == 1) {
          this.listQuery.page = 1;
          this.isLoading = false;
          this.patentList = res.data.rows;
        } else {
          this.patentList = this.patentList.concat(res.data.rows);
          this.loading = false;
        }
        if (this.listQuery.page >= this.listQuery.size) {
          this.finished = true; // 若数据已全部获取完毕
          return;
        }
        this.listQuery.page++;
      });
    },
    // 查看药品说明书
    goDurgInstruction(id, flag) {
      this.$router.push({
        name: "myDrugInstruction",
        query: {
          drugId: id,
          flag: flag
        }
      });
    },
    selectDrugstore() {
      this.$refs.drugstoreref.toggle();
      this.onRefresh();
    },
    // 筛选的重置按钮
    sortReset(val) {
      if (val == "star") {
        this.startall = false;
        this.listQuery.starList = [];
      } else if (val == "type") {
        this.listQuery.drugTypeList = [];
        this.durgtypeall = false;
      }
    },
    // 筛选的确认按钮
    sortConfirm(val) {
      if (val == "star") {
        this.$refs.starref.toggle();
      } else if (val == "type") {
        this.$refs.typeref.toggle();
      } else {
        console.log("操作有误");
      }
      this.onRefresh();
    }
  }
};
</script>

<style scoped lang="less">
.myDrug {
  background: @white;
}
.emptyCfList {
  text-align: center;
  margin-top: 0px;

  img {
    width: 193px;
    height: 162px;
    display: inline-block;
  }

  li {
    color: #9ea3ad;
    font-size: 13px;
    line-height: 20.5px;
    margin-top: 17px;
  }
}

.search-sortDiv {
  background: @white;
  position: fixed;
  left: 0;
  .font-size-md;
  box-sizing: border-box;
  z-index: 3;
  width: 100%;
  height: 95px;
  overflow: hidden;
  .serarchInfo {
    display: flex;
    align-items: center;
    border-radius: 999px;
    margin: 3px 10px;
  }
  .custom-title {
    .font-size-md;
    padding-top: 6px;
  }

  .searchField {
    width: 100%;

    .van-field {
      width: 100%;
      margin-top: 0px;
    }

    /deep/ .van-search {
      padding: 0;
      background: @page-back;
      border-radius: 199px;
      height: 40px;
    }

    /deep/ .van-search__content {
      background: @page-back;
    }
    /deep/ .van-search__action div {
      padding-left: 0;
      color: @blue;
    }
  }

  div {
    input {
      width: 100%;
    }
  }
}
.sortMenu {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 90px;
  /deep/ .van-overlay {
    background-color: rgba(0, 0, 0, 0.4);
  }
  /deep/ .van-dropdown-menu__bar {
    box-shadow: none;
  }
  /deep/ .van-dropdown-item__content {
    width: 100%;
    left: 0%;
  }
  // 星级排序
  .starsolt-menu {
    flex: 1;
    height: 48px;
    line-height: 48px;
    font-size: 12px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    div {
      height: 100%;
    }
    img {
      width: 15px;
      height: 15px;
      padding: 16px 0;
    }
  }
  .sx-menu {
    flex: 4;
    height: 48px;
    .sx-btns {
      display: flex;
      justify-content: space-around;
      flex-direction: row;
      padding: 5px;
      .van-button {
        width: 47%;
        border: 1px solid #1989fa;
      }
    }
  }
}
.viList {
  display: flex;
  position: relative;
  top: 90px;
}
.drug-list {
  background: #fff;
}
.allDrugList {
  position: relative;
  left: 27%;
  width: 73%;
  background: white;
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
.drugListInfo {
  padding: 8px 0x;
  background: #fff;
  .drugCard {
    .star {
      position: absolute;
      left: 0;
      width: 27px;
      height: 27px;
      top: 0;
    }
    .btns {
      width: 100%;
      display: block;
      // justify-content: end;
      text-align: right;
    }
    position: relative;
    padding: 12px;
    background: @page-back;
    border-radius: 8px;
    // margin-bottom: 10px;
    margin: 0 auto 10px;
    width: 80%;
  }

  .usedDrug {
    background: @page-back;
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
}

/deep/ .van-sidebar-item {
  background-color: @page-back;
  text-align: center;
}

/deep/ .van-sidebar {
  width: 27%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  position: fixed;
  //height: calc(100vh - 100px);
  background: @page-back;
  padding-bottom: 40px;
}

/deep/ .van-sidebar-item--select {
  background: @white;
  border-radius: 8px 0px 0px 8px;
}

/deep/ .van-sidebar-item--select::before {
  background-color: @white;
}
/deep/ .van-dropdown-menu__bar {
  height: 48px;
  line-height: 48px;
}
.btns .grayBtn {
  color: @font-color-2!important;
  background: @page-back;
  border: 1px solid @font-color-2;
}
.btns .publicWhiteBtn-80 {
  background: @page-back;
}
</style>
