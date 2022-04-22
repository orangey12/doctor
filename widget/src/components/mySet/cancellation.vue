<template>
  <div>
    <navbar title="注销申请"></navbar>
    <div>
      <li class="title">请选择您想注销账户的原因(必选)</li>
      <van-radio-group v-model="radio">
        <van-radio :name="item.val" :key="index" v-for="(item,index) in reason">{{ item.name }}</van-radio>
      </van-radio-group>
      <li class="title">请补充您想要注销账户的原因</li>
      <div class="otherReason">
        <van-field
          v-model="message"
          rows="3"
          maxlength="200"
          autosize
          type="textarea"
          show-word-limit
          placeholder="请输入15字以上描述"
        />
      </div>
    </div>
    <div class="bottomBtn">
      <button class="publicBtn" @click="commit">提交</button>
    </div>
  </div>
</template>

<script>
import Navbar from "../../common/navbar";
import {Toast} from "vant";

export default {
  name: "cancellation",
  components: {Navbar},
  data() {
    return {
      radio:0,
      reason: [{"name": "功能异常：功能故障或者不可用", "val": 0}, {
        "name": "产品建议：功能用得不爽想提建议",
        "val": 1
      }, {"name": "安全问题：密码、数据、隐私等", "val": 2}, {"name": "其他问题", "val": 3}],
      imgSrc:"",
      message:"",
    }
  },
  methods: {
    commit(){
      console.log(this.radio);
      if(this.radio == '3'){
        if(!this.message){
          Toast("请填写意见反馈内容");
          return ;
        }
      }
      this.$router.replace({
        name:"feedbackFinish",
        query:{
          type:'cancellation'
        }
      })
    }
  }
}
</script>

<style scoped lang="less">

.upImg{
  width: 108px;
  height: 108px;
  margin: 12px 16px 0px;
}
.title{
  .font-color-2;
  .font-size-md;
  padding: 4px 16px;
  line-height: 22px;
}
.van-radio-group{
  background: @white;
  .van-radio{
    padding: 12px;
    .black-font;
    .font-size-md;
  }
}
.otherReason{
  background: white;
  padding-bottom: 12px;
}
</style>
