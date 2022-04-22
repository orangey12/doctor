<template>
  <div class="medicationReason">
    <navbar title="用药理由"></navbar>
    <div class="addReason">
      <van-field
        v-model="reason"
        class="reasonInput"
        rows="1"
        autosize
        type="textarea"
        placeholder="请填写用药理由"
      />
      <button class="commitBtn">提交审核</button>
    </div>
  </div>
</template>

<script>
import navbar from "@/common/navbar";
export default {
  components: { navbar },
  data() {
    return {
      reason: ""
    };
  }
};
</script>

<style lang="less" scoped>
.addReason{
  padding: 0 16px;
  .reasonInput{
    margin-top: 12px;
    border-radius: 4px;
  }
  .commitBtn{
    margin-top: 12px;
    background: #14A0E6;
    border: 1px solid #14A0E6;
    color: #ffffff;
    line-height: 49px;
    border-radius: 26px;
    width: 100%;
  }
}
</style>