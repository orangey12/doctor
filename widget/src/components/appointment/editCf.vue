<template>
  <div class="editCf">
    <navbar title="处方修改" active="3">
      <template slot="rightIcon">
        <span class="font-login-color-blue font-size-md">处方预览</span>
      </template>
    </navbar>
    <div>
      <van-tabs
        v-model="active"
        title-inactive-color="#666666"
        title-active-color="#14A0E6"
        color="#14A0E6"
      >
        <van-tab title="处方详情">
          <div class="editCfBody">
            <cfDetail :businessIdProp="businessId"></cfDetail>
          </div>
        </van-tab>
        <van-tab title="患者病情">
          <patientDetail :regId="regId" :patientId="patientId"></patientDetail>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
  import navbar from "@/common/navbar";
  import cfDetail from "@/components/childCompon/cfDetail";
  import patientDetail from "@/components/childCompon/patientDetail";

  export default {
    components: {navbar, cfDetail, patientDetail},
    name: "editCf",
    data() {
      return {
        active: 0,
        businessId: '',
        regId: '',
        patientId: ''
      };
    },
    beforeCreate() {
      this.$store.commit("UPDATE_KEEP_ALIVE", {
        keepAlive: "editCf"
      });
    },
    created() {
      this.businessId = this.$route.query.businessId
      this.regId = this.$route.query.regId
      this.patientId = this.$route.query.patientId
    },
    methods: {
      // 清楚缓存
      clearAlive() {
        this.$store.commit("UPDATE_KEEP_ALIVE", {
          keepAlive: "editCf",
          type: 1
        });
        this.$router.go(-1);
      },
    }
  };
</script>

<style lang="less" scoped>
</style>
