<template>
  <div class="hisPlanDetail">
    <navbar title="随访计划详情"></navbar>
    <div>
      <plandetail-com :id="id" :plsId="plsId" type="carried"></plandetail-com>
    </div>
  </div>
</template>

<script>
import Navbar from "../../common/navbar";
import PlandetailCom from "./plandetailCom";
export default {
  name: "hisPlanDetail",
  components: { PlandetailCom, Navbar },
  data() {
    return {
      id: "",
      plsId: 0
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.plsId = this.$route.query.plsId;
  }
};
</script>

<style scoped></style>
