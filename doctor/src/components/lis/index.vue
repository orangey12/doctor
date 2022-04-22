<template>
  <div class="checkList">
    <navbar title="新增检验" back></navbar>
    <v-touch
      id="touch"
      v-on:swipeleft="openPatientInfo"
      v-on:swiperight="onSwipeRight"
      tag="div"
    >
      <div class="checkDiv">
        <touch-patient-info
          :patientId="$route.query.patientId"
          ref="patientInfo"
        ></touch-patient-info>
        <div class="diagnosis">
          <li class="titleTips">
            <span class="line"></span>
            <span>临床诊断</span>
          </li>
          <div class="addZdDiv">
            <div class="addDiv" @click.stop="showAddField" v-show="!showField">
              <img
                src="../../assets/img/cf/editZd.png"
                class="editZd icon-width-height-sm-16"
              />
              <span>点击输入诊断</span>
            </div>
            <van-field
              v-show="showField"
              ref="addzd"
              @focus="searchZd('focus')"
              @blur="blurInput"
              v-model="zdName"
              placeholder="点击输入诊断"
            />
          </div>
          <!-- 最底端提示 -->
          <div
            class="diagList"
            ref="bottombar"
            v-show="diagList.length > 0 && !zdListPopup"
          >
            <div class="zdList">
              <span
                v-for="(item, index) in diagList"
                @click.stop="selectZd(item)"
                :key="index"
                >{{ item.diagName }}</span
              >
            </div>
            <div class="imgDiv" @click.stop="showMore">
              <img src="../../assets/img/cf/more.png" class="downImg" />
            </div>
          </div>
        </div>
        <div class="checkObject">
          <li class="title">检验项目</li>
          <div class="listDiv">
            <div class="ctDiv" v-for="(item, index) in lisList" :key="index">
              <li class="object">
                <u class="name"
                  >{{ index + 1 }}.{{ item.lisItemName }}-{{
                    item.sampleTypeName
                  }}-{{ item.sampleBodyName }}</u
                >
                <u class="price"
                  >￥{{ item.price }}
                  <img
                    src="../../assets/img/chat/close_2.png"
                    class="closeIcon"
                    @click="delObj(item, index, item, index)"
                /></u>
              </li>
              <li
                class="orgName"
                v-for="(orgName, orgIndex) in item.orgNames.split(',')"
                :key="orgIndex"
              >
                {{ orgName }}
              </li>
            </div>
          </div>
          <li class="totalPrice" v-if="lisList.length > 0">
            合计： <span style="color: #FF5050">￥{{ total }}</span>
          </li>
          <div class="addBtnDiv" @click="openSelectOnject">
            <img src="../../assets/img/cf/addZd.png" class="addIcon" />
            <span>添加检验</span>
          </div>
        </div>
      </div>
    </v-touch>
    <div class="bottomBtn">
      <button class="publicBtn" @click="getMechainIsExit">发送</button>
    </div>
    <van-popup class="selectObject" position="right" v-model="showObject">
      <div class="fixedDiv">
        <header class="defaultHeader" :style="{ top: paddingTop + 'px' }">
          <img
            src="../../assets/img/chat/back.png"
            class="backIcon"
            @click="showObject = false"
          />
          <div class="title">项目请选择</div>
        </header>
        <div class="searchDiv" :style="{ 'padding-top': headerHeight + 'px' }">
          <img src="../../assets/img/index/search.png" class="searchIcon" />
          <div class="searchField">
            <van-field
              v-model="searchVal"
              placeholder="请输入想要搜索的内容"
              :clearable="true"
            />
          </div>
          <span @click="getXmList" class="font-login-color-blue">搜索</span>
        </div>
      </div>
      <div
        class="objectList"
        :style="{ 'padding-top': parseInt(headerHeight) + 44 + 'px' }"
      >
        <van-tree-select
          @click-nav="getXmList"
          height="84vh"
          :items="items"
          :main-active-index.sync="active"
        >
          <template #content>
            <div style="width: 100%;">
              <van-steps
                @click-step="selectSteps"
                direction="vertical"
                :active="objectActive"
                :active-color="downColor"
                inactive-color="#999"
              >
                <van-step class="vanSteps">
                  {{ lisItemName }}
                </van-step>
                <van-step class="vanSteps">
                  {{ sampleTypeName }}
                </van-step>
                <van-step class="vanSteps">
                  {{ sampleBodyName }}
                </van-step>
              </van-steps>
              <li class="title">{{ objTitle }}</li>
              <div v-if="objectActive == 0">
                <div
                  v-for="(item, index) in lisItemList"
                  @click="selectXm(item)"
                  :key="index"
                  class="itemInfo"
                >
                  <li class="object ">
                    {{ item.lisItemName }}
                  </li>
                  <div
                    class="orgNames div-overflow-2"
                    @click.stop="showOrgNames(item.orgNames)"
                  >
                    {{ item.orgNames }}
                  </div>
                </div>
              </div>
              <div v-if="objectActive == 1">
                <li
                  @click="selectSample(item)"
                  class="sampleBodyName"
                  v-for="(item, index) in sampleList"
                  :key="index"
                >
                  {{ item.sampleTypeName }}
                </li>
              </div>
              <div v-if="objectActive == 2">
                <li
                  @click="selectObj(item)"
                  class="sampleBodyName"
                  v-for="(item, index) in objList"
                  :key="index"
                >
                  {{ item.sampleBodyName }}
                </li>
              </div>
            </div>
          </template>
        </van-tree-select>
      </div>
    </van-popup>
    <van-popup
      v-model="notMechainShow"
      :close-on-click-overlay="false"
      class="popup"
    >
      <li class="title">提示</li>
      <li class="tipsInfo">
        您所开具的项目暂无可以同时响应的机构，请修改重新发送
      </li>
      <div class="btns">
        <button @click="notMechainShow = false" class="publicBtn commitBtn">
          确定
        </button>
      </div>
    </van-popup>
    <van-popup
      v-model="notRegShow"
      :close-on-click-overlay="false"
      class="popup"
    >
      <li class="title">提示</li>
      <li class="tipsInfo">您所开具的项目暂无号，是否继续开具</li>
      <div class="btns">
        <button @click="notRegShow = false" class="publicWhiteBtn">否</button>
        <button @click="save" class="publicBtn twoBtn">是</button>
      </div>
    </van-popup>
    <van-popup
      v-model="showOrgNamesPopup"
      closeable
      class="orgNamesPopup"
      round
    >
      <li v-for="(item, index) in orgNames.split(',')">
        {{ item }}
      </li>
    </van-popup>
    <van-popup
      v-model="zdListPopup"
      class="zdListPopup"
      :overlay="false"
      position="bottom"
    >
      <van-list>
        <li
          v-for="(item, index) in diagList"
          @click.stop="selectZd(item)"
          :key="index"
        >
          {{ item.diagName }}
        </li>
      </van-list>
    </van-popup>
  </div>
