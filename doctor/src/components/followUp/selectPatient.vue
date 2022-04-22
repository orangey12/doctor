<template>
  <div class="selectSort" style="min-height:calc(100vh - 35px);">
    <navbar title="选择分组"></navbar>
    <div class="header">
      <img src="../../assets/img/patientGroup/search.png" class="searchIcon" />
      <input
        type="text"
        placeholder="搜索联系人、聊天记录等"
        v-model="name"
        @keyup.enter="getSeatchList"
      />
    </div>
    <van-collapse v-model="activeNames">
      <div
        style="display:flex;position:relative;"
        v-for="(val, keys, index) in groupList"
        :key="index"
      >
        <van-checkbox
          v-model="val.isCheckedAll"
          @click="isCheckedAll(val, keys)"
          style="position:absolute;left:16px;top:12px;z-index:2;"
        ></van-checkbox>
        <van-collapse-item :name="index" style="width:90%;margin-left:6%">
          <template #title>
            <div class="title">
              <span>{{ val.groupName }}（已选{{ val.result.length }}）</span>
            </div>
          </template>
          <van-checkbox-group v-model="val.result">
            <div class="list" v-for="(vals, i) in val.list" :key="i">
              <van-checkbox :name="vals" @click="isCheck(val)">
                <template>
                  <div class="list_item">
                    <img v-zlazy="vals.patientImg" alt />
                    <span>{{ vals.patientName }}</span>
                  </div>
                </template>
              </van-checkbox>
            </div>
          </van-checkbox-group>
        </van-collapse-item>
      </div>
    </van-collapse>
    <div class="footer_box">
      <van-checkbox v-model="allChecked" @click="getAllChecked"
        >全选</van-checkbox
      >
      <div class="confirm" @click="confirm">确定</div>
    </div>
  </div>
</template>
<script>
import navbar from "@/common/navbar";
import { findPatientInfoGroupByGroup } from "@/api/pictrue";
import ossUpDown from "../../utils/ossUpDown";
import myJsTools from "../../utils/myJsTools";
export default {
  name: "selectPatient",
  components: { navbar },
  data() {
    return {
      groupList: [],
      result: [],
      activeNames: [],
      name: "",
      allChecked: false,
      allList: []
    };
  },
  mounted() {
    console.log(this.$route.params.groupList);
    if (this.$route.params.groupList) {
      this.groupList = this.$route.params.groupList;
      if (this.allList.length == 0) {
        this.allList = this.$route.params.groupList;
      }
    } else {
      this.getGroupList();
    }
  },
  methods: {
    getSeatchList() {
      this.groupList = [];
      this.getGroupList();
    },
    //初始化获取分组列表
    getGroupList() {
      findPatientInfoGroupByGroup({ name: this.name }).then(async res => {
        let data = res.data;
        data.map(item => {
          item.result = [];
          item.isCheckedAll = false;
        });
        this.groupList = data;
        if (this.allList.length == 0) {
          this.allList = data;
        }
      });
    },
    //全选
    isCheckedAll(val, keys) {
      if (val.isCheckedAll == true) {
        val.result = [];
        val.list.forEach(item => {
          val.result.push(item);
        });
      } else {
        val.list.forEach(item => {
          val.result = [];
        });
      }
    },
    //是否选中
    isCheck(val) {
      if (val.result.length == val.list.length) {
        val.isCheckedAll = true;
      } else {
        val.isCheckedAll = false;
      }
    },
    // 全部全选
    getAllChecked() {
      this.groupList.forEach(element => {
        element.isCheckedAll = this.allChecked;
        if (this.allChecked) {
          element.result = element.list;
        } else {
          element.result = [];
        }
      });
    },
    // 确定
    confirm() {
      let arr = [];
      if (this.name == "") {
        arr = this.groupList;
      } else {
        this.allList.forEach(element => {
          this.groupList.forEach(item => {
            if (item.groupName == element.groupName) {
              console.log(element);
              console.log(item);
              element.result = item.result;
              element.isCheckedAll = item.isCheckedAll;
            }
          });
        });
        arr = this.allList;
      }
      this.$store.commit("setGroupList", arr);
      this.$router.go(-1);
    }
  }
};
</script>
<style scoped lang="less">
.header {
  width: calc(100% - 32px);
  background: #fff;
  display: flex;
  padding: 11px 16px;
  img {
    width: 22px;
    height: 22px;
  }
  input {
    line-height: 18px;
    margin-left: 9px;
    width: 80%;
  }
}
.selectSort {
  padding-top: 10px;
  padding-bottom: 50px;
  background: #ffffff;
  box-sizing: border-box;
  .title {
    display: flex;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 1);
    line-height: 20px;
    span {
      display: block;
      margin-left: 16px;
    }
  }
  .list {
    background: #ffffff;
    padding: 0 4%;
    &_item {
      display: flex;
      align-items: center;
      img {
        width: 32px;
        height: 32px;
        margin: 0 16px 0 6px;
        padding: 14px 0;
        border-radius: 50%;
      }
      span {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0, 0, 0, 1);
        line-height: 20px;
      }
    }
  }
}
.footer_box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  box-sizing: border-box;
  z-index: 99999;
  /deep/ .van-checkbox__label {
    color: #14a0e6;
    font-size: 14px;
  }
  .confirm {
    height: 36px;
    line-height: 36px;
    background-color: #14a0e6;
    color: #ffffff;
    text-align: center;
    border-radius: 18px;
    padding: 0 26px;
    font-size: 14px;
  }
}
</style>
