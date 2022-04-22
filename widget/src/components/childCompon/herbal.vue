<template>
  <div class="herbal">
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
        草药方
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
            开成药方
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
        span="6"
        @click="saveUserdCf"
        class="leftBtn font-blod-2 black-font font-size-md"
      >
        <span v-if="pageType == 'cf'">另存为常用</span>
      </van-col>
      <van-col span="12" class="black-font font-blod-3 font-size-lg">
        草药方
      </van-col>
      <van-col @click="deleCf" span="6" class="rightBtn font-size-md">
        <img
          src="../../assets/img/cf/deleteCf.png"
          class="icon-width-height-sm"
        />
      </van-col>
    </van-row>

    <div
      class="drugList minHeight"
      ref="drugList"
      :style="{
        background:
          drugList.length == 0
            ? 'url(' + require('../../assets/img/cf/bgg.png') + ')'
            : '',
        backgroundRepeat: drugList.length == 0 ? 'no-repeat' : '',
        backgroundSize: drugList.length == 0 ? '50%' : '',
        backgroundPosition: drugList.length == 0 ? 'center' : ''
      }"
    >
      <div class="drugDiv">
        <div v-for="(item, index) in drugList" :key="index" class="oneDrug">
          <img
            src="../../assets/img/cf/delete.png"
            class="icon-width-height-sm-16 delDrugIcon"
            @click="deleteDrug(index)"
          />
          <li class="drugNameLi display-div">
            <u class="color3">{{ item.drugName }}</u>
          </li>
          <li class="setDiv display-div">
            <u class="dduName" @click="showPcjf(item, index)">
              <span v-if="!item.dduName">煎服</span>
              <span v-else>{{ item.dduName }}</span>
            </u>
            <u class="display-div">
              <van-stepper
                min="0"
                max="99.9"
                allow-empty
                v-model="item.quan"
                ref="addDduName"
                :show-plus="false"
                default-value=" "
                :show-minus="false"
                @focus="focusQuan(item, index)"
                @blur="restrictNum(item, index)"
                :decimal-length="1"
              />
              <span class="font-size-lg">{{ item.unit }}</span>
            </u>
          </li>
        </div>
        <div class="addDiv" @click="showAddField" v-show="!showAddPatent">
          <img
            src="../../assets/img/cf/editZd2.png"
            class="editZd icon-width-height-sm-16"
          />
          <span>点击添加药品</span>
        </div>
        <van-field
          class="druginput"
          v-show="showAddPatent"
          ref="addPatent"
          @focus="searchHerbal('focus')"
          @blur="blurInput"
          v-model="herbalName"
          placeholder="点击添加药品"
        />
      </div>
    </div>
    <div class="drugSet" v-show="drugList.length > 0">
      <li
        class="tips font-login-color-red"
        v-if="
          herbalSet.herbalFormulations == '颗粒' && herbal_granules_note_info
        "
      >
        提示：{{ herbal_granules_note_info }}
      </li>
      <van-row class="setMethods">
        <van-col span="8" class="displayCol">
          <span class="labelSpanFor8">用药天数</span>
          <van-stepper
            min="0"
            max="99"
            allow-empty
            @focus="dayListShow = true"
            v-model="herbalSet.days"
            ref="daysNum"
            :show-plus="false"
            :show-minus="false"
            default-value=" "
            @blur="blurNum"
          />
        </van-col>
        <van-col span="8" @click="showJxPicker = true" class="displayCol">
          <span class="labelSpanFor8">用药剂型</span>
          <span class="herbalFormulations">
            <span>{{ herbalSet.herbalFormulations }}</span>
            <img
              src="../../assets/img/cf/down.png"
              class="icon-width-height-sm-16"
            />
          </span>
        </van-col>
        <van-col span="8" class="cfUseMetminhod">
          <span>处方用法：口服</span>
        </van-col>
      </van-row>
      <van-row class="setDay" v-if="parseFloat(herbalSet.days)">
        <van-col
          span="7"
          :class="editValue ? 'displayCol' : 'displayCol editDisplayCol'"
        >
          <span class="labelSpan">用药付数:</span>
          <van-field
            v-model="herbalNum"
            :formatter="formatter"
            maxlength="2"
            input-align="center"
            type="digit"
            :disabled="editValue"
          />
        </van-col>
        <van-col
          span="8"
          :class="editValue ? 'displayCol' : 'displayCol editDisplayCol'"
        >
          <span class="labelSpan">每日几次:</span>
          <van-field
            v-model="rc"
            :formatter="formatter"
            maxlength="2"
            input-align="center"
            type="digit"
            :disabled="editValue"
          />
        </van-col>
        <van-col
          span="7"
          :class="editValue ? 'displayCol' : 'displayCol editDisplayCol'"
        >
          <span class="labelSpan">每日几剂:</span>
          <van-field
            v-model="rj"
            :formatter="formatter"
            maxlength="2"
            input-align="center"
            type="digit"
            :disabled="editValue"
          />
        </van-col>
        <van-col
          span="2"
          class="editImg"
          @click="editValue = false"
          v-if="editValue"
        >
          <img
            src="../../assets/img/chat/edit.png"
            class="icon-width-height-sm-16"
          />
        </van-col>
        <van-col span="2" class="editImg" @click="setHerbal" v-else>
          <img
            src="../../assets/img/cf/finish.png"
            class="icon-width-height-sm-16"
          />
        </van-col>
      </van-row>
    </div>
    <div
      class="diagList black-font"
      ref="herbalListBottom"
      v-show="herbalList.length > 0"
    >
      <span
        v-for="(item, index) in herbalList"
        @click="selectHerbal(item)"
        :key="index"
        >{{ item.drugName }}</span
      >
    </div>
    <div class="diagList dayList" ref="dayListShowBottom" v-show="dayListShow">
      <span
        v-for="(item, index) in dayList"
        @click="selectDay(item)"
        :key="index"
        >{{ item.meaning }}</span
      >
    </div>
    <div class="diagList dayList" ref="numListShowBottom" v-show="numListShow">
      <span
        v-for="(item, index) in numList"
        @click="selectNum(item)"
        :key="index"
        >{{ item.meaning }}</span
      >
    </div>
    <van-popup v-model="showJxPicker" round position="bottom">
      <van-picker
        show-toolbar
        :columns="herbalFormulationsList"
        @cancel="showJxPicker = false"
        :default-index="jxDefaultIndex"
        @confirm="commitJx"
      />
    </van-popup>
    <van-popup v-model="showFrying" position="bottom">
      <li class="fryingTitle display-div font-login-color-blue font-size-md-2">
        <u @click="showFrying = false">取消</u>
        <u @click="selecttsjf">确定</u>
      </li>
      <van-checkbox-group v-model="result" :max="1" icon-size="16">
        <van-checkbox
          v-for="(item, index) in columns"
          :key="index"
          :name="item"
          @click="changeSelect(item)"
        >
          <span :class="result[0] == item ? 'font-login-color-blue' : ''">{{
            item
          }}</span>
        </van-checkbox>
      </van-checkbox-group>
    </van-popup>
  </div>
