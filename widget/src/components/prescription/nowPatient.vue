<template>
  <div>
    <navbar title="选择患者"></navbar>
    <div class="patientList">
      <div class="searchField" :style="{'top': paddingTop + 'px'}">
        <van-form action="/">
          <van-search
            v-model="patientName"
            placeholder="搜索患者名称"
            :clearable="true"
            @clear="getPatientList"
            @search="getPatientList"
            :left-icon="searchIcon"
          />
        </van-form>
      </div>
      <van-index-bar :index-list="indexList" :sticky="false" :style="{'padding-top': parseInt(paddingTop - 40) + 'px'}">
        <div v-for="(item, key, index) in patientList" :key="index">
          <van-index-anchor
            :index="key != '☆' ? key : '☆ 星标用户'"
            style="background:#F5F5F5;"
          ></van-index-anchor>
          <div class="list" v-for="(val, i) in item" :key="i" >
            <div class="item" @click="openPre(val)">
              <img v-zlazy="val.patientImg" :key="val.patientId" class="img-width-height-sm" data-type="headImg"/>
              <span>{{ val.patientNameMemo }}</span>
            </div>
          </div>
        </div>
      </van-index-bar>
    </div>

  </div>
</template>

<script>
import {getDocChatListReceive} from "../../api/pictrue";
import myJsTools from "../../utils/myJsTools";
import Navbar from "../../common/navbar";
import {findPatientListByGroup} from "../../api/patientGroup";
import {getDrugPrescriptionPreInfo} from "../../api/cf";

export default {
  name: "nowPatient",
  components: {Navbar},
  data() {
    return {
      patientList:[],
      patientName:"",
      indexList:[],
      searchIcon: require("../../assets/img/index/search.png"),
      paddingTop:"",
      dpmpId:"",
    }
  },
  created() {
    this.paddingTop = myJsTools.getItem("headerHeight");
    this.dpmpId = this.$route.query.dpmpId;
    this.getCfInfo();
    this.getPatientList();
  },
  methods: {
    openPre(item){
      let query = {
        patientId: item.patientId,
        pageType:"usedCf"
      };
      this.$router.push({
        name: "prescription",
        query: query
      });
    },
    getCfInfo(){
      getDrugPrescriptionPreInfo({
        docId: myJsTools.getItem("token_info").docId,
        dpmpId: this.dpmpId,
      }).then(res => {
        this.setData(res);
      })
    },
    setData(res) {
      let data = res.data;
      data.type = data.prescriptionType;
      data.name = data.prescriptionType == '3' ? 'herbal' : 'patent'
      let val = {
        cfIndex: 0,
        cf: data,
      }
      myJsTools.setItem("passDiags",data.diags);
      myJsTools.setItem("preType",data.prescriptionType);
      this.$store.commit("editCf", val);
    },
    //初始化获取患者列表
    getPatientList() {
      findPatientListByGroup({patientName: this.patientName,docId:myJsTools.getItem("token_info").docId}).then(res => {
        let arrList = [];
        let data = res.data.proPatientList;
        for (let i = 0; i < data.length; i++) {
          let val = data[i];
          val.patientNameMemo = val.memo || val.patientName;
          arrList.push(val);
        }
        let arr = myJsTools.data_letter_sort(arrList, "py");
        this.patientList = arr;
        this.indexList = Object.keys(this.patientList);
      });
    },
  }
}
</script>

<style scoped lang="less">



.searchField {
  position: fixed;
  width: 100%;

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

.list {
  background: @white;
  padding: 0 16px;

  .item {
    display: flex;
    align-items: center;

    img {
      margin-right: 8px;
      padding: 12px 0;
    }

    span {
      .black-font;
      .font-size-md-2;
      line-height: 20px;
    }
  }
}
</style>
