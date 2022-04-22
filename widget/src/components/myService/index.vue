<template>
  <div class="serviceIndex">
    <navbar title="我的服务"></navbar>
    <div class="serviceLi">
      <li @click="openAdvisory">
        <u>咨询设置</u>
        <u>
          <img src="../../assets/img/my/rightArrow.png" class="rightArrow">
        </u>
      </li>
      <li @click="openFollowUp">
        <u>复诊设置</u>
        <u>
          <img src="../../assets/img/my/rightArrow.png" class="rightArrow">
        </u>
      </li>
      <li @click="openServiceSet">
        <u>自定义服务设置</u>
        <u>
          <img src="../../assets/img/my/rightArrow.png" class="rightArrow">
        </u>
      </li>
      <li @click="openZz" class="bottomLi">
        <u>转诊设置</u>
        <u>
          <img src="../../assets/img/my/rightArrow.png" class="rightArrow">
        </u>
      </li>
      <li @click="openCfSee" class="bottomLi">
        <u>处方可见设置</u>
        <u>
          <img src="../../assets/img/my/rightArrow.png" class="rightArrow">
        </u>
      </li>
      <li @click="openSf" class="bottomLi">
        <u>诊断开方身份验证设置</u>
        <u>
          <img src="../../assets/img/my/rightArrow.png" class="rightArrow">
        </u>
      </li>

    </div>
  </div>
</template>

<script>
  import Navbar from "../../common/navbar";

  export default {
    name: "serviceIndex",
    components: {Navbar},
    data() {
      return {}
    },
    created() {

    },
    methods: {
      //  转诊设置
      openZz() {
        this.$router.push({
          name: "zzSet"
        })
      },
      //自定义服务
      openServiceSet() {
        this.$router.push({
          name: "myServiceList"
        })
      },
      //我的咨询
      openAdvisory() {
        this.$router.push({
          name: "myAdvisory"
        })
      },
      //我的咨询
      openFollowUp() {
        this.$router.push({
          name: "myFollowUp"
        })
      },
      //处方可见设置
      openCfSee(){
        this.$router.push({
          name: "cfIsSee"
        })
      },
      //诊断开方设置
      openSf(){
        this.$router.push({
          name: "setDiagnosis"
        })
      }
    }
  }
</script>

<style scoped lang="less">


  .serviceLi {
    .black-font;
    .font-size-md-2;
    line-height: 22px;

    li {
      .display-div;
      padding: 12px 16px;
      border-bottom: 0.5px solid @back-border;
      background: @white;
    }
  }

  .bottomLi {
    border: none;
  }

</style>
