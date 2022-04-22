<template>
  <div class="addPage">
    <navbar title="我的自定义服务"></navbar>
    <div class="addService">
      <div class="serviceInfo">
        <li class="titleTips">
          <span class="line"></span>
          <span>自定义服务</span>
        </li>
        <van-field v-model="customBussTitle" label="服务标题" readonly placeholder="请输入标题">
          <template #button>
            <u class="status font-login-color-red" v-if="status == '0'">待支付</u>
            <u class="status font-login-color-blue" v-if="status == '1'">待服务</u>
            <u class="status font-login-color-blue" v-if="status == '2'">已服务</u>
            <u class="status black-font" v-if="status == '7'">已退费</u>
          </template>
        </van-field>
        <van-field v-model="customBussPrice" type="numbers" readonly label="服务价格" placeholder="请输入价格"/>
        <van-field v-model="customBussMemo" label="服务描述" readonly placeholder="请输入描述" autosize type="textarea"/>
      </div>
      <div class="serviceInfo">
        <li class="titleTips">
          <span class="line"></span>
          <span>自定义服务说明</span>
        </li>
        <div class="tips">
          您可自定义您关于问诊相关服务的信息，自定义后，将以您的自定义信息为准，医院修改，对您的自定义信息不产生影响
        </div>
      </div>
      <div class="bottomBtn" v-if="status == 1">
        <button class="publicBtn" @click="commitService">确认已服务</button>
      </div>
    </div>
  </div>
</template>

<script>
  import Navbar from "../../common/navbar";
  import myJsTools from "../../utils/myJsTools";
  import {findCustomService, getDetailsDicCustomBusiness, updateDocCustomBusinessComplete} from "../../api/myService";
  import {Toast} from "vant";

  export default {
    name: "serviceDetail",
    components: {Navbar},
    data() {
      return {
        customBussMemo: "",
        customBussPrice: "",
        customBussTitle: "",
        docId: "",
        customId: "",
        customBussinessId: "",
        status:"",
      }
    },
    created() {
      this.docId = myJsTools.getItem("token_info").docId;
      this.status = this.$route.query.status;
      if (this.$route.query.customId) {
        this.customId = this.$route.query.customId;
        this.getDetail();
      }
      if (this.$route.query.customBussinessId) {
        this.customBussinessId = this.$route.query.customBussinessId;
        this.getDetailById();
      }
    },
    methods: {
      getDetail() {
        getDetailsDicCustomBusiness({
          customId: this.customId
        }).then(res => {
          console.log(res);
          this.customBussMemo = res.data.customBussMemo;
          this.customBussPrice = res.data.customBussPrice;
          this.customBussTitle = res.data.customBussTitle;
        })
      },
      commitService(){
        updateDocCustomBusinessComplete({
          customBussinessId:this.customBussinessId
        }).then(res=>{
          Toast("已执行");
          this.$router.go(-1);
        })
      },
      getDetailById() {
        findCustomService({
          customBussinessId: this.customBussinessId
        }).then(res => {
          console.log(JSON.stringify(res) + "聊天也查看详情 服务");
          this.customBussMemo = res.data.customBussMemo;
          this.customBussPrice = res.data.customBussPrice;
          this.customBussTitle = res.data.customBussTitle;
        })
      }
    }

  }
</script>

<style scoped lang="less">


  .addService {
    padding: 0 16px;
    .black-font;

    .serviceInfo {
      margin-top: 10px;
      background: @white;
      border-radius: 8px;
      padding: 15px 15px 0px 15px;

      /deep/ .van-cell {
        padding: 15px 0px;
      }

      .titleTips {
        display: flex;
        align-items: center;
        .font-size-md-2;
        .font-blod-2;

        .line {
          background: @blue;
          display: inline-block;
          width: 3px;
          height: 14px;
          margin-right: 10px;
        }

      }

      .tips {
        padding: 15px 0;
        line-height: 21px;
        .font-size-md;
      }
    }
  }
</style>
