<template>
  <div style="background:#fff;">
    <div
      class="patent minHeight"
      :style="{
        background:
          drugList.length == 0
            ? 'url(' + require('../../assets/img/cf/bgg2.png') + ')'
            : '',
        backgroundRepeat: drugList.length == 0 ? 'no-repeat' : '',
        backgroundSize: drugList.length == 0 ? '50%' : '',
        backgroundPosition: drugList.length == 0 ? 'center' : ''
      }"
    >
      <van-row
        class="optTitle"
        v-if="drugList.length == 0"
        style="border-bottom: 1px dashed #EBEBEB;padding-bottom: 10px;"
      >
        <van-col
          @click="openTemplatePre"
          span="6"
          class="leftBtn font-login-color-blue font-size-md"
        >
          <img
            src="../../assets/img/cf/mbkf2.png"
            class="icon-width-height-sm-16"
          />
          <span class="color9">模板开方</span>
        </van-col>
        <van-col span="12" class="black-font font-blod-3 font-size-lg">
          <span v-if="type == '1'">成药方</span>
          <span v-if="type == '4'">食品级</span>
        </van-col>
        <van-col span="6" class="font-login-color-blue font-size-md">
          <div v-if="pageType != 'editUserdCf'" class="rightBtn">
            <img
              src="../../assets/img/cf/zh2.png"
              class="icon-width-height-sm-16"
            />
            <span
              v-if="cfTypeList.length == 2"
              v-for="(item, index) in cfTypeList"
              :key="index + 'cfType'"
            >
              <span
                v-if="item.code != type"
                @click="switchCf(item)"
                class="color9"
                >开{{ item.meaning }}</span
              >
            </span>
            <span v-if="cfTypeList.length > 2" @click="switchCf" class="color9">
              开草药方
            </span>
          </div>
        </van-col>
      </van-row>

      <van-row
        class="optTitle"
        v-else
        style="border-bottom: 1px dashed #EBEBEB;padding-bottom: 10px;"
      >
        <van-col
          @click="saveUserdCf"
          span="6"
          class="leftBtn font-blod-2 black-font font-size-md"
        >
          <span v-if="pageType == 'cf'">另存为常用</span>
        </van-col>
        <van-col span="12" class="black-font font-blod-3 font-size-lg">
          <span v-if="type == '1'">成药方</span>
          <span v-if="type == '4'">食品级</span>
        </van-col>
        <van-col span="6" class="rightBtn font-size-md">
          <img
            src="../../assets/img/cf/deleteCf.png"
            @click="deleCf"
            class="icon-width-height-sm"
          />
        </van-col>
      </van-row>

      <div class="drugList">
        <div class="drugDiv">
          <div v-for="(item, index) in drugList" :key="index">
            <li class="drugNameLi display-div">
              <u class="color3">{{ item.drugName }}</u>
              <u class="display-div">
                <span class="quanNum color9"
                  >x{{ item.quan }} {{ item.unit }}</span
                >
                <img
                  src="../../assets/img/cf/delete.png"
                  class="icon-width-height-sm-16"
                  @click="deleteDrug(index)"
                />
              </u>
            </li>
            <li class="useMethod font-login-color" @click="editDrug(index)">
              <u
                >用法: {{ item.dduName }}、每次{{ item.eachQuan
                }}{{ item.jldw }}、{{ item.ddufName }}、用药{{ item.days }}天</u
              >
              <u>
                <img
                  src="../../assets/img/chat/edit.png"
                  class="icon-width-height-sm-16 editIcon"
              /></u>
            </li>
          </div>
        </div>
        <div class="addDiv" @click="showAddField">
          <img
            src="../../assets/img/cf/editZd2.png"
            class="editZd icon-width-height-sm-16"
          />
          <span>点击搜索添加药品</span>
        </div>
      </div>
      <van-popup
        v-model="patentPopup"
        position="bottom"
        class="patentPopup"
        :close-on-click-overlay="false"
      >
        <li class="title">请设置用法用量</li>
        <van-row class="ypzz font-login-color-blue drugName">
          {{ patent.drugName }}
        </van-row>
        <van-row class="ypzz">
          <van-col span="7" class="gg">
            规 &nbsp;&nbsp; 格
          </van-col>
          <van-col span="17" class="ggValue">
            {{ patent.gg }}
          </van-col>
        </van-row>
        <van-row class="ypzz" v-if="patent.memo">
          <van-col span="7">
            药品主治
          </van-col>
        </van-row>
        <div class="memo" v-if="patent.memo">{{ patent.memo }}</div>

        <van-row>
          <van-col span="7">
            用药天数
          </van-col>
          <van-col span="14" class="numVal">
            <van-stepper
              key="days"
              v-model="patent.days"
              max="99"
              min="0"
              button-size="36px"
              default-value="0"
            />
          </van-col>
          <van-col span="3">
            天
          </van-col>
        </van-row>
        <van-row>
          <van-col span="7">
            用药频次
          </van-col>
          <van-col span="13" @click="selectDdufName" class="numVal useDrugPc">
            {{ patent.ddufName }}
          </van-col>
          <van-col span="3" @click="selectDdufName">
            <img
              src="../../assets/img/cf/downSelect.png"
              class="downImg icon-width-height-sm-16"
            />
          </van-col>
        </van-row>
        <van-row>
          <van-col span="7">
            每次剂量
          </van-col>
          <van-col span="14" class="numVal">
            <van-stepper
              :decimal-length="1"
              max="999.9"
              min="0"
              v-model.number="patent.eachQuan"
              button-size="36px"
              allow-empty
              default-value=" "
            />
          </van-col>
          <van-col span="3">
            {{ patent.jldw }}
          </van-col>
        </van-row>
        <van-row>
          <van-col span="7">
            发药数量
          </van-col>
          <van-col span="14" class="numVal">
            <van-stepper
              v-model.number="patent.quan"
              min="0"
              integer
              max="99"
              button-size="36px"
              allow-empty
              default-value=" "
            />
          </van-col>
          <van-col span="3">
            {{ patent.unit }}
          </van-col>
        </van-row>
        <van-row>
          <van-col span="7">
            用药方法
          </van-col>
          <van-col span="13" @click="selectDduName" class="numVal useDrugPc">
            {{ patent.dduName }}
          </van-col>
          <van-col span="3" @click="selectDduName">
            <img
              src="../../assets/img/cf/downSelect.png"
              class="downImg icon-width-height-sm-16"
            />
          </van-col>
        </van-row>
        <div class="btns">
          <button class="publicWhiteBtn-80" @click="patentPopup = false">
            取消
          </button>
          <button class="pubicBtn-80 twoBtn" @click="addPatent">确定</button>
        </div>
      </van-popup>
      <van-popup v-model="showPicker" v-if="showPicker" round position="bottom">
        <van-picker
          show-toolbar
          :columns="columns"
          @cancel="showPicker = false"
          @confirm="onConfirm"
          :default-index="defaultIndex"
        />
      </van-popup>
      <van-popup
        v-model="showPcPicker"
        v-if="showPcPicker"
        round
        position="bottom"
      >
        <van-picker
          show-toolbar
          :columns="pcColumns"
          @cancel="showPcPicker = false"
          :default-index="pcDefaultIndex"
          @confirm="commitPc"
        />
      </van-popup>

      <van-popup v-model="showDrugList" class="drugListPopup" position="bottom">
        <div class="searchDiv" id="searchDiv">
          <div class="iconDiv">
            <img
              @click="showDrugList = false"
              src="../../assets/img/cf/closePopup.png"
              class="icon-width-height-sm-16"
            />
          </div>
          <div class="serarchInfo">
            <div class="searchField">
              <van-form action="/">
                <van-search
                  v-model="searchVal"
                  placeholder="请输入想要搜索的内容"
                  :clearable="true"
                  @search="onRefresh"
                />
              </van-form>
            </div>
            <span @click="clearSearch" class="font-login-color-blue">取消</span>
          </div>
        </div>
        <div class="viList">
          <van-sidebar v-model="activeKey" @change="onChange">
            <van-sidebar-item title="全部" />
            <van-sidebar-item title="常用药" />
            <van-sidebar-item
              :title="item.ddtName"
              v-for="(item, index) in typeList"
              :key="index"
            />
          </van-sidebar>
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
                finished-text=""
                @load="onLoad"
              >
                <div class="drugListInfo" v-if="typeIndex != '1'">
                  <div
                    class="drugCard"
                    v-for="(item, index) in patentList"
                    :key="index"
                  >
                    <div class="drugInfo">
                      <img
                        v-zlazy="item.drugImg"
                        class="img-width-height-lg"
                        :data-type="pageType == 0 ? 'xyImg' : 'cyImg'"
                      />
                      <div class="info">
                        <li class="name">{{ item.drugName }}</li>
                        <li class="specification">规格：{{ item.gg }}</li>
                        <li class="specification" v-if="item.supplierName">
                          厂商：{{ item.scqy }}
                        </li>
                        <li
                          class="specification"
                          v-if="item.shareLevel != null"
                        >
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
                      <button
                        class="publicWhiteBtn-80 twoBtn"
                        @click="selectPatent(item)"
                      >
                        <span>添加</span>
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
                    <div class="drugInfo">
                      <img
                        v-zlazy="item.drugImg"
                        class="img-width-height-lg"
                        data-type="xyImg"
                      />
                      <div class="info">
                        <li class="name">{{ item.drugName }}</li>
                        <li class="specification">
                          规格：{{ item.gg }}/{{ item.jldw }}
                        </li>
                        <li class="specification" v-if="item.supplierName">
                          厂商：{{ item.scqy }}
                        </li>
                        <li
                          class="specification"
                          v-if="item.shareLevel != null"
                        >
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
                      <button
                        class="publicWhiteBtn-80 twoBtn"
                        @click="selectPatent(item)"
                      >
                        <span>添加</span>
                      </button>
                    </div>
                  </div>
                </div>
              </van-list>
            </van-pull-refresh>
          </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import {
  addDoccommondrug,
  cancelDoccommondrug,
  dicdrugusage,
  findAll,
  findAllDrug,
  findDrugByDocId,
  getDicDrugType
} from "../../api/cf";
import myJsTools from "../../utils/myJsTools";
import { Toast } from "vant";

