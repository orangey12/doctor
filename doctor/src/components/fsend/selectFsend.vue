<template>
  <div class="selectSort" style="min-height:calc(100vh - 35px);">
    <navbar title="选择分组"></navbar>
    <div class="header">
      <img src="../../assets/img/index/search.png" class="icon-width-height-sm"/>
      <input
        type="text"
        placeholder="搜索联系人"
        v-model="name"
        @keyup.enter="getSeatchList"
      />
    </div>
    <van-collapse v-model="activeNames">
      <div
        class="grouoList"
        v-for="(val, keys, index) in groupList"
        :key="index"
      >
        <van-checkbox
          v-model="val.isCheckedAll"
          @click="isCheckedAll(val, keys)"
          class="checkBoxVan"
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
                    <img v-zlazy="vals.patientImg" alt/>
                    <span>{{ vals.patientName }}</span>
                  </div>
                </template>
              </van-checkbox>
            </div>
          </van-checkbox-group>
        </van-collapse-item>
      </div>
    </van-collapse>
    <div class="footer_box display-div">
      <van-checkbox v-model="allChecked" @click="getAllChecked"
      >全选
      </van-checkbox
      >
      <div class="pubicBtn-80" @click="confirm">添加</div>
    </div>
  </div>
</template>
<script>
import $api from "@/utils/api.js";
import navbar from "@/common/navbar";
import {findPatientInfoGroupByGroup} from "@/api/pictrue";
import ossUpDown from "../../utils/ossUpDown";
import myJsTools from "../../utils/myJsTools";

export default {
  name: "selectFsend",
  components: {navbar},
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
    if (this.$route.params.groupList) {
      this.groupList = this.$route.params.groupList;
      if (this.allList.length == 0) {
        this.allList = this.$route.params.groupList;
      }
    } else {
      this.getGroupList();
    }
  },
  updated() {
    api.sendEvent({
      name: "updatePatient",
      extra: {}
    });
  },
  methods: {
    getSeatchList() {
      this.groupList = [];
      this.getGroupList();
    },
    //初始化获取分组列表
    getGroupList() {
      findPatientInfoGroupByGroup({name: this.name, docId: myJsTools.getItem("token_info").docId,filterNoUserIdPatient:'1'}).then(async res => {
        let data = res.data;
        let arr = [];
        data.map(item => {
          item.list.map(val => {
            arr.push(val);
          })
        })
        data.map(item => {
          item.result = [];
          item.isCheckedAll = false;
          item.list.map(val => {
            arr.map(ele => {
              if (ele.patientId == val.patientId) {
                val.patientImg = ele.patientImg;
              }
            })
          })
        })
        this.groupList = data;
        if (this.allList.length == 0) {
          this.allList = data;
        }
        console.log(JSON.stringify(data) + "-------------患者头像")
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
      console.log(this.allList);
      if (this.name == "") {
        arr = this.groupList;
      } else {
        this.allList.forEach(element => {
          this.groupList.forEach(item => {
            if (item.groupName == element.groupName) {
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
  background: @white;
  display: flex;
  align-items: center;
  padding: 11px 16px;

  input {
    line-height: 18px;
    margin-left: 9px;
    width: 80%;
  }
}

.grouoList {
  display: flex;
  position: relative;
  align-items: center;
}

/deep/ .van-collapse-item__content{
  padding: 0;
}

.checkBoxVan {
  position: absolute;
  left: 16px;
  top: 22px;
  z-index: 2;
}

.selectSort {
  padding-top: 10px;
  padding-bottom: 50px;
  background: @white;
  box-sizing: border-box;

  /deep/ .van-cell {
    padding: 20px 16px;
    align-items: center;
  }

  .title {
    display: flex;
    align-items: center;
    .font-size-md;
    .black-font;
    line-height: 20px;

    span {
      display: block;
      margin-left: 16px;
    }
  }

  .list {
    background: @white;
    padding: 0 4%;

    &_item {
      display: flex;
      align-items: center;

      img {
       .img-width-height-sm;
        margin: 0 16px 0 6px;
        padding: 14px 0;
      }

      span {
        .black-font;
        .font-size-md;
        line-height: 20px;
      }
    }
  }
}

/deep/ [class*=van-hairline]::after{
  border: none;
}

/deep/ .van-collapse-item--border::after{
  border: none;
}

.footer_box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  background: @white;
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
  padding: 0 16px;
  box-sizing: border-box;
  z-index: 99999;

  /deep/ .van-checkbox__label {
    .font-login-color-blue;
    .font-size-md;
  }

}
</style>
