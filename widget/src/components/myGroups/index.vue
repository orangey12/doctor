<template>
  <div class="myGroupsIndex">
    <navbar title="我的分组"></navbar>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text=""
        @load="onLoad"
        :immediate-check="false"
        class="list_wrap"
      >
        <div id="list-content" v-if="list.length != 0">
          <div class="list" v-for="(item, index) in list" :key="index">
            <van-swipe-cell>
              <div class="name" @click="goEdit(item)">
                {{ item.groupName }}（{{ item.patientCount }}）
              </div>
              <template #right>
                <div class="btn1" @click="delGroups(item.groupId)">
                  <span>删除</span>
                </div>
              </template>
            </van-swipe-cell>
          </div>
        </div>
        <div v-if="list.length == 0" class="emptyDiv">
            <img src="@/assets/img/my/pitera.png" class="emptyIcon" />
            <li>暂无分组消息，点击新建分组去创建</li>
          </div>
      </van-list>
    </van-pull-refresh>

    <div class="bottomBtn" @click="clickCreate">
      <button class="publicBtn">新建分组</button>
    </div>
    <!-- 删除弹窗 -->
    <van-popup v-model="show" class="popup">
      <p class="title">确认删除</p>
      <p class="tips">您确认将已选患者从该组删除？</p>
      <div class="btns">
        <button class="publicWhiteBtn" @click="show = false">取消</button>
        <button class="publicBtn twoBtn" @click="sure">确定</button>
      </div>
    </van-popup>
  </div>
</template>
<script>
import $api from "@/utils/api.js";
import navbar from "@/common/navbar";
import { Toast, PullRefresh, List } from "vant";
import {
  findGroupNameAndPatientCountByGroup,
  doctorDeleteUserGroup
} from "@/api/myGroups";
export default {
  name: "myGroupsIndex",
  components: { navbar },
  data() {
    return {
      list: [],
      show: false,
      id: "",
      isLoading: false,
      loading: false,
      finished: false,
      total: "", //总条数
      listQuery: {
        page: 1, //页码
        limit: 10 //每页条数
      }
    };
  },
  created() {
    this.$store.commit("setGroupsInfo", {});
  },
  mounted() {
    this.getGroupsList();
  },
  methods: {
    //   下拉刷新
    onRefresh() {
      // 清空列表数据
      this.finished = false;
      this.loading = false;
      this.listQuery.page = 1;
      this.onLoad();
    },
    onLoad() {
      if (this.isLoading) {
        this.isLoading = false;
      }
      this.getGroupsList();
    },
    //初始化获取分组列表
    getGroupsList() {
      findGroupNameAndPatientCountByGroup(this.listQuery).then(res => {
        this.loading = false;
        this.listQuery.size = res.data.total / this.listQuery.limit;
        if (this.listQuery.page == 1) {
          this.listQuery.page = 1;
          this.isLoading = false;
          this.list = res.data.rows;
        } else {
          this.list = this.list.concat(res.data.rows);
          this.loading = false;
        }
        if (this.listQuery.page >= this.listQuery.size) {
          this.finished = true; // 若数据已全部获取完毕
          return;
        } else {
          this.finished = false;
          this.listQuery.page++;
        }
      });
    },
    //删除分组
    delGroups(id) {
      this.id = id;
      this.show = true;
    },
    //删除(确定)
    sure() {
      doctorDeleteUserGroup({ groupId: this.id }).then(res => {
        if ((res.code = 20000)) {
          this.show = false;
          Toast("删除成功");
          this.getGroupsList();
        }
      });
    },
    //编辑分组
    goEdit(item) {
      this.$store.commit("setGroupsInfo", item);
      this.$router.push({
        name: "editGroups"
      });
    },
    //新建分组
    clickCreate() {
      this.$router.push({
        name: "myGroupCreate"
      });
    }
  }
};
</script>
<style scoped lang="less">

.myGroupsIndex {
  height: calc(100vh - 35px);
  background: @white;
  .list_wrap {
    height: calc(100vh - 120px);
    overflow-y: scroll;
  }
  .list {
    border-top: 1px solid @back-border;
    background: @white;
    .name {
      .black-font;
      .font-size-md;
      line-height: 22px;
      padding: 25px 16px;
    }
    .btn,
    .btn1 {
      width: 72px;
      height: 100%;
      background: @font-color-2;
      .font-size-sm;
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
    .btn1 {
      background: @red;
    }
  }
  .list:last-child {
    border-bottom: 1px solid @back-border;
  }
  .emptyDiv {
    margin-top: 30%;
  }
  .bottomBtn {
    box-shadow: none;
  }
}
</style>
