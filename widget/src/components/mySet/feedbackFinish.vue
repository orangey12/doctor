<template>
  <div>
    <navbar title="意见反馈"></navbar>
    <div class="emptyDiv">
      <img src="../../assets/img/my/finish.png" class="emptyIcon">
     <div  v-if="type == 'cancellation'">
       <li>
         已接收到您的注销申请，我们会尽快
       </li>
       <li>处理</li>
     </div>
      <div v-else>
        <li>
          您的反馈已提交，我们会尽快改进
        </li>
        <li>
          敬请期待
        </li>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "../../common/navbar";
export default {
  name: "feedbackFinish",
  components: {Navbar},
  data(){
    return{
      type:"",//页面类型 cancellation 为注销申请
    }
  },
  created() {
    this.type = this.$route.query.type;
  }
}
</script>

<style scoped lang="less">
.emptyDiv{
  padding-top: 30%;
  .emptyIcon{
    width: 64px;
    height: 64px;
  }
}
</style>
