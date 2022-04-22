<template>
  <div class="patientGroup">
    <navbar title="选择分组"></navbar>
    <div class="groupBody">
      <van-field
        v-model="remarks"
        label="备注"
        placeholder="请输入备注"
        maxlength="10"
      />
      <li class="groupTitle">选择分组</li>
      <div class="search">
        <van-field
          v-model="value"
          placeholder="输入组名，快速查找"
          @keydown.enter="search"
          maxlength="10"
        />
      </div>
      <div class="groupList">
        <van-checkbox-group v-model="result" ref="checkboxGroup">
          <van-checkbox
            class="groupCheck"
            :name="item.groupId"
            v-for="(item, index) in list"
            :key="index"
            @click="hasClick(item)"
            v-model="isChecked"
          >
            <li class="groupName">{{ item.groupsName }}</li>
            <li class="font-login-color">{{ item.patientNameStr }}</li>
          </van-checkbox>
          <li class="addGroup" @click="addGroup">
            <img
              src="../../assets/img/group/addGroup.png"
              class="addGroupIcon"
            />
            <span>新建分组</span>
          </li>
        </van-checkbox-group>
      </div>
      <div class="allSelect font-login-color-blue" >
        <span v-if="this.number" >已选{{ this.number }}个分组</span>
        <span v-else>已选0个分组</span>
        <button class="pubicBtn-80" @click="confirm">确定</button>
      </div>
    </div>
  </div>
</template>

<script>
import navbar from "@/common/navbar";
import { Toast, PullRefresh, List } from "vant";
import {
  findAttentionAndRemarkByPatientId,
  addPatientToGroups,
  getGroupIdAndGroupNameAndPatientNameStrListPage
} from "@/api/myGroups";
import myJsTools from "../../utils/myJsTools";
export default {
  data() {
    return {
      remarks: "",
      result: [],
      isChecked: false,
      number: "",
      value: "",
      list: [],
      oldGroupIdArray: "",
      limit: 6,
      page: 1
    };
  },
  computed: {},
  created() {
    if (this.$route.query.oldGroupIdArray) {
      this.oldGroupIdArray = this.$route.query.oldGroupIdArray.split(",");
      console.log("old", this.oldGroupIdArray);
    }
    this.patientId = myJsTools.getItem("patientInfo").patientId;
    this.patientName = myJsTools.getItem("patientInfo").patientName;
    this.patientImg = myJsTools.getItem("patientInfo").patientImg;
    this.docId = myJsTools.getItem("token_info").docId;
    this.getList();

  },
  mounted() {},
  watch: {},
  methods: {
    // 查询分组列表
    getList() {
      getGroupIdAndGroupNameAndPatientNameStrListPage({
        docId: this.docId,
        limit: this.limit,
        page: this.page
      }).then(res => {
        console.log("用户分组信息", res);
        let data = res.data.rows;
        this.loading = false;
        for (var i = 0; i < data.length; i++) {
          this.list.push({
            groupsName: data[i].groupName,
            groupId: data[i].groupId,
            patientNameStr: data[i].patientNameStr,
            isChecked: this.isChecked
          });
        }
        this.getMsg();
      });
    },
    // 查询患者分组和备注
    getMsg() {
      findAttentionAndRemarkByPatientId({
        docId: this.docId,
        patientId: this.patientId
      }).then(res => {
        this.groupNameStr = res.data.groupNameStr;
        this.groupIdStr = res.data.groupIdStr;
        this.oldGroupIdArray = res.data.groupIdStr;
        let arr = this.groupIdStr.split(",");
        this.list.map(item=>{
          arr.map(el=>{
            if(el == item.groupId){
              this.result.push(el);
              item.isChecked = true;
              this.number = this.result.length;
            }
          })
        })
        console.log(this.result);
      });
    },
    // 添加分组
    addGroup() {
      this.$router.push({
        name: "addGroup",
        query: {
          patientImg: this.patientImg,
          patientName: this.patientName,
          patientId: this.patientId
        }
      });
    },
    // 点击选择分组
    hasClick(item, index) {
      item.isChecked = !item.isChecked;
      this.number = this.result.length;
    },
    // 确认提交
    confirm() {
      if (this.oldGroupIdArray) {
        this.oldGroupIdArray = this.oldGroupIdArray.split(",");
      } else {
        this.oldGroupIdArray = [];
      }
      addPatientToGroups({
        docId: this.docId,
        patientId: this.patientId,
        newGroupIdArray: this.result,
        oldGroupIdArray: this.oldGroupIdArray,
        memo: this.remarks
      }).then(res => {
        console.log("确认添加", res);
        this.$router.go(-1);
      });
    },
    // 搜索
    search() {
      getGroupIdAndGroupNameAndPatientNameStrListPage({
        docId: this.docId,
        limit: this.limit,
        page: this.page,
        groupName: this.value
      }).then(res => {
        this.list = [];
        console.log("查询分组", res);
        let data = res.data.rows;
        for (var i = 0; i < data.length; i++) {
          this.list.push({
            groupsName: data[i].groupName,
            groupId: data[i].groupId,
            patientNameStr: data[i].patientNameStr
          });
        }
      });
    }
  },
  components: {
    navbar
  }
};
</script>

<style scoped lang="less">

.groupBody {
  .search {
    background:@white url("../../assets/img/index/search.png") no-repeat;
    background-size: 22px 22px;
    background-position: 5% 11px;
    padding-left: 45px;
    /deep/.van-cell {
      padding-left: 0px;
    }
  }
  .groupTitle {
    .font-size-sm;
    .font-login-color;
    line-height: 16px;
    padding: 4px 16px;
  }
  .groupList {
    background: @white;
    padding: 0 16px;
    .groupCheck {
      padding: 13px 0;
      .font-size-md;
      border-bottom: 1px solid @back-border;
      li {
        line-height: 22px;
        margin-left: 16px;
      }
      .groupName {
        .black-font;
        margin-bottom: 4px;
      }
    }
    .addGroup {
      padding: 13px 0;
      .font-login-color-blue;
      .font-size-md;
      line-height: 22px;
      display: flex;
      margin-bottom: 60px;
      .addGroupIcon {
        .icon-width-height-sm;
        margin-right: 8px;
      }
    }
  }
  .allSelect {
    position: fixed;
    bottom: 0;
    box-shadow: 0 0 -20px rgba(0, 0, 0, 0.1);
    border-top: 0.5px solid @back-border;
    background: @white;
    .font-size-md;
    padding: 12px 16px;
    justify-content: space-between;
    width: 100%;
    span {
      line-height: 22px;
      width: 70%;
      display: inline-block;
    }
    button {
      margin-right: 12px;
    }
  }
}
</style>
