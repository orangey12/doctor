<template>
  <div class="personalService">
    <navbar title="个性服务设置"></navbar>
    <div class="settingDiv">
      <van-tabs
        v-model="active"
        title-inactive-color="#333333"
        title-active-color="#14A0E6"
        color="#14A0E6"
        @change="reloadPage"
      >
        <van-tab title="咨询">
          <service-set :active="active" :key="timer"></service-set>
        </van-tab>
        <van-tab title="复诊">
          <service-set :active="active" :key="timer"></service-set>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
    import Navbar from "../../common/navbar";
    import ServiceSet from "../childCompon/serviceSet";
    export default {
        name: "personalService",
      components: {ServiceSet, Navbar},
      data(){
          return{
            active:0,
            timer:"",
          }
      },
      methods:{
        reloadPage(){
          this.timer = new Date().getTime()
        },
      },
    }
</script>

<style scoped>

</style>