</template>

<script>
import Navbar from "../../common/navbar";
import myJsTools from "../../utils/myJsTools";
import { Toast } from "vant";
import TouchPatientInfo from "../childCompon/touchPatientInfo";
import { getSysPlatformConfigBykey } from "../../api/login";
import { getPacsLisDiagnosisList } from "../../api/cf";

import {
  findAllDicLisType,
  getIsResponseLisOrganization,
  getLisItmeList,
  getLisSampleBody,
  getLisSampleType,
  saveProLisInfo
} from "../../api/chat";

let timeOut;

export default {
  name: "index",
  components: { TouchPatientInfo, Navbar },
  data() {
    return {
      docId: "",
      diagList: [], //诊断列表
      showField: false, //显示输入框
      showselect: false, //已选还是未选状态
      zdListPopup: false,
      zdName: "",
      showObject: false,
      headerHeight: 50,
      paddingTop: "",
      searchVal: "",
      items: [],
      sampleList: [], //类型列表
      lisTypeName: "",
      active: 0,
      objectActive: 0, //0为请选择项目
      lisItemList: [], //部位列表
      sampleBodyName: "请选择部位",
      samBodyId: "",
      pacssamBodyId: "",
      sampleTypeName: "请选择样本类型",
      samTypeId: "",
      orgNames: "",
      lisItemName: "请选择项目",
      objTitle: "请选择项目", //请选择某一步  显示的提示文字
      objList: [],
      userInfo: {},
      total: 0,
      checkInfo: {},
      downColor: "",
      notMechainShow: false, //没有可响应机构的提示
      notRegShow: false, //有可响应机构 无号提示
      organList: [], //机构数组
      showOrgNamesPopup: false, //展示所有的机构
      lisItemParam: {} //选中的项目数据
    };
  },
  created() {
    this.docId = myJsTools.getItem("token_info").docId;
  },
  mounted() {
    if (window.isIOS) {
      window.visualViewport.addEventListener("resize", this.updateBar);
      window.visualViewport.addEventListener("scroll", this.updateBar);
    }
    this.downColor = myJsTools.getItem("downColor");
    if (myJsTools.getItem("headerHeight")) {
      this.paddingTop = parseInt(api.safeArea.top);
      this.headerHeight = parseInt(myJsTools.getItem("headerHeight"));
    }
  },
  computed: {
    lisList() {
      let total = 0;
      let list = this.$store.getters.getLisList;
      list.map(el => {
        total += el.price;
      });
      this.total = parseFloat(total).toFixed(2);
      return list;
    }
  },
  methods: {
    selectZd(item) {
      this.diagList = [];
      this.diagList.length = 0;
      this.showField = true;
      this.zdListPopup = false;
      this.zdName = item.diagName;
    },
    //搜索诊断
    searchZd(type) {
      let time = 0;
      if (type == "focus") {
        time = 0;
        this.focusInput = true;
      } else {
        time = 200;
      }

      if (this.zdName.length > 0) {
        clearTimeout(timeOut);
        if (!this.focusInput) {
          return;
        }
        timeOut = setTimeout(() => {
          getPacsLisDiagnosisList({
            docId: this.docId,
            diagName: this.zdName
          }).then(res => {
            var data = res.data;
            this.diagList = data;
          });
        }, time);
      } else {
        this.diagList = [];
      }
    },
    showMore() {
      this.zdListPopup = true;
    },
    //失去焦点
    blurInput() {
      if (!zdListPopup) {
        this.diagList.length = 0;
      }
      this.focusInput = false;
    },
    //显示添加诊断框
    showAddField() {
      this.showField = true;
      setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.addzd.focus();
        });
      }, 200);
    },
    updateBar() {
      this.$nextTick(() => {
        var bottomBar = this.$refs.bottombar;
        var bottomBar2 = this.$refs.bottombar2;
        this.setBottom(bottomBar);
        this.setBottom(bottomBar2);
      });
    },
    setBottom(bottomBar) {
      var viewport = window.visualViewport;
      var offsetY =
        document.documentElement.scrollHeight -
        viewport.height -
        viewport.offsetTop;
      console.log(
        "document.documentElement.scrollHeight-" +
          document.documentElement.scrollHeight +
          "viewport.height-" +
          viewport.height +
          "viewport.offsetTop-" +
          viewport.offsetTop +
          "api.winHeight" +
          api.winHeight
      );
      if (offsetY - 5 > 0) {
        offsetY = offsetY - 5;
      }
      bottomBar.style.left = "0px";
      bottomBar.style.bottom = offsetY + "px";
      console.log(offsetY);
      bottomBar.style.transform = "scale(" + 1 / viewport.scale + ")";
    },
    openPatientInfo() {
      this.$refs.patientInfo.openPatientInfo();
    },
    onSwipeRight() {
      this.$refs.patientInfo.patientPopup = false;
    },
    openSelectOnject() {
      this.diagList.length = 0;
      this.showObject = true;
      this.resetData();
      this.getTypeList();
    },
    resetData(type) {
      if (type != "nav") {
        this.lisTypeName = "";
        this.active = 0;
      }
      this.objectActive = 0;
      this.lisItemList = [];
      this.sampleBodyName = "请选择部位";
      this.pacssamBodyId = "";
      this.lisItemName = "请选择项目";
      this.objList = [];
    },
    //分类
    getTypeList() {
      findAllDicLisType().then(res => {
        let data = res.data;
        if (data.length > 0) {
          data.map(item => {
            item.text = item.lisTypeName;
          });
          this.lisTypeName = data[0].lisTypeName;
        }
        data.unshift({
          text: "全部",
          lisTypeName: "全部",
          lisTypeId: ""
        });
        this.items = data;
        this.getXmList();
      });
    },
    //项目
    getXmList() {
      this.resetData("nav");
      getLisItmeList({
        lisTypeId: this.items[this.active].lisTypeId,
        searchName: this.searchVal,
        hosId: myJsTools.getItem("docUserInfo").hosId
      }).then(res => {
        this.lisItemList = res.data;
      });
    },
    showOrgNames(orgNames) {
      this.showOrgNamesPopup = true;
      this.orgNames = orgNames;
    },
    //请选择项目 获取类型
    selectXm(item) {
      this.lisItemParam = item;
      this.lisItemName = item.lisItemName;
      this.objectActive = 1;
      getLisSampleType().then(res => {
        this.sampleList = res.data;
      });
    },
    selectSample(item) {
      this.samTypeId = item.samTypeId;
      this.sampleTypeName = item.sampleTypeName;
      this.objectActive = 2;
      getLisSampleBody({
        samTypeId: this.samTypeId
      }).then(res => {
        this.objList = res.data;
      });
    },
    // 请选择部位
    selectObj(item) {
      let param = {
        dliId: this.lisItemParam.dliId,
        lisItemName: this.lisItemParam.lisItemName,
        lisTypeId: this.lisItemParam.lisTypeId,
        lisTypeName: this.lisItemParam.lisTypeName,
        samBodyId: item.samBodyId,
        sampleBodyName: item.sampleBodyName,
        noteContent: item.noteContent,
        noteTypeId: item.noteTypeId,
        price: this.lisItemParam.guidancePrice,
        orgNames: this.lisItemParam.orgNames,
        samTypeId: this.samTypeId,
        sampleTypeName: this.sampleTypeName,
        sampleRequire: this.lisItemParam.sampleRequire
      };
      let list = this.lisList;
      let flag = false;
      if (list.length == 0) {
        this.showObject = false;
        this.$store.commit("setLisList", param);
      } else {
        let arr = [];
        list.map((el, index) => {
          if (
            el.dliId == param.dliId &&
            el.samBodyId == param.samBodyId &&
            el.samTypeId == param.samTypeId
          ) {
            Toast("此检查部位已存在，请重新请选择");
            flag = true;
            return;
          }
          if (index == list.length - 1) {
            if (!flag) {
              this.showObject = false;
              this.$store.commit("setLisList", param);
            }
          }
        });
      }
    },
    //点击步骤条
    selectSteps(val) {
      if ((val == 1 || val == 2) && !this.lisItemParam.dliId) {
        Toast("请先请选择项目");
        return;
      }
      if (val == 2 && !this.samTypeId) {
        Toast("请先请选择样本类型");
        return;
      }
      if (val == 0) {
        this.objTitle = "请选择项目";
      } else if (val == 1) {
        this.objTitle = "请选择样本类型";
      } else {
        this.objTitle = "请选择";
      }
      this.objectActive = val;
    },
    //删除已选项目
    delObj(item, index) {
      let list = this.lisList;
      list.splice(index, 1);
      this.$store.commit("setAllLisList", list);
    },
    //获取全局配置
    getConfig() {
      return new Promise(async (resolve, reject) => {
        getSysPlatformConfigBykey({
          configKey: "is_doc_appoint_organ"
        }).then(res => {
          resolve(res.data.configValue);
        });
      });
    },
    //查询是否有可响应机构
    getMechainIsExit() {
      let list = this.lisList;
      if (list.length == 0) {
        Toast("请请选择检验项目");
        return;
      }
      let itemList = [];
      this.lisList.map(el => {
        itemList.push(el.dliId);
      });
      getIsResponseLisOrganization({
        itemList: itemList,
        itemNum: this.lisList.length
      }).then(res => {
        if (res.data.isResponse == "0") {
          this.notMechainShow = true;
        } else if (res.data.isResponse == "1") {
          this.organList = res.data.organList;
          this.notRegShow = true;
        } else {
          this.organList = res.data.organList;
          this.save();
        }
      });
    },

    //保存
    async save() {
      if (!this.zdName) {
        this.zdName = "待查";
      }
      let param;
      let userInfo = this.$refs.patientInfo.userInfo;
      let docInfo = this.$refs.patientInfo.docInfo;
      param = {
        age: userInfo.age,
        ageUnit: userInfo.ageUnit,
        birthDate: userInfo.birthDate,
        deptId: docInfo.defaultDeptId,
        deptName: docInfo.defaultDeptName,
        docId: docInfo.docId,
        docName: docInfo.docName,
        idNo: userInfo.idNo,
        patientId: userInfo.patientId,
        patientName: userInfo.patientName,
        ppiDiag: this.zdName,
        ppiType: myJsTools.getItem("token_info").ppiType,
        saveProLisDetailDTO: this.lisList,
        sex: userInfo.sex,
        sexCode: userInfo.sexCode,
        docTel: docInfo.telNo,
        telNo: userInfo.telNo,
        status: "1"
      };
      myJsTools.setItem("lisInfo", param);
      let appoint = await this.getConfig();
      if (appoint == "1") {
        this.$router.push({
          name: "mechanismLis",
          query: {
            organList: JSON.stringify(this.organList)
          }
        });
        return;
      }
      Toast.loading({
        message: "发送中...",
        forbidClick: true,
        closeOnClick: false,
        duration: 0
      });
      saveProLisInfo(param).then(res => {
        this.$store.commit("setAllLisList", []);
        let ext = {
          pliId: res.data.pliId,
          ppiDiag: param.ppiDiag,
          type: "jyd",
          orderStatus: 1
        };
        api.sendEvent({
          name: "sendLis",
          extra: {
            ext: ext
          }
        });
        this.$router.go(-1);
      });
    }
  }
};
</script>

