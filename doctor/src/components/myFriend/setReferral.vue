<template>
  <div class="setReferral">
    <navbar title="转诊设置"></navbar>
    <div class="setDiv">
      <van-row>
        <van-col span="20">是否允许该医生转诊</van-col>
        <van-col span="4"><van-switch size="30px" v-model="checked" @change="changeReferral"/></van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
    import Navbar from "../../common/navbar";
    import {batchSetReferralForDoc} from "../../api/friend";
    import myJsTools from "../../utils/myJsTools";
    export default {
        name: "setReferral",
      components: {Navbar},
      data(){
          return{
            checked:false,
            docId:"",
          }
      },
      created() {
        this.docId = this.$route.query.docId;
        this.checked = this.$route.query.isReferral == '1'?true:false;
      },
      methods:{
        changeReferral(val){
          console.log(val);
          batchSetReferralForDoc({
            docId:myJsTools.getItem("token_info").docId,
            friendList:[this.docId],
            isReferral:val?'1':'0'
          }).then(res=>{
            console.log(res);
          })
        },
      },
    }
</script>

<style scoped lang="less">

  .van-row {
    padding: 12px 16px;
    .black-font;
    .font-size-md;
    line-height: 22px;
    background: @white;
  }
</style>
