<template>
  <div>
    <div class="zdDiv">
      <li
        class="titleTips"
        style="justify-content: center;border-bottom: 1px dashed #EBEBEB;padding: 4px 0 10px;"
      >
        <!-- <span class="line"></span> -->
        <span class="black-font font-blod-3 font-size-lg">临床诊断</span>
      </li>
      <div class="addZd">
        <div class="selectedDiag" v-if="selectedDiagList.length > 0">
          <div
            v-for="(item, index) in selectedDiagList"
            @click="editZd(item, index)"
            :key="index"
            :class="item.editZdShow && item.diagType == '3' ? '' : 'diagsName'"
          >
            <span v-if="item.diagType == '1'">
              <span style="color:#999999;">{{ item.diagNamePrefix }}</span>
              <span>{{ item.diagName }}</span>
              <span style="color:#999999;">{{ item.diagNameSuffix }}</span>
            </span>
            <span v-if="item.diagType == '3'">
              <span v-if="!item.editZdShow"
                >{{ item.diagName }} - {{ item.symptomaticName }}</span
              >
              <div class="herbalZd editHerbalZd" v-show="item.editZdShow">
                <div class="bzName">{{ zdName }}</div>
                <span class="herbalLine">-</span>
                <div>
                  <van-field
                    class="changecol2"
                    :ref="'drugAddZx' + index"
                    @focus="searchZx('focus')"
                    @blur="blurInput('edit')"
                    v-model="zxName"
                    placeholder="请输入患者症型"
                  />
                </div>
                <img
                  src="../../assets/img/cf/delete.png"
                  @click.stop="delZd"
                  v-if="item.type == 'edit'"
                  class="icon-width-height-sm-16 delIcon"
                />
              </div>
            </span>
            <img
              src="../../assets/img/cf/editZd.png"
              class="editZd icon-width-height-sm-16"
              @click="editZd(item, index)"
              v-if="!item.editZdShow"
            />
          </div>
        </div>
        <div class="addZdDiv" v-show="showAddDiv">
          <div
            class="addDiv"
            @click.stop="showAddField"
            v-show="!showField && !herbalZdShow"
          >
            <img
              src="../../assets/img/cf/editZd2.png"
              class="editZd icon-width-height-sm-16"
            />
            <span>输入西医诊断或中医病症</span>
          </div>
          <van-field
            v-show="showField && !herbalZdShow"
            ref="addzd"
            @focus="searchZd('focus')"
            @blur="blurInput"
            v-model="zdName"
            class="xytwo"
            placeholder="输入西医诊断或中医病症"
          />
          <div class="herbalZd" v-show="herbalZdShow">
            <van-field
              ref="addBz"
              @focus="searchZd('focus')"
              @blur="blurInput"
              v-model="zdName"
              placeholder="请输入病症"
              style="background: #eaf8ff;"
            />
            <span>-</span>
            <van-field
              class="twocontrol"
              ref="addZx"
              @focus="searchZx('focus')"
              @blur="blurInput"
              v-model="zxName"
              placeholder="请输入患者症型"
              style="background: #eaf8ff;"
            />
            <img
              src="../../assets/img/cf/delete.png"
              @click.stop="delZd('clear')"
              class="icon-width-height-sm-16 delIcon"
            />
          </div>
        </div>
      </div>
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
      <div
        class="diagList"
        ref="bottombar2"
        v-show="zxList.length > 0 && !zxListPopup"
      >
        <div class="zdList">
          <span
            v-for="(item, index) in zxList"
            @click.stop="selectZx(item)"
            :key="index"
            >{{ item.symptomaticName }}</span
          >
        </div>
        <div class="imgDiv" @click.stop="zxListPopup = true">
          <img src="../../assets/img/cf/more.png" class="downImg" />
        </div>
      </div>

      <van-popup
        v-model="zdAddPopup"
        class="zdEditPopup"
        :close-on-click-overlay="false"
        round
      >
        <li class="popup-title">临床诊断</li>
        <van-field
          v-model="nowSelect.diagNamePrefix"
          maxlength="10"
          placeholder="请输入前缀"
        />
        <li class="font-login-color-blue font-size-md zdName font-blod-2">
          {{ nowSelect.diagName }}
        </li>
        <van-field
          v-model="nowSelect.diagNameSuffix"
          maxlength="10"
          placeholder="请输入后缀"
        />

        <div class="btns" v-if="nowSelect.index || nowSelect.index == 0">
          <button class="publicWhiteBtn" @click.stop="delZd">
            删除
          </button>
          <button class="publicBtn twoBtn" @click.stop="closeZdAdd">
            确定
          </button>
        </div>
        <div v-else>
          <button class="publicBtn commitBtn" @click.stop="closeZdAdd">
            确定
          </button>
        </div>
      </van-popup>

      <van-popup
        v-model="zdListPopup"
        class="zdListPopup"
        :overlay="false"
        position="bottom"
      >
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text=""
          @load="onLoaded"
        >
          <li
            v-for="(item, index) in diagList"
            @click.stop="selectZd(item)"
            :key="index"
          >
            {{ item.diagName }}
          </li>
        </van-list>
      </van-popup>

      <van-popup
        v-model="zxListPopup"
        class="zdListPopup"
        :overlay="false"
        position="bottom"
      >
        <li
          v-for="(item, index) in zxList"
          @click.stop="selectZx(item)"
          :key="index"
        >
          {{ item.symptomaticName }}
        </li>
      </van-popup>
    </div>
  </div>
