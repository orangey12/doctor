<template>
  <div class="historyCom">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text=""
        @load="onLoaded"
      >
        <div
          class="historyCard"
          v-for="(item, index) in sendList"
          :key="index"
          @click="openHistoryDetail(item)"
        >
          <li class="title">
            <u>{{ item.didName }}</u>
            <u v-if="item.sendType == '1'" class="font-login-color-blue">单独</u>
            <u v-if="item.sendType == '2'" class="font-login-color-blue">群发</u>
            <u v-if="item.sendType == '3'" class="font-login-color-blue">随访</u>
          </li>
          <div class="sendNum">
            <li>
              发送人数：<span>{{ item.sendNum }}</span>
            </li>
            <li class="clickNum">
              触发人数：<span>{{ item.readNum }}</span>
            </li>
            <li>
              反馈人数：<span>{{ item.feedbackNum }}</span>
            </li>
          </div>
          <li class="line"></li>
          <li class="time">时间：{{ item.sendTime }}</li>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getInquiringDiagnosisSendList } from "../../api/scale";

export default {
  name: "historyCom",
  props: {
    title: String,
    didId: String,
    didOnlyId: String
  },
  data() {
    return {
      listQuery: {
        limit: 10,
        page: 1,
        size: 1
      },
      sendList: [],
      isLoading: false,
      finished: true,
      loading: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    openHistoryDetail(item) {
      this.$router.push({
        name: "historyDetail",
        query: {
          sendId: item.sendId
        }
      });
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
      this.getList();
    },
    getList() {
      this.listQuery.didOnlyId = this.didOnlyId;
      getInquiringDiagnosisSendList(this.listQuery).then(res => {
        console.log(res);
        let data = res.data.rows;
        this.loading = false;
        this.listQuery.size = res.data.total / this.listQuery.limit;
        if (this.listQuery.page == 1) {
          this.listQuery.page = 1;
          this.isLoading = false;
          this.sendList = data;
        } else {
          this.sendList = this.sendList.concat(data);
          this.loading = false;
        }
        if (this.listQuery.page >= this.listQuery.size) {
          this.finished = true; // 若数据已全部获取完毕
          return;
        }
        this.listQuery.page++;
        // this.sendList = res.data.rows;
      });
    }
  }
};
</script>

<style scoped lang="less">

.historyCom {
  padding: 0 16px;
  .historyCard {
    background: @white;
    border-radius: 8px;
    padding: 12px 0;
    margin-top: 12px;
    .title {
      padding: 0 16px;
      .black-font;
      .font-size-md;
      .font-blod-2;
      line-height: 22px;
      justify-content: space-between;
      :nth-child(1) {
        width: 85%;
      }
    }
    .line {
      height: 0.5px;
      background: @back-border;
      width: 100%;
    }
    .sendNum {
      display: flex;
      .font-color-2;
      .font-size-md;
      line-height: 18px;
      padding: 12px 16px;
      li {
        span {
          color: #333333;
          font-weight: 600;
        }
      }
      .clickNum {
        margin: 0 23px;
      }
    }
    .time {
      color: #666666;
      font-size: 14px;
      line-height: 20px;
      padding: 12px 0 0 16px;
    }
  }
}
</style>
