<template>
  <div class="editGroups">
    <navbar :title="title"></navbar>
    <div class="head">
      <van-form action="/">
        <van-search
          v-model="value"
          background="rgba(0,0,0,0.03)"
          :left-icon="searchIcon"
          placeholder="请输入想要搜索的内容"
          :clearable="true"
          @search="getPatientList"
        />
      </van-form>
      <div class="head_by" @click="showPopup">
        <img src="@/assets/img/group/by.png" alt=""/>
        <span>筛选</span>
      </div>
    </div>
    <div class="box">
      <van-swipe-cell v-for="(val, i) in patientList" :key="i">
        <div class="box_item">
          <img v-zlazy="val.patientImg" class="img-width-height-spe" v-if="val.patientName"/>
          <span>{{ val.patientName }}</span>
        </div>
        <template #right>
          <div class="btn" @click="delPatient(val)"><span>删除</span></div>
        </template>
      </van-swipe-cell>
    </div>
    <div class="foot">
      <button @click="add" class="pubicBtn-80">添加</button>
    </div>
    <!-- 筛选 -->
    <van-popup
      v-model="show"
      position="right"
      :style="{
        height: '100vh',
        boxSizing:'border-box',
        padding: '16px 15px 0px',
        paddingTop: paddTop,
        width:'80%',
      }"
    >
      <screen-patient @getList="getPatientList" @screenPatienList="screenPatienList"></screen-patient>
    </van-popup>
    <!-- 删除弹窗 -->
    <van-popup v-model="del" class="popup">
      <p class="title">确认删除</p>
      <p class="tips">您确认将已选患者从该组删除？</p>
      <div class="btns">
        <button class="publicWhiteBtn" @click="cancel">取消</button>
        <button class="publicBtn twoBtn" @click="sure">确定</button>
      </div>
    </van-popup>
  </div>
</template>
<script>
import $api from "@/utils/api.js";
import navbar from "@/common/navbar";
import slider from "@/common/slider";
import {Toast} from "vant";
import {
  findPatientByGroupId,
  doctorUpdateUserGroup,
  doctorDeletePatientByGroupId,
  findPatientList
} from "../../api/myGroups";
import ossUpDown from "../../utils/ossUpDown";
import myJsTools from "../../utils/myJsTools";
import ScreenPatient from "../childCompon/screenPatient";

export default {
  name: "myGroupsIndex",
  components: {ScreenPatient, navbar, slider},
  data() {
    return {
      sliderMin: "",
      sliderMax: "",
      val: "",
      title: "",
      patientList: [],
      value: "",
      show: false,
      del: false,
      paddTop: "",
      searchIcon: require("../../assets/img/index/search.png"),
    };
  },
  activated() {
    this.getPatientList();
  },
  beforeRouteLeave(to, from, next) {
    if (to.name == "editGroupsAdd") {
      from.meta.keepAlive = true;
    } else {
      from.meta.keepAlive = false;
    }
    next();
  },
  mounted() {
    this.getPatientList();
    this.paddTop = parseInt(api.safeArea.top) + "px";
  },

  methods: {
    //初始化获取分组里面的患者列表
    getPatientList() {
      findPatientByGroupId({
        groupId: this.$store.getters.getGroupsInfo.groupId,
        groupName: this.$store.getters.getGroupsInfo.groupName,
        patientName: this.value
      }).then(res => {
        this.patientList = res.data;
        this.count = res.data.length;
        this.title =
          this.$store.getters.getGroupsInfo.groupName +
          " " +
          "(" +
          this.count +
          ")";
      });
    },
    //删除分组里面的患者
    delPatient(val) {
      this.val = val;
      this.del = true;
    },
    //删除分组里面的患者(确定)
    sure() {
      let patientIdArray = [];
      patientIdArray.push(this.val.patientId);
      doctorDeletePatientByGroupId({
        groupId: this.$store.getters.getGroupsInfo.groupId,
        patientIdArray: patientIdArray
      }).then(res => {
        if (res.code == 20000) {
          this.del = false;
          Toast("删除成功");
          this.getPatientList();
        }
      });
    },
    //删除分组里面的患者(取消)
    cancel() {
      this.del = false;
    },
    //点击筛选
    showPopup() {
      this.show = true;
    },
    //添加患者
    add() {
      this.$store.commit("setGroupsList",  this.patientList);
      this.$router.push({
        name: "myAddPatient",
        query: {
          pageType:"edit"
        }
      });
    },
    screenPatienList(dataForm) {
      dataForm.groupId = this.$store.getters.getGroupsInfo.groupId;
      findPatientList(dataForm).then(async res => {
        this.patientList = res.data || [];
        this.show = false;
      });
    },
  }
};
</script>
<style scoped lang="less">


.editGroups {
  position: relative;
  background: @white;

  .head {
    position: relative;
    border-top: 1px solid #ebebeb;
    border-bottom: 1px solid #ebebeb;
    display: flex;
    align-items: center;

    /deep/ .van-cell {
      align-items: center;
    }

    /deep/ .van-search__content {
      background: #ffffff;
      padding: 11px 16px;
    }

    /deep/ .van-search{
      padding: 0px !important;
    }

    .van-form {
      width: 90%;
    }

    .head_by {
      img {
        width: 23px;
        height: 20px;
        margin-bottom: 2px;
      }

      span {
        font-size: 11px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
        line-height: 12px;
      }
    }
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

  .foot {
    width: 100%;
    position: fixed;
    bottom: 0;
    background: @white;
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
    border: 1px solid @back-border;
    padding: 7px 0;

    button {
      float: right;
      margin-right: 16px;
    }
  }

  .del {
    width: calc(80% - 40px);
    background: rgba(255, 255, 255, 1);
    border-radius: 8px;
    padding: 20px;

    .p_title {
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
      line-height: 22px;
      text-align: center;
      margin-bottom: 28px;
    }

    .p_message {
      font-size: 12px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
      line-height: 17px;
      text-align: center;
      margin-bottom: 36px;
    }

    .p_btn {
      display: flex;
      justify-content: space-between;

      div {
        width: 45%;
        background: rgba(20, 160, 230, 1);
        border-radius: 23px;
        font-size: 16px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: rgba(255, 255, 255, 1);
        line-height: 22px;
        text-align: center;
        padding: 6px 0;
      }

      .p_btn_1 {
        border-radius: 23px;
        border: 1px solid rgba(20, 160, 230, 1);
        background: #ffffff;
        color: rgba(20, 160, 230, 1);
      }
    }
  }
}
</style>
