<template>
    <div class="eleRecordDetail">
      <navbar title="电子病历详情"></navbar>
      <detail :emrId="emrId"></detail>
    </div>
</template>

<script>
    import Navbar from "../../common/navbar";
    import Detail from "./detail";
    export default {
        name: "eleRecordDetail",
      components: {Detail, Navbar},
      data(){
          return{
            emrId:"",
          }
      },
      created() {
        this.emrId = this.$route.query.emrId;
      },
    }
</script>

<style scoped>

</style>