</template>

<script>
import { findAllListPage, findByName } from "../../api/cf";
import { getSymptomaticTypeList } from "../../api/set";
import { Toast } from "vant";
import myJsTools from "../../utils/myJsTools";

let timeOut, timerId;
export default {
  name: "zdCom",
  props: {
    beforeZdList: Array,
    zdPopup: Boolean,
    type: {
      default: ""
    }
  },
  data() {
    return {
      diagList: [], //诊断列表
      selectedDiagList: [],
      zdAddPopup: false,
      zdListPopup: false,
      zxName: "", //证型搜索
      herbalZdShow: false, //显示选择证型
      zxList: [], //证型列表
      showField: false,
      showAddDiv: true, //编辑草药诊断时，不显示新增框
      zdName: "",
      nowSelect: {
        diagNamePrefix: "",
        diagNameSuffix: "",
        diagName: "",
        editZdShow: false
      },
      focusInput: false,
      bottomHeight: 0,
      zxListPopup: false,
      isLoading: false,
      finished: true,
      loading: false,
      listQuery: {
        page: 1,
        limit: 50,
        size: 1
      }
    };
  },
  watch: {
    selectedDiagList: {
      handler() {
        this.$emit("commitDiagList", this.selectedDiagList);
      },
      deep: true
    },
    zdName: {
      handler() {
        this.searchZd("input");
      },
      deep: true
    },
    zxName: {
      handler() {
        this.searchZx("input");
      },
      deep: true
    },
    beforeZdList: {
      handler() {
        if (this.beforeZdList && this.beforeZdList.length > 0) {
          this.selectedDiagList = this.beforeZdList;
        }
      },
      deep: true
    },
    zdPopup: {
      handler() {
        this.zdAddPopup = this.zdPopup;
      },
      deep: true
    }
  },
  created() {
    if (this.type == "saveOther") {
      this.selectedDiagList = [];
    } else {
      if (myJsTools.getItem("passDiags")) {
        this.selectedDiagList =
          this.beforeZdList || myJsTools.getItem("passDiags");
      } else {
        this.selectedDiagList = this.beforeZdList || [];
      }
    }
  },
  mounted() {
    if (window.isIOS) {
      window.visualViewport.addEventListener("resize", this.updateBar);
      window.visualViewport.addEventListener("scroll", this.updateBar);
    }
  },
  destroyed() {
    if (window.isIOS) {
      window.visualViewport.removeEventListener(
        "resize",
        this.updateBar,
        false
      );
      window.visualViewport.removeEventListener(
        "scroll",
        this.updateBar,
        false
      );
    }
  },
  methods: {
    showMore() {
      this.finished = false;
      this.listQuery.page = 1;
      this.loading = true;
      this.zdListPopup = true;
      this.getZdList();
    },
    // 上拉加载
    onLoaded() {
      if (this.isLoading) {
        this.isLoading = false;
      }
      this.getZdList();
    },
    getZdList() {
      this.listQuery.diagName = this.zdName;
      this.listQuery.diagType = myJsTools.getItem("preType");
      findAllListPage(this.listQuery).then(res => {
        let data = res.data.rows;
        this.total = res.data.total;
        this.loading = false;
        this.listQuery.size = res.data.total / this.listQuery.limit;
        if (this.listQuery.page == 1) {
          this.listQuery.page = 1;
          this.isLoading = false;
          this.diagList = data;
        } else {
          this.diagList = this.diagList.concat(data);
          this.loading = false;
        }
        if (this.listQuery.page >= this.listQuery.size) {
          this.finished = true; // 若数据已全部获取完毕
          return;
        }
        this.listQuery.page++;
      });
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
          findByName({
            diagName: this.zdName,
            diagType: myJsTools.getItem("preType")
          }).then(res => {
            var data = res.data;
            this.diagList = data;
          });
        }, time);
      } else {
        this.diagList = [];
      }
    },
    //搜索证型
    searchZx(type) {
      let time = 0;
      if (this.zxName.length > 0) {
        clearTimeout(timeOut);
        if (type == "focus") {
          time = 0;
        } else {
          time = 300;
        }
        timeOut = setTimeout(() => {
          getSymptomaticTypeList({
            symptomaticName: this.zxName
          }).then(res => {
            var data = res.data;
            this.zxList = data;
          });
        }, time);
      } else {
        this.diagList = [];
      }
    },
    //选择诊断 如果诊断已存在，则不能重复添加
    selectZd(item) {
      if (item.diagType == "1") {
        for (let i = 0; i < this.selectedDiagList.length; i++) {
          if (this.selectedDiagList[i].diagName == item.diagName) {
            Toast("诊断已存在，请勿重复选择");
            return;
          }
        }
        this.zdAddPopup = true;
      } else if (item.diagType == "3") {
        this.herbalZdShow = true;
        this.zdName = item.diagName;
        setTimeout(() => {
          this.$nextTick(() => {
            this.$refs.addZx.focus();
          });
        }, 200);
      }
      this.diagList = [];
      this.zdListPopup = false;
      this.nowSelect.diagType = item.diagType;
      this.nowSelect.diagId = item.diagId;
      this.nowSelect.diagCode = item.diagCode;
      this.nowSelect.diagName = item.diagName;
    },
    //选择证型
    selectZx(item) {
      for (let i = 0; i < this.selectedDiagList.length; i++) {
        let el = this.selectedDiagList[i];
        if (
          el.diagName == this.nowSelect.diagName &&
          this.nowSelect.index != i &&
          el.symptomaticName == item.symptomaticName
        ) {
          Toast("该诊断已存在，请重新选择");
          return;
        }
      }
      this.nowSelect.symptomaticName = item.symptomaticName;
      this.nowSelect.symptomaticId = item.symptomaticId;
      this.nowSelect.symptomaticCode = item.symptomaticCode;
      this.zxListPopup = false;
      this.zxList = [];
      this.zdName = "";
      this.zxName = "";
      this.nowSelect.type = "";
      this.herbalZdShow = false;
      this.showField = false;
      this.showAddDiv = true;
      let obj = Object.assign({}, this.nowSelect);
      if (this.nowSelect.index || this.nowSelect.index == 0) {
        this.nowSelect.editZdShow = false;
        this.selectedDiagList.splice(this.nowSelect.index, 1, this.nowSelect);
      } else {
        this.selectedDiagList.push(obj);
      }
    },
    //添加诊断
    closeZdAdd() {
      this.zdAddPopup = false;
      this.zdName = "";
      this.showField = false;
      this.diagList = [];
      let obj = Object.assign({}, this.nowSelect);
      if (this.nowSelect.index || this.nowSelect.index == 0) {
        this.selectedDiagList.splice(this.nowSelect.index, 1, this.nowSelect);
      } else {
        this.selectedDiagList.push(obj);
      }
      this.nowSelect = {
        diagNamePrefix: "",
        diagNameSuffix: "",
        diagName: ""
      };
    },
    //删除诊断
    delZd(type) {
      this.showField = false;
      this.herbalZdShow = false;
      this.zdAddPopup = false;
      this.showAddDiv = true;
      console.log(this.nowSelect.index);
      if (type != "clear") {
        this.selectedDiagList.splice(this.nowSelect.index, 1);
      }
      this.nowSelect = {
        diagNamePrefix: "",
        diagNameSuffix: "",
        diagName: "",
        type: ""
      };
      this.zxList = [];
      this.diagList = [];
      this.zdName = "";
      this.zxName = "";
    },
    //编辑诊断 草药诊断编辑状态不显示新增框
    editZd(item, index) {
      item.index = index;
      item.type = "edit";
      if (item.diagType == "3") {
        item.editZdShow = true;
      }
      this.$set(this.selectedDiagList, index, item);
      this.nowSelect = item;
      if (item.diagType == "1") {
        this.zdAddPopup = true;
      } else if (item.diagType == "3") {
        this.zdName = item.diagName;
        this.zxName = item.symptomaticName;
        this.showAddDiv = false;
        setTimeout(() => {
          this.$nextTick(() => {
            this.$refs[`drugAddZx${index}`][0].focus();
          });
        }, 200);
      }
    },
    //失去焦点
    blurInput(type) {
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
    }
  }
};
</script>

