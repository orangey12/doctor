<template>
  <div class="followDetail">
    <navbar title="随访计划详情"></navbar>
    <van-tabs
      v-model="active"
      title-inactive-color="#666666"
      title-active-color="#14A0E6"
      color="#14A0E6"
      @change="changeTab"
    >
      <van-tab title="详情">
        <plandetail-com :id="id"></plandetail-com>
      </van-tab>
      <van-tab title="历史">
        <div class="followList">
          <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
            <van-list
              v-model="loading"
              :finished="finished"
              finished-text=""
              @load="onLoaded"
            >
          <div
            class="card"
            v-for="(item, index) in followHistoryList"
            :key="index"
            @click="openDetail(item)"
          >
            <li class="title">
              <u>{{ item.planName }}</u>
              <u>
                <span class="font-login-color-red" v-if="item.sendStatus == 0">待执行</span>
                <span
                  class="font-login-color-blue"
                  v-if="item.sendStatus == 1"
                  >已执行</span
                >
                <span
                  class="black-font"
                  v-if="item.sendStatus == 2"
                  >已取消</span
                >
              </u>
            </li>
            <li class="content">
              {{ item.sendContent }}
            </li>
            <div class="time">
              <li>随访时间：{{ item.planTime }}</li>
            </div>
          </div>
            </van-list>
          </van-pull-refresh>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import Navbar from "../../common/navbar";
import PlandetailCom from "./plandetailCom";
import {followupQueryPlanExecutionHistoryList, followupQueryPlanList} from "../../api/followUp";
export default {
  name: "followDetail",
  components: { PlandetailCom, Navbar },
  data() {
    return {
      id: "",
      active: 0,
      followHistoryList: [],
      listQuery: {
        page: 1,
        size: 1,
        limit: 10,
        planId: ""
      },
      isLoading: false,
      finished: true,
      loading: false
    };
  },
  created() {
    this.listQuery.planId = this.id = this.$route.query.id;
  },
  methods: {
    changeTab() {
      if (this.active == 1) {
        this.getList();
      }
    },
    // 下拉刷新
    onRefresh() {
      // 清空列表数据
      this.finished = false;
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.listQuery.page = 1;
      this.onLoaded();
    },
    // 上拉加载
    onLoaded() {
      if (this.isLoading) {
        this.isLoading = false;
      }
      this.getFollowList();
    },
    //获取历史记录
    getList() {
      followupQueryPlanExecutionHistoryList(this.listQuery).then(res => {
        console.log(res);
        let data = res.data.rows;
        this.loading = false;
        this.listQuery.size = res.data.total / this.listQuery.limit;
        if (this.listQuery.page == 1) {
          this.listQuery.page = 1;
          this.isLoading = false;
          this.followHistoryList = data;
        } else {
          this.followHistoryList = this.followHistoryList.concat(data);
          this.loading = false;
        }
        if (this.listQuery.page >= this.listQuery.size) {
          this.finished = true; // 若数据已全部获取完毕
          return;
        }
        this.listQuery.page++;
      });
    },
    openDetail(item) {
      if (item.sendStatus == "1") {
        this.$router.push({
          name: "hascarriedPlan",
          query: {
            id: this.id,
            plsId: item.plsId
          }
        });
      } else {
        this.$router.push({
          name: "hisPlanDetail",
          query: {
            id: this.id,
            plsId: item.plsId
          }
        });
      }
    }
  }
};
</script>

<style scoped lang="less">

.followList {
  padding: 15px;
  .card {
    background: @white;
    border-radius: 8px;
    padding: 12px;

    .title {
      .black-font;
      .font-size-md;
      .font-blod-2;
      justify-content: space-between;
    }
    u:first-child {
      width: 80%;
    }
    .content {
      margin-top: 8px;
      .black-font;
      .font-size-md;
      line-height: 21px;
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
    }
    .time {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid @back-border;
      font-size: 14px;
    }
  }
}
</style>
