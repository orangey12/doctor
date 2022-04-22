<template>
  <div class="friendRequests">
    <navbar :title="type == 'bz'?'设置备注':'好友申请'"></navbar>
    <div class="content">
      <div class="friendInfo">
        <div class="info">
          <img v-zlazy="docInfo.docImg" class="userHead">
          <div class="docInfo">
            <li class="docName">{{docInfo.docName}} {{docInfo.docProf}}</li>
            <li class="dept">{{docInfo.deptName}}</li>
            <li class="labelSpan" v-if="docInfo.docLabelList">
                <span class="font-login-color-blue" v-for="(item,index) in docInfo.docLabelList">
                  十年经验
                </span>
            </li>
          </div>
        </div>
        <li class="remarks" v-if="type == 'bz'">
          <van-field v-model="remarks" label="备注" placeholder="请输入备注"/>
        </li>
      </div>
      <li class="tips" v-if="type == 'agree'">
        <u>提示</u>
        <u>添加该医生好友，将可以互相转诊</u>
      </li>
    </div>
    <div v-if="type == 'bz'" class="bottomBtn" @click="saveRemarks">
      <button class="publicBtn">保存</button>
    </div>
    <div class="bottomBtn" @click="agreeFriend" v-if="type == 'agree'">
      <button class="publicBtn">同意</button>
    </div>
  </div>
</template>

<script>
  import Navbar from "../../common/navbar";
  import {confirmAddDocFriendRelation, searchDocInfoEvaluation, setRemarksToFriend} from "../../api/friend";
  import myJsTools from "../../utils/myJsTools";
  import {Toast} from "vant";

  export default {
    name: "friendRequests",
    components: {Navbar},
    data() {
      return {
        docId: "",
        docInfo: "",
        type: '',//bz 设置备注  agree 同意好友申请
        remarks: "",
      }
    },
    created() {
      this.docId = this.$route.query.docId;
      this.type = this.$route.query.type;
      this.getDocInfo();
    },
    methods: {
      //获取医生信息
      getDocInfo() {
        searchDocInfoEvaluation({
          docId: this.docId,
          nowDocId: myJsTools.getItem("token_info").docId,
        }).then(async res => {
          this.docInfo = Object.assign({}, res.data);
          this.remarks = res.data.remarks || "";
        })
      },
      //同意医生好友请求
      agreeFriend() {
        confirmAddDocFriendRelation({
          activeDocId: this.docId,
          passiveDocId: myJsTools.getItem("token_info").docId
        }).then(res => {
          console.log(res);
          Toast("已同意");
          this.$router.go(-2);
        })
      },
      saveRemarks() {
        setRemarksToFriend({
          remarks: this.remarks,
          activeDocId: myJsTools.getItem("token_info").docId,
          passiveDocId: this.docId,
        }).then(res => {
          console.log(res);
          Toast("备注设置成功");
          this.$router.go(-1);
        })
      },
    }
  }
</script>

<style scoped lang="less">


  .userHead {
    .img-width-height-lg;
    margin-right: 12px;
  }

  .friendInfo {
    background: @white;
  }

  .info {
    padding: 14px 29px;
    display: flex;

    .docName {
      .black-font;
      .font-size-lg;
      .font-blod-2;
      line-height: 22px;
    }

    .dept {
      .font-color-2;
      .font-size-md;
      line-height: 17px;
      margin-top: 2px;
    }

    .labelSpan {
      margin-top: 9px;

      span {
        display: inline-block;
        background: @span-back;
        .font-size-sm;
        line-height: 16px;
        padding: 2px 6px;
        border-radius: 9px;
        margin-right: 8px;
      }
    }
  }

  .tips {
    padding: 12px 0;
    display: flex;
    .font-size-md;

    :first-child {
      width: 20%;
      .black-font;
    }
  }

  .remarks {
    border-top: 0.5px solid @back-border;
  }

  .tips {
    padding: 12px 16px;
    margin-top: 12px;
    background: @white;
  }
</style>