<style scoped lang="less">
#touch {
  touch-action: pan-y !important;
  height: 100%;
}

/deep/ .van-step--vertical {
  padding: 29px 0;
  font-size: 14px;

  .van-step__circle-container {
    top: 38px;
  }

  .van-step__line {
    top: 40px;
  }
}

.sampleBodyName {
  padding-top: 12px;
  color: #333333;
  font-size: 14px;
  line-height: 20px;
  padding-left: 12px;
}

/deep/ .van-step__circle {
  display: block;
  width: 10px;
  height: 10px;
}

/deep/ .van-sidebar {
  width: 32%;
  font-size: 16px;
}

/deep/ .van-step--vertical:not(:last-child)::after {
  border: none;
}

.checkDiv {
  height: calc(100vh - 110px);
}

.checkDiv {
  padding: 10px 16px 0;
  color: #333333;
  font-size: 14px;

  .diagnosis {
    border-radius: 4px;
    background: #ffffff;
    padding: 12px;
    margin-top: 12px;

    /deep/ .van-cell {
      padding: 7px 8px;
      margin-top: 13px;
      background: #f6f8fb;
    }
  }

  .title {
    font-weight: 600;
  }

  .checkObject {
    background: #ffffff;
    padding: 12px;
    border-radius: 4px;
    margin-top: 12px;

    .totalPrice {
      text-align: right;
      font-size: 14px;
      color: #333333;
      margin-top: 20px;
    }

    .ctDiv {
      background: #f6f8fb;
      padding: 8px;
      border-radius: 8px;
      margin-top: 8px;

      .object {
        color: #333333;
        display: flex;
        line-height: 20px;
        padding-bottom: 8px;
        border-bottom: 0.5px solid #eeeeee;

        .name {
          width: 80%;
        }

        .price {
          width: 20%;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          color: @red;
          font-size: 14px;

          img {
            width: 16px;
            height: 16px;
            margin-left: 6px;
          }
        }
      }
    }

    .listDiv {
      :last-child {
        border: none;
      }
    }

    .addBtnDiv {
      display: flex;
      color: #14a0e6;
      font-size: 16px;
      line-height: 22px;
      align-items: center;
      font-weight: 600;
      width: 29%;
      margin: 16px auto 0;

      .addIcon {
        width: 20px;
        height: 20px;
        display: inline-block;
        margin-right: 5px;
      }
    }
  }
}

