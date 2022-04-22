<template>
  <div class="newScale">
    <navbar title="新建量表"></navbar>
    <div class="newScaleFirst">
      <div class="title">
        <li class="titleLi">量表标题</li>
        <van-field
          v-model="title"
          placeholder="请输入量表标题"
          maxlength="20"
        />
      </div>
      <div class="welMsgDiv">
        <li class="titleLi">欢迎语</li>
        <van-field
          :autosize="true"
          rows="2"
          type="textarea"
          v-model="welMsg"
          disabled
          placeholder="请输入量表标题"
        />
      </div>
    </div>
    <div class="bottomBtn" @click="openNewScaleContent">
      <button class="publicBtn">创建量表</button>
    </div>
  </div>
</template>

<script>
import Navbar from "../../common/navbar";
import { Toast } from "vant";
export default {
  name: "newScale",
  components: { Navbar },
  data() {
    return {
      title: "",
      welMsg:
        "感谢您能抽出几分钟时间来参加量表，为了方便医生了解病情，请认真作答，谢谢！"
    };
  },
  methods: {
    //创建量表
    openNewScaleContent() {

      if (!this.title) {
        Toast("请填写量表标题");
        return;
      }
      this.$store.commit("setAllTopic", []);
      this.$router.push({
        name: "newScaleContent",
        query: {
          title: this.title,
          isEdit: false
        }
      });
    }
  }
};
</script>

<style scoped lang="less">

.newScaleFirst {
  padding: 0 16px;
  .title,
  .welMsgDiv {
    li {
     .font-color-2;
      .font-size-sm;
      line-height: 18px;
      padding: 16px 0 3px 0;
    }
    /deep/input::placeholder {
      .font-login-color;
      .font-size-md;
      line-height: 22px;
    }
    .titleLi{
      margin-bottom: 8px;
    }
  }
  /deep/.van-cell {
    padding: 12px;
    border-radius: 4px;
  }
  /deep/.van-field__control {
    margin-left: 0px;
  }
  .welMsgDiv {
    margin-top: 16px;
    /deep/.van-field__control:disabled {
      .font-login-color;
      .font-size-md;
      background-color: transparent;
      cursor: not-allowed;
      opacity: 1;
      line-height: 22px;
      -webkit-text-fill-color: currentColor;
    }
  }
}
</style>
