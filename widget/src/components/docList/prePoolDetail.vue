<template>
  <div>
    <navbar title="处方详情"></navbar>
    <div class="details">
     <patient-info :info="info"></patient-info>
      <div class="blInfo">
        <li class="title">处方/病历照片</li>
        <div class="imgDiv">
          <img v-zlazy="item" @click="getImgView(index)" v-for="(item,index) in info.medicalImg" :key="index">
          <img src="../../assets/img/index/none.png" v-if="!info.medicalImg">
        </div>
      </div>
      <div class="drugInfoList">
        <li class="title">药品信息</li>
        <div v-for="(item,index) in info.drugInfo" :key="index" class="drugitem">
          <img v-zlazy="item.drugImg" data-type="xyImg" class="img-width-height-lg">
          <div class="drugInfo">
            <li>{{item.drugName}}</li>
            <li class="gg font-login-color font-size-sm">规格： {{item.gg}}</li>
            <li class="display-div priceNumDiv">
              <u class="font-login-color-red font-blod-2">￥{{item.price}}</u>
              <u>x{{item.quan}}</u>
            </li>
          </div>
        </div>
      </div>
      <div class="bottomBtn">
        <button class="publicBtn" @click="recviceOrder">接单</button>
      </div>
      <img-save
        v-if="show"
        :showPic="show"
        :index="index"
        :images="images"
        @changePreview="changePreview"
        @onClose="onClose"
      ></img-save>
    </div>
  </div>
</template>

<script>
import Navbar from "../../common/navbar";
import {
  checkDocIfReceivingOrder,
  queryProPrescriptionPoolListDetail,
  updateProPrescriptionPoolStatus
} from "../../api/cf";
import myJsTools from "../../utils/myJsTools";
import ImgSave from "../../common/imgSave";
import PatientInfo from "../childCompon/patientInfo";

export default {
  name: "prePoolDetail",
  components: {PatientInfo, ImgSave, Navbar},
  data() {
    return {
      orderNo: "",
      info: {},
      show: false,
      images: [],
      index: 0,
    }
  },
  created() {
    this.orderNo = this.$route.query.orderNo;
    this.getDetail();
  },
  methods: {
    getDetail() {
      queryProPrescriptionPoolListDetail({
        orderNo: this.orderNo
      }).then(res => {
        let data = res.data;
        if(data && data.medicalImg){
          data.medicalImg = JSON.parse(data.medicalImg);
        }
        this.info = res.data;
      })
    },
    openPatientInfo() {
      this.$router.push({
        name: "information",
        query: {
          patientId: this.info.patientId,
          docId: myJsTools.getItem("token_info").docId,
          pageType: "doc"
        }
      });
    },
    // 预览图片
    getImgView(index) {
      this.images = this.info.medicalImg;
      this.index = index;
      this.show = true;
    },
    changePreview(index) {
      this.index = index;
    },
    onClose() {
      this.show = false;
    },
    recviceOrder(){
      //验证医生是否可以接单 如果满足条件接单  不满足条件不可以接单
      checkDocIfReceivingOrder({
        orderNo:this.orderNo,
        docId:myJsTools.getItem("token_info").docId
      }).then(res=>{
        updateProPrescriptionPoolStatus({
          docId:myJsTools.getItem("token_info").docId,
          docName:myJsTools.getItem("token_info").docName,
          orderNo: this.info.orderNo
        }).then(res=>{
          this.$router.replace({
            name:"prescription",
            query:{
              type:'prePool',
              goPage:-1,
              orderNo:this.info.orderNo
            }
          })
        })
      })

    },
  }
}
</script>

<style scoped lang="less">


.details {
  padding: 12px 16px 80px;
}

.drugInfoList,.blInfo{
  background: @white;
  border-radius: 8px;
  margin-top: 8px;
  .title{
    margin: 0px 16px;
    padding: 12px 0px;
    border-bottom: 1px solid @back-border;
  }
}

.blInfo{
  .title{
    border: none;
  }
  .imgDiv{
    display: flex;
    padding: 0 0 12px 12px;
    img{
      width: 100px;
      height: 100px;
      margin-right: 9px;
    }
  }
}

.drugInfoList{
  .drugitem{
    padding: 12px 16px 0px;
    display: flex;
    align-items: center;
    .black-font;
    .font-size-md;
    .drugInfo{
      margin-left: 12px;
      width: 100%;
      border-bottom: 1px solid @back-border;
      .gg{
        margin-top: 4px;
      }
      .priceNumDiv{
        margin-top: 19px;
        width: 100%;
        padding-bottom: 11px;
      }
    }
    :last-child{
      border: none;
    }
  }
}
</style>
