<template>
  <div class="myGroupCreate">
    <navbar title="新建分组"></navbar>
    <div class="head">
      <van-field
        v-model="groupsName"
        label="分组名称"
        placeholder="请输入分组名称"
        maxlength="8"
      />
    </div>
    <div class="new">
      <img src="@/assets/img/picture/new.png" class="icon-width-height-sm"/>
      <span @click="add">添加患者</span>
    </div>
    <div class="title">分组成员({{ groupList.length }})</div>
    <div class="box">
      <van-swipe-cell v-for="(val, i) in groupList" :key="i">
        <div class="box_item">
          <img v-zlazy="val.patientImg" class="img-width-height-spe" v-if="val.patientName"/>
          <span>{{ val.patientName }}</span>
        </div>
        <template #right>
          <div class="btn" @click="delPatient(i)"><span>删除</span></div>
        </template>
      </van-swipe-cell>
    </div>
    <div class="bottomBtn" @click="confire">
      <button class="publicBtn">确定</button>
    </div>
  </div>
</template>
<script>
import $api from "@/utils/api.js";
import navbar from "@/common/navbar";
import {Popup} from "vant";
import {Toast} from "vant";
import {doctorAddUserGroup} from "@/api/myGroups";

export default {
  name: "myGroupCreate",
  components: {navbar},
  data() {
    return {
      value: "",
      groupList: [],
      groupsName: ""
    };
  },
  activated() {
    let arr = this.$store.getters.getGroupsList;
    this.groupList = arr;
  },
  beforeCreate() {
    this.$store.commit("UPDATE_KEEP_ALIVE", {
      keepAlive: "myGroupCreate"
    });
  },
  methods: {
    delPatient(index) {
      this.groupList.splice(index, 1);
      this.$store.commit("setGroupsList", this.groupList)
    },
    //添加患者
    add() {
      this.$router.push({
        name: "myAddPatient"
      });
    },
    //点击确定
    confire() {
      let patientIdArray = this.groupList.map(item => {
        return item.patientId;
      });
      if (this.groupsName == "") {
        Toast("请输入分组名");
      } else {
        doctorAddUserGroup({
          groupName: this.groupsName,
          patientIdArray: patientIdArray
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


/deep/ input::placeholder {
  .font-size-md;
}

.bottomBtn {
  box-shadow: none;
}

.myGroupCreate {
  min-height: 100vh;
  background: @white;

  .new {
    display: flex;
    align-items: center;
    padding: 11px 4%;
    background: @white;

    img {
      margin-right: 8px;
    }

    span {
      .font-size-md;
      line-height: 22px;
      .font-login-color-blue;
    }
  }

  .title {
    background: @page-back;
    padding: 6px 20px;
    .font-size-sm;
    .font-color-2;
    line-height: 16px;
  }

  .box {
    &_item {
      display: flex;
      align-items: center;
      padding: 14px 0;

      img {
        margin-right: 16px;
        margin-left: 16px;
      }

      span {
        .font-size-md;
        .black-font;
        line-height: 20px;
      }
    }

    .btn {
      width: 72px;
      height: 100%;
      background: @red;
      .font-login-sm;
      .white-font;
      line-height: 17px;
      display: flex;
      align-items: center;
      text-align: center;
      float: left;

      span {
        width: 100%;
        display: block;
      }
    }
  }
}
</style>
