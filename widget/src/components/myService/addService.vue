<template>
  <div class="addPage">
    <navbar :title="customId?'编辑自定义服务':'添加自定义服务'"></navbar>
    <div class="addService">
      <div class="serviceInfo">
        <li class="titleTips">
          <span class="line"></span>
          <span>新增服务</span>
        </li>
        <van-field v-model="customBussTitle" label="服务标题" placeholder="请输入标题" maxlength="20"/>
        <van-field v-model="customBussPrice" type="number" label="服务价格" placeholder="请输入价格"/>
        <van-field v-model="customBussMemo" label="服务描述" placeholder="请输入描述" autosize type="textarea" maxlength="200"/>
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
    </div>
    <div class="bottomBtn" @click="saveService">
      <button class="publicBtn">保存</button>
    </div>
  </div>
</template>

<script>
  import Navbar from "../../common/navbar";
  import myJsTools from "../../utils/myJsTools";
  import {addDicCustomBusiness, getDetailsDicCustomBusiness, updateDicCustomBusiness} from "../../api/myService";
  import {Toast} from "vant";

  export default {
    name: "addService",
    components: {Navbar},
    data() {
      return {
        customBussMemo: "",
        customBussPrice: "",
        customBussTitle: "",
        docId: "",
        customId: "",
      }
    },
    created() {
      this.docId = myJsTools.getItem("token_info").docId;
      if (this.$route.query.customId) {
        this.customId = this.$route.query.customId;
        this.getDetail();
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
      // 保存自定义服务
      saveService() {
        if (!this.customBussTitle) {
          Toast("请输入标题");
          return;
        }
        if (!this.customBussPrice) {
          Toast("请输入价格");
          return;
        }
        if (!this.customBussMemo) {
          Toast("请输入描述");
          return;
        }
        if (this.customBussPrice < 0) {
          Toast("请输入正确的价格");
          return
        } else {
          let reg = /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/
          if (!reg.test(this.customBussPrice)) {
            Toast("请输入两位小数的价格");
            return
          }
        }
        if (this.customId) {
          updateDicCustomBusiness({
            customBussMemo: this.customBussMemo,
            customBussPrice: this.customBussPrice,
            customBussTitle: this.customBussTitle,
            customId: this.customId,
            docId: this.docId
          }).then(res => {
            console.log(res);
            Toast("修改成功");
            this.$router.go(-1);
          })
        } else {
          addDicCustomBusiness({
            customBussMemo: this.customBussMemo,
            customBussPrice: this.customBussPrice,
            customBussTitle: this.customBussTitle,
            docId: this.docId
          }).then(res => {
            console.log(res);
            Toast("添加成功");
            this.$router.go(-1);
          })
        }

      },
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

      .tips {
        padding: 15px 0;
        line-height: 21px;
        .font-size-md;
      }
    }
  }
</style>
