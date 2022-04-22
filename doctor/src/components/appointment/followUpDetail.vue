<template>
  <div>
    <navbar title="随访详情"></navbar>
    <div v-if="info.planName">
      <van-field v-model="info.planName" label="标题" disabled placeholder="标题" />
      <van-field v-model="info.sendContent" label="随访内容" disabled autosize type="textarea" placeholder="随访内容" />
      <van-field v-model="info.planTime" label="创建时间" disabled placeholder="创建时间" />
      <van-field v-model="info.repetitionPeriod" label="重复周期" disabled placeholder="重复周期" />
      <van-field v-model="value" label="随访照片" disabled placeholder="" v-if="info.sendImg"/>
      <div class="imgDiv" v-if="info.sendImg">
        <img v-zlazy="info.sendImg" class="sendImg" @click="show=true">
      </div>
      <van-field v-model="info.status" label="量表" readonly @click="openScale" placeholder="量表" v-if="info.didOnlyId">
        <template #button>
          <img src="../../assets/img/my/rightArrow.png" class="rightArrow">
        </template>
      </van-field>
      <van-field v-model="value" label="出诊表" readonly placeholder="出诊表" @click="openVisit" v-if="info.visitDocId">
        <template #button>
          <img src="../../assets/img/my/rightArrow.png" class="rightArrow">
        </template>
      </van-field>
      <van-field v-model="info.memo" label="备注" disabled placeholder="备注" />
    </div>
    <img-save
      v-if="show"
      :showPic="show"
      :index="index"
      :images="images"
      @changePreview="changePreview"
      @onClose="onClose"
    ></img-save>
    <div class="bottomBtn">
      <button class="publicBtn" @click="stopFollow">终止随访</button>
    </div>
  </div>
</template>

<script>
import Navbar from "../../common/navbar";
import {
  followupQueryPatientPlanImplementationDetails, stopDocFlockDetail
} from "../../api/followUp";
import ImgSave from "../../common/imgSave";
import {Toast} from "vant";

export default {
  name: "followUpDetail",
  components: {ImgSave, Navbar},
  data() {
    return {
      plsId:"",
      value:"",
      info:{},
      show: false,
      images: [],
      index: 0,
    }
  },
  created() {
    this.plsId = this.$route.query.plsId;
    this.getDetail();
  },
  methods: {
    changePreview(index) {
      this.index = index;
    },
    onClose() {
      this.show = false;
    },
    //终止随访
    stopFollow(){
      stopDocFlockDetail({
        patientId:this.$route.query.patientId,
        flockId:this.info.flockId
      }).then(res=>{
        Toast("随访已终止")
      })
    },
    //查看详情
    getDetail() {
      followupQueryPatientPlanImplementationDetails({
        plsId:this.plsId,
        patientId:this.$route.query.patientId,
      }).then(res => {
        if(res.data && res.data.scaleStatus == '1'){
          res.data.status = "已反馈"
        }else{
          res.data.status = "未反馈"
        }
        this.info = Object.assign({},res.data)
      })
    },
    //打开量表
    openScale(){
      this.$router.push({
        name:"sendScaleDetail",
        query:{
          sendId:this.info.sendId,
          type: "look",
          isFeedback:this.info.scaleStatus || '0'
        }
      })
    },
    //打开排班
    openVisit() {
      let param = {
        type: "look" //只查看
      };
      if (this.info.visitRealType == 1) {
        this.$router.push({
          name: "lineCard",
          query: param
        });
      } else {
        this.$router.push({
          name: "onLineCard",
          query: param
        });
      }
    },
  }
}
</script>

<style scoped lang="less">

.imgDiv{
  background: @white;
  padding: 0px 0 9px 16px;
}
.sendImg{
  width: 60px;
  height: 60px;

}
</style>
