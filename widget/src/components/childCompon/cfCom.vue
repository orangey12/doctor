<template>
  <div class="cfList">
    <div v-for="(item,index) in cfList" :key="index">
      <transition mode="out-in" name="component-fade">
        <component :regId="regId" v-bind:is="item.name" ref="cfList" @saveOther="saveOther" :type="item.type" :cfTypeList="cfTypeList"
                   @showMoreCFType="showMoreCFType" :pageType="pageType"
                   :item="item.name == 'patent'?item.drugList:item"
                   :index="index" :key="index"></component>
      </transition>
    </div>
    <van-action-sheet
      v-model="showAction"
      :actions="actions"
      cancel-text="取消"
      close-on-click-action
      style="width:100%"
      @select="selectCfType"
    />
    <van-popup v-model="showPicker" position="bottom" class="savePopup" >
      <navbar title="另存为常用处方" @quit="showPicker = false" :is-popup="true"></navbar>
      <div :style="{'margin-top':paddingTop + 'px'}" class="cfName">
        <li class="titleTips" >
          <span class="line"></span>
          <span>处方名称</span>
        </li>
        <van-field
          v-model="dpmpName"
          rows="3"
          autosize
          type="textarea"
          placeholder="请输入10个字以内的处方名称"
          maxlength="10"
          show-word-limit
        />
      </div>
      <zd-com ref="zdCom" type="saveOther" @commitDiagList="commitDiagList"></zd-com>
      <div class="bottomBtn">
        <button class="publicWhiteBtn" @click="showPicker = false">取消</button>
        <button class="publicBtn twoBtn" @click="saveUsedCf">完成</button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import {Toast} from "vant";
import {addDoccommonprescription} from "../../api/cf";
import {getSysCodeByType} from "../../api/scale";
import Herbal from "./herbal";
import Patent from "./patent";
import ZdCom from "./zdCom";
import Navbar from "../../common/navbar";
import myJsTools from "../../utils/myJsTools";

export default {
  name: "cfCom",
  components: {Navbar, ZdCom, Herbal, Patent},
  props: {
    pageType: {
      default: "cf",
      type: String
    },
    docInfo: {
      type: Object,
      default() {
        return {};
      }
    },
    regId:{
      type:String,
      default:""
    }
  },
  data() {
    return {
      cfTypeList: [],//处方类型列表
      drugSaveOtherIndex: "",//另存为常用处方时的处方index
      showAction: false,//多种处方类型时，弹出展示框
      actions: [],//处方类型列表
      showPicker: false,//另存为常用处方弹框
      dpmpName: "",//处方名称
      selectedDiagList: [],//另存为常用诊断
      paddingTop:"",
    }
  },
  computed: {
    cfList() {
      return this.$store.getters.getCfList;
    }
  },
  created() {
    this.getCfListType();
    this.paddingTop = myJsTools.getItem("headerHeight");
  },
  methods: {
    //诊断组件返回值
    commitDiagList(value) {
      this.selectedDiagList = value;
    },
    showMoreCFType(val) {
      this.showAction = true;
      this.actions = [];
      this.cfIndex = val.cfIndex;
      for (let i = 0; i < this.cfTypeList.length; i++) {
        if (this.cfTypeList[i].code != val.type) {
          this.actions.push({
            name: this.cfTypeList[i].meaning,
            code: this.cfTypeList[i].code,
            assemblyName: this.cfTypeList[i].name
          })
        }
      }
    },
    selectCfType(item) {
      let val = {
        type: item.code,
        cfIndex: this.cfIndex,
        name: item.assemblyName,
      }
      myJsTools.setItem("preType",item.code);
      this.$store.commit("switchCf", val)
    },
    saveOther(index) {
      this.showPicker = true;
      this.drugSaveOtherIndex = index;
    },
    //另存为常用
    saveUsedCf() {
      if (!this.dpmpName) {
        Toast("请填写处方名称");
        return;
      }
      let cfInfo = this.cfList[this.drugSaveOtherIndex];
      let param = {
        deptId: this.docInfo.defaultDeptId,
        deptName: this.docInfo.defaultDeptName,
        docId: this.docInfo.docId,
        docName: this.docInfo.docName,
        dpmpName: this.dpmpName,
        drugPrescriptionDetailPres: cfInfo.drugList,
        prescriptionType: cfInfo.type,
        diags: this.selectedDiagList
      }
      if (cfInfo.type == '3') {
        param.days = cfInfo.days;
        param.dduName = "口服";
        param.rc = cfInfo.rc;
        param.rj = cfInfo.rj;
        param.herbalNum = cfInfo.herbalNum;
        param.herbalFormulations = cfInfo.herbalFormulations;
      }
      addDoccommonprescription(param).then(res => {
        this.dpmpName = "";
        this.showPicker = false;
        Toast("保存成功");
      });
    },
    //获取可开方的类型
    getCfListType() {
      getSysCodeByType({
        codeType: "027"
      }).then(res => {
        let data = res.data;
        for (let i = 0; i < data.length; i++) {
          if (data[i].code == '3') {
            data[i].name = 'herbal'
          } else {
            data[i].name = 'patent'
          }
        }
        this.cfTypeList = res.data;
      });
    },
  },
}
</script>

<style scoped lang="less">

.component-fade-enter-active, .component-fade-leave-active {
  transition: opacity .5s ease;
}

.component-fade-enter, .component-fade-leave-to
  /* .component-fade-leave-active for below version 2.1.8 */ {
  opacity: 0;
}

.savePopup {
  height: 100%;
  padding: 8px;
  background: @page-back;
  box-sizing: border-box;
}

.cfName{
  padding: 8px 12px;
  background: @white;
  border-radius: 8px;
  /deep/ .van-cell{
    margin: 12px 0 0;
    border: 0.5px solid @back-border;
  }
}
</style>