<style scoped lang="less">
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
.xytwo {
  background: #eaf8ff !important;
}
.xytwo /deep/ .van-field__control {
  background: #eaf8ff;
  padding-left: 2px;
  color: #14a0e6;
}
.zdDiv {
  background: @white;
  padding: 8px;
  margin-top: 8px;
  border-radius: 4px;
  .font-size-md;
}

.addDiv {
  // background: @page-back;

  .font-login-color;
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

/deep/ .van-field {
  padding: 5px;
  .font-size-md;
  background: @page-back;
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

.herbalZd {
  // background: @page-back;
  background: #eaf8ff;
  display: flex;
  align-items: center;
  position: relative;

  .delIcon {
    position: absolute;
    right: -4px;
    top: -4px;
  }

  /deep/ .van-field__control {
    background: @white;
    padding-left: 2px;
    color: #14a0e6;
  }
  .twocontrol /deep/ .van-field__control {
    background: @white;
    padding-left: 2px;
    color: #999999;
  }

  .changecol2 {
    /deep/ .van-field__control {
      background: @white;
      padding-left: 2px;
      color: #333333;
    }
  }
  .herbalLine {
    margin: 0 22px;
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

.diagsName {
  background: #f5f5f5;
  color: #333333;
  padding: 8px;
  .font-size-md;
  margin-top: 8px;
  margin-right: 8px;
}

.addZdDiv {
  margin-top: 8px;
}

.editHerbalZd {
  margin-top: 8px;
  background: #f5f5f5 !important;
  .bzName {
    padding-left: 8px;
    .font-login-color;
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
</style>
