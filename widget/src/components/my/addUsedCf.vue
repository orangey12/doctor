<template>
  <div class="cfDetail" id="cfDetail">
    <navbar type="defaultPage" :title="dpmpId?'编辑常用处方':'新增常用处方'">
    </navbar>
    <div class="addPre">
      <div class="diagnosis">
        <li class="display-div">
          <u class="titleTips">
            <span class="line"></span>
            <span class="font-blod-2">处方名称</span>
          </u>
          <u>
            <img src="../../assets/img/my/cfCode.png" v-if="type != '3' && dpmpId" @click="scanUsedCf"
                 class="icon-width-height-sm">
          </u>
        </li>
        <van-field
          v-model="dpmpName"
          class="reasonInput"
          rows="1"
          maxlength="10"
          autosize
          type="textarea"
          placeholder="请输入处方名称"
        />
      </div>
      <zd-com :beforeZdList="beforeZdList" ref="zdCom" @commitDiagList="commitDiagList"></zd-com>
      <cf-com :pageType="pageType"></cf-com>

      <div class="invalidDrug" v-if="noDrugList.length > 0">
        <li class="display-div">
          <u>失效药品{{ noDrugList.length }}种</u>
          <u class="font-login-color-red" @click="noDrugList = []">清空失效药品</u>
        </li>
        <div class="invalidHerbal" v-if="type == '3'">
          <div v-for="(item,index) in noDrugList" :key="index" class="drugOne">
            <li>{{ item.drugName }}</li>
            <li class="display-div setDrug">
              <u class="font-size-md">煎服</u>
              <u><span class="font-size-lg-2">{{ item.quan }}</span> <span class="font-size-lg">g</span></u>
            </li>
          </div>
        </div>
        <div class="invalidpatent drugDiv" v-else>
          <div v-for="(item,index) in noDrugList" :key="index" class="drugOne">
            <li class="drugNameLi display-div">
              <u class="font-login-color">{{ item.drugName }}</u>
              <u class="display-div">
                <span class="font-login-color quanNum">x{{ item.quan }} {{ item.unit }}</span>
              </u>
            </li>
            <li class="useMethod black-font">
              <u>用法: {{ item.dduName }}、每次{{ item.eachQuan }}{{ item.jldw }}、{{ item.ddufName }}、用药{{ item.days }}天</u>
            </li>
          </div>
        </div>

      </div>
      <div class="bottomBtn" v-if="!dpmpId">
        <button class="publicBtn" @click="saveUsedCf">保存</button>
      </div>
      <div class="bottomBtn" v-else>
        <button class="publicWhiteBtn" @click="openSelectPatient">开方</button>
        <button class="publicBtn twoBtn" @click="saveUsedCf">保存</button>
      </div>
    </div>
    <van-popup v-model="numTipsShow" :close-on-click-overlay="false" class="popup">
      <li class="title">库存不足</li>
      <li class="tipsInfo">您的处方中，存在库存不足的药品，请修改药品数量后再发送给患者</li>
      <div class="btns">
        <button @click="numTipsShow=false" class="publicBtn commitBtn">确定</button>
      </div>
    </van-popup>

    <van-popup v-model="usageShow" :close-on-click-overlay="false" class="popup">
      <li class="title">提示</li>
      <li class="tipsInfo">存在未设置用法用量的处方，请您确认</li>
      <div class="btns">
        <button @click="usageShow=false" class="publicBtn commitBtn">确定</button>
      </div>
    </van-popup>
    <van-popup v-model="codeShow" class="scanPopup">
      <li class="title">处方码</li>
      <div>
        <qrcode :qr-url='hbCodeUrl' :qr-size='250' v-if="hbCodeUrl"></qrcode>
        <li>扫一扫开处方</li>
      </div>
    </van-popup>
  </div>
</template>

