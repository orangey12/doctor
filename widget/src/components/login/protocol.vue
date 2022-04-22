<template>
  <div class="protocol">
    <navbar :title="title"></navbar>
    <div v-html="content" class="contentDiv"></div>
  </div>
</template>

<script>
import navbar from "../../common/navbar";
import {findVisitAgreement} from "../../api/my";

export default {
  name: "protocol",
  data() {
    return {
      title: "",
      content: "",
      agreementType: "",
    }
  },
  components: {navbar},
  created() {
    let type = this.$route.query.type;
    if (type == '4') {
      this.title = "服务协议"
      this.agreementType = '4';
    } else if (type == '5') {
      this.title = "隐私政策"
      this.agreementType = '5';
    } else if (type == 3) {
      this.title = "合作协议"
      this.agreementType = '3';
    }
    this.getXy();
  },
  methods: {
    getXy() {
      findVisitAgreement({
        agreementType: this.agreementType
      }).then(res => {
        console.log(res, this.title);
        this.content = res.data.agreementContent;
      })
    }
  }
}
</script>

<style scoped lang="less">


.contentDiv {
  padding: 10px;
  background: @white;
  font-size: @font-size-md;
}
</style>
