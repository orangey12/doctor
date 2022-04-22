<template>
  <div class="consultationSummary">
    <navbar title="咨询小结"></navbar>
    <div class="message">
      <van-field
        v-model="addMessage"
        type="textarea"
        maxlength="500"
        show-word-limit
        placeholder="请填写信息"
        class="textarea"
        :disabled="type == 1"
        show-word-limit
      />
    </div>
    <van-button round @click="confirm" v-if="type == 2">提交</van-button>
  </div>
</template>

<script>
import { Toast } from "vant";
import { updateinterrogationSummary } from "@/api/proreceive";
import Navbar from "../../common/navbar";
import eschatUnit from "../../utils/eschat";
import myJsTools from "../../utils/myJsTools";
import { getInterrogationSummaryById } from "../../api/chat";
export default {
  name: "consultationSummary",
  components: { Navbar },
  data() {
    return {
      addMessage: "",
      regId: "",
      userId: "",
      docId: "",
      id: "",
      type: 2
    };
  },
  created() {
    let query = this.$route.query;
    console.log(JSON.stringify(query) + "---------咨询小结传参问题")
    this.regId = query.regId;
    this.userId = query.userId;
    this.docId = myJsTools.getItem("token_info").docId;
    this.id = query.id;
    this.type = query.type;
    this.getDetail();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    getDetail() {
      getInterrogationSummaryById({
        regId: this.regId
      }).then(res => {
        console.log(JSON.stringify(res));
        if (res.data.interrogationSummary) {
          this.addMessage = res.data.interrogationSummary;
        }
      });
    },
    confirm() {
      if (this.addMessage == "") {
        Toast("请填写信息");
      } else {
        updateinterrogationSummary({
          interrogationSummary: this.addMessage,
          regId: this.$route.query.regId
        }).then(res => {
          let ext = {
            type: "zxxj",
            regId: this.$route.query.regId
          };
          eschatUnit.sendMsg(
            "[咨询小结]",
            this.docId,
            this.id,
            this.userId,
            ext
          );
          console.log("咨询小结", res);
          this.$router.go(-1);
        });
      }
    }
  }
};
</script>

<style scoped lang="less">
.consultationSummary {
  header {
    position: fixed;
    top: 0;
    display: flex;
    height: 44px;
    background: #ffffff;
    // border-bottom: 1px solid #ebebeb;
    .backIcon {
      margin-top: 8px;
      padding-left: 15px;
      width: 24px;
      height: 24px;
    }
    span {
      font-size: 18px;
      color: #333333;
      font-weight: 700;
      margin: 7px 120px;
    }
  }
  .message {
    width: 343px;
    .textarea {
      height: 160px;
      margin: 24px 16px;
      padding: 13px 16px;
    }
    /deep/.van-field__control {
      height: 120px;
    }
  }
  .van-button {
    width: 92%;
    background-color: #14a0e6;
    color: #ffffff;
    margin: 0 16px;
  }
}
.message /deep/ .van-field__control {
  margin-left: 0;
}
</style>