<script>
import navbar from "@/common/navbar";
import qrcode from "../../common/qrcode";
import {
  dicdrugusage,
  addDoccommonprescription,
  findDocCommonPrescriptionDetail,
  deleteDoccommonprescription, getDrugPrescriptionPreInfo, checkDrugStorage, checkScanCodePrescription
} from "../../api/cf.js";
import {Toast, Dialog} from "vant";
import myJsTools from "../../utils/myJsTools";
import CfCom from "../childCompon/cfCom";
import ZdCom from "../childCompon/zdCom";
import {createAutoWxQrCode} from "../../api/docList";
import {getSysPlatformConfigBykey} from "../../api/login";

export default {
  name: "addUsedCf",
  components: {ZdCom, CfCom, navbar, qrcode},
  data() {
    return {
      index: 0,
      dpmpName: "",
      dpmpId: "",
      noDrugList: [],
      pageType: "usedCf",
      type: "",
      usageShow: false,
      selectedDiagList: [],
      beforeZdList: [],
      codeShow: false,
      hbCodeUrl: "",
      numTipsShow:false,
    };
  },
  computed: {
    cfList() {
      return this.$store.getters.getCfList;
    }
  },
  beforeCreate() {
    this.$store.commit("UPDATE_KEEP_ALIVE", {
      keepAlive: "addUsedCf"
    });
  },
  beforeDestroy() {
    this.$refs.zdCom.zdListPopup = false;
    this.$refs.zdCom.zxListPopup = false;
    this.$refs.zdCom.zxList = [];
    this.$refs.zdCom.diagList = [];
  },
  created() {
    this.type = this.$route.query.prescriptionType;
    if (this.$route.query.dpmpId) {
      this.dpmpId = this.$route.query.dpmpId;
      this.hbCodeUrl = this.dpmpId;
      this.dpmpName = this.$route.query.dpmpName;
      this.getDetail();
      this.pageType = 'editUserdCf';
    } else {
      if (this.cfList.length == 0) {
        let type, name;
        type = myJsTools.getItem("preType") || '1';
        name = type == '3' ? 'herbal' : 'patent'
        let value = {
          type: type,
          drugList: [],
          name: name
        }
        this.$store.commit("setCfList", value);
      }
    }
  },
  mounted() {
  },
  methods: {
    //诊断组件返回值
    commitDiagList(value) {
      this.selectedDiagList = value;
    },
    scanUsedCf() {
      this.hbCodeUrl = "";
      if (this.selectedDiagList.length == 0) {
        Toast("请输入诊断");
        return;
      }
      if (this.noDrugList.length > 0) {
        Toast("您的处方中含有失效药品，请先删除");
        return;
      }
      if (this.cfList.length == 1 && this.cfList[0].drugList.length == 0) {
        Toast("至少添加一个药品");
        return;
      }
      let drugList = [];
      let list = this.cfList[0].drugList;
      for (let i = 0; i < list.length; i++) {
        let el = list[i];
        if (list.type == '3') {
          drugList.push({
            drugId: el.drugId,
            quan: parseFloat(parseFloat(el.quan) * parseFloat(list.herbalNum)).toFixed(2)
          })
        } else {
          drugList.push({
            drugId: el.drugId,
            quan: el.quan
          })
        }
      }
      getSysPlatformConfigBykey({
        configKey: "fast_prescribe"
      }).then(res => {
        if(res.data.configValue != '1'){
          checkDrugStorage({
            drugList: drugList,
            drugNum: drugList.length,
            drugstoreId: myJsTools.getItem("docAllInfo").drugstoreId
          }).then(response => {
            if (response.data.checkDrugStorage == '0') {
              this.numTipsShow = true;
            } else if (response.data.checkDrugStorage == '1') {
              this.saveUsedCf('scan');
            }
          })
        }else{
          checkScanCodePrescription({
            drugList: drugList,
            drugNum: drugList.length,
            docId: myJsTools.getItem("token_info").docId
          }).then(response => {
            if (response.data.checkDrugStorage == '0') {
              this.numTipsShow = true;
            } else if (response.data.checkDrugStorage == '1') {
              this.saveUsedCf('scan');
            }
          })
        }
      })
    },
    //跳转到选择正在问诊中的患者界面
    openSelectPatient() {
      if (this.noDrugList.length > 0) {
        Toast("您的处方中含有失效药品，请先删除");
        return;
      }
      this.$store.commit("UPDATE_KEEP_ALIVE", {
        keepAlive: "addUsedCf",
        type: 1,
      });
      this.$router.push({
        name: "nowPatient",
        query: {
          dpmpId: this.dpmpId
        }
      })
    },
    //另存为常用
    saveUsedCf(type) {
      if (!this.dpmpName) {
        Toast("请填写处方名称");
        return;
      }
      if (this.noDrugList.length > 0) {
        Toast("您的处方中含有失效药品，请先删除");
        return;
      }
      if (this.cfList.length == 1 && this.cfList[0].drugList.length == 0) {
        Toast("至少添加一个药品");
        return;
      }

      for (let i = 0; i < this.cfList.length; i++) {
        let item = this.cfList[i];
        if (item.drugList.length > 0) {
          if (item.type == '3') {
            if (!item.days || !item.herbalFormulations || !item.herbalFormulations || !item.herbalNum || !item.rc || !item.rj) {
              this.usageShow = true;
              return;
            }
          }
        }
      }

      let cfInfo = this.cfList[0];
      let info = myJsTools.getItem("docAllInfo");
      let param = {
        deptId: info.deptId,
        deptName: info.deptName,
        docId: info.docId,
        docName: info.docName,
        dpmpName: this.dpmpName,
        drugPrescriptionDetailPres: cfInfo.drugList,
        prescriptionType: cfInfo.type,
        diags: this.selectedDiagList,
        drugstoreId: info.drugstoreId
      }
      if (this.dpmpId) {
        param.dpmpId = this.dpmpId;
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
        this.showPicker = false;
        if(type != 'scan'){
          this.dpmpName = "";
          this.clearAlive();
          this.$store.commit("UPDATE_KEEP_ALIVE", {
            keepAlive: "addUsedCf",
            type: 1,
          });
          this.$router.go(-1);
        }else{
          createAutoWxQrCode({
            codeType:"D_D_1",
            description:this.dpmpName,
            urlStr:"docId=" + myJsTools.getItem("token_info").docId + "&hosId=" + myJsTools.getItem("token_info").hosId + "&dpmpId=" + this.dpmpId
          }).then(res=>{
            this.hbCodeUrl = res.data.url;
            this.codeShow = true;
          })
        }
      });
    },
    // 清楚缓存
    clearAlive() {
      this.$store.commit("setAllCfList", []);
    },

    getDetail() {
      findDocCommonPrescriptionDetail({dpmpId: this.dpmpId, docId: myJsTools.getItem("token_info").docId}).then(res => {
        console.log("常用处方详情", res);
        let data = res.data
        this.noDrugList = data.noDrugList;
        let type = this.$route.query.prescriptionType;
        this.beforeZdList = data.diags;
        data.type = type;
        data.name = type == '3' ? 'herbal' : 'patent'
        let val = {
          cfIndex: 0,
          cf: data,
        }
        myJsTools.setItem("preType",type);
        this.$store.commit("editCf", val);
      });
    },
    // 保存处方
    getSaveList() {
      if (!this.dpmpName) {
        Toast("请输入处方名称");
        return;
      }
      for (var i = 0; i < this.herbList.length; i++) {
        for (var j = 0; j < this.herbList[i].length; j++) {
          this.herbList[i][j].quan = this.herbList[i][j].sendNum + "";
          this.herbList[i][j].eachQuan = this.herbList[i][j].sendNum + "";
          this.herbList[i][j].drugId = this.herbList[i][j].drugId;
          this.herbList[i][j].djdName = this.herbList[i][j].pcjf;
          this.herbList[i][j].day = 0;
          this.herbList[i][j].days = 0;
          this.herbList[i][j].ddfCode = "";
          this.herbList[i][j].dduName = "";
          this.herbList[i][j].ddufName = "";
          this.herbList[i][j].times = 0;

          delete this.herbList[i][j].pcjf;
          delete this.herbList[i][j].total;
          delete this.herbList[i][j].unit;
          delete this.herbList[i][j].gg;
          delete this.herbList[i][j].sendNum;
          delete this.herbList[i][j].scqy;
          delete this.herbList[i][j].price;
          delete this.herbList[i][j].jldw;
          delete this.herbList[i][j].bzsl;
          delete this.herbList[i][j].cfType;
          delete this.herbList[i][j].drugName;
        }
      }
      let arr = [];
      console.log(this.medicineList);
      for (var i = 0; i < this.medicineList.length; i++) {
        for (var j = 0; j < this.medicineList[i].length; j++) {
          console.log(this.medicineList[i], "this.medicineList[i]");
          this.medicineList[i][j].quan = this.medicineList[i][j].sendNum + "";
          this.medicineList[i][j].eachQuan = this.medicineList[i][j].dosage;
          this.medicineList[i][j].drugId = this.medicineList[i][j].drugId;
        }
      }

      var drugPrescriptionMasterPre;
      for (var i = 0; i < this.medicineList.length; i++) {
        arr = arr.concat(this.medicineList[i]);
        drugPrescriptionMasterPre = {
          docId: this.$route.query.docId,
          docName: this.$route.query.docName,
          dpmpName: this.condition,
          prescriptionType: "1"
        };
      }

      for (var i = 0; i < this.herbList.length; i++) {
        console.log("this.herbList[i]", this.herbList[i]);
        arr = arr.concat(this.herbList[i]);
        drugPrescriptionMasterPre = {
          dduName: "",
          docId: this.$route.query.docId,
          docName: this.$route.query.docName,
          dpmpName: this.condition,
          prescriptionType: "3"
        };
      }
      var pro = {
        docId: this.$route.query.docId,
        docName: this.$route.query.docName
      };

      if (this.dpmpId) {
        pro.dpmpId = this.dpmpId;
        drugPrescriptionMasterPre.dpmpId = this.dpmpId;
      }
      var data = {
        docCommonPrescription: pro,
        drugPrescriptionDetailPres: arr,
        drugPrescriptionMasterPre: drugPrescriptionMasterPre
      };
      console.log("请求参数", data);
      addDoccommonprescription(data).then(res => {
        this.clearAlive();
        this.$router.go(-1);
      });
    }
  }
};
</script>