.itemInfo {
  background: @white;
  margin: 12px 12px 0;
  padding: 8px;
  border-radius: 8px;

  .object {
    font-size: 14px;
    line-height: 21px;
    padding-bottom: 8px;
    border-bottom: 0.5px solid #eeeeee;
    color: @blue;
  }
}

.orgName,
.orgNames {
  color: #999;
  font-size: 12px;
  line-height: 17px;
  padding-top: 8px;
}

.selectObject {
  height: 100%;
  width: 100%;

  .fixedDiv {
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 9999;
  }

  /deep/ .van-popup--right {
    top: 0;
    right: 0;
    -webkit-transform: none;
    transform: none;
  }

  .defaultHeader {
    display: flex;
    width: 100%;
    background: #ffffff;
    line-height: 30px;

    .title {
      color: #333333;
      font-weight: 700;
      font-size: 18px;
      padding: 7px 0;
      text-align: center;
      width: 90%;
    }

    .backIcon {
      width: 24px;
      height: 24px;
      padding: 10px 0px 10px 15px;
    }

    img {
      width: 22px;
      height: 22px;
      padding: 14px 16px;
    }
  }

  .searchDiv {
    display: flex;
    width: 100%;
    background: #ffffff;
    font-size: 14px;

    .searchIcon {
      width: 22px;
      height: 22px;
      padding: 10px 16px;
    }

    span {
      font-size: 12px;
      line-height: 18px;
      padding: 12px 0 12px 11px;
    }

    .searchField {
      width: 70%;

      .van-field {
        width: 100%;
      }
    }

    div {
      input {
        width: 100%;
      }
    }
  }
}

