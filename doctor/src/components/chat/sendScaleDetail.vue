<template>
  <div class="sendScaleDetail">
    <navbar title="量表详情"></navbar>
    <detail-com
      :didId="didId"
      :title="title"
      :didOnlyId="didOnlyId"
      :isFeedback="isFeedback"
      :sendId="sendId"
      :isCt="false"
    ></detail-com>
    <div class="bottomBtn" @click="sendScale" v-if="type == 'chat'">
      <button class="publicBtn">发送</button>
    </div>
    <div class="bottomBtn" @click="addPlan" v-if="type == 'plan'">
      <button class="publicBtn">确认添加</button>
    </div>
  </div>
</template>

<script>
import Navbar from "../../common/navbar";
import DetailCom from "../scale/detailCom";
export default {
  name: "sendScaleDetail",
  components: { DetailCom, Navbar },
  data() {
    return {
      didId: "",
      title: "",
      didOnlyId: "",
      type: "",
      sendId: "",
      isFeedback:"detail"
    };
  },
  created() {
    this.didId = this.$route.query.didId;
    this.title = this.$route.query.title;
    this.didOnlyId = this.$route.query.didOnlyId;
    this.sendId = this.$route.query.sendId;
    this.type = this.$route.query.type || "chat";
    this.isFeedback = this.$route.query.isFeedback || 'detail';
  },
  methods: {
    sendScale() {
      let me = this;
      api.sendEvent({
        name: "sendScaleMsg",
        extra: {
          didId: me.didId,
          title: me.title
        }
      });
      this.$router.go(-2);
    },
    //添加到随访计划
    addPlan() {
      let me = this;
      api.sendEvent({
        name: "sendDid",
        extra: {
          didOnlyId: me.didOnlyId,
          title: me.title,
          didId:me.didId
        }
      });
      this.$router.go(-2);
    }
  }
};
</script>

<style scoped lang="less">

</style>