</template>

<script>
import { findAllDrugNoPage, getDicDrugDecoction } from "../../api/cf";
import myJsTools from "../../utils/myJsTools";
import { Toast } from "vant";
import { getSysCodeByType } from "../../api/scale";
import { getConfigInfoByKey } from "../../api/my";

let timeOut;
export default {
  name: "herbal",
  props: {
    item: {
      default: function() {
        return {};
      },
      type: Object
    },
    index: {
      default: ""
    },
    title: {
      default: ""
    },
    pageType: {
      default: "cf"
    },
    type: {
      default: 3
    },
    cfTypeList: {
      default: function() {
        return [];
      },
      type: Array
    },
    regId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      herbalName: "", //西药搜索名称
      herbalList: [], //西药列表
      showAddPatent: false, //添加西药按
      herbalPopup: false,
      drugList: [], //药品列表
      herbal: {}, //已选择的西药
      herbalSet: {},
      numList: [], //克数字典
      numListShow: false,
      dayList: [], //天数字典
      dayListShow: false,
      editValue: true, //编辑用药付数，几次 几剂
      herbalFormulationsList: [], //剂型列表
      herbal_granules_note_info: "", //颗粒注意事项
      showJxPicker: false, //剂型选择器
      jxDefaultIndex: 0,
      showFrying: false, //特殊煎法选择器
      result: [], //选择结果
      columns: [],
      drugIndex: "", //当前选择的药品id
      herbTimes: 1,
      rc: "2",
      rj: "1",
      herbalNum: ""
    };
  },
  watch: {
    herbalSet: {
      handler() {
        this.herbalSet.drugList = this.drugList;
        let val = {
          cfIndex: this.index,
          cf: this.herbalSet
        };
        if (this.drugList.length > 0) {
          this.$store.commit("editCf", val);
        }
      },
      deep: true
    },
    item: {
      handler() {
        this.setHerbalData();
      },
      deep: true
    },
    herbalName: {
      handler() {
        this.searchHerbal("input");
      },
      deep: true
    },
    "herbalSet.days": {
      handler() {
        if (this.herbTimes == 1 && !this.herbalNum && this.herbalSet.days) {
          this.herbalNum = this.herbalSet.days;
          this.herbTimes++;
        }
      },
      deep: true
    },
    herbalNum: {
      handler() {
        this.setData();
      },
      deep: true
    },
    rc: {
      handler() {
        this.setData();
      },
      deep: true
    },
    rj: {
      handler() {
        this.setData();
      },
      deep: true
    }
  },
  created() {
    this.getTopType();
    this.setHerbalData();
  },
  mounted() {
    this.setDaysNum();
    this.getRoastingMethod();
    if (window.isIOS) {
      window.visualViewport.addEventListener("resize", this.updateBar);
      window.visualViewport.addEventListener("scroll", this.updateBar);
    }
  },
  destroyed() {
    if (window.isIOS) {
      window.visualViewport.removeEventListener("resize", this.updateBar, true);
      window.visualViewport.removeEventListener("scroll", this.updateBar, true);
    }
  },
  methods: {
    setHerbalData() {
      this.drugList = this.item.drugList;
      this.herbalSet = this.item;
      this.herbalNum = this.herbalSet.herbalNum;
      this.rc = this.herbalSet.rc || 2;
      this.rj = this.herbalSet.rj || 1;
    },
    setData() {
      this.herbalSet.herbalNum = this.herbalNum;
      this.herbalSet.rc = this.rc;
      this.herbalSet.rj = this.rj;
    },
    updateBar() {
      this.$nextTick(() => {
        var herbalListBottom = this.$refs.herbalListBottom;
        var dayListShowBottom = this.$refs.dayListShowBottom;
        var numListShowBottom = this.$refs.numListShowBottom;
        this.setBottom(herbalListBottom);
        this.setBottom(dayListShowBottom);
        this.setBottom(numListShowBottom);
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
    formatter(value) {
      let str = "";
      if (value.match(/^[1-9]\d{0,1}$/)) {
        str = value.match(/^[1-9]\d{0,1}$/)[0];
      }
      return str;
    },
    setHerbal() {
      if (
        !this.herbalSet.herbalNum ||
        !this.herbalSet.rc ||
        !this.herbalSet.rj
      ) {
        Toast("请填写用法用量");
        return;
      }
      this.editValue = true;
    },
    //模板开方
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
      if (!this.herbalSet.herbalFormulations) {
        Toast("请选择用药剂型");
        return;
      }
      if (!parseFloat(this.herbalSet.days)) {
        Toast("请填写用药天数");
        return;
      }
      if (!this.herbalSet.herbalNum) {
        Toast("请填写用药付数");
        return;
      }
      if (!this.herbalSet.rc) {
        Toast("请填写每日几次");
        return;
      }
      if (!this.herbalSet.rj) {
        Toast("请填写每日几剂");
        return;
      }
      this.$emit("saveOther", this.index);
    },
    //将草药切换成成药
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
          title: item.meaning,
          name: item.name
        };
        myJsTools.setItem("preType", item.code);
        this.$store.commit("switchCf", val);
      }
    },
    //特殊煎法选择
    changeSelect(e) {
      if (this.result.length == 0) {
        this.result = [];
      } else {
        this.result = [e];
      }
    },
    //天数失焦的时候去隐藏天数配置
    blurNum() {
      setTimeout(() => {
        this.dayListShow = false;
      }, 300);
    },
    //设置特殊煎法
    selecttsjf() {
      let item = this.drugList[this.drugIndex];
      if (this.result.length == 0) {
        item.dduName = "";
      } else {
        item.dduName = this.result[0];
      }
      let val = {
        drugVal: item,
        cfIndex: this.index,
        index: this.drugIndex,
        type: "edit"
      };
      this.$store.commit("setDrugOne", val);
      this.showFrying = false;
    },
    showPcjf(item, index) {
      this.result = [];
      this.showFrying = true;
      this.drugIndex = index;
    },
    setDaysNum() {
      if (!this.herbalSet.days) {
        this.$nextTick(() => {
          this.$refs.daysNum.$el.children[1].value = "";
        });
      }
    },
    commitJx(value, index) {
      this.herbalSet.herbalFormulations = value;
      this.jxDefaultIndex = index;
      this.showJxPicker = false;
    },
    // 获取草药特殊煎法
    getRoastingMethod() {
      getDicDrugDecoction().then(res => {
        for (let i = 0; i < res.data.length; i++) {
          const element = res.data[i];
          this.columns.push(element.decoctionName);
        }
      });
    },
    //获取克数字典
    getTopType() {
      getSysCodeByType({
        codeType: "022"
      }).then(res => {
        this.numList = res.data;
      });
      getSysCodeByType({
        codeType: "021"
      }).then(res => {
        for (let i = 0; i < res.data.length; i++) {
          this.herbalFormulationsList.push(res.data[i].meaning);
        }
      });
      getSysCodeByType({
        codeType: "024"
      }).then(res => {
        this.dayList = res.data;
      });
      getConfigInfoByKey({
        configKey: "herbal_granules_note_info"
      }).then(res => {
        this.herbal_granules_note_info = res.data.configValue;
      });
    },
    //选择克数
    selectDay(item) {
      this.herbalSet.days = item.meaning;
      if (this.herbTimes == 1) {
        this.herbalSet.herbalNum = this.herbalNum = item.meaning;
        this.herbTimes++;
      }
      this.dayListShow = false;
    },
    //克数聚焦
    focusQuan(item, index) {
      this.drugIndex = index;
      this.numListShow = true;
    },
    selectNum(num) {
      let item = this.drugList[this.drugIndex];
      item.quan = num.meaning;
      let val = {
        drugVal: item,
        cfIndex: this.index,
        index: this.drugIndex,
        type: "edit"
      };
      this.$store.commit("setDrugOne", val);
      this.numListShow = false;
    },
    deleCf() {
      this.$store.commit("deleteCf", this.index);
    },
    deleteDrug(index) {
      let val = {
        index: index,
        cfIndex: this.index
      };
      this.$store.commit("deleteDrug", val);
    },
    // 验证剂量
    restrictNum(item, index) {
      setTimeout(() => {
        console.log(parseFloat(item.quan));
        if (!parseFloat(item.quan)) {
          item.quan = 10;
        }
        item.eachQuan = item.quan;
        let val = {
          drugVal: item,
          cfIndex: this.index,
          index: index,
          type: "edit"
        };
        this.$store.commit("setDrugOne", val);
        this.numListShow = false;
      }, 300);
    },
    searchHerbal(type) {
      let time = 0;
      if (this.herbalName.length > 0) {
        clearTimeout(timeOut);
        if (type == "focus") {
          time = 0;
        } else {
          time = 300;
        }
        timeOut = setTimeout(() => {
          findAllDrugNoPage({
            type: 3,
            docId: myJsTools.getItem("token_info").docId,
            drugName: this.herbalName,
            regId: this.regId
          }).then(res => {
            var data = res.data;
            this.herbalList = data;
          });
        }, time);
      } else {
        this.herbalList = [];
      }
    },
    //选择草药
    selectHerbal(item) {
      for (let i = 0; i < this.drugList.length; i++) {
        if (item.drugId == this.drugList[i].drugId) {
          Toast("已经存在该药品，请重新选择");
          return;
        }
      }
      if (item.drugName) {
        item.herbalNum = ""; //用药克数
        item.dduName = ""; //特殊煎法
      }
      this.herbal = Object.assign({}, item);
      let val = {
        drugVal: this.herbal,
        cfIndex: this.index,
        index: this.herbal.index
      };
      if (this.herbal.index || this.herbal.index == 0) {
        val.type = "edit";
      }
      this.$store.commit("setDrugOne", val);
      this.herbalName = "";
      this.showAddPatent = false;
      this.herbalList = [];
      setTimeout(() => {
        this.$nextTick(() => {
          let item = this.$refs.addDduName[this.drugList.length - 1].$el
            .children[1];
          item.value = "";
          this.numListShow = true;

          item.focus();
        });
      }, 200);
    },
    //失去焦点
    blurInput() {
      if (!this.herbalName) {
        this.showAddPatent = false;
      }
      setTimeout(() => {
        this.herbalList = [];
      }, 500);
    },
    showAddField() {
      this.showAddPatent = true;
      setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.addPatent.focus();
        });
      }, 200);
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
.minHeight {
  min-height: 250px;
}