.objectList {
  display: flex;
  width: 100%;
  background: #f5f5f5;
  align-items: center;

  /deep/ .van-tree-select__nav {
    flex: none;
  }

  /deep/ .van-tree-select__content,
  .van-steps {
    background: #f5f5f5;
  }

  /deep/ .van-step--finish {
    color: #999999;
  }

  /deep/ .van-tree-select {
    width: 100%;
  }

  .title {
    color: #999999;
    font-size: 12px;
    padding-top: 9px;
    /*border-top: 0.5px solid #EEEEEE;*/
    padding-left: 12px;
    width: 80%;
  }

  /deep/ .van-sidebar-item--select::before {
    background-color: #14a0e6;
  }

  /deep/ .van-tree-select__nav,
  /deep/ .van-sidebar-item {
    background-color: #ffffff;
  }

  /deep/ .van-sidebar-item--select,
  .van-sidebar-item--select:active {
    background: #f5f5f5;
  }
}

.orgNamesPopup {
  width: 80%;
  background: @white;
  text-align: center;
  color: @black;
  line-height: 20px;
  font-size: 14px;
  padding: 27px 0;
}
.addZdDiv {
  margin-top: 8px;
}
.addDiv {
  background: @page-back;
  .font-login-color;
  display: flex;
  .font-size-md;
  align-items: center;
  padding: 8px;

  .editZd {
    margin-right: 4px;
  }
}
.diagList {
  position: fixed;
  padding-right: 70px;
  bottom: 0px;
  z-index: 99999999;
  width: 100%;
  height: 56px;
  line-height: 56px;
  .display-div;
  background: @white;
  left: 0;
  .black-font;
  .font-size-lg-2;

  span {
    margin-left: 16px;
  }

  .imgDiv {
    padding: 0 9px;
  }

  .downImg {
    width: 42px;
    height: 15px;
  }

  .zdList {
    overflow-x: scroll;
    -webkit-overflow-scrolling: touch;
    overflow-y: hidden;
    white-space: nowrap;
  }
}
.zdEditPopup {
  width: 80%;
  background: @white;
  padding: 16px;
  text-align: center;

  .btns {
    padding-top: 12px;
    display: flex;
    align-items: center;

    button {
      line-height: 34px !important;
    }
  }

  .popup-title {
    margin-bottom: 24px;
  }

  .zdName {
    padding: 12px 0;
  }

  .van-cell {
    line-height: 18px;
    padding: 8px;
    font-size: @font-size-sm-2;
    background: @field-back;
    border-radius: 4px;
    border: none;
    width: 100%;
    height: 52px;
  }

  .commitBtn {
    margin: 24px auto 0;
    line-height: 34px !important;
  }
}
.zdListPopup {
  background: @white;
  height: 50%;
  overflow: scroll;
  width: 100%;
  text-align: center;
  padding: 11px 0;
  border-top: 1px solid @back-border;

  li {
    padding: 11px 0;
    .black-font;
    .font-size-lg;
  }
}
.selectedDiag {
  display: flex;
  flex-wrap: wrap;

  div {
    display: flex;
    align-items: center;

    .editZd {
      margin-left: 6px;
    }
  }
}
.diagsName {
  background: #eaf8ff;
  padding: 8px;
  .font-size-md;
  margin-top: 8px;
  margin-right: 8px;
}
/deep/ .van-field {
  padding: 8px;
  .font-size-md;
  background: @page-back;
}
</style>
