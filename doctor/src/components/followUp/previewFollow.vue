<template>
  <div class="previewFollow">
    <navbar title="预览"></navbar>
    <div class="followDetail">
      <li class="title">{{ planName }}</li>
      <p class="content">
        {{ planContent }}
      </p>
      <img :src="planImg" class="followImg" v-if="planImg" />
      <li class="followTabel titleTips" v-if="visitRealType" @click="openVisit">
        <u>
          <span class="line"></span>
          <span>出诊表</span>
        </u>
        <u class="font-login-color-blue">查看</u>
      </li>
      <li class="followTabel titleTips" v-if="didOnlyId" @click="openScaleDetail">
        <u>
          <span class="line"></span>
          <span>量表</span>
        </u>
        <u class="font-login-color-blue">查看</u>
      </li>
    </div>
    <div class="bottomBtn">
      <button class="publicWhiteBtn" @click="cancelLook">取消</button>
      <button class="publicBtn twoBtn" @click="savePlan">保存</button>
    </div>
  </div>
</template>

<script>
import Navbar from "../../common/navbar";
export default {
  name: "previewFollow",
  components: { Navbar },
  data() {
    return {
      didId: "",
      docId: "",
      planContent: "",
      planImg: "",
      planName: "",
      visitRealType: ""
    };
  },
  created() {
    let query = this.$route.query;
    this.docId = query.docId;
    this.didOnlyId = query.didOnlyId;
    this.planContent = query.planContent;
    this.planImg = query.planImg;
    this.planName = query.planName;
    this.visitRealType = query.visitRealType;
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
    //查看量表详情
    openScaleDetail() {
      this.$router.push({
        name: "sendScaleDetail",
        query: {
          didOnlyId: this.didOnlyId,
          type: "look" //只查看
        }
      });
    },
    openVisit() {
      let param = {
        type: "look" //只查看
      };
      if (this.visitRealType == 1) {
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
  padding: 16px 16px 80px 16px;
  .title {
    padding-top: 17px;
    .black-font;
    .font-size-lg-2;
    .font-blod-2;
    line-height: 25px;
    text-align: center;
  }
  .content {
    .black-font;
    .font-size-md;
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