.drugList {
  margin-top: 12px;
}

/deep/ .van-checkbox {
  padding: 12px 16px;
  justify-content: center;
  .font-size-md-2;
}

/deep/ .van-checkbox__icon {
  display: none;
}

.fryingTitle {
  padding: 10px 16px;
}

.addDiv {
  // background: @page-back;
  .font-login-color;
  margin-top: 8px;
  display: flex;
  .font-size-md;
  align-items: center;
  width: 44%;
  padding: 27px 8px;
  background: #eaf8ff;
  color: #14a0e6;
  .editZd {
    margin-right: 4px;
  }
}

.herbal {
  position: relative;
}

.setMethods {
  display: flex;
  align-items: center;
}

.drugDiv {
  .font-size-md;
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  .van-field {
    width: 48%;
    padding: 27px 8px;
  }

  .oneDrug {
    width: 42%;
    background: #f5f5f5;
    padding: 6px 12px 6px 10px;
    margin-top: 8px;
    position: relative;

    .delDrugIcon {
      position: absolute;
      right: -8px;
      top: -8px;
    }

    /deep/ .van-stepper__input {
      background: #f5f5f5;
      .font-size-lg-2;
      .font-login-color;
      width: 40px;
    }

    .setDiv {
      margin-top: 14px;
      .font-login-color;
      .font-size-md;

      .dduName {
        width: 100%;
      }

      .van-field {
        width: 80%;
        padding: 0;
        margin: 0;
      }

      .van-field__control {
        width: 30%;
      }
    }
  }

  /* 奇数行的样式 */

  .oneDrug:nth-child(odd) {
    margin-right: 9px;
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

.drugSet {
  margin-top: 8px;
  border-top: 1px dashed @back-border;
  padding: 8px 0;
  position: relative;
  bottom: 0;
  width: 100%;
  box-sizing: border-box;
  .black-font;
  .font-size-md;

  .tips {
    margin-bottom: 8px;
  }

  .displayCol {
    display: flex;
    align-items: center;

    /deep/ .van-stepper__input {
      width: 40px;
      height: 34px;
    }
  }

  .labelSpan {
    margin-right: 4px;
  }

  .labelSpanFor8 {
    margin-right: 8px;
  }

  .herbalFormulations {
    display: inline-block;
    background: @page-back;
    width: 40%;
    height: 34px;
    line-height: 34px;
    position: relative;
    text-align: left;
    padding-left: 4px;

    img {
      position: absolute;
      right: 2px;
      top: 9px;
    }
  }

  .cfUseMethod {
    line-height: 34px;
    height: 34px;
  }

  .setDay {
    margin-top: 8px;
    display: flex;
    align-items: center;

    /deep/ .van-field {
      background: @page-back;
      padding: 0;
      margin: 0;
      width: 35%;
      text-align: center;
    }

    .displayCol {
      /deep/ .van-field {
        background: @white;
        padding: 4px 0;
      }
    }

    .editDisplayCol {
      /deep/ .van-field {
        background: @page-back;
        padding: 4px 0;
      }
    }

    .editImg {
      padding-top: 4px;
      justify-content: center;
      display: flex;
    }

    /deep/ .van-field__control:disabled {
      color: @black;
      -webkit-text-fill-color: @black;
    }
  }
}

.herbalPopup {
  height: 50%;
  background: @white;
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
  }

  /deep/ .van-stepper__input {
    width: 64%;
    margin: 0px;
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
    background: #eaf8ff;
    border-radius: 2px;
    text-align: center;
  }
}

/deep/ .van-field {
  padding: 8px;
  margin-top: 8px;
  .font-size-md;
  background: @page-back;
}

.herbal {
  background: @white;
  margin-top: 8px;
  padding: 14px 8px 0px;
  border-radius: 4px;

  .optTitle {
    display: flex;
    align-items: flex-end;
  }

  .van-col {
    text-align: center;
    justify-content: center;
  }

  .rightBtn {
    justify-content: flex-end !important;

    .icon-width-height-sm-16 {
      display: inline-block;
    }
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
  border-top: 1px solid @page-back;
  overflow-y: hidden;
  white-space: nowrap;
  left: 0;
  background: @white;
  .font-size-lg-2;
  left: 0;

  span {
    margin-left: 16px;
  }
}

.druginput /deep/ .van-field__control {
  color: #14a0e6;
}
.druginput {
  background: #eaf8ff;
}

.dayList {
  .font-login-color;

  span {
    padding: 5px 30px;
    background: @page-back;
    border-radius: 13px;
    .font-color-2;
    .font-size-lg;
    margin-left: 8px;
    line-height: 20px;
  }

  span:last-child {
    margin-right: 8px;
  }
}
</style>
