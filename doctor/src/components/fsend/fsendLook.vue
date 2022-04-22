<template>
  <div class="previewFollow">
    <navbar title="预览"></navbar>
    <div class="followDetail">
      <li class="title">{{ infoDetail.planName }}</li>
      <p class="content">
        {{ infoDetail.sendContent }}
      </p>
      <img v-zlazy="infoDetail.sendImg" class="followImg" v-if="infoDetail.sendImg" />
      <li class="followTabel" v-if="infoDetail.visitRealType" @click="openVisit">
        <u>
          <span class="line"></span>
          <span>出诊表</span>
        </u>
        <u class="font-login-color-blue">查看</u>
      </li>
      <li class="followTabel" v-if="infoDetail.didId" @click="openScaleDetail">
        <u>
          <span class="line"></span>
          <span>量表</span>
        </u>
        <u class="font-login-color-blue">查看</u>
      </li>
    </div>
    <div class="bottomBtn" v-if="type!='look'">
      <button class="publicWhiteBtn" @click="cancelLook">取消</button>
      <button class="publicBtn twoBtn" @click="savePlan">发送</button>
    </div>
  </div>
</template>

<script>
  import Navbar from "../../common/navbar";
  import {getDocBulkDetails} from "../../api/fsend";
  import ossUpDown from "../../utils/ossUpDown";
  import myJsTools from "../../utils/myJsTools";
  export default {
    name: "previewFollow",
    components: { Navbar },
    data() {
      return {
        didId: "",
        didOnlyId:"",
        docId: "",
        planContent: "",
        sendImg: "",
        planName: "",
        visitRealType: "",
        infoDetail:{},
        sendId:"",
        type:"",
      };
    },
    created() {
      let query = this.$route.query;
      console.log(JSON.stringify(query));
      this.sendId = this.$route.query.sendId
      if(this.$route.query.sendId){
        this.type = this.$route.query.type
        this.getDetail();
      }else{
        this.infoDetail.docId = query.docId;
        if(query.didOnlyId){
          this.didOnlyId = query.didOnlyId
        }else if(query.sendOnlyId){
          this.sendId = query.sendOnlyId;
        }
        this.infoDetail.didId = query.didId;
        this.infoDetail.sendContent = query.planContent;
        this.infoDetail.sendImg = query.planImg;
        this.infoDetail.planName = query.planName;
        this.infoDetail.visitRealType = query.visitRealType;
      }
    },
    methods: {
      //取消预览
      cancelLook() {
        this.$router.go(-1);
      },

      //保存随访计划
      savePlan() {
        api.sendEvent({
          name: "savePlan",
        });
        this.$router.go(-1);
      },
      // 点击详情预览
      getDetail() {
        getDocBulkDetails({
          sendId: this.$route.query.sendId
        }).then(async res => {
          let info = res.data;
          console.log(JSON.stringify(res));
          if(this.$route.query.pageType == 'admin'){
            info.sendImg = JSON.parse(info.sendImg)[0];
          }
          this.infoDetail = Object.assign({}, info);
        });
      },
      //查看量表详情
      openScaleDetail() {
        let query = {
          type: "look" //只查看
        }
        if(this.sendId){
          query.sendId= this.sendId;
        }else{
          query.didOnlyId = this.didOnlyId;
        }
        this.$router.push({
          name: "sendScaleDetail",
          query:query
        });
      },
      openVisit() {
        let param = {
          type: "look"//只查看

        };
        if (this.infoDetail.visitRealType == '1') {
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
      }
    }
  };
</script>

<style scoped lang="less">

  .followDetail {
    .black-font;
    .font-size-md;
    padding: 16px 16px 80px 16px;
    .title {
      padding-top: 17px;
      .font-size-lg-2;
      .font-blod-2;
      line-height: 25px;
      text-align: center;
    }
    .content {
      line-height: 20px;
      margin-top: 12px;
    }
    .followImg {
      width: 100%;
      margin-top: 8px;
    }
    .followTabel {
      justify-content: space-between;
      align-items: center;
      .black-font;
      .font-size-lg;
      padding: 14px 0;
      line-height: 22px;
      .line {
        width: 3px;
        height: 14px;
        border-radius: 1px;
        margin-right: 9px;
        display: inline-block;
        background: @blue;
      }
      u:first-child {
        width: 85%;
      }
    }
  }
</style>
