<template>
  <div class="myGroupCreate">
    <navbar title="新建分组"></navbar>
    <div class="head">
      <van-field
        v-model="groupsName"
        label="分组名称"
        maxlength="8"
        placeholder="请输入分组名称"
      />
    </div>
    <div class="list">
      <div class="title">人员</div>
      <div style="align-items: center;display: flex;">
        <img v-zlazy="this.$route.query.patientImg" alt />
        <span>{{ this.$route.query.patientName }}</span>
      </div>
    </div>
    <div class="bottomBtn" @click="confirm">
      <button class="publicBtn">确定</button>
    </div>
  </div>
</template>
<script>
import $api from "@/utils/api.js";
import navbar from "@/common/navbar";
import { Popup } from "vant";
import { Toast } from "vant";
import { doctorAddUserGroup } from "@/api/myGroups";
export default {
  name: "myGroupCreate",
  components: { navbar },
  data() {
    return {
      groupsName: "",
      patientIdArray: [this.$route.query.patientId]
    };
  },
  activated() {
    let arr = this.$store.getters.getGroupsList;
    this.groupList.push(...arr);
    let obj = {};
    this.groupList = this.groupList.reduce((cur, next) => {
      obj[next.patientId] ? "" : (obj[next.patientId] = true && cur.push(next));
      return cur;
    }, []);
  },
  beforeCreate() {
    this.$store.commit("UPDATE_KEEP_ALIVE", {
      keepAlive: "myGroupCreate"
    });
  },
  methods: {
    //点击确定
    confirm() {
      if (this.groupsName == "") {
        Toast("请输入分组名");
      } else {
        doctorAddUserGroup({
          groupName: this.groupsName,
          patientIdArray: this.patientIdArray
        }).then(res => {
          if (res.code == 20000) {
            Toast("新建成功");
            this.$router.go(-1);
          }
        });
      }
    }
  }
};
</script>
<style scoped lang="less">

.myGroupCreate {
  min-height: 100vh;
  background: @white;
  .head {
    position: relative;
  }
  .title {
    background: @page-back;
    padding: 4px 4%;
    font-size: 11px;
    .font-size-md;
    .font-login-color;
    line-height: 16px;
  }
  .list {
    background: @white;
    height: calc(100vh - 223px);
    overflow-y: scroll;

    img {
      .img-width-height-spe;
      margin: 0 16px;
      padding: 14px 0;
    }
    span {
      .black-font;
      .font-size-md;
    }
  }
}
</style>