let timeOut;
export default {
  name: "patent",
  props: {
    item: {
      default: function() {
        return [];
      },
      type: Array
    },
    name: {
      default: ""
    },
    index: {
      default: ""
    },
    type: {
      default: 1
    },
    pageType: {
      default: "cf"
    },
    regId: {
      type: String,
      default: ""
    },
    cfTypeList: {
      default: function() {
        return [];
      },
      type: Array
    }
  },
  data() {
    return {
      patentName: "", //西药搜索名称
      patentList: [], //西药列表
      patentPopup: false,
      usedDrugList: [],
      patent: {
        days: "",
        ddufName: "",
        eachQuan: ""
      }, //已选择的西药
      usage: [], //处方用法
      columns: [],
      defaultIndex: 0,
      showPicker: false, //选择服用方法
      pcList: [], //频次列表
      pcColumns: [], //频次列表弹窗
      pcDefaultIndex: 0,
      showDrugList: false, //药品列表弹窗
      showPcPicker: false, //频次弹窗
      drugList: [],
      listQuery: {
        sortField: "drugName",
        sortType: "DESC",
        page: 1,
        limit: 10,
        size: 1,
        type: ""
      },
      isLoading: false,
      finished: false,
      loading: false,
      ddtId: "",
      typeList: [],
      activeKey: 0, //分类默认id
      searchVal: "",
      typeIndex: "",
      docId: "",
      stratrr: [0, 1, 2, 3, 4]
    };
  },
  watch: {
    "patent.days": {
      handler() {
        this.computedNum();
      }
    },
    "patent.eachQuan": {
      handler() {
        this.computedNum();
      }
    },
    "patent.ddufName": {
      handler() {
        this.computedNum();
      }
    },
    "patent.quan": function(val, oldVal) {
      console.log(val, oldVal);
      if (!oldVal) {
        this.patent.quan = this.patent.oldQuan || val;
      }
    },
    item: {
      handler() {
        this.drugList = this.item;
      },
      deep: true
    }
  },
  created() {
    this.drugList = this.item;
    this.docId = myJsTools.getItem("token_info").docId;
    this.getCfMethod();
    this.getDrugTypeList();
  },
  methods: {
    clearSearch() {
      this.searchVal = "";
      this.onRefresh();
    },
    // 收藏、取消收藏
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
    //获取药品分类
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
    // 获取列表
    getusedDrugList() {
      this.listQuery.docId = this.docId;
      this.listQuery.type = this.type == "1" ? "0" : this.type;
      this.listQuery.drugName = this.searchVal;
      (this.listQuery.sortField = "drugName"),
        (this.listQuery.sortType = "DESC"),
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
    openTemplatePre() {
      this.$router.push({
        name: "templatePre",
        query: {
          prescriptionType: this.type
        }
      });
    },
    saveUserdCf() {
      if (this.drugList.length == 0) {
        Toast("请至少选择一种药品");
        return;
      }
      this.$emit("saveOther", this.index);
    },

    //将成药切换成草药
    switchCf(item) {
      if (this.cfTypeList.length > 2) {
        let val = {
          type: this.type,
          cfIndex: this.index
        };
        this.$emit("showMoreCFType", val);
      } else {
        let val = {
          type: item.code,
          cfIndex: this.index,
          name: item.name
        };
        myJsTools.setItem("preType", item.code);
        this.$store.commit("switchCf", val);
      }
    },
    //删除处方
    deleCf() {
      this.$store.commit("deleteCf", this.index);
    },
    //计算发药数量
    computedNum() {
      console.log("sss", this.patentPopup);
      //如果不为空
      if (
        this.patent.eachQuan > 0 &&
        this.patent.times &&
        this.patent.days &&
        this.patent.day
      ) {
        //剂量*用药频次日/服用天数/包装数量
        let result = Math.ceil(
          (((this.patent.eachQuan * this.patent.times) / this.patent.day) *
            this.patent.days) /
            this.patent.bzsl
        );
        this.patent.quan = result;
      }
    },
    //删除药品
    deleteDrug(index) {
      let val = {
        index: index,
        cfIndex: this.index
      };
      this.$store.commit("deleteDrug", val);
    },
    //修改药品
    editDrug(index) {
      let item = this.drugList[index];
      item.index = index;
      item.type = "edit";
      item.oldQuan = item.quan;
      this.patent = Object.assign({}, item);
      this.patentPopup = true;
    },
    //将选择的药品存储起来
    addPatent() {
      if (!this.patent.days) {
        Toast("请填写用药天数");
        return;
      }
      if (!this.patent.times) {
        Toast("请选择用药频次");
        return;
      }
      if (!this.patent.eachQuan) {
        Toast("请填写每次剂量");
        return;
      }
      if (!this.patent.quan) {
        Toast("请填写发药数量");
        return;
      }
      let val = {
        drugVal: this.patent,
        cfIndex: this.index,
        index: this.patent.index
      };
      if (this.patent.type == "edit") {
        val.type = "edit";
      }
      this.$store.commit("setDrugOne", val);
      this.patent = {
        days: "",
        ddufName: "",
        eachQuan: ""
      };
      this.patentName = "";
      this.patentPopup = false;
    },
    // 获取频次
    getpcList() {
      this.pcColumns = [];
      findAll().then(res => {
        console.log(res);
        var data = res.data;
        this.pcList = data;

        for (let m = 0; m < data.length; m++) {
          const element = data[m];
          this.pcColumns.push(element.ddufName);
          if (this.patent.ddufName) {
            if (this.patent.ddufName == element.ddufName) {
              this.patent.ddufName = element.ddufName;
              this.patent.ddufCode = element.ddufCode;
              this.patent.day = element.day;
              this.patent.times = element.times;
              this.pcDefaultIndex = m;
            }
          }
        }

        if (!this.patent.ddufName) {
          this.patent.ddufName = data[0].ddufName;
          this.patent.ddufCode = data[0].ddufCode;
          this.patent.day = data[0].day;
          this.patent.times = data[0].times;
          this.pcDefaultIndex = 0;
        }
      });
    },
    // 频次选择之后保存
    commitPc(value, index) {
      this.patent.ddufName = value;
      this.patent.ddufCode = this.pcList[index].ddufCode;
      this.patent.day = this.pcList[index].day;
      this.patent.times = this.pcList[index].times;
      this.showPcPicker = false;
      this.pcDefaultIndex = index;
    },
    selectDdufName() {
      this.showPcPicker = true;
      if (this.patent.ddufName) {
        this.pcDefaultIndex = this.pcColumns.indexOf(this.patent.ddufName);
      }
    },
    // 获取处方用法
    getCfMethod() {
      dicdrugusage().then(res => {
        console.log(res);
        var data = res.data;
        for (let m = 0; m < data.length; m++) {
          const element = data[m];
          this.columns.push(element.dduName);
        }
      });
    },
    //选择服用方法
    onConfirm(value, index) {
      this.patent.dduName = value;
      this.defaultIndex = index;
      this.showPicker = false;
    },
    selectDduName() {
      if (this.patent.dduName) {
        this.defaultIndex = this.columns.indexOf(this.patent.dduName);
      }
      this.showPicker = true;
    },
    //选择成药
    selectPatent(item) {
      for (let i = 0; i < this.drugList.length; i++) {
        if (item.drugId == this.drugList[i].drugId) {
          Toast("已经存在该药品，请重新选择");
          return;
        }
      }
      if (item.drugName) {
        item.days = item.days || null; //用药天数
        item.quan = item.quan || null; //发药数量
      }
      if (!item.dduName) {
        item.dduName = this.columns[0];
      }
      this.showDrugList = false;
      this.patent = Object.assign({}, item);
      this.getpcList();
      setTimeout(() => {
        this.patentPopup = true;
      }, 100);
    },
    showAddField() {
      this.showDrugList = true;
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
      this.patentList = [];
      this.usedDrugList = [];
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

    // 获取列表
    getDrugList() {
      this.listQuery.docId = myJsTools.getItem("token_info").docId;
      this.listQuery.type = this.type == "1" ? "0" : this.type;
      this.listQuery.drugName = this.searchVal;
      this.listQuery.ddtId = this.ddtId;
      this.listQuery.regId = this.regId;
      this.listQuery.sortField = "drugName";
      this.listQuery.sortType = "DESC";
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
    }
  }
};
</script>

<style scoped lang="less">
.color3 {
  color: #333333;
}
.color9 {
  color: #999999;
}
.searchDiv {
  position: fixed;
  left: 0;
  background: @white;
  border-bottom: 1px solid @back-border;
  .font-size-md;
  box-sizing: border-box;
  z-index: 3;
  width: 100%;

  .iconDiv {
    padding-right: 16px;
    padding-top: 8px;
    text-align: right;
    img {
      display: inline-block;
    }
  }

  .serarchInfo {
    display: flex;
    align-items: center;
  }
  /deep/ .van-field {
    background: @white;
  }
  span {
    .font-size-md;
    padding-top: 6px;
  }

  .searchField {
    width: 88%;

    .van-field {
      width: 100%;
      margin-top: 0px;
    }

    /deep/ .van-search {
      padding: 0;
    }

    /deep/ .van-search__content {
      padding-left: 0;
    }

    /deep/ .van-cell {
      align-items: center;
      padding-left: 0px;
    }
  }

  div {
    input {
      width: 100%;
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

.addDiv {
  // background: @page-back;
  .font-login-color;
  margin-top: 8px;
  display: flex;
  .font-size-md;
  align-items: center;
  padding: 8px;
  background: #eaf8ff;
  color: #14a0e6;
  .editZd {
    margin-right: 4px;
  }
}

.drugListPopup {
  height: 80%;
}

.drugDiv {
  .font-size-md;

  .drugNameLi {
    background: #f5f5f5;
    padding: 8px;
    margin-top: 8px;
  }

  .quanNum {
    margin-right: 8px;
  }

  .useMethod {
    padding: 8px 6px;
    display: flex;
    align-items: center;

    .editIcon {
      padding-left: 13px;
    }
  }
}

.patentPopup {
  //height: 53vh;
  background: @white;
  padding-bottom: 12px;
  .black-font;
  .font-blod-2;
  .font-size-lg;

  .van-col {
    padding: 6px 0;
  }

  .downImg {
    margin: 0 auto;
  }

  .van-row {
    display: flex;
    align-items: center;
    padding-bottom: 12px;
  }

  .numVal {
    padding: 0;
  }

  .gg {
    letter-spacing: 3px;
  }
  .ggValue {
    font-weight: 400;
    text-align: left !important;
  }
  .ypzz {
    padding-bottom: 0;
  }

  .memo {
    max-height: 64px;
    overflow-y: scroll;
    font-size: 14px;
    font-weight: 400;
    line-height: 21px;
    text-align: left;
    margin: 0px 22px 12px 22px;
    padding-bottom: 10px;
  }

  .btns {
    display: flex;
    justify-content: flex-end;
    padding-right: 27px;
  }

  .publicWhiteBtn-80 {
    background: #d8d8d8;
    border: none;
    color: @white;
  }

  .useDrugPc {
    background: @page-back;
    line-height: 36px;
    height: 36px;
    margin-left: 6px;
    border-radius: 4px;
  }

  /deep/ .van-stepper__input {
    width: 56%;
    background: @page-back;
  }

  /deep/ .van-stepper__minus,
  .van-stepper__plus {
    background: @page-back;
  }

  /deep/ .van-stepper__minus::after,
  .van-stepper__plus::after {
    width: 1px;
    height: 35%;
  }

  /deep/ .van-stepper__minus::before,
  .van-stepper__plus::before {
    width: 35%;
    height: 1px;
  }

  .title {
    .font-size-lg-2;
    .black-font;
    text-align: center;
    padding: 18px 0;
  }

  .drugName {
    margin-left: 22px;
  }
}

/deep/ .van-field {
  padding: 8px;
  margin-top: 8px;
  .font-size-md;
  background: @page-back;
}

.minHeight {
  min-height: 300px;
}

.patent {
  margin-top: 8px;
  padding: 14px 8px;
  border-radius: 4px;
  background: @white;
  .optTitle {
    display: flex;
    align-items: flex-end;
  }

  .rightBtn {
    justify-content: flex-end;

    .icon-width-height-sm-16 {
      display: inline-block;
    }
  }

  .van-col {
    text-align: center;
  }

  .leftBtn,
  .rightBtn {
    display: flex;
    align-items: center;
  }
}

.diagList {
  position: fixed;
  padding-right: 16px;
  bottom: 0;
  z-index: 99999;
  width: 100%;
  height: 56px;
  line-height: 56px;
  overflow-x: scroll;
  -webkit-overflow-scrolling: touch;
  overflow-y: hidden;
  white-space: nowrap;
  background: @white;
  left: 0;
  .font-login-color;
  .font-size-lg-2;
  span {
    margin-left: 16px;
  }
}

.viList {
  display: flex;
  position: relative;
  padding-top: 70px;
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
  height: 65%;
  background: @page-back;
  padding-bottom: 40px;
}

/deep/ .van-sidebar-item--select {
  background: @white;
  border-radius: 8px 0px 0px 8px;
}

/deep/ .van-sidebar-item--select::before {
  background-color: @blue;
  /*left: 20%;*/
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
    // background: @white;
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
</style>