<style scoped lang="less">


.addPre {
  height: 90vh;
  box-sizing: border-box;
  overflow: scroll;
}

.addPre {
  background: @page-back;
  padding: 8px 8px 70px;

  .diagnosis {
    background: @white;
    padding: 9px 16px 21px 16px;
    text-align: left;
    .black-font;
    .font-size-md;
    border-radius: 4px;
    line-height: 20px;

    /deep/ .van-field__control {
      border: 0.5px solid @page-back;
      padding: 12px;
      min-height: 80px;
      box-sizing: border-box;
    }

    /deep/ .van-cell {
      padding: 10px 0;
    }
  }
}

.invalidDrug {
  background: @white;
  padding: 8px;
  margin-top: 8px;
}

.invalidHerbal {
  display: flex;
  flex-wrap: wrap;
  .black-font;
  .font-size-md;

  .drugOne {
    background: @page-back;
    width: 42%;
    margin-top: 8px;
    padding: 11px 10px;
    border-radius: 2px;
    .font-login-color;
    .font-size-md-2;

    .setDrug {
      margin-top: 14px;
    }
  }

  .drugOne:nth-child(odd) {
    margin-right: 9px;
  }
}

.drugDiv {
  .font-size-md;

  .drugNameLi {
    background: @page-back;
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

.scanPopup{
  width: 80%;
  text-align: center;
  border-radius: 8px;
  padding-bottom: 22px;
  .font-size-lg;
  .black-font;
  .title{
    background: @blue;
    padding: 19px 0 14px;
    margin-bottom: 19px;
    .white-font;
    .font-size-md;
  }
}

</style>
